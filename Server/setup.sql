CREATE DATABASE GonzSale;

CREATE TABLE User(
   user_id int(3) AUTO_INCREMENT PRIMARY KEY, 
   user_name varchar(35),
   user_contact varchar(30)                         -- email or phone
);

CREATE TABLE Store(
   store_id int(3) AUTO_INCREMENT PRIMARY KEY,
   owner_user_id int(3),
   store_imgSrc = text
);

CREATE TABLE Product(
   product_id int(4) AUTO_INCREMENT PRIMARY KEY,    --All product will be visible anyways
   product_name varchar(200),
   product_description varchar(600),
   product_imgSrc json,                             -- URL Array
   product_category json,                           -- string array
   vendor_id int(3)
);

CREATE TABLE Transaction(
   transaction_id int(6) AUTO_INCREMENT PRIMARY KEY, 
   buyer_user_id int(3),
   seller_store_id int(3),
   product_id int(4)
);
