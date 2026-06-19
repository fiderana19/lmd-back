const db = require("../config/database");

async function getAll() {
  const query =
    "SELECT id_note,valeur,id_annee,matricule AS id_etudiant,titre_niveau AS id_niveau,nom_ec AS id_ec FROM note,etudiant,niveau,ec WHERE note.id_etudiant = etudiant.id_etudiant AND note.id_niveau = niveau.id_niveau AND note.id_ec = ec.id_ec";
  return db.query(query);
}

async function getById(id) {
  return db.query("SELECT * FROM note WHERE id_note = ?", [id]);
}

async function create(data) {
  const { valeur, id_etudiant, id_niveau, id_ec, id_annee } = data;
  return db.query(
    "INSERT INTO note(valeur, id_etudiant, id_niveau, id_ec, id_annee) VALUES (?, ?, ?, ?, ?)",
    [valeur, id_etudiant, id_niveau, id_ec, id_annee],
  );
}

async function update(id, valeur) {
  return db.query("UPDATE note SET valeur = ? WHERE id_note = ?", [valeur, id]);
}

async function remove(id) {
  return db.query("DELETE FROM note WHERE id_note = ?", [id]);
}

async function getByEtudiant(id_etudiant) {
  return db.query("SELECT * FROM note WHERE id_etudiant = ?", [id_etudiant]);
}

async function getByEtudiantAndNiveau(id_etudiant, id_niveau) {
  return db.query("SELECT * FROM note WHERE id_etudiant = ? AND id_niveau = ?", [id_etudiant, id_niveau]);
}

async function getByEtudiantAndYear(id_etudiant, annee) {
  return db.query("SELECT * FROM note WHERE id_etudiant = ? AND YEAR(date) = ?", [id_etudiant, annee]);
}

async function getByNiveauAndYear(id_ec, id_niveau, id_annee) {
  const query =
    "SELECT valeur,matricule FROM note,etudiant WHERE id_ec = ? AND id_niveau = ? AND id_annee = ? AND note.id_etudiant = etudiant.id_etudiant";
  return db.query(query, [id_ec, id_niveau, id_annee]);
}

module.exports = {
  getAll, getById, create, update, remove,
  getByEtudiant, getByEtudiantAndNiveau, getByEtudiantAndYear, getByNiveauAndYear,
};
