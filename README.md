# Bamazon (Node.js & MySQL App)

## Overview

Bamazon is a CLI Amazon-like storefront created using Node and MySQL.  It takes in orders from customers and depletes stock from the Bamazon store's inventory. It incorporates Manager and Supervisor CLI functionality where inventory, departments, and products can be displayed and managed.  

* [Video of typical user flows through the application found here](https://www.youtube.com/watch?v=Zb3xl9Cy2Eo).



## Customer Application

The customer application is a Node application called `bamazonCustomer.js`.  Running this application will:

1) Display all of the items available for sale. 
_(Rows in this 'products' table were imported into the database from a csv file provided in my github.)_

2) Prompt the users with two messages:

   * The first asks them the ID of the product they would like to buy.
   * The second message asks how many units of the product they would like to buy.

3) Once the customer requests to place an order, the application checks if Bamazon has enough of the product to meet the customer's request.

   * If Bamazon _does not_ have enough of the product, the app informs the user and does not fullfill the order.
   * If Bamazon _does_ have enough of the product, the customer's order is fulfilled.


![Bamazon Customer Image](/Customer.PNG)


## Manager Application

The manager application is a Node application called `bamazonManager.js`. Running this application will:

1) List a set of menu options:

    * View Products for Sale
    * View Low Inventory
    * Add to Inventory
    * Add New Product

2) If a manager selects `View Products for Sale`, the app will list every available item: the item IDs, names, prices, and quantities.

3) If a manager selects `View Low Inventory`, then it will list all items with an inventory count lower than five.

4) If a manager selects `Add to Inventory`, it will display a prompt that will let the manager "add more" of any item currently in the store.

5) If a manager selects `Add New Product`, it will allow the manager to add a completely new product to the store.

![Bamazon Manager Image](/Manager.PNG)   



## Supervisor Application

The supervisor application is a Node app called `bamazonSupervisor.js`. Running this application will list the following menu options:

   * View Product Sales by Department
   
   * Create New Department

1) When a supervisor selects `View Product Sales by Department`, the app will display a summarized table in their terminal/bash window.

   * The `total_profit` column is be calculated on the fly using the difference between `over_head_costs` and `product_sales`. `total_profit` is not stored in any database. It uses a custom alias.

2) When the supervisor select `Create New Department`, the app will display a prompt that will let the supervisor add a new department.

![Bamazon Supervisor Image](/Supervisor.PNG) 

