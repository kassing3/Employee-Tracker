# Employee-Tracker
[![The MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


## Description
This program allows a business owner to iew and manage the departments, roles, and employees in their company to organize and plan their business. This CMS program is a built out command-line application that manages a company's employee database using Node.js, Inquirer, and MySQL based in the following acceptance criteria:

```
GIVEN a command-line application that accepts user input
WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids
WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database
WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database
```

## Installation
To use this program, you must have install that necessary npm packages using the command ```npm install``` in the command line

## Usage
To use this program to create and manage a company's employee database, open the command line in the designated folder and use the command ```node server.js``` or ```npm start```

For a better understanding of it's functionality and how to use the program, feel free to view the [Walk-through Video](https://watch.screencastify.com/v/J2S4KcrUUaxdag8EZW4h).

**Here's a screenshot of the command-line application with the prompts:**

![MockUp](./images/Screen%20Shot%202022-11-17%20at%209.27.58%20AM.png)


## License
This project is licensed under [The MIT License](https://opensource.org/licenses/MIT)


## Tests
To test this application, feel free to clone this repo in github, install the npm packages using ```npm install``` in the command line, and then enter ```node server.js``` or ```npm start``` in the command line to add departments, roles, and employees, and update an employee's role.	
