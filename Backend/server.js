const express = require('express');
const path = require('path');
const cors = require('cors');
const db = require('./db');
const jwt = require('jsonwebtoken');

const app = express();
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Import routes after defining middleware
const authRoutes = require('./routes/auth');
const serviceRoutes = require('./routes/service');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes); 

// Serve static files for login and registration
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
});
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'register.html')); 
});
app.get('/services', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'service_directory.html'));
});
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Start the server
app.listen(5000, () => {
    console.log('Server is running on port 5000!');
});
