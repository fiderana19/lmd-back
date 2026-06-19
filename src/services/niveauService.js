const { Niveau } = require("../models");

async function getAll() {
  return Niveau.findAll();
}

async function getById(id) {
  return Niveau.findByPk(id);
}

async function create(data) {
  const { id_niveau, titre_niveau, descri_niveau, domaine, mention, parcours } = data;
  return Niveau.create({ id_niveau, titre_niveau, descri_niveau, domaine, mention, parcours });
}

async function update(id, data) {
  const { titre_niveau, descri_niveau, domaine, mention, parcours } = data;
  return Niveau.update(
    { titre_niveau, descri_niveau, domaine, mention, parcours },
    { where: { id_niveau: id } },
  );
}

async function remove(id) {
  return Niveau.destroy({ where: { id_niveau: id } });
}

module.exports = { getAll, getById, create, update, remove };
