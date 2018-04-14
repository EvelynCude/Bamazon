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
    console.log("__________________________________________________________________________________________________________________".red.bold);
    console.log("|`````````````````````````````````````````````Welcome To`````````````````````````````````````````````````````````|".red.bold);
    console.log("|```````````````` _________  _______  ____   ___  ___________________ ________  ___  ___`````````````````````````|".red.bold);
    console.log("|````````````````/\\  ====  \\/       \\/    \\ /   \\/    _________     //   ___  \\/   \\/   \\````````````````````````|".red.bold);
    console.log("|````````````````\\ \\_______/\\   <\\>  \\     \\     \\   <\\>  \\ _ /    / |   \\  \\  \\         \\```````````````````````|".red.bold);
    console.log("|`````````````````\\ \\  ==== `\\        \\           \\        \\ /    /___\\   \\__/  |         \\``````````````````````|".red.bold);
    console.log("|``````````````````\\ \\_______/\\____\\   \\___/\\/\\____\\____\\   \\__________\\_______/ \\___/\\    \\`````````````````````|".red.bold);
    console.log("|```````````````````\\/______/\\/___/ \\___\\_/\\/\\/____/____/\\___\\_________/______/ \\/__/\\ \\____\\````````````````````|".red.bold);
    console.log("|`````````````````````````````````\\/____/               \\/___/                        \\/____/````````````````````|".bold.red);
    console.log("|````````````````````````````````````````````````````````````````````````````````````````````````````````````````|".bold.red);
    console.log("|________________________________________________________________________________________________________________|".bold.red);
    showProducts();
});

function showProducts(){
    connection.query('SELECT item_id, product_name, price FROM products', function (err, res) {
        var table = new Table({
            head: ['Item ID', 'Product Name', 'Price ($)']
            , colWidths: [10, 55, 20]
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
                    console.log("Sorry, there's not enough in stock to complete you're order.");
                    console.log("Try a different quantity or a different item.")
                    mainMenu();
                }else{
                    var purchasePrice = res[0].price * parseInt(answer.quantity);
                    var updateStock = res[0].stock_quantity - parseInt(answer.quantity);
                    connection.query(
                        'UPDATE products SET ? WHERE ?', 
                        [
                            {
                                stock_quantity: updateStock
                            }, 
                            {
                                item_id: answer.itemID
                            }
                        ] , 
                        function(err){
                        if (err) throw err;
                        console.log("\nYou're order has been processed!  The total cost of your purchase was $%s.".magenta.bold, purchasePrice); 
                        console.log("Thank you for shopping at Bamazon.".magenta.bold);
                        connection.end();
                    }
                    )
                }
            });
        });
}


