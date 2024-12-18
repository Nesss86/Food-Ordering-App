-- Clear existing data
TRUNCATE TABLE food_items RESTART IDENTITY CASCADE;

-- Insert new seed data
INSERT INTO food_items (id, name, category, price, image_path, is_available) VALUES
(1, 'Apple Pie', 'desserts', 8.99, '/images/Apple_Pie.png', TRUE),
(2, 'Brownie with Walnuts', 'desserts', 7.99, '/images/Brownie_With_Walnuts.png', TRUE),
(3, 'Caprese Salad', 'appetizers', 6.99, '/images/Caprese_Salad.png', TRUE),
(4, 'Cheeseburger', 'main course', 10.99, '/images/Cheeseburger.png', TRUE),
(5, 'Chocolate Cake', 'desserts', 9.49, '/images/Chocolate_Cake.png', TRUE),
(6, 'Fish and Chips', 'main course', 12.99, '/images/Fish_and_Chips.png', TRUE),
(7, 'Fruit Bowl', 'snacks', 4.99, '/images/Fruit_Bowl.png', TRUE),
(8, 'Garlic Bread', 'appetizers', 3.99, '/images/Garlic_Bread.png', TRUE),
(9, 'Grilled Chicken Sandwich', 'main course', 11.49, '/images/Grilled_Chicken_Sandwich.png', TRUE),
(10, 'Macarons', 'desserts', 6.49, '/images/Macarons.png', TRUE),
(11, 'Margherita Pizza', 'main course', 13.99, '/images/Margherita_Pizza.png', TRUE),
(12, 'Mixed Nuts', 'snacks', 5.49, '/images/Mixed_Nuts.png', TRUE),
(13, 'Mozzarella Sticks', 'appetizers', 7.49, '/images/Mozzarella_Sticks.png', TRUE),
(14, 'Nachos', 'snacks', 6.99, '/images/Nachos.png', TRUE),
(15, 'Popcorn', 'snacks', 2.99, '/images/Popcorn.png', TRUE),
(16, 'Potato Chips', 'snacks', 2.49, '/images/Potato_Chips.png', TRUE),
(17, 'Pretzels', 'snacks', 3.49, '/images/Pretzels.png', TRUE),
(18, 'Protein Bar', 'snacks', 2.99, '/images/Protein_Bar.png', TRUE),
(19, 'BBQ Ribs', 'main course', 14.99, '/images/BBQ_Ribs.png', TRUE),
(20, 'Spaghetti Bolognese', 'main course', 12.49, '/images/Spaghetti_Bolognese.png', TRUE),
(21, 'Spring Rolls', 'appetizers', 5.99, '/images/Spring_Rolls.png', TRUE),
(22, 'Sprinkle Donut', 'desserts', 2.99, '/images/Sprinkle_Donut.png', TRUE),
(23, 'Strawberry Cheesecake', 'desserts', 9.99, '/images/Strawberry_Cheesecake.png', TRUE),
(24, 'Stuffed Mushrooms', 'appetizers', 6.49, '/images/Stuffed_Mushrooms.png', TRUE),
(25, 'Vanilla Ice Cream', 'desserts', 4.49, '/images/Vanilla_Ice_cream.png', TRUE),
(26, 'Veggie Burrito', 'main course', 8.99, '/images/Veggie_Burrito.png', TRUE),
(27, 'Veggies with Hummus', 'appetizers', 5.49, '/images/Veggies_With_Hummus.png', TRUE),
(28, 'Wings', 'appetizers', 9.99, '/images/Wings.png', TRUE);

