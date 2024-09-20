const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db'); 
const router = express.Router();

// Registration endpoint
router.post('/api/auth/register', async (req, res) => {
    const { fullname, email, username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO users (fullname, email, username, password) VALUES (?, ?, ?, ?)';
        db.query(query, [fullname, email, username, hashedPassword], (err) => {
            if (err) {
                console.error('Error registering user:', err);
                return res.status(500).json({ message: 'Database error' });
            }
            res.status(201).json({ success: true, message: 'Registration successful' });
        });
    } catch (err) {
        console.error('Error during registration:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Login endpoint
router.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], async (err, results) => {
        if (err) {
            console.error('Error logging in:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        const user = results[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        res.status(200).json({ success: true, message: 'Login successful' });
    });
});
module.exports= router;