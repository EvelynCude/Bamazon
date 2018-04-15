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

/* Modify item id to auto increment after importing data from csv*/
ALTER TABLE products MODIFY item_id INTEGER(10) AUTO_INCREMENT;
SELECT *FROM products;

SELECT * FROM products;

CREATE TABLE departments(
    department_id INTEGER AUTO_INCREMENT NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    over_head_costs DECIMAL(10,2) NOT NULL,
    product_sales DECIMAL(10,2) NOT NULL,
    PRIMARY KEY(department_id)
);

SELECT * FROM departments;

INSERT INTO departments (department_name, over_head_costs, product_sales)
VALUE ("Pet Supplies", 500, 1500),
    ("Home and Kitchen", 1000, 2000),
    ("Clothing and Shoes", 750, 900),
    ("Cell Phones and Accessories", 1400, 2300),
    ("Accessories", 400, 500),
    ("Beauty and Health", 950, 1000),
    ("Food and Beverage", 1200, 1500);