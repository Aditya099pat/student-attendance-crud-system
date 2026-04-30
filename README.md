# Student Attendance CRUD System

A full-stack DBMS project that connects a React frontend with a MySQL database through an Express.js backend. The application allows users to create, read, update, and delete student records, while also managing attendance data. All frontend actions are reflected directly in the MySQL database.

## Project Overview

This project demonstrates how a frontend application communicates with a backend server and performs database operations using REST APIs. The backend handles API requests, executes SQL queries, and updates the MySQL database based on user actions performed from the frontend.

## Features

- Add new student records
- View all students
- View a specific student by ID
- Update existing student details
- Delete student records
- Mark student attendance
- View attendance records with student details
- MySQL database integration
- REST API-based backend
- React frontend using Axios for API calls

## Tech Stack

### Frontend
- React
- Vite
- Axios
- React Router DOM

### Backend
- Node.js
- Express.js
- MySQL2
- CORS
- Dotenv
- Nodemon

### Database
- MySQL
  
## Database Tables

```sql
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    roll_no VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    department VARCHAR(100),
    year INT
);

CREATE TABLE attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(id)
);
```
  

## Project Structure

```text
DBMS-MPR-main/
│
├── client/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── routes/
│   │   ├── student.routes.js
│   │   └── attendance.routes.js
│   ├── app.js
│   ├── db.js
│   ├── index.js
│   └── package.json
│
└── README.md
