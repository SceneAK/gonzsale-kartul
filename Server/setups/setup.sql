      CREATE DATABASE GonzSale;

CREATE TABLE user(
   user_id int(3) AUTO_INCREMENT PRIMARY KEY, 
   user_name varchar(35),
   user_phone varchar(10),
   user_email varchar(30),
   user_password varchar(256),
   user_used_storage int DEFAULT 0                  -- in megabytes
);

CREATE TABLE store(
   store_id int(3) AUTO_INCREMENT PRIMARY KEY,
   owner_user_id int(3),
   store_name varchar(35),
   store_imgSrc text,
   FOREIGN KEY (owner_user_id) REFERENCES user(user_id)
);

CREATE TABLE product(
   product_id int(4) AUTO_INCREMENT PRIMARY KEY,    --All product will be visible anyways
   product_name varchar(200),
   product_description varchar(600),
   product_category varchar(150),                   -- One Category Path. Maybe add "tags" if needed
   product_variants json,
   product_imgSrc json,                             -- URL Array
   product_price int,
   product_unit varchar(50),
   store_id int(3),
   FOREIGN KEY (store_id) REFERENCES store(store_id)
);

CREATE TABLE order(
   order_id int(6) AUTO_INCREMENT PRIMARY KEY,
   transaction_id int(6),
   product_id int(4),
   customer_user_id int(4),
   order_qty int,
   order_variant json,
   order_status ENUM('PENDING', 'PROCESSING', 'IN_GONZAGA' ,'COMPLETED') DEFAULT 'PENDING',
   FOREIGN KEY (product_id) REFERENCES product(product_id),
   FOREIGN KEY (customer_user_id) REFERENCES user(user_id),
   FOREIGN KEY (transaction_id) REFERENCES transaction(transaction_id)
);

CREATE TABLE transaction(
   transaction_id int(6) PRIMARY KEY, 
   transaction_date date,
   transaction_amount int
   payment_method varchar(255),
);
