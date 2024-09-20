const express = require('express');
const db = require('../db');
const router = express.Router();

router.get ('/api/services', (req,res) => {
    const query = `SELECT * FROM service_providers`;
    db.query(query,(err, results) => {
        if (err) {
            console.error('Error fetching service providers:', err);
            return res.status(500).json ({message: 'Database Error'});
        }
        res.status(200).json(results);
    });
});
module.exports = router