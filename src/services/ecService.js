const db = require("../config/database");

async function getAll() {
  const query =
    "SELECT id_ec,nom_ec,semestre,et,ed,ep,credit_ec,poids_ec,nom_ue AS id_ue FROM ec,ue WHERE ec.id_ue = ue.id_ue";
  return db.query(query);
}

async function getById(id) {
  const query =
    "SELECT id_ec,nom_ec,semestre,et,ed,ep,credit_ec,poids_ec,nom_ue AS id_ue FROM ec,ue WHERE ec.id_ue = ue.id_ue AND id_ec = ?";
  return db.query(query, [id]);
}

async function create(data) {
  const { nom_ec, semestre, et, ed, ep, credit_ec, poids_ec, id_ue } = data;
  const query =
    "INSERT INTO ec (nom_ec, semestre, et, ed, ep, credit_ec, poids_ec, id_ue) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  return db.query(query, [nom_ec, semestre, et, ed, ep, credit_ec, poids_ec, id_ue]);
}

async function update(id, data) {
  const { nom_ec, semestre, et, ed, ep, credit_ec, poids_ec } = data;
  const query =
    "UPDATE ec SET nom_ec = ?, semestre = ?, et = ?, ed = ?, ep = ?, credit_ec = ?, poids_ec = ? WHERE id_ec = ?";
  return db.query(query, [nom_ec, semestre, et, ed, ep, credit_ec, poids_ec, id]);
}

async function remove(id) {
  return db.query("DELETE FROM ec WHERE id_ec = ?", [id]);
}

module.exports = { getAll, getById, create, update, remove };
