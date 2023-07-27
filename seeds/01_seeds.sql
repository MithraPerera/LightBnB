/* Insert temp data to users table */
INSERT INTO users (name, email, password)
VALUES ('Eva Stanley', 'sebastianguerra@ymail.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
       ('Louisa Meyer', 'jacksonrose@hotmail.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
       ('Dominic Parks', 'victoriablackwell@outlook.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

/* Insert temp data to properties table */
INSERT INTO properties (title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active, owner_id) 
VALUES ('Speed lamp', 'description', 'https://example.com/thumbnail.jpg', 'https://example.com/cover.jpg', 99.99, 2, 1, 2, 'United States', '123 Main St', 'New York City', 'New York', '10001', true, 1),
       ('Blank corner', 'description', 'https://example.com/thumbnail.jpg', 'https://example.com/cover.jpg', 149.99, 1, 1, 1, 'United States', '456 Elm St', 'Los Angeles', 'California', '90001', true, 2),
       ('Habit mix ', 'description', 'https://example.com/thumbnail.jpg', 'https://example.com/cover.jpg', 499.99, 4, 3, 4, 'Spain', '789 Oak St', 'Barcelona', 'Catalonia', '08001', true, 3);

/* Insert temp data to reservations table */
INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2018-01-11', '2018-01-21', 1, 1),
       ('2019-02-04', '2019-02-14', 2, 2),
       ('2020-03-01', '2020-03-11', 3, 3);

/* Insert temp data to property_reviews table */
INSERT INTO property_reviews (rating, message, guest_id, property_id, reservation_id)
VALUES (4, 'messages', 1, 1, 1),
       (5, 'messages', 2, 2, 2),
       (3, 'messages', 3, 3, 3);