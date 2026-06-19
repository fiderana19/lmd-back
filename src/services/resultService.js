const db = require("../config/database");
const logger = require("../utils/logger");
const AppError = require("../utils/AppError");

function groupByUE(notes) {
  const groupes = notes.reduce((acc, note) => {
    const { id_ue, poids_ec, nom_ec, valeur, credit_ec } = note;
    const existing = acc.find((item) => item.id_ue === id_ue);

    if (existing) {
      existing.notes.push({ nom_ec, valeur });
      existing.moyenne = existing.moyenne + valeur * poids_ec;
      existing.credit_ue = existing.credit_ue + (valeur >= 5 ? credit_ec : 0);
    } else {
      acc.push({
        id_ue,
        moyenne: valeur * poids_ec,
        notes: [{ nom_ec, valeur }],
        credit_ue: valeur >= 5 ? credit_ec : 0,
      });
    }
    return acc;
  }, []);

  groupes.forEach((unit) => {
    if (unit.moyenne < 10 || unit.notes.some((note) => note.valeur < 5)) {
      unit.credit_ue = 0;
    }
  });
  return groupes;
}

function findResult(groupedNotes) {
  const moyDmoy =
    groupedNotes.reduce((acc, item) => acc + item.moyenne, 0) /
    groupedNotes.length;

  const sommeDcredit = groupedNotes.reduce(
    (acc, item) => acc + item.credit_ue,
    0,
  );

  return { moyenne_generale: moyDmoy, total_credits: sommeDcredit };
}

function findFinal(gr) {
  let final = "";
  if (gr.total_credits >= 60 && gr.moyenne_generale >= 10) {
    final = "ADMIS";
  }
  if (
    gr.total_credits >= 30 &&
    gr.total_credits < 60 &&
    gr.moyenne_generale >= 10
  ) {
    final = "AUTORISE A PASSE AU NIVEAU SUPERIEUR";
  }
  if (
    gr.total_credits >= 30 &&
    gr.moyenne_generale < 10 &&
    gr.moyenne_generale > 7
  ) {
    final = "AUTORISER A REDOUBLER";
  }
  if (gr.total_credits < 30 && gr.moyenne_generale < 7) {
    final = "EXCLUS";
  }
  if (gr.total_credits < 30 && gr.moyenne_generale > 7) {
    final = "AUTORISER A REDOUBLER";
  }
  return final;
}

function findResultAll(groupedNotes) {
  groupedNotes.map((el) => {
    el.marks = groupByUE(el.marks);
    el.resultat = findResult(el.marks);
    el.final = findFinal(el.resultat);
  });
  return groupedNotes;
}

function groupByEtudiant(marks) {
  const gpEt = marks.reduce((acc, note) => {
    const found = acc.find((item) => item.id_etudiant === note.id_etudiant);
    const newData = {
      id_ue: note.id_ue,
      nom_ec: note.nom_ec,
      valeur: note.valeur,
      poids_ec: note.poids_ec,
      credit_ec: note.credit_ec,
    };
    if (found) {
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
  }, []);
  return gpEt;
}

function filterResult(groupedNotes) {
  return groupedNotes.map(({ id_etudiant, matricule, nom, prenom, final }) => ({
    id_etudiant, matricule, nom, prenom, final,
  }));
}

function filterFinalResult(groupedNotes, val) {
  return groupedNotes
    .filter((item) => item.final === val)
    .map(({ id_etudiant, matricule, nom, prenom, final }) => ({
      id_etudiant, matricule, nom, prenom, final,
    }));
}

async function getUnity(id_etudiant, id_annee, id_niveau) {
  const query =
    "SELECT ue.id_ue, ec.nom_ec, ec.poids_ec, ec.credit_ec, note.valeur FROM note JOIN etudiant ON note.id_etudiant = etudiant.id_etudiant JOIN ec ON note.id_ec = ec.id_ec JOIN ue ON ec.id_ue = ue.id_ue WHERE note.id_etudiant = ? AND note.id_annee = ? AND note.id_niveau = ?;";
  const data = await db.query(query, [id_etudiant, id_annee, id_niveau]);
  return groupByUE(data);
}

async function getResult(id_etudiant, id_annee, id_niveau) {
  const query =
    "SELECT ue.id_ue, ec.nom_ec, ec.credit_ec, ec.poids_ec, note.valeur FROM note JOIN etudiant ON note.id_etudiant = etudiant.id_etudiant JOIN ec ON note.id_ec = ec.id_ec JOIN ue ON ec.id_ue = ue.id_ue WHERE note.id_etudiant = ? AND note.id_annee = ? AND note.id_niveau = ?;";
  const data = await db.query(query, [id_etudiant, id_annee, id_niveau]);
  return findResult(groupByUE(data));
}

async function getFinal(id_etudiant, id_annee, id_niveau) {
  const query =
    "SELECT ue.id_ue, ec.nom_ec, ec.credit_ec, ec.poids_ec, note.valeur FROM note JOIN etudiant ON note.id_etudiant = etudiant.id_etudiant JOIN ec ON note.id_ec = ec.id_ec JOIN ue ON ec.id_ue = ue.id_ue WHERE note.id_etudiant = ? AND note.id_annee = ? AND note.id_niveau = ?;";
  const data = await db.query(query, [id_etudiant, id_annee, id_niveau]);
  return findFinal(findResult(groupByUE(data)));
}

async function getEtudiantInfo(id_etudiant, id_annee, id_niveau) {
  const query =
    "SELECT DISTINCT niveau.domaine,niveau.mention,niveau.parcours,niveau.titre_niveau,niveau.descri_niveau,etudiant.matricule,etudiant.nom,etudiant.prenom,etudiant.date_naiss,etudiant.lieu_naiss,annee.id_annee FROM note JOIN etudiant ON note.id_etudiant = etudiant.id_etudiant JOIN niveau ON note.id_niveau = niveau.id_niveau JOIN annee ON note.id_annee = annee.id_annee WHERE note.id_etudiant = ? AND note.id_annee = ? AND note.id_niveau = ?;";
  return db.query(query, [id_etudiant, id_annee, id_niveau]);
}

async function getNiveauFinal(id_annee, id_niveau) {
  const query =
    "SELECT etudiant.id_etudiant ,etudiant.matricule, etudiant.nom, etudiant.prenom, ue.id_ue, ec.nom_ec, ec.credit_ec, ec.poids_ec, note.valeur FROM note JOIN etudiant ON note.id_etudiant = etudiant.id_etudiant JOIN ec ON note.id_ec = ec.id_ec JOIN ue ON ec.id_ue = ue.id_ue WHERE note.id_annee = ? AND note.id_niveau = ?;";
  const data = await db.query(query, [id_annee, id_niveau]);
  const groupedNotes = groupByEtudiant(data);
  const exo = findResultAll(groupedNotes);
  return filterResult(exo);
}

async function getNiveauInfo(id_annee, id_niveau) {
  const query =
    "SELECT DISTINCT niveau.domaine,niveau.mention,niveau.parcours,niveau.titre_niveau,niveau.descri_niveau,annee.id_annee FROM note JOIN niveau ON note.id_niveau = niveau.id_niveau JOIN annee ON note.id_annee = annee.id_annee AND note.id_annee = ? AND note.id_niveau = ?;";
  return db.query(query, [id_annee, id_niveau]);
}

module.exports = {
  groupByUE,
  findResult,
  findFinal,
  findResultAll,
  groupByEtudiant,
  filterResult,
  filterFinalResult,
  getUnity,
  getResult,
  getFinal,
  getEtudiantInfo,
  getNiveauFinal,
  getNiveauInfo,
};
