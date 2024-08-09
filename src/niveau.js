/*
--------------------
|   NIVEAU FILE    |
--------------------
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
//Getting all niveau
router.get('/' , (req , res) => {
    const SELECT_ALL = "SELECT * FROM niveau;";
    db.query(SELECT_ALL , (err , data) => {
        if(err) {
            console.log(err);
            return res.json(err);
        }
        return res.json(data);
    });
})
//Getting niveau by id
router.get('/get/:id' , (req , res) => {
    const id = req.params.id;
    const SELECT_BY_ID = "SELECT * FROM niveau WHERE id_niveau = ?;";
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
//Creating niveau
router.post("/create" , (req, res) => {
    const id_niveau = req.body.id_niveau;
    const titre_niveau = req.body.titre_niveau;
    const descri_niveau = req.body.descri_niveau;
    const domaine = req.body.domaine;
    const mention = req.body.mention;
    const parcours = req.body.parcours;

    db.query(
        "INSERT INTO niveau ( id_niveau , titre_niveau,  descri_niveau , domaine , mention , parcours ) VALUES (?,?,?,?,?,?)",
        [id_niveau , titre_niveau, descri_niveau , domaine , mention , parcours],
        (err , data) => {
            if(err) {
                console.log(err);
                return res.json(err);
            }
            return res.json(data);
        }
    );
})
//Editing niveau
router.patch("/edit/:id" , (req, res) => {
    const id = req.params.id;
    const UPDATE_niveau = "UPDATE niveau SET titre_niveau = ?, descri_niveau = ?, domaine = ? , mention = ? , parcours = ? where id_niveau = ?";
    const values = [
        req.body.titre_niveau,
        req.body.descri_niveau,
        req.body.domaine,
        req.body.mention,
        req.body.parcours,
    ]

    db.query(
        UPDATE_niveau,
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
//Deleting niveau
router.delete('/delete/:id' , (req , res) => {
    const id = req.params.id;
    const DELETE_niveau = "DELETE FROM niveau WHERE id_niveau = ?;";
    db.query(
        DELETE_niveau,
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