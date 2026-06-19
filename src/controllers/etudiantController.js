const etudiantService = require("../services/etudiantService");
const logger = require("../utils/logger");

async function getAll(req, res, next) {
  try {
    const data = await etudiantService.getAll();
    res.json(data);
  } catch (err) {
    logger.error("etudiant getAll error:", err);
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const data = await etudiantService.getById(req.params.id);
    res.json(data);
  } catch (err) {
    logger.error("etudiant getById error:", err);
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const data = await etudiantService.create(req.body);
    res.json(data);
  } catch (err) {
    logger.error("etudiant create error:", err);
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const data = await etudiantService.update(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    logger.error("etudiant update error:", err);
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const data = await etudiantService.remove(req.params.id);
    res.json(data);
  } catch (err) {
    logger.error("etudiant remove error:", err);
    next(err);
  }
}

module.exports = { getAll, getById, create, update, remove };
