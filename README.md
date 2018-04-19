# Bamazon (Node.js & MySQL App)

## Overview

Bamazon is a CLI Amazon-like storefront created using Node and MySQL.  It takes in orders from customers and depletes stock from the Bamazon store's inventory. It incorporates Manager and Supervisor CLI functionality where inventory, departments, and products can be displayed and managed.  

* [Video of typical user flows through the application found here](https://www.youtube.com/watch?v=Zb3xl9Cy2Eo).


### Customer Application

The customer application is a Node application called `bamazonCustomer.js`.  Running this application:

1) Displays all of the items available for sale. 

2) Prompts the users with two messages:

   * The first asks them the ID of the product they would like to buy.
   * The second message asks how many units of the product they would like to buy.

3) Once the customer has placed the order, the application checks if Bamazon has enough of the product to meet the customer's request.

   * If Bamazon _does not_ have enough of the product, the app informs the user and does not fullfill the order.
   * If Bamazon _does_ have enough of the product, the customer's order is fulfilled.


![Bamazon Customer Image](/Customer.png)   
