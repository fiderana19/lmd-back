const noteService = require("../services/noteService");
const logger = require("../utils/logger");

async function getAll(req, res, next) {
  try {
    const data = await noteService.getAll();
    res.json(data);
  } catch (err) {
    logger.error("note getAll error:", err);
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const data = await noteService.getById(req.params.id);
    res.json(data);
  } catch (err) {
    logger.error("note getById error:", err);
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const data = await noteService.create(req.body);
    res.json(data);
  } catch (err) {
    logger.error("note create error:", err);
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const { valeur } = req.body;
    const data = await noteService.update(req.params.id, valeur);
    res.json(data);
  } catch (err) {
    logger.error("note update error:", err);
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const data = await noteService.remove(req.params.id);
    res.json(data);
  } catch (err) {
    logger.error("note remove error:", err);
    next(err);
  }
}

async function getByEtudiant(req, res, next) {
  try {
    const data = await noteService.getByEtudiant(req.params.id_etudiant);
    res.json(data);
  } catch (err) {
    logger.error("note getByEtudiant error:", err);
    next(err);
  }
}

async function getByEtudiantAndNiveau(req, res, next) {
  try {
    const data = await noteService.getByEtudiantAndNiveau(req.params.id_etudiant, req.params.id_niveau);
    res.json(data);
  } catch (err) {
    logger.error("note getByEtudiantAndNiveau error:", err);
    next(err);
  }
}

async function getByEtudiantAndYear(req, res, next) {
  try {
    const data = await noteService.getByEtudiantAndYear(req.params.id_etudiant, req.params.annee);
    res.json(data);
  } catch (err) {
    logger.error("note getByEtudiantAndYear error:", err);
    next(err);
  }
}

async function getByNiveauAndYear(req, res, next) {
  try {
    const { id_ec, id_niveau, id_annee } = req.body;
    const data = await noteService.getByNiveauAndYear(id_ec, id_niveau, id_annee);
    res.json(data);
  } catch (err) {
    logger.error("note getByNiveauAndYear error:", err);
    next(err);
  }
}

module.exports = {
  getAll, getById, create, update, remove,
  getByEtudiant, getByEtudiantAndNiveau, getByEtudiantAndYear, getByNiveauAndYear,
};
