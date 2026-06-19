const { Annee } = require("../models");

async function getAll() {
  return Annee.findAll();
}

module.exports = { getAll };
