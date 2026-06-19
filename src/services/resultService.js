const { Note, Ec, Ue, Etudiant, Niveau, Annee } = require("../models");

function getMention(moyenne) {
  if (moyenne >= 16) return "Très Bien";
  if (moyenne >= 14) return "Bien";
  if (moyenne >= 12) return "Assez Bien";
  if (moyenne >= 10) return "Passable";
  return "";
}

function groupByUE(notes) {
  const creditMap = {};
  const nomMap = {};

  const groupes = notes.reduce((acc, note) => {
    const { id_ue, nom_ue, credit_ue_total, poids_ec, nom_ec, valeur } = note;
    creditMap[id_ue] = credit_ue_total;
    nomMap[id_ue] = nom_ue;

    const existing = acc.find((item) => item.id_ue === id_ue);

    if (existing) {
      existing.notes.push({ nom_ec, valeur });
      existing.moyenne = existing.moyenne + valeur * poids_ec;
    } else {
      acc.push({
        id_ue,
        nom_ue,
        moyenne: valeur * poids_ec,
        notes: [{ nom_ec, valeur }],
      });
    }
    return acc;
  }, []);

  groupes.forEach((unit) => {
    const totalCredits = creditMap[unit.id_ue];
    const hasEliminatory = unit.notes.some((note) => note.valeur < 5);
    unit.credit_ue = unit.moyenne >= 10 && !hasEliminatory ? totalCredits : 0;
    unit.credit_ue_total = totalCredits;
  });

  return groupes;
}

function findResult(groupedNotes) {
  const totalWeighted = groupedNotes.reduce(
    (acc, item) => acc + item.moyenne * item.credit_ue_total, 0,
  );
  const totalCreditsPossible = groupedNotes.reduce(
    (acc, item) => acc + item.credit_ue_total, 0,
  );
  const sommeDcredit = groupedNotes.reduce(
    (acc, item) => acc + item.credit_ue, 0,
  );

  const moyenneGenerale = totalCreditsPossible > 0
    ? totalWeighted / totalCreditsPossible
    : 0;

  return {
    moyenne_generale: Math.round(moyenneGenerale * 100) / 100,
    total_credits: sommeDcredit,
    total_credits_possible: totalCreditsPossible,
    mention: getMention(moyenneGenerale),
  };
}

function findFinal(gr) {
  if (gr.moyenne_generale >= 10) {
    if (gr.total_credits >= gr.total_credits_possible) return "ADMIS";
    return "AUTORISE A PASSE AU NIVEAU SUPERIEUR";
  }
  if (gr.moyenne_generale > 7) return "AUTORISER A REDOUBLER";
  return "EXCLUS";
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
      nom_ue: note.nom_ue,
      credit_ue_total: note.credit_ue_total,
      nom_ec: note.nom_ec,
      valeur: note.valeur,
      poids_ec: note.poids_ec,
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
  const rows = await Note.findAll({
    where: { id_etudiant, id_annee, id_niveau },
    include: [{
      model: Ec,
      attributes: ["nom_ec", "poids_ec", "credit_ec"],
      include: [{
        model: Ue,
        attributes: ["id_ue", "nom_ue", "credit_ue"],
      }],
    }],
    attributes: ["valeur"],
  });
  const data = rows.map((r) => ({
    id_ue: r.ec.ue.id_ue,
    nom_ue: r.ec.ue.nom_ue,
    credit_ue_total: r.ec.ue.credit_ue,
    nom_ec: r.ec.nom_ec,
    poids_ec: r.ec.poids_ec,
    valeur: r.valeur,
  }));
  return groupByUE(data);
}

async function getResult(id_etudiant, id_annee, id_niveau) {
  const rows = await Note.findAll({
    where: { id_etudiant, id_annee, id_niveau },
    include: [{
      model: Ec,
      attributes: ["nom_ec", "credit_ec", "poids_ec"],
      include: [{
        model: Ue,
        attributes: ["id_ue", "nom_ue", "credit_ue"],
      }],
    }],
    attributes: ["valeur"],
  });
  const data = rows.map((r) => ({
    id_ue: r.ec.ue.id_ue,
    nom_ue: r.ec.ue.nom_ue,
    credit_ue_total: r.ec.ue.credit_ue,
    nom_ec: r.ec.nom_ec,
    poids_ec: r.ec.poids_ec,
    valeur: r.valeur,
  }));
  return findResult(groupByUE(data));
}

async function getFinal(id_etudiant, id_annee, id_niveau) {
  const rows = await Note.findAll({
    where: { id_etudiant, id_annee, id_niveau },
    include: [{
      model: Ec,
      attributes: ["nom_ec", "credit_ec", "poids_ec"],
      include: [{
        model: Ue,
        attributes: ["id_ue", "nom_ue", "credit_ue"],
      }],
    }],
    attributes: ["valeur"],
  });
  const data = rows.map((r) => ({
    id_ue: r.ec.ue.id_ue,
    nom_ue: r.ec.ue.nom_ue,
    credit_ue_total: r.ec.ue.credit_ue,
    nom_ec: r.ec.nom_ec,
    poids_ec: r.ec.poids_ec,
    valeur: r.valeur,
  }));
  return findFinal(findResult(groupByUE(data)));
}

async function getEtudiantInfo(id_etudiant, id_annee, id_niveau) {
  const rows = await Note.findAll({
    where: { id_etudiant, id_annee, id_niveau },
    include: [
      { model: Etudiant, attributes: ["matricule", "nom", "prenom", "date_naiss", "lieu_naiss"] },
      { model: Niveau, attributes: ["domaine", "mention", "parcours", "titre_niveau", "descri_niveau"] },
      { model: Annee, attributes: ["id_annee", "libelle"] },
    ],
    attributes: [],
  });
  if (rows.length === 0) return [];
  const r = rows[0];
  return [{
    domaine: r.niveau.domaine,
    mention: r.niveau.mention,
    parcours: r.niveau.parcours,
    titre_niveau: r.niveau.titre_niveau,
    descri_niveau: r.niveau.descri_niveau,
    matricule: r.etudiant.matricule,
    nom: r.etudiant.nom,
    prenom: r.etudiant.prenom,
    date_naiss: r.etudiant.date_naiss,
    lieu_naiss: r.etudiant.lieu_naiss,
    id_annee: r.annee.id_annee,
    libelle: r.annee.libelle,
  }];
}

async function getNiveauFinal(id_annee, id_niveau) {
  const rows = await Note.findAll({
    where: { id_annee, id_niveau },
    include: [
      { model: Etudiant, attributes: ["id_etudiant", "matricule", "nom", "prenom"] },
      {
        model: Ec,
        attributes: ["nom_ec", "credit_ec", "poids_ec"],
        include: [{
          model: Ue,
          attributes: ["id_ue", "nom_ue", "credit_ue"],
        }],
      },
    ],
    attributes: ["valeur"],
  });
  const data = rows.map((r) => ({
    id_etudiant: r.etudiant.id_etudiant,
    matricule: r.etudiant.matricule,
    nom: r.etudiant.nom,
    prenom: r.etudiant.prenom,
    id_ue: r.ec.ue.id_ue,
    nom_ue: r.ec.ue.nom_ue,
    credit_ue_total: r.ec.ue.credit_ue,
    nom_ec: r.ec.nom_ec,
    poids_ec: r.ec.poids_ec,
    valeur: r.valeur,
  }));
  const groupedNotes = groupByEtudiant(data);
  const exo = findResultAll(groupedNotes);
  return filterResult(exo);
}

async function getNiveauInfo(id_annee, id_niveau) {
  const rows = await Note.findAll({
    where: { id_annee, id_niveau },
    include: [
      { model: Niveau, attributes: ["domaine", "mention", "parcours", "titre_niveau", "descri_niveau"] },
      { model: Annee, attributes: ["id_annee", "libelle"] },
    ],
    attributes: [],
  });
  if (rows.length === 0) return [];
  const r = rows[0];
  return [{
    domaine: r.niveau.domaine,
    mention: r.niveau.mention,
    parcours: r.niveau.parcours,
    titre_niveau: r.niveau.titre_niveau,
    descri_niveau: r.niveau.descri_niveau,
    id_annee: r.annee.id_annee,
    libelle: r.annee.libelle,
  }];
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
