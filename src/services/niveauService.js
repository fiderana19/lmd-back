const db = require("../config/database");

async function getAll() {
  return db.query("SELECT * FROM niveau");
}

async function getById(id) {
  return db.query("SELECT * FROM niveau WHERE id_niveau = ?", [id]);
}

async function create(data) {
  const { id_niveau, titre_niveau, descri_niveau, domaine, mention, parcours } = data;
  return db.query(
    "INSERT INTO niveau (id_niveau, titre_niveau, descri_niveau, domaine, mention, parcours) VALUES (?,?,?,?,?,?)",
    [id_niveau, titre_niveau, descri_niveau, domaine, mention, parcours],
  );
}

async function update(id, data) {
  const { titre_niveau, descri_niveau, domaine, mention, parcours } = data;
  return db.query(
    "UPDATE niveau SET titre_niveau = ?, descri_niveau = ?, domaine = ?, mention = ?, parcours = ? WHERE id_niveau = ?",
    [titre_niveau, descri_niveau, domaine, mention, parcours, id],
  );
}

async function remove(id) {
  return db.query("DELETE FROM niveau WHERE id_niveau = ?", [id]);
}

module.exports = { getAll, getById, create, update, remove };
