const { Etudiant } = require("../models");

async function getAll() {
  return Etudiant.findAll();
}

async function getById(id) {
  return Etudiant.findByPk(id);
}

async function create(data) {
  const { id_etudiant, matricule, nom, prenom, date_naiss, lieu_naiss } = data;
  return Etudiant.create({ id_etudiant, matricule, nom, prenom, date_naiss, lieu_naiss });
}

async function update(id, data) {
  const { matricule, nom, prenom, date_naiss, lieu_naiss } = data;
  return Etudiant.update(
    { matricule, nom, prenom, date_naiss, lieu_naiss },
    { where: { id_etudiant: id } },
  );
}

async function remove(id) {
  return Etudiant.destroy({ where: { id_etudiant: id } });
}

module.exports = { getAll, getById, create, update, remove };
