const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const jwt = require('jsonwebtoken');

const app = express();
const JWT_SECRET = process.env.JWT_SECRET;

app.use(express.json());
app.use(express.urlencoded ({extended:true}));
app.use(cors());
app.use(express.static(path.join(__dirname, '..', 'public')));

const authRoutes = require('./routes/auth');
const serviceRoutes = require('./routes/service');

app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
});
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'register.html')); // Updated path
});
app.get('/services', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'service_directory.html'));
});

app.listen(5000,() => {
    console.log('Server is okay and running!')
})