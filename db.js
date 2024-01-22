const mysql = require('mysql2');
const fs = require('fs');
const dotenv = require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT_CONFIG,
    ssl: { ca: fs.readFileSync('./ca-certificate.crt') }
});

module.exports = {connection};