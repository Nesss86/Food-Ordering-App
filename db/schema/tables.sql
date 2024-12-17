-- Drop existing tables if they exist
DROP TABLE IF EXISTS Order_Items CASCADE;
DROP TABLE IF EXISTS Orders CASCADE;
DROP TABLE IF EXISTS Food_Items CASCADE;
DROP TABLE IF EXISTS Admins CASCADE;
DROP TABLE IF EXISTS Customers CASCADE;

-- Reset sequences for all tables
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'admins_id_seq') THEN
        ALTER SEQUENCE admins_id_seq RESTART WITH 1;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'customers_id_seq') THEN
        ALTER SEQUENCE customers_id_seq RESTART WITH 1;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'food_items_id_seq') THEN
        ALTER SEQUENCE food_items_id_seq RESTART WITH 1;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'orders_id_seq') THEN
        ALTER SEQUENCE orders_id_seq RESTART WITH 1;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'order_items_id_seq') THEN
        ALTER SEQUENCE order_items_id_seq RESTART WITH 1;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'sales_audit_id_seq') THEN
        ALTER SEQUENCE sales_audit_id_seq RESTART WITH 1;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'activity_log_id_seq') THEN
        ALTER SEQUENCE activity_log_id_seq RESTART WITH 1;
    END IF;
    IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'analytics_id_seq') THEN
        ALTER SEQUENCE analytics_id_seq RESTART WITH 1;
    END IF;
END $$;

-- Create Admins Table
CREATE TABLE Admins (
    ID SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin'
);

-- Create Customers Table
CREATE TABLE Customers (
    ID SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(16),
    signup_date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Create Food_Items Table
CREATE TABLE Food_Items (
    ID SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image_path VARCHAR(255), -- Path to image in the public folder
    category VARCHAR(50) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE
);

-- Create Orders Table
CREATE TABLE Orders (
    ID SERIAL PRIMARY KEY,
    customer_id INT NOT NULL,
    time_placed TIMESTAMP NOT NULL DEFAULT NOW(),
    time_ready TIMESTAMP,
    confirmed BOOLEAN DEFAULT FALSE,
    order_status VARCHAR(20) DEFAULT 'pending',
    total_price DECIMAL(10, 2),
    FOREIGN KEY (customer_id) REFERENCES Customers(ID) ON DELETE CASCADE
);

-- Create Order_Items Table
CREATE TABLE Order_Items (
    ID SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    food_id INT NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES Orders(ID) ON DELETE CASCADE,
    FOREIGN KEY (food_id) REFERENCES Food_Items(ID) ON DELETE RESTRICT
);
