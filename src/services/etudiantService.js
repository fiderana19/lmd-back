const db = require("../config/database");

async function getAll() {
  return db.query("SELECT * FROM etudiant");
}

async function getById(id) {
  return db.query("SELECT * FROM etudiant WHERE id_etudiant = ?", [id]);
}

async function create(data) {
  const { id_etudiant, matricule, nom, prenom, date_naiss, lieu_naiss } = data;
  return db.query(
    "INSERT INTO etudiant (id_etudiant, matricule, nom, prenom, date_naiss, lieu_naiss) VALUES (?,?,?,?,?,?)",
    [id_etudiant, matricule, nom, prenom, date_naiss, lieu_naiss],
  );
}

async function update(id, data) {
  const { matricule, nom, prenom, date_naiss, lieu_naiss } = data;
  return db.query(
    "UPDATE etudiant SET matricule = ?, nom = ?, prenom = ?, date_naiss = ?, lieu_naiss = ? WHERE id_etudiant = ?",
    [matricule, nom, prenom, date_naiss, lieu_naiss, id],
  );
}

async function remove(id) {
  return db.query("DELETE FROM etudiant WHERE id_etudiant = ?", [id]);
}

module.exports = { getAll, getById, create, update, remove };
