
-- Create the users table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    birth_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    role VARCHAR(10) CHECK (role IN ('manager', 'owner'))
    email VARCHAR(50),
    password VARCHAR(100)
);

-- Create the products table
CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    product_name VARCHAR(100),
    product_category VARCHAR(100),
    product_price NUMERIC(10, 2)  -- Adjust precision and scale as needed
);

-- Create the store_location table
CREATE TABLE store_location (
    store_id SERIAL PRIMARY KEY,
    store_name VARCHAR(100),
    address VARCHAR(255),
    latitude DECIMAL(9, 6),
    longitude DECIMAL(9, 6)
);

-- Create the orders table
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    order_type VARCHAR(50),
    store_id INT REFERENCES store_location(store_id)
);

-- Create the order_list table
CREATE TABLE order_list (
    order_list_id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(order_id),
    product_id INT REFERENCES products(product_id),
    quantity INT
);

-- Create the recommendations table
CREATE TABLE recommendations (
    recommendation_id SERIAL PRIMARY KEY,
    recommendation TEXT,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
