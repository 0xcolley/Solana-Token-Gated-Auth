const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const dotenv = require('dotenv').config();
const auth_route = require('./routes/check_token.js');
const fs = require('fs');
const { connection } = require('./db');

const app = express();

app.use(cors());

app.use((req, res, next) => {
    console.log(`${new Date().toString()} - ${req.method} Request to ${req.url}`);
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api', auth_route);

app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).send('Internal Server Error');
});

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
    
    connection.connect(error => {
        if (error) {
            console.error('Error connecting to the database:', error.stack);
            return;
        }
        console.log('Connected to the database successfully.');
    });
});

module.exports = app;