/*
---------------------------------
|   ELEMENT CONSTITUTIF FILE    |
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


// Afficher tous les ec
router.get("/", (req, res) => {
    const SELECT_ALL_EC_QUERY = "SELECT id_ec,nom_ec,semestre,et,ed,ep,credit_ec,poids_ec,nom_ue AS id_ue FROM ec,ue WHERE ec.id_ue = ue.id_ue";
    
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

// Ajout ec
router.post("/create", (req, res) => {
    const { nom_ec, semestre, et, ed, ep, credit_ec, poids_ec, id_ue } = req.body;

    const INSERT_EC_QUERY = "INSERT INTO ec (nom_ec, semestre, et, ed, ep, credit_ec, poids_ec, id_ue) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    
    db.query(
        INSERT_EC_QUERY,
        [nom_ec, semestre, et, ed, ep, credit_ec, poids_ec, id_ue],
        (err, data) => {
            if(err) {
                console.log(err);
                return res.json(err);
            }
            return res.json(data);
        }
    );
});

// Delete ec
router.delete("/delete/:id", (req, res) => {
    const id = req.params.id;

    const DELETE_EC_QUERY = "DELETE FROM ec WHERE id_ec = ?";
    
    db.query(
        DELETE_EC_QUERY,
        [id],
        (err, data) => {
            if(err) {
                console.log(err);
                return res.json(err);
            }
            return res.json(data);
        }
    );
});

// get ec by id
router.get("/get/:id", (req, res) => {
    const id = req.params.id;

    const GET_EC_QUERY = "SELECT * FROM ec WHERE id_ec = ?";
    
    db.query(
        GET_EC_QUERY,
        [id],
        (err, data) => {
            if(err) {
                console.log(err);
                return res.json(err);
            }
            return res.json(data);
        }
    );
});

// update ec
router.patch("/edit/:id", (req, res) => {
    const id = req.params.id;
    const { nom_ec, semestre, et, ed, ep, credit_ec, poids_ec } = req.body;

    const UPDATE_EC_QUERY = "UPDATE ec SET nom_ec = ?, semestre = ?, et = ?, ed = ?, ep = ?, credit_ec = ?, poids_ec = ? WHERE id_ec = ?";
    
    db.query(
        UPDATE_EC_QUERY,
        [nom_ec, semestre, et, ed, ep, credit_ec, poids_ec, id],
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