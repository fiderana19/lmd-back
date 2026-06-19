const niveauService = require("../services/niveauService");
const logger = require("../utils/logger");

async function getAll(req, res, next) {
  try {
    const data = await niveauService.getAll();
    res.json(data);
  } catch (err) {
    logger.error("niveau getAll error:", err);
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const data = await niveauService.getById(req.params.id);
    res.json(data);
  } catch (err) {
    logger.error("niveau getById error:", err);
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const data = await niveauService.create(req.body);
    res.json(data);
  } catch (err) {
    logger.error("niveau create error:", err);
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const data = await niveauService.update(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    logger.error("niveau update error:", err);
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const data = await niveauService.remove(req.params.id);
    res.json(data);
  } catch (err) {
    logger.error("niveau remove error:", err);
    next(err);
  }
}

module.exports = { getAll, getById, create, update, remove };
