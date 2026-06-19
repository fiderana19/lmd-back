const db = require("../config/database");

async function getAll() {
  return db.query("SELECT * FROM ue");
}

async function getById(id) {
  return db.query("SELECT * FROM ue WHERE id_ue = ?", [id]);
}

async function create(nom_ue, credit_ue) {
  return db.query("INSERT INTO ue (nom_ue, credit_ue) VALUES (?, ?)", [nom_ue, credit_ue]);
}

async function update(id, nom_ue, credit_ue) {
  return db.query("UPDATE ue SET nom_ue = ?, credit_ue = ? WHERE id_ue = ?", [nom_ue, credit_ue, id]);
}

async function remove(id) {
  return db.query("DELETE FROM ue WHERE id_ue = ?", [id]);
}

module.exports = { getAll, getById, create, update, remove };
