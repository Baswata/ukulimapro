const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');

const app = express();

app.use(express.json());
app.use(express.urlencoded ({extended:true}));
app.use(express.static('public'));
app.use(cors());

app.use(express.static(path.join(__dirname,'public')));

const authRoutes = require('./routes/auth');
const serviceRoutes = require('./routes/service');

app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'public','html','login.html'));
});
app.get('/register', (req,res) => {
    res.sendFile(path.join(__dirname,'public','html','register.html'));
});

app.listen(5000,() => {
    console.log('Server is okay and running!')
})