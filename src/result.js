/*
--------------------
|   RESULT FILE    |
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

//Getting the etudiant unity
router.post("/unity", (req, res) => {
    const SELECT_NOTE_QUERY = "SELECT ue.id_ue, ec.nom_ec, ec.poids_ec, ec.credit_ec, note.valeur FROM note JOIN etudiant ON note.id_etudiant = etudiant.id_etudiant JOIN ec ON note.id_ec = ec.id_ec JOIN ue ON ec.id_ue = ue.id_ue WHERE note.id_etudiant = ? AND note.id_annee = ? AND note.id_niveau = ?;";
    const values = [
        req.body.id_etudiant,
        req.body.id_annee,
        req.body.id_niveau,
    ]
    db.query(
        SELECT_NOTE_QUERY,
        values,
        (err, data) => {
            if(err) {
                console.log(err);
                return res.json(err);
            }
            const groupedNotes = groupByUE(data);

            return res.json(groupedNotes);
        }
    );
});


//Getting the etudiant mark data
router.post("/result", (req, res) => {
    const SELECT_NOTE_QUERY = "SELECT ue.id_ue, ec.nom_ec, ec.credit_ec, ec.poids_ec, note.valeur FROM note JOIN etudiant ON note.id_etudiant = etudiant.id_etudiant JOIN ec ON note.id_ec = ec.id_ec JOIN ue ON ec.id_ue = ue.id_ue WHERE note.id_etudiant = ? AND note.id_annee = ? AND note.id_niveau = ?;";
    const values = [
        req.body.id_etudiant,
        req.body.id_annee,
        req.body.id_niveau,
    ]

    db.query(
        SELECT_NOTE_QUERY,
        values,
        (err, data) => {
            if(err) {
                console.log(err);
                return res.json(err);
            }
            const groupedNotes = groupByUE(data);
            const gr = findResult(groupedNotes);

            return res.json(gr);
        }
    );
});

//Getting the etudiant final result
router.post("/final", (req, res) => {
    const SELECT_NOTE_QUERY = "SELECT ue.id_ue, ec.nom_ec, ec.credit_ec, ec.poids_ec, note.valeur FROM note JOIN etudiant ON note.id_etudiant = etudiant.id_etudiant JOIN ec ON note.id_ec = ec.id_ec JOIN ue ON ec.id_ue = ue.id_ue WHERE note.id_etudiant = ? AND note.id_annee = ? AND note.id_niveau = ?;";
    const values = [
        req.body.id_etudiant,
        req.body.id_annee,
        req.body.id_niveau,
    ]

    db.query(
        SELECT_NOTE_QUERY,
        values,
        (err, data) => {
            if(err) {
                console.log(err);
                return res.json(err);
            }
            const groupedNotes = groupByUE(data);
            const gr = findResult(groupedNotes);
            const rr = findFinal(gr)

            return res.json(rr);
        }
    );
});

//Getting the etudiant data 
router.post("/", (req, res) => {
    const SELECT_NOTE_QUERY = "SELECT DISTINCT niveau.domaine,niveau.mention,niveau.parcours,niveau.titre_niveau,niveau.descri_niveau,etudiant.matricule,etudiant.nom,etudiant.prenom,etudiant.date_naiss,etudiant.lieu_naiss,annee.id_annee FROM note JOIN etudiant ON note.id_etudiant = etudiant.id_etudiant JOIN niveau ON note.id_niveau = niveau.id_niveau JOIN annee ON note.id_annee = annee.id_annee WHERE note.id_etudiant = ? AND note.id_annee = ? AND note.id_niveau = ?;";
    const values = [
        req.body.id_etudiant,
        req.body.id_annee,
        req.body.id_niveau,
    ]

    const notes = db.query(
        SELECT_NOTE_QUERY,
        values,
        (err, data) => {
            if(err) {
                console.log(err);
                return res.json(err);
            }
            return res.json(data);
        }
    );
});

/* FUNCTION  */

//Grouping the notes by Unity
function groupByUE(notes) {
    const groupes = notes.reduce((acc,note) => {
    //Initializing variables
    const {id_ue , poids_ec, nom_ec , valeur , credit_ec} = note;

    //Verifying if the unity already exist
    const existing = acc.find(item => item.id_ue === id_ue) ;

    if(existing) {
        existing.notes.push({nom_ec, valeur});
        //Calculate the average
        existing.moyenne = ((existing.moyenne) + (valeur*poids_ec));

        //Calculate the poids
        existing.credit_ue = existing.credit_ue + ((valeur >= 5) ? credit_ec : 0);
    } else {
        //If the unity didn't exist
        acc.push({id_ue ,  moyenne: valeur*poids_ec, notes : [{nom_ec, valeur}] , credit_ue: ((valeur >= 5) ? credit_ec : 0) });
    }
    return acc;
    },[])

    //Elimination condition
    groupes.forEach(unit => {
      //If moyenne not completed and there is a note less 5
      if(unit.moyenne < 10 || unit.notes.some(note => note.valeur < 5 )) {
        unit.credit_ue = 0;
      }     
    });
    return groupes;
}

//Returning the etudiant moyenne_generale and total_credits
function findResult(groupedNotes) {
    const moyDmoy = groupedNotes.reduce((acc, item) => acc+ item.moyenne,0) / groupedNotes.length;

    const sommeDcredit = groupedNotes.reduce((acc, item) => acc+ item.credit_ue,0)

    return { moyenne_generale: moyDmoy, total_credits: sommeDcredit }
}

//The final result function
function findFinal(gr) {
    let final = "";
    if(gr.total_credits >= 60 && gr.moyenne_generale >= 10) {
        final = 'ADMIS';
    }
    if(gr.total_credits >= 30 && gr.total_credits < 60 && gr.moyenne_generale >= 10) {
        final = 'AUTORISE A PASSE AU NIVEAU SUPERIEUR';
    }
    if(gr.total_credits >= 30 && gr.moyenne_generale < 10 && gr.moyenne_generale > 7) {
        final = 'AUTORISER A REDOUBLER';
    }
    if(gr.total_credits < 30 && gr.moyenne_generale < 7) {
        final = 'EXCLUS';
    }
    if(gr.total_credits < 30 && gr.moyenne_generale > 7) {
        final = 'AUTORISER A REDOUBLER';
    }
    return  final ;
}

module.exports = router;