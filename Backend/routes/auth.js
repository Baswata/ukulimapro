const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db'); // Your database connection

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET; // Ensure this is set in your environment variables

// Registration Route
router.post('/register', async (req, res) => {
    const { fullname, email, username, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await new Promise((resolve, reject) => {
            const query = 'SELECT * FROM users WHERE email = ? OR username = ?';
            db.query(query, [email, username], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into the database
        const query = 'INSERT INTO users (fullname, email, username, password) VALUES (?, ?, ?, ?)';
        await new Promise((resolve, reject) => {
            db.query(query, [fullname, email, username, hashedPassword], (err) => {
                if (err) return reject(err);
                resolve();
            });
        });

        res.status(201).json({ message: 'User registered successfully.' });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the user by username
        const user = await new Promise((resolve, reject) => {
            const query = 'SELECT * FROM users WHERE username = ?';
            db.query(query, [username], (err, results) => {
                if (err) return reject(err);
                resolve(results[0]);
            });
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password.' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid username or password.' });
        }

        // Generate a token
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token, user: { id: user.id, username: user.username } });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
