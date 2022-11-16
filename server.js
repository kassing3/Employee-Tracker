const express = require("express");

const mysql = require("mysql2");
const inquire = require("inquirer");
const cTable = require("console.table");

const Query = require("./lib/Query");
const displayDepartment = new Query.displayDepartment();

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // TODO: Add MySQL password here
      password: 'Coding123.',
      database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
);

db.query(displayDepartment, function (err,results) {
    console.log(results)
});