const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
require('dotenv').config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Failed to authenticate token' });
        }
        req.userId = decoded.id;
        next();
    });
};

// Registration Route
router.post('/register', async (req, res) => {
    const { fullname, email, username, password } = req.body;
    
    try {
        console.log("Received registration request:", fullname, email, username);

        // Check if the user already exists
        const existingUser = await new Promise((resolve, reject) => {
            const query = 'SELECT * FROM users WHERE email = ? OR username = ?';
            db.query(query, [email, username], (err, results) => {
                if (err) {
                    console.error("Error querying database for existing user:", err);
                    return reject(err);
                }
                resolve(results);
            });
        });

        if (existingUser.length > 0) {
            console.log("User already exists with email or username.");
            return res.status(400).json({ success: false, message: 'User already exists.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Password hashed successfully.");

        // Insert new user into the database
        const query = 'INSERT INTO users (fullname, email, username, password) VALUES (?, ?, ?, ?)';
        await new Promise((resolve, reject) => {
            db.query(query, [fullname, email, username, hashedPassword], (err) => {
                if (err) {
                    console.error("Error inserting user into the database:", err);
                    return reject(err);
                }
                resolve();
            });
        });

        console.log("User registered successfully.");
        res.status(201).json({ success: true, message: 'User registered successfully.' });
    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});


// Login Route

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    // Check if both username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: 'Both username and password are required' });
    }

    try {
        const userQuery = 'SELECT * FROM users WHERE username = ?';
        const user = await new Promise((resolve, reject) => {
            db.query(userQuery, [username], (err, results) => {
                if (err) {
                    console.error('Database query error:', err); // Log DB errors
                    return reject(err);
                }
                resolve(results[0]); 
            });
        });

        // Check if the user exists
        if (!user) {
            console.log('User not found:', username); // Log user not found
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare provided password with the stored hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Password mismatch for user:', username); // Log password mismatch
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create JWT token
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
        
        // Send success response with token and user info
        res.status(200).json({ token, user: { id: user.id, username: user.username } });
    } catch (err) {
        console.error('Login error:', err); // Log any other errors
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
