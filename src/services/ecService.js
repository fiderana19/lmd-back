const { Ec, Ue } = require("../models");
const sequelize = require("../config/sequelize");

async function getAll() {
  return Ec.findAll({
    include: [{ model: Ue, attributes: [] }],
    attributes: [
      "id_ec", "nom_ec", "semestre", "et", "ed", "ep", "credit_ec", "poids_ec",
      [sequelize.col("ue.id_ue"), "id_ue"],
      [sequelize.col("ue.nom_ue"), "nom_ue"],
    ],
    raw: true,
  });
}

async function getById(id) {
  const result = await Ec.findAll({
    where: { id_ec: id },
    include: [{ model: Ue, attributes: [] }],
    attributes: [
      "id_ec", "nom_ec", "semestre", "et", "ed", "ep", "credit_ec", "poids_ec",
      [sequelize.col("ue.id_ue"), "id_ue"],
      [sequelize.col("ue.nom_ue"), "nom_ue"],
    ],
    raw: true,
  });
  return result;
}

async function create(data) {
  const { id_ec, nom_ec, semestre, et, ed, ep, credit_ec, poids_ec, id_ue } = data;
  return Ec.create({ id_ec, nom_ec, semestre, et, ed, ep, credit_ec, poids_ec, id_ue });
}

async function update(id, data) {
  const { nom_ec, semestre, et, ed, ep, credit_ec, poids_ec, id_ue } = data;
  return Ec.update(
    { nom_ec, semestre, et, ed, ep, credit_ec, poids_ec, id_ue },
    { where: { id_ec: id } },
  );
}

async function remove(id) {
  return Ec.destroy({ where: { id_ec: id } });
}

module.exports = { getAll, getById, create, update, remove };
