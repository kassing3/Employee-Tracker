-- Displays Table for Deparment Directory
SELECT *
FROM department;


-- Displays Table for Role Directory
SELECT 
    role.id, 
    role.title, 
    department.name AS Department, 
    role.salary
FROM role
INNER JOIN department
    ON role.department_id = department.id;

-- Displays Table For Employee Directory
SELECT 
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
        ON role.department_id = department.id;

 