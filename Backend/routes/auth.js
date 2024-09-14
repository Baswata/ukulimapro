const express = require('express');
const bcrypt = require ('bcryptjs');
const db = require ('../db');
const router = express.Router();

router.post('/register', async (req,res) => {
    const {fullname, email, username, password} = req.body;
    const hashedPassword = await bcrypt.hash (req.body.password,(10));
    const query = 'INSERT INTO  users (fullname, email, username, password) VALUES(?,?,?,?)';

    db.query(query,[fullname,email,username,hashedPassword], (err) => {
        if(err) {
            console.error('Error registering user:', err);
            return res.status(500).json ({message:'Database error'});

        }
        res.direct('login.html');
    });
});

router.post('/login', (req, res) => {
    const{username,password} = req.body;
    const query = `SELECT * FROM users WHERE username =?`;
    db.query(query, [username], async (err,results) => {
        if (err) {
            console.error('Error logging in:', err);
            return res.status(500).json({message:'Database Error'});
        }
        res.redirect('/index.html');
    });
});

module.exports= router;