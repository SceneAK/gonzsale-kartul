      CREATE DATABASE GonzSale;

   CREATE TABLE User(
      user_id int(3) AUTO_INCREMENT PRIMARY KEY, 
      user_name varchar(35),
      user_phone varchar(10),
      user_email varchar(30),
      user_password varchar(256),
      user_used_storage int DEFAULT 0                  -- in megabytes
   );

   CREATE TABLE Store(
      store_id int(3) AUTO_INCREMENT PRIMARY KEY,
      store_name varchar(35),
      owner_user_id_fk int(3),
      store_imgSrc text,
      FOREIGN KEY (owner_user_id_fk) REFERENCES User(user_id)
   );

   CREATE TABLE Product(
      product_id int(4) AUTO_INCREMENT PRIMARY KEY,    
      product_name varchar(200),
      product_description varchar(600),
      product_imgSrc json,                           
      product_category varchar(150),  
      store_id_fk int(3),
      FOREIGN KEY (store_id_fk) REFERENCES Store(store_id)
   );

   CREATE TABLE Order(

   );

   CREATE TABLE Transaction(
      transaction_id int(6) AUTO_INCREMENT PRIMARY KEY, 
      buyer_user_id int(3),
      seller_store_id int(3),
      product_id int(4)
   );