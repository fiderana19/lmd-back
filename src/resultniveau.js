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
router.post("/final/", (req, res) => {
    const obs = req.body.obs;

    const values = [
        req.body.id_annee,
        req.body.id_niveau,
    ]

    const SELECT_NOTE_QUERY = "SELECT etudiant.id_etudiant ,etudiant.matricule, etudiant.nom, etudiant.prenom, ue.id_ue, ec.nom_ec, ec.credit_ec, ec.poids_ec, note.valeur FROM note JOIN etudiant ON note.id_etudiant = etudiant.id_etudiant JOIN ec ON note.id_ec = ec.id_ec JOIN ue ON ec.id_ue = ue.id_ue WHERE note.id_annee = ? AND note.id_niveau = ?;";
    
    db.query(
        SELECT_NOTE_QUERY,
        values,
        (err, data) => {
            if(err) {
                console.log(err);
                return res.json(err);
            }
            const groupedNotes = groupByEtudiant(data);
            const exo = findResultAll(groupedNotes);
            const t = filterResult(exo);
            const vrai = filterFinalResult(t,obs);

            return res.json(vrai);
        }
    );
});


//Getting the etudiant mark data
router.post("/info", (req, res) => {
    const values = [
        req.body.id_annee,
        req.body.id_niveau,
    ]

    const SELECT_NOTE_QUERY = "SELECT DISTINCT niveau.domaine,niveau.mention,niveau.parcours,niveau.titre_niveau,niveau.descri_niveau,annee.id_annee FROM note JOIN niveau ON note.id_niveau = niveau.id_niveau JOIN annee ON note.id_annee = annee.id_annee AND note.id_annee = ? AND note.id_niveau = ?;";

    db.query(
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

function findResultAll(groupedNotes) {
    groupedNotes.map(el => {
     el.marks = groupByUE(el.marks)
     el.resultat = findResult(el.marks)
     el.final = findFinal(el.resultat)
    })
    return groupedNotes;
}

function groupByEtudiant(marks) {
    const gpEt = marks.reduce((acc , note) => {
      const found = acc.find(item => item.id_etudiant === note.id_etudiant);

      const newData = {
        id_ue: note.id_ue,
        nom_ec: note.nom_ec,
        valeur: note.valeur,
        poids_ec: note.poids_ec,
        credit_ec: note.credit_ec,
      }

      if(found) {
        found.marks.push(newData);
      } else {
        acc.push({
          id_etudiant: note.id_etudiant,
          matricule: note.matricule,
          nom: note.nom,
          prenom: note.prenom,
          marks: [newData],
        });
      }
      return acc;
    }, [])
    return gpEt;
}

 function filterResult(groupedNotes) {
    let res = [];

    for (let index = 0; index < groupedNotes.length; index++) {
        const id_etudiant = groupedNotes[index].id_etudiant;
        const matricule = groupedNotes[index].matricule;
        const nom = groupedNotes[index].nom;
        const prenom = groupedNotes[index].prenom;
        const final = groupedNotes[index].final;  
        
        res.push({ id_etudiant ,matricule, nom, prenom, final });
    }
    return res;
}


function filterFinalResult(groupedNotes, val) {
    let rt = [];

    for (let index = 0; index < groupedNotes.length; index++) {
        const id_etudiant = groupedNotes[index].id_etudiant;
        const matricule = groupedNotes[index].matricule;
        const nom = groupedNotes[index].nom;
        const prenom = groupedNotes[index].prenom;
        const final = groupedNotes[index].final; 
        
        if(final === val) {
            rt.push({ id_etudiant ,matricule, nom, prenom, final });
        }
    }
    return rt;
}

module.exports = router;