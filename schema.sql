DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products
(
    item_id INTEGER(10) NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INTEGER(10) NOT NULL,
    product_sales DECIMAL(10,2) NULL,
    PRIMARY KEY(item_id)
);
SELECT * FROM products;

ALTER TABLE products MODIFY item_id INTEGER(10) AUTO_INCREMENT;
SELECT *FROM products;