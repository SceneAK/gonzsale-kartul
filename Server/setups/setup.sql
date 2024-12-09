CREATE DATABASE gonzsale;
USE gonzsale;
CREATE TABLE users(
   user_id VARCHAR(36) PRIMARY KEY, 
   user_name VARCHAR(35),
   user_phone VARCHAR(10),
   user_email VARCHAR(30) NOT NULL UNIQUE,
   user_password VARCHAR(256),
   user_role ENUM('USER', 'STORE_MANAGER', 'ADMIN') DEFAULT 'USER',
   user_used_storage INT DEFAULT 0
);

CREATE TABLE stores(
   store_id VARCHAR(36) PRIMARY KEY,
   owner_user_id VARCHAR(36) UNIQUE, 
   store_name VARCHAR(35),
   store_imgSrc TEXT,
   store_QR_imgSrc TEXT,
   store_bank_account VARCHAR(16),
   store_payment_method VARCHAR(10),
   FOREIGN KEY (owner_user_id) REFERENCES users(user_id)
);

CREATE TABLE products(
   product_id VARCHAR(36) PRIMARY KEY,
   product_name VARCHAR(200),
   product_description VARCHAR(600),
   product_category VARCHAR(150),
   product_variants JSON,
   product_imgSrc JSON,
   product_price INT,
   product_unit VARCHAR(50),
   store_id VARCHAR(36),
   product_canOrder boolean,
   FOREIGN KEY (store_id) REFERENCES stores(store_id)
);

CREATE TABLE transactions(
   transaction_id VARCHAR(36) PRIMARY KEY, 
   transaction_date date,
   transaction_amount INT,
   transaction_proof TEXT
);

CREATE TABLE orders(
   order_id VARCHAR(36) PRIMARY KEY,
   transaction_id VARCHAR(36),
   product_id VARCHAR(36),
   customer_user_id VARCHAR(36),
   order_qty INT,
   order_variant JSON,
   order_notes TEXT,
   order_status ENUM('PENDING', 'PROCESSING', 'IN_GONZAGA' ,'COMPLETED') DEFAULT 'PENDING',
   FOREIGN KEY (product_id) REFERENCES products(product_id),
   FOREIGN KEY (customer_user_id) REFERENCES users(user_id),
   FOREIGN KEY (transaction_id) REFERENCES transactions(transaction_id)
);
