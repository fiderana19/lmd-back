const { Op, fn, col, where } = require("sequelize");
const { Note, Etudiant, Niveau, Ec } = require("../models");
const sequelize = require("../config/sequelize");

async function getAll() {
  return Note.findAll({
    include: [
      { model: Etudiant, attributes: [] },
      { model: Niveau, attributes: [] },
      { model: Ec, attributes: [] },
    ],
    attributes: [
      "id_note", "valeur", "id_annee", "id_etudiant", "id_niveau", "id_ec",
      [col("etudiant.matricule"), "matricule"],
      [col("etudiant.nom"), "etudiant_nom"],
      [col("niveau.titre_niveau"), "titre_niveau"],
      [col("ec.nom_ec"), "nom_ec"],
    ],
    raw: true,
  });
}

async function getById(id) {
  return Note.findByPk(id);
}

async function create(data) {
  const { valeur, id_etudiant, id_niveau, id_ec, id_annee } = data;
  return Note.create({ valeur, id_etudiant, id_niveau, id_ec, id_annee });
}

async function update(id, valeur) {
  return Note.update({ valeur }, { where: { id_note: id } });
}

async function remove(id) {
  return Note.destroy({ where: { id_note: id } });
}

async function getByEtudiant(id_etudiant) {
  return Note.findAll({ where: { id_etudiant } });
}

async function getByEtudiantAndNiveau(id_etudiant, id_niveau) {
  return Note.findAll({ where: { id_etudiant, id_niveau } });
}

async function getByEtudiantAndYear(id_etudiant, annee) {
  return Note.findAll({
    where: {
      id_etudiant,
      [Op.and]: where(fn("YEAR", col("date")), annee),
    },
  });
}

async function getByNiveauAndYear(id_ec, id_niveau, id_annee) {
  return Note.findAll({
    where: { id_ec, id_niveau, id_annee },
    include: [{ model: Etudiant, attributes: [] }],
    attributes: ["valeur", [col("etudiant.matricule"), "matricule"]],
    raw: true,
  });
}

module.exports = {
  getAll, getById, create, update, remove,
  getByEtudiant, getByEtudiantAndNiveau, getByEtudiantAndYear, getByNiveauAndYear,
};
