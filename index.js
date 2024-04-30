require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 5000;

// Create connection to MySQL
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.PORT
});

// Connect
connection.connect(err => {
  if (err) {
    console.log('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');

  // Create table if not exists
  const CREATE_TABLE_QUERY = `CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    dob DATE NOT NULL
  )`;
  
  connection.query(CREATE_TABLE_QUERY, (err) => {
    if (err) {
      console.log('Error creating table:', err);
      return;
    }
    console.log('Table created successfully');
  });
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint to save student information
app.post('/students', (req, res) => {
  const { name, email, dob } = req.body;
  const INSERT_STUDENT_QUERY = `INSERT INTO students (name, email, dob) VALUES (?, ?, ?)`;
  connection.query(INSERT_STUDENT_QUERY, [name, email, dob], (err, results) => {
    if (err) {
      console.log('Error saving student:', err);
      res.status(500).send('Error saving student');
      return;
    }
    res.status(200).send('Student saved successfully');
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
