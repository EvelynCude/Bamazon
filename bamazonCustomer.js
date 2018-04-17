var colors = require('colors');
var inquirer = require('inquirer');
var Table = require('cli-table');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: "",
    database: 'bamazon'
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("__________________________________________________________________________________________________________________".blue.bold);
    console.log("|```````````````````````````````````````````````".blue.bold + "Welcome To".red.bold + "```````````````````````````````````````````````````````|".blue.bold);
    console.log("|`````````````````".blue.bold + "_________  _______  ____   ___  ___________________ ________  ___  ___".red.bold + "`````````````````````````|".blue.bold);
    console.log("|````````````````".blue.bold + "/\\  <\\>   \\/       \\/    \\ /   \\/    _________     //   ___  \\/   \\/   \\".red.bold + "````````````````````````|".blue.bold);
    console.log("|````````````````".blue.bold + "\\ \\_______/\\   <\\>  \\     \\     \\   <\\>  \\ _ /    / |   \\  \\  \\         \\".red.bold + "```````````````````````|".blue.bold);
    console.log("|`````````````````".blue.bold + "\\ \\  <\\>  `\\        \\           \\        \\ /    /___\\   \\__/  |         \\".red.bold + "``````````````````````|".blue.bold);
    console.log("|``````````````````".blue.bold + "\\ \\_______/\\____\\   \\___/\\/\\____\\____\\   \\__________\\_______/ \\___/\\    \\".red.bold + "`````````````````````|".blue.bold);
    console.log("|```````````````````".blue.bold + "\\/______/\\/___/ \\___\\_/\\/\\/____/____/\\___\\_________/______/ \\/__/\\ \\____\\".red.bold + "````````````````````|".blue.bold);
    console.log("|`````````````````````````````````".blue.bold + "\\/____/               \\/___/                        \\/____/".red.bold + "````````````````````|".blue.bold);
    console.log("|````````````````````````````````````````````````````````````````````````````````````````````````````````````````|".blue.bold);
    console.log("|________________________________________________________________________________________________________________|\n".blue.bold);
    showProducts();
});

function showProducts(){
    connection.query('SELECT item_id, product_name, price FROM products', function (err, res) {
        var table = new Table({
            head: ['Item ID', 'Product Name', 'Price ($)']
            , colWidths: [10, 80, 20]
        });
        for (i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, res[i].price]);
        }
        console.log(table.toString());
        mainMenu();
    });    
}

function mainMenu(){
    inquirer
        .prompt([
            {
                name: "itemID",
                type: "input",
                message: "Enter the Item ID of the product you would like to buy: ".cyan
            },
            {
                name: "quantity",
                type: "input",
                message: "How many units would you like to buy?".cyan
            }
        ])
        .then(function(answer){
            connection.query('SELECT * FROM products WHERE ?', {item_id: answer.itemID}, function(err, res){
                if (err) throw err;

                if (parseInt(answer.quantity) > res[0].stock_quantity){
                    console.log("\nSorry, there's not enough in stock to complete you're order.");
                    console.log("Try a different quantity or a different item.\n")
                    mainMenu();
                }else{
                    var purchasePrice = res[0].price * parseInt(answer.quantity);
                    var updateStock = res[0].stock_quantity - parseInt(answer.quantity);
                    var updateSales = res[0].product_sales + answer.quantity * res[0].price;
                    var department = res[0].department_name;
                    connection.query(
                        'UPDATE products SET ? WHERE ?', 
                        [
                            {
                                stock_quantity: updateStock,
                                product_sales: updateSales
                            }, 
                            {
                                item_id: answer.itemID
                            }
                        ] , 
                        function(err){
                        if (err) throw err;
                        console.log("\nYou're order has been processed!  The total cost of your purchase was $%s.".magenta.bold, purchasePrice); 
                        console.log("Thank you for shopping at Bamazon.\n".magenta.bold);
                            connection.query(
                                'UPDATE departments SET product_sales = departments.product_sales + ? WHERE department_name = ?', [purchasePrice, department], function (err) {
                                    if (err) throw err;
                                    console.log("\n(Department sales have been updated.)\n\n".magenta.bold);
                                    connection.end();
                                }
                            );
                        }
                    );

                    // connection.query(
                    //     'UPDATE bamazon.departments SET ? WHERE ?'
                    //     [
                    //     {
                    //         product_sales: product_sales + purchasePrice
                    //     },
                    //     {
                    //         department_name: department
                    //     }
                    //     ],
                    //     function (err) {
                    //         if (err) throw err;
                    //         console.log("\n");
                    //         console.log(purchasePrice);
                    //         connection.end();
                    //     }
                    // );
                }
            });
        });
}


