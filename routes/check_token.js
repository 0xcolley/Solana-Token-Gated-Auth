const express = require('express');
const { connection } = require('../db');

const router = express.Router();

const check_tokens = (mint_addies, callback) => {
    if (mint_addies.length === 0) {
        callback(false, null); // No addresses to check, return false
        return;
    }

    const placeholders = mint_addies.map(() => '?').join(',');
    const query = `SELECT * FROM mint_addy WHERE address IN (${placeholders})`;
    connection.query(query, mint_addies, (error, results) => {
        if (error) {
            console.log(error);
            callback(false, error); 
            return;
        }
        if (results.length > 0) {
            callback(true, null); 
        } else {
            callback(false, null);
        }
    });
};


router.post('/auth', (req, res) => {
    const token_addresses = req.body.tokens;
    if (!Array.isArray(token_addresses) || token_addresses.length === 0) {
        return res.status(400).json({ message: 'Invalid input: expected a non-empty array of addresses' });
    }

    check_tokens(token_addresses, (result, error) => {
        if (result == true) {
            console.log(`User logged in: ${req.ip}` )
            res.status(201).json({ message: 'Success', data: result }).send();
        } 
        else {
            console.log(`User failed auth: ${req.ip}` )
            res.status(401).json({ message: 'No matching addresses found' }).send();
        }
    });
});

module.exports = router;
