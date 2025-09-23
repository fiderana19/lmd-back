const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Connect = require('../db/connection');
const db = Connect();

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const LOGIN_QUERY = "SELECT * from user WHERE username = ?"

    db.query(LOGIN_QUERY, username, async (err, data) => {
        if (err) {
            console.log(err);
            return res.json(err);
        }

        const user = await data[0]; 
        const pwd = await data[0].password;
        const isMatched = await bcrypt.compare(password , pwd);
        
        if(isMatched === true) {
            const payload = { id: user.user_id, username: user.username };

            const token = await jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET)
            return res.status(200).send({ token: token});           
        } else {
            return res.status(401).send({ message: "Mot de passe incorrect !"});
        }    
    });
})

router.post("/signup", async (req, res) => {
    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const SIGNUP_QUERY  = "INSERT INTO user (username, password) VALUES (?, ?)";

    db.query(SIGNUP_QUERY, [username, hashedPassword], (err, data) => {
        if (err) {
            console.log(err);
            return res.json(err);
        }
        return res.status(201).send({ message: "Inscription réussie" });
    });
})

module.exports = router;