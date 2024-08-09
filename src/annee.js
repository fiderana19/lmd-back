/*
---------------------------------
|   ANNEE FILE    |
---------------------------------
*/ 
const express = require('express');
const router = express.Router();
const mysql = require('mysql');
//Database connection
const db = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "",
    database : "noteuniversitaire",
})

// Afficher tous les années
router.get("/", (req, res) => {
    const SELECT_ALL_EC_QUERY = "SELECT * FROM annee";
    
    db.query(
        SELECT_ALL_EC_QUERY,
        (err, data) => {
            if(err) {
                console.log(err);
                return res.json(err);
            }
            return res.json(data);
        }
    );
});

module.exports = router;