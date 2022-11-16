const express = require("express");

const mysql = require("mysql2");
const inquire = require("inquirer");
const cTable = require("console.table");

const PORT = process.env.PORT || 3001;
const app = express();

//Stores Department & Role Choices for Inquirer Prompts
const departmentArr = [];
const roleArr = [];
const employeeArr = [];

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// close inquirer input if user press "escape" key
process.stdin.on('keypress', (_, key) => {
if (key.name === "escape") {
    process.exit();
}
});

//Connection for Database
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

//Generates the Array of Department Choices for Adding Department Prompts
function departmentChoices() {
    const sql = `SELECT id AS value, name FROM department;`;

    db.query(sql, (err, res) => {
        if (err){
            throw err;
        }

        for (var i = 0; i < res.length; i++) {

            if (departmentArr.indexOf(res[i].name) === -1) {
                departmentArr.push(res[i].name);
            }; 
        }
    });


    return departmentArr


};

//Generates the Array of Role Choices for Adding Role Prompts
function roleChoices() {
    const sql = `SELECT id AS value, title FROM role;`;

    db.query(sql, (err, res) => {
        if (err){
            throw err;
        }

        for (var i = 0; i < res.length; i++) {
            roleArr.push(res[i].title);
        }
    });

    return roleArr


};

//Generates the Array of Employee Choices for Adding Manager & Updating Employee Prompts
function employeeChoices() {
    const sql = `SELECT id AS value, CONCAT(first_name, " ", last_name) AS name FROM employee`;

    db.query(sql, (err, res) => {
        if (err){
            throw err;
        }

        for (var i = 0; i < res.length; i++) {
            employeeArr.push(res[i].name);
        }
    });

    const none = {
        value: null,
        title: "None"
    }
    employeeArr.push(none.title);

    return employeeArr


};

//Prompts: MENU Options
function launchMenu() {
    return inquire 
    .prompt([
        {
            type: "list",
            name: "menu",
            message: "MENU: What would you like to do?",
            choices: ["View All Departments", "View All Roles", "View All Employees", "Add a Department", "Add a Role", "Add an Employee", "Update an Employee Role", "Exit"]
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
                addDepartment();
                break;
            case "Add a Role":
                addRole();
                break;
            case "Add an Employee":
                addEmployee();
                break;
            case "Update an Employee Role":
                updateEmployeeRole();
                break;
            case "Exit":
                process.exit();
                break;
        }
    })
}

//Displays Departments when selected in Menu
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

//Displays Roles when selected in Menu
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
    }).catch(console.log)
    .then(()=> launchMenu());;
            
};

//Displays Employees when selected in Menu
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

//PROMPTS: Add Department
function addDepartment() {
    return inquire
    .prompt([
        {
            type: "input",
            name: "department",
            message: "What is the name of the Department?"
        }
    ]).then ((answers)=> {
        const sql = `INSERT INTO department (name) 
        VALUES (?)`;

        const param = answers.department;

        db.promise().query(sql, param).then (([rows, fields]) =>{});
      
    }).then(() => {
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
        }).catch(console.log);
        
    }).then(() => {

      
            setTimeout(() => {
                console.log("Thank you for adding a Department!")
                launchMenu();
            }, 500);
    })
    
};

//PROMPTS: Add Roles
function addRole() {
    return inquire
    .prompt([
        {
            type: "input",
            name: "role",
            message: "What is the name of the Role?"
        },
        {
            type: "input",
            name: "salary",
            message: "What is the salary for the Role?"
        },
        {
            type: "list",
            name: "department",
            message:"Which Department does this Role belong to?",
            choices: departmentChoices ()
        },
    ]).then ((answers)=> {

        const departmentID = departmentChoices().indexOf(answers.department) + 1;

        const sql = `INSERT INTO role (title, salary, department_id) 
            VALUES (${JSON.stringify(answers.role)}, ${parseInt(answers.salary)}, ${departmentID})`;

       
        db.query(sql);
           
      
    }).then(()=> {

        const sql = `SELECT 
                        role.id, 
                        role.title, 
                        department.name AS Department, 
                        role.salary
                    FROM role
                    INNER JOIN department
                        ON role.department_id = department.id`;

        db.promise().query(sql)
        .then( ([rows, fields]) => {
                    console.log(`\n 
                ____________________________________
                |                                  |
                |              ROLES               |
                |__________________________________|
                `);
            console.table(rows);

        }).catch(console.log);

    })
    .then(() => {

      
            setTimeout(() => {
                console.log("Thank you for adding a Department!")
                launchMenu();
            }, 500);
    });
};

//PROMPTS: Add Employees
function addEmployee() {
    return inquire
    .prompt([
        {
            type: "input",
            name: "first_name",
            message: "What is the Employee's First Name?"
        },
        {
            type: "input",
            name: "last_name",
            message: "What is the Employee's Last Name?"
        },
        {
            type: "list",
            name: "role",
            message: "What is the Employee's Role",
            choices: roleChoices()
        },
        {
            type: "list",
            name: "manager",
            message: "Who is the Employee's Manager",
            choices: employeeChoices()
        },
    ]).then ((answers)=> {

        const roleID = roleChoices().indexOf(answers.role) + 1;
        const managerID = employeeChoices().indexOf(answers.manager) + 1;

        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
            VALUES (${JSON.stringify(answers.first_name)}, 
                    ${JSON.stringify(answers.first_name)}, 
                    ${roleID}, 
                    ${managerID})`;

       
        db.query(sql);
           
      
    }).then(()=> {

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
                            ON role.department_id = department.id`;

        db.promise().query(sql)
        .then( ([rows, fields]) => {
                    console.log(`\n 
                    ____________________________________
                    |                                  |
                    |             EMPLOYEES            |
                    |__________________________________|
                    `);
            console.table(rows);

        }).catch(console.log);

    })
    .then(() => {

      
            setTimeout(() => {
                console.log("Thank you for adding a Department!")
                launchMenu();
            }, 500);
    });
};

//PROMPTS: Update Employees
function updateEmployeeRole() {
    return inquire
    .prompt([
        {
            type: "list",
            name: "employee",
            message: "Which Employee's Role would you like to update?",
            choices: employeeChoices()
        },
        {
            type: "list",
            name: "role",
            message: `What role do you want to assign this Employee to?`,
            choices: roleChoices()
        },
    ]).then ((answers)=> {

        const employeeID = employeeChoices().indexOf(answers.employee) + 1;
        const roleID = roleChoices().indexOf(answers.role) + 1;

        const sql = ` UPDATE employee
                      SET role_id = ${roleID}
                      WHERE id = ${employeeID}`;

       
        db.query(sql);
           
      
    }).then(()=> {

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
                            ON role.department_id = department.id`;

        db.promise().query(sql)
        .then( ([rows, fields]) => {
                    console.log(`\n 
                    ____________________________________
                    |                                  |
                    |             EMPLOYEES            |
                    |__________________________________|
                    `);
            console.table(rows);

        }).catch(console.log);

    })
    .then(() => {

      
            setTimeout(() => {
                console.log("Thank you for adding a Department!")
                launchMenu();
            }, 500);
    });
};

launchMenu();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  