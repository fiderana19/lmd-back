/*
------------------
|   NOTE FILE    |
------------------
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

//Afficher tous les notes 
router.get("/", (req, res) => {
    const SELECT_NOTE_QUERY = "SELECT id_note,valeur,id_annee,matricule AS id_etudiant,titre_niveau AS id_niveau,nom_ec AS id_ec FROM note,etudiant,niveau,ec WHERE note.id_etudiant = etudiant.id_etudiant AND note.id_niveau = niveau.id_niveau AND note.id_ec = ec.id_ec";
    
    db.query(
        SELECT_NOTE_QUERY,
        (err, data) => {
            if(err) {
                console.log(err);
                return res.json(err);
            }
            return res.json(data);
        }
    );
});

//Afficher tous les notes 
router.get("/note/:id", (req, res) => {
    const id = req.params.id;

    const SELECT_NOTE_QUERY = "SELECT * FROM note WHERE id_note = ?";
    
    db.query(
        SELECT_NOTE_QUERY,
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
// creer note
router.post("/create", (req, res) => {
    const valeur = req.body.valeur;
    const id_etudiant = req.body.id_etudiant;
    const id_niveau = req.body.id_niveau;
    const id_ec = req.body.id_ec;
    const id_annee = req.body.id_annee;
    
    const INSERT_NOTE_QUERY = "INSERT INTO note(valeur, id_etudiant, id_niveau, id_ec, id_annee) VALUES (?, ?, ?, ?, ?)";
    
    db.query(
        INSERT_NOTE_QUERY,
        [valeur, id_etudiant, id_niveau, id_ec, id_annee],
        (err, data) => {
            if(err) {
                console.log(err);
                return res.json(err);
            }
            return res.json(data);
        }
    );
});

//Modifier note
router.patch("/edit/:id", (req, res) => {
    const id = req.params.id;
    const { valeur } = req.body;

    const UPDATE_NOTE_QUERY = "UPDATE note SET valeur = ? WHERE id_note = ?";
    
    db.query(
        UPDATE_NOTE_QUERY,
        [valeur, id],
        (err, data) => {
            if(err) {
                console.log(err);
                return res.json(err);
            }
            return res.json(data);
        }
    );
});
//Supprimer note
router.delete("/delete/:id", (req, res) => {
    const id = req.params.id;

    const DELETE_NOTE_QUERY = "DELETE FROM note WHERE id_note = ?";
    
    db.query(
        DELETE_NOTE_QUERY,
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

// afficher les notes par etudiants
router.get("/notes/etudiant/:id_etudiant", (req, res) => {
    const id_etudiant = req.params.id_etudiant;

    const SELECT_NOTES_BY_STUDENT_QUERY = "SELECT * FROM note WHERE id_etudiant = ?";
    
    db.query(
        SELECT_NOTES_BY_STUDENT_QUERY,
        [id_etudiant],
        (err, data) => {
            if(err) {
                console.log(err);
                return res.json(err);
            }
            return res.json(data);
        }
    );
});
// afficher les notes d'un etudiant au cours d'un niveau
router.get("/notes/etudiant/:id_etudiant/niveau/:id_niveau", (req, res) => {
    const id_etudiant = req.params.id_etudiant;
    const id_niveau = req.params.id_niveau;

    const SELECT_NOTES_BY_STUDENT_AND_LEVEL_QUERY = "SELECT * FROM note WHERE id_etudiant = ? AND id_niveau = ?";
    
    db.query(
        SELECT_NOTES_BY_STUDENT_AND_LEVEL_QUERY,
        [id_etudiant, id_niveau],
        (err, data) => {
            if(err) {
                console.log(err);
                return res.json(err);
            }
            return res.json(data);
        }
    );
});
// afficher les notes d'un etudiant pendant une année spécifique
router.get("/etudiant/:id_etudiant/annee/:annee", (req, res) => {
    const id_etudiant = req.params.id_etudiant;
    const annee = req.params.annee;

    const SELECT_NOTES_BY_STUDENT_AND_YEAR_QUERY = "SELECT * FROM note WHERE id_etudiant = ? AND YEAR(date) = ?";
    
    db.query(
        SELECT_NOTES_BY_STUDENT_AND_YEAR_QUERY,
        [id_etudiant, annee],
        (err, data) => {
            if(err) {
                console.log(err);
                return res.json(err);
            }
            return res.json(data);
        }
    );
});

//Reuperer les notes d'un niveau pendant une annee
router.post("/niveau/", (req, res) => {
    const id_ec = req.body.id_ec;
    const id_niveau = req.body.id_niveau;
    const id_annee = req.body.id_annee;

    const SELECT_NOTE_NIVEAU = "SELECT valeur,matricule FROM note,etudiant WHERE id_ec = ? AND id_niveau = ? AND id_annee = ? AND note.id_etudiant = etudiant.id_etudiant";
    db.query(
        SELECT_NOTE_NIVEAU,
        [id_ec, id_niveau, id_annee],
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