const express = require("express");

const mysql = require("mysql2");
const inquire = require("inquirer");
const cTable = require("console.table");

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


  
// close inquirer input if user press "escape" key
process.stdin.on('keypress', (_, key) => {
if (key.name === "escape") {
    process.exit();
}
});

const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // TODO: Add MySQL password here
        password: 'Coding123.',
        database: 'employees_db'
    },
    
);



function launchMenu() {
    return inquire 
    .prompt([
        {
            type: "list",
            name: "menu",
            message: "MENU: What would you like to do?",
            choices: ["View All Departments", "View All Roles", "View All Employees", "Add a Department", "Add a Role", "Add an Employee", "Update an Employee Role"]
        }

    ])
    .then( val => {
        switch (val.menu) {
            case"View All Departments":
                displayDepartment ();
                break;
            case "View All Roles":
                displayRoles();
                break;
            case "View All Employees":
                displayEmployees();
                break;
            case "Add a Department":
            case "Add a Role":
            case "Add an Employee":
            case "Update an Employee Role":
        }
    })
}

// Using Promise Wrapper through MySQL2
function displayDepartment () {

    const sql = `SELECT * FROM department`;

    db.promise().query(sql)
    .then( ([rows, fields]) => {
        console.log(`\n
        ____________________________________
        |                                  |
        |             DEPARTMENTS          |
        |__________________________________|
        `);
        console.table(rows);
    }).catch(console.log)
    .then(()=> launchMenu());
};

function displayRoles () {
     const sql = `SELECT 
            role.id, 
            role.title, 
            department.name AS Department, 
            role.salary
        FROM role
        INNER JOIN department
            ON role.department_id = department.id`

    db.promise().query(sql)
    .then(([rows,fields]) => {
    
                console.log(`\n 
        ____________________________________
        |                                  |
        |              ROLES               |
        |__________________________________|
        `);
        console.table(rows);
    })
    .catch(console.log)
    .then(()=> launchMenu());;
            
};

function displayEmployees () {
    const sql = `SELECT 
            E.id, 
            E.first_name,
            E.last_name, 
            role.title,
            department.name AS department,
            role.salary,
            CONCAT(M.first_name, " ", M.last_name) AS manager 
        FROM employee E
            LEFT JOIN employee M
                ON E.manager_id = M.id
            LEFT JOIN role
                ON e.role_id = role.id
            LEFT JOIN department
                ON role.department_id = department.id`

   db.promise().query(sql)
   .then(([rows,fields]) => {
   
               console.log(`\n 
       ____________________________________
       |                                  |
       |             EMPLOYEES            |
       |__________________________________|
       `);
       console.table(rows);
   })
   .catch(console.log)
   .then(()=> launchMenu());;
           
};


// function addDepartment() {
//     return inquire
//     .prompt([
//         {
//             type: "input",
//             name: "department",
//             message: "What is the name of the Department?"
//         }
//     ]).then ((answers)=> {
//         const sql = `INSERT INTO department (name) 
//         VALUES (?)`;

//         const departmentNameParam = answers.department;

//         db.query(sql, departmentNameParam, (err, result) =>{
//             if (err) {
//                 console.log(err);
//             };
//         });

//         db.query(`SELECT * FROM department`, function (err,results) {
//             if (err) {
//                 console.log(err);
//             };
//             console.table(results)
//         })

//         launchApplication ();

//     })
// }



launchMenu();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  