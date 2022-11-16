INSERT INTO department (name)
VALUES ("Marketing"),
       ("Operations");

INSERT INTO role (title, salary, department_id)
VALUES ("Marketing Manager", 90000, 1),
       ("Operations Manager", 75000, 2),
       ("Coordinator", 50000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jessica", "Lewis", 1, NULL),
       ("Denis", "Matther", 2, NULL),
       ("Shane", "Douglass", 3, 1);
