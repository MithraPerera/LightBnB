const { Pool } = require('pg');
const properties = require("./json/properties.json");
const users = require("./json/users.json");

const pool = new Pool({
  user: 'mithraperera',
  password: '',
  host: 'localhost',
  database: 'lightbnb'
});

// the following assumes that you named your connection variable `pool`
pool.query(`SELECT title FROM properties LIMIT 10;`).then(response => { });

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
// const getUserWithEmail = function(email) {
//   let resolvedUser = null;
//   for (const userId in users) {
//     const user = users[userId];
//     if (user?.email.toLowerCase() === email?.toLowerCase()) {
//       resolvedUser = user;
//     }
//   }
//   return Promise.resolve(resolvedUser);
// };
const getUserWithEmail = function(email) {
  return pool
    .query(`SELECT * FROM users WHERE email = $1`, [email])
    .then((result) => {
      return result.rows[0] || null;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
// const getUserWithId = function(id) {
//   return Promise.resolve(users[id]);
// };
const getUserWithId = function(id) {
  return pool
    .query(`SELECT * FROM users WHERE id = $1`, [id])
    .then((result) => {
      // The promise resolves with a user object with the given id, or null if that id does not exist
      return result.rows[0] || null;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
// const addUser = function(user) {
//   const userId = Object.keys(users).length + 1;
//   user.id = userId;
//   users[userId] = user;
//   return Promise.resolve(user);
// };
const addUser = function(user) {
  return pool
    .query(`INSERT INTO users (name, email, password)
          VALUES ($1, $2, $3)
          RETURNING *;`, [user.name, user.email, user.password])
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    })
};

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
// const getAllReservations = function(guest_id, limit = 10) {
//   return getAllProperties(null, 2);
// };
const getAllReservations = function(guest_id, limit = 10) {
  return pool
    .query(`SELECT reservations.*, properties.*, AVG(rating) AS average_rating
      FROM reservations
      JOIN properties ON reservations.property_id = properties.id
      JOIN property_reviews ON properties.id = property_reviews.property_id
      WHERE reservations.guest_id = $1
      GROUP BY properties.id, reservations.id
      ORDER BY reservations.start_date
      LIMIT $2;`, [guest_id, limit])
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    })
};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
// const getAllProperties = function(options, limit = 10) {
//   const limitedProperties = {};
//   for (let i = 1; i <= limit; i++) {
//     limitedProperties[i] = properties[i];
//   }
//   return Promise.resolve(limitedProperties);
// };
const getAllProperties = (options, limit = 10) => {

  const queryParams = [];
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  // Adding to the query string based on the filter options passed in

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `
    WHERE city LIKE $${queryParams.length}`;
  }

  if (options.owner_id) {
    queryParams.length ? (queryString += `AND `) : (queryString += `WHERE `);
    queryParams.push(options.owner_id);
    queryString += `properties.owner_id = $${queryParams.length} `;
  }

  if (options.minimum_price_per_night) {
    queryParams.length ? (queryString += `AND `) : (queryString += `WHERE `);
    queryParams.push(options.minimum_price_per_night * 100);
    queryString += `cost_per_night >= $${queryParams.length} `;
  }

  if (options.maximum_price_per_night) {
    queryParams.length ? (queryString += `AND `) : (queryString += `WHERE `);
    queryParams.push(options.maximum_price_per_night * 100);
    queryString += `cost_per_night <= $${queryParams.length} `;
  }

  queryString += `
  GROUP BY properties.id  `;

  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString += `HAVING avg(property_reviews.rating) >= $${queryParams.length} `;
  }

  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  return pool.query(queryString, queryParams)
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    })
};


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
// const addProperty = function(property) {
//   const propertyId = Object.keys(properties).length + 1;
//   property.id = propertyId;
//   properties[propertyId] = property;
//   return Promise.resolve(property);
// };
const addProperty = function(property) {
  const queryParams = [
    property.owner_id,
    property.title,
    property.description,
    property.thumbnail_photo_url,
    property.cover_photo_url,
    property.cost_per_night,
    property.street,
    property.city,
    property.province,
    property.post_code,
    property.country,
    property.parking_spaces,
    property.number_of_bathrooms,
    property.number_of_bedrooms,
  ];
  // Insert a new property into the "properties" table and return the inserted row
  return pool
    .query(`INSERT INTO properties (owner_id,
            title,
            description,
            thumbnail_photo_url,
            cover_photo_url,
            cost_per_night,
            street,
            city,
            province,
            post_code,
            country,
            parking_spaces,
            number_of_bathrooms,
            number_of_bedrooms)
            
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
            RETURNING *`, queryParams)

    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
