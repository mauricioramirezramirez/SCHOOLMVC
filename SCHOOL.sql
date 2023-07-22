CREATE DATABASE SCHOOL;
USE SCHOOL;

CREATE TABLE students(
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    grade INT NOT NULL
);

SHOW TABLES;
DESCRIBE students;


INSERT INTO students(id, email, name, last_name, grade) VALUES(null, "mauricio-ramirez@gmail.com", "Mauricio", "Ramírez", 93);
INSERT INTO students(id, email, name, last_name, grade) VALUES(null, "ivan_mendoza@gmail.com", "Ivan", "Mendoza", 90);

SELECT * FROM students;

/*
dotnet ef migrations add InitialCreate
dotnet ef database update
*/