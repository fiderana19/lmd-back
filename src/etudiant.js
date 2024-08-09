/*
----------------------
|   ETUDIANT FILE    |
----------------------
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
//Getting all 
router.get('/' , (req , res) => {
    const SELECT_ALL = "SELECT * FROM etudiant;";
    db.query(SELECT_ALL , (err , data) => {
        if(err) {
            console.log(err);
            return res.json(err);
        }
        return res.json(data);
    });
})
//Creating a new etudiant
router.post("/create" , (req, res) => {
    const id_etudiant = req.body.id_etudiant;
    const matricule = req.body.matricule;
    const nom = req.body.nom;
    const prenom = req.body.prenom;
    const date_naiss = req.body.date_naiss;
    const lieu_naiss = req.body.lieu_naiss;

    db.query(
        "INSERT INTO etudiant ( id_etudiant , matricule , nom , prenom , date_naiss , lieu_naiss ) VALUES (?,?,?,?,?,?)",
        [id_etudiant , matricule , nom , prenom , date_naiss , lieu_naiss],
        (err , data) => {
            if(err) {
                console.log(err);
                return res.json(err);
            }
            return res.json(data);
        }
    );
})

//Editing an etudiant
router.patch("/edit/:id" , (req, res) => {
    const id = req.params.id;
    const UPDATE_etudiant = "UPDATE etudiant SET matricule= ?, nom = ?, prenom = ? , date_naiss = ? , lieu_naiss = ? where id_etudiant = ?";
    const values = [
        req.body.matricule,
        req.body.nom,
        req.body.prenom,
        req.body.date_naiss,
        req.body.lieu_naiss,
    ]

    db.query(
        UPDATE_etudiant,
        [...values,id],
        (err , data) => {
            if(err) {
                console.log(err);
                return res.json(err);
            }
            return res.json(data);
        }
    );
})

//Deleting an etudiant
router.delete('/delete/:id' , (req , res) => {
    const id = req.params.id;
    const DELETE_etudiant = "DELETE FROM etudiant WHERE id_etudiant = ?;";
    db.query(
        DELETE_etudiant,
        id, 
        (err , data) => {
        if(err) {
            console.log(err);
            return res.json(err);
        }
        return res.json(data);
    });
})

//Getting etudiant by id
router.get('/get/:id' , (req , res) => {
    const id = req.params.id;
    const SELECT_BY_ID = "SELECT * FROM etudiant WHERE id_etudiant = ?;";
    db.query(
        SELECT_BY_ID,
        id, 
        (err , data) => {
        if(err) {
            console.log(err);
            return res.json(err);
        }
        return res.json(data);
    });
})

module.exports = router;