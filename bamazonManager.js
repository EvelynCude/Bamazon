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

//Display store manager header and send to main menu
connection.connect(function (err) {
    if (err) throw err;
    console.log("__________________________________________________________________________________________________________________".blue.bold);
    console.log("|``````````````````````````````````````````````".blue.bold +"Manager View"+"``````````````````````````````````````````````````````|".blue.bold);
    console.log("|`````````````````".blue.bold+"_________  _______  ____   ___  ___________________ ________  ___  ___".red.bold+"`````````````````````````|".blue.bold);
    console.log("|````````````````".blue.bold+"/\\  <\\>   \\/       \\/    \\ /   \\/    _________     //   ___  \\/   \\/   \\".red.bold+"````````````````````````|".blue.bold);
    console.log("|````````````````".blue.bold+"\\ \\_______/\\   <\\>  \\     \\     \\   <\\>  \\ _ /    / |   \\  \\  \\         \\".red.bold+"```````````````````````|".blue.bold);
    console.log("|`````````````````".blue.bold+"\\ \\  <\\>  `\\        \\           \\        \\ /    /___\\   \\__/  |         \\".red.bold+"``````````````````````|".blue.bold);
    console.log("|``````````````````".blue.bold+"\\ \\_______/\\____\\   \\___/\\/\\____\\____\\   \\__________\\_______/ \\___/\\    \\".red.bold+"`````````````````````|".blue.bold);
    console.log("|```````````````````".blue.bold+"\\/______/\\/___/ \\___\\_/\\/\\/____/____/\\___\\_________/______/ \\/__/\\ \\____\\".red.bold+"````````````````````|".blue.bold);
    console.log("|`````````````````````````````````".blue.bold+"\\/____/               \\/___/                        \\/____/".red.bold +"````````````````````|".blue.bold);
    console.log("|````````````````````````````````````````````````````````````````````````````````````````````````````````````````|".blue.bold);
    console.log("|________________________________________________________________________________________________________________|".blue.bold);
    mainMenu();
});

//Main menu options 
function mainMenu() {
    inquirer.prompt([
        {
            type: "rawlist",
            name: "queryType",
            message: "What would you like to do?",
            choices: [
                'View Products for Sale',
                'View Low Inventory',
                'Add to Inventory',
                'Add New Product',
                'Exit'
            ]
        }
    ]).then(function (data) {
        switch (data.queryType) {
            case 'View Products for Sale':
                viewProducts();
                break;
            case 'View Low Inventory':
                lowInventory();
                break;
            case 'Add to Inventory':
                addInventory();
                break;
            case 'Add New Product':
                addProduct();
                break;
            case 'Exit':
                connection.end();
        };
    });
}
// Provide Manager ability to go to main menu or exit after every result
function exitOption(){
    inquirer.prompt([
        {
            type: "rawlist",
            name: "queryType",
            message: "Options:",
            choices: [
                'Main Menu',
                'Exit'
            ]
        }
    ]).then(function (data) {
        switch (data.queryType) {
            case 'Main Menu':
                mainMenu();
                break;
            case 'Exit':
                connection.end();
        };
    });
}

//Fucntion to display list of every item (IDs, names, prices, and quantities)
function viewProducts(){
    connection.query('SELECT item_id, product_name, price, department_name, stock_quantity FROM products', function (err, res) {
        var table = new Table({
            head: ['Item ID', 'Product Name', 'Price ($)', 'Department', 'Stock Quantity']
            , colWidths: [10, 55, 20, 40, 20]
        });
        for (i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, res[i].price, res[i].department_name, res[i].stock_quantity]);
        }
        console.log(table.toString());
        exitOption();
    });  
}

//Function to view low Inventory
function lowInventory(){
    var query = "SELECT item_id, product_name, stock_quantity FROM products WHERE stock_quantity < 5";
    connection.query(query, function (err, res) {
        var table = new Table({
            head: ['Item ID', 'Product Name', 'Stock Quantity']
            , colWidths: [10, 55, 20]
        });
        for (i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name,  res[i].stock_quantity]);
        }
        console.log(table.toString());
        exitOption();
    }); 
}

//Functinn to add Inventory
function addInventory(){
    inquirer
        .prompt([
            {
                name: "itemID",
                type: "input",
                message: "Enter the Item ID: "
            },
            {
                name: "quantity",
                type: "input",
                message: "How many units would you like to add?"
            }
        ])
        .then(function (answer) {
            connection.query('SELECT * FROM products WHERE ?', { item_id: answer.itemID }, function (err, res) {
            var updateStock = res[0].stock_quantity + parseInt(answer.quantity);
            console.log(updateStock);
            connection.query(
                'UPDATE products SET ? WHERE ?',
                    [{
                        stock_quantity: updateStock
                    },
                    {
                        item_id: answer.itemID
                    }],
                    function (err) {
                        if (err) throw err;
                        console.log("\nYou're inventory update was successfull!\n\n".magenta.bold);
                    mainMenu();
                }
            )
            });

        });
}

function addProduct(){
    inquirer.prompt([

        {
            type: "input",
            name: "product",
            message: "What is the name of your new product?"
        },
        {
            type: "input",
            name: 'department',
            message: 'Which department do you wish to add the new product to?'
        },
        {
            type: 'input',
            name: 'price',
            message: "What should the product's price be?"
        },
        {
            type: 'input',
            name: 'stock',
            message: "How many are you adding to your stock?"
        }
    ]).then(function (data) {
        var query = connection.query(
            "INSERT INTO products SET ?",
            {
                product_name: data.product,
                department_name: data.department,
                price: data.price,
                stock_quantity: data.stock
            },
            function (err, res) {
                if (err) throw err;
                console.log("You've successfully added %s.  It is now being sold on Bamazon.", data.product);
                // Call updateProduct AFTER the INSERT completes

            }
        );

    });

};