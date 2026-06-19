const { Ue } = require("../models");

async function getAll() {
  return Ue.findAll();
}

async function getById(id) {
  return Ue.findByPk(id);
}

async function create(id_ue, nom_ue, credit_ue) {
  return Ue.create({ id_ue, nom_ue, credit_ue });
}

async function update(id, nom_ue, credit_ue) {
  return Ue.update({ nom_ue, credit_ue }, { where: { id_ue: id } });
}

async function remove(id) {
  return Ue.destroy({ where: { id_ue: id } });
}

module.exports = { getAll, getById, create, update, remove };
