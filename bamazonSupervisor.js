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
    console.log("|`````````````````````````````````````````````".blue.bold + "Supervisor View" + "````````````````````````````````````````````````````|".blue.bold);
    console.log("|`````````````````".blue.bold + "_________  _______  ____   ___  ___________________ ________  ___  ___".red.bold + "`````````````````````````|".blue.bold);
    console.log("|````````````````".blue.bold + "/\\  <\\>   \\/       \\/    \\ /   \\/    _________     //   ___  \\/   \\/   \\".red.bold + "````````````````````````|".blue.bold);
    console.log("|````````````````".blue.bold + "\\ \\_______/\\   <\\>  \\     \\     \\   <\\>  \\ _ /    / |   \\  \\  \\         \\".red.bold + "```````````````````````|".blue.bold);
    console.log("|`````````````````".blue.bold + "\\ \\  <\\>  `\\        \\           \\        \\ /    /___\\   \\__/  |         \\".red.bold + "``````````````````````|".blue.bold);
    console.log("|``````````````````".blue.bold + "\\ \\_______/\\____\\   \\___/\\/\\____\\____\\   \\__________\\_______/ \\___/\\    \\".red.bold + "`````````````````````|".blue.bold);
    console.log("|```````````````````".blue.bold + "\\/______/\\/___/ \\___\\_/\\/\\/____/____/\\___\\_________/______/ \\/__/\\ \\____\\".red.bold + "````````````````````|".blue.bold);
    console.log("|`````````````````````````````````".blue.bold + "\\/____/               \\/___/                        \\/____/".red.bold + "````````````````````|".blue.bold);
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
                'View Product Sales by Department',
                'Create New Department',
                'Exit'
            ]
        }
    ]).then(function (data) {
        switch (data.queryType) {
            case 'View Product Sales by Department':
                viewSales();
                break;
            case 'Create New Department':
                newDepartment();
                break;
            case 'Exit':
                connection.end();
        };
    });
}
function exitOption() {
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

function viewSales(){
    connection.query('SELECT departments.department_id, departments.department_name, departments.over_head_costs, departments.product_sales,' +
    '(departments.product_sales - departments.over_head_costs) AS total_profit FROM departments', function(err, res){
        var table = new Table({
            head: ['Department ID', 'Department Name', 'Overhead Costs', 'Product Sales', 'Total Profit']
            , colWidths: [15, 45, 18, 15, 15]
        });
        for (i = 0; i < res.length; i++) {
            table.push([res[i].department_id, res[i].department_name, res[i].over_head_costs, res[i].product_sales, res[i].total_profit]);
        }
        console.log(table.toString());
        exitOption();
    });
}



function newDepartment() {
    inquirer.prompt([
        {
            type: "input",
            name: "department",
            message: "What is the name of the new department?"
        },
        {
            type: "input",
            name: 'overhead',
            message: 'What is the overhead cost of the department?'
        }
    ]).then(function (data) {
        var query = connection.query(
            "INSERT INTO departments SET ?",
            {
                department_name: data.department,
                over_head_costs: data.overhead,
                product_sales: 0.00
            },
            function (err, res) {
                if (err) throw err;
            }
        );
        console.log("\nYou've successfully added the %s department to Bamazon.\n".magenta.bold, data.department);          
        exitOption();
    });
}