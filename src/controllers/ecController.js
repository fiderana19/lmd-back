const ecService = require("../services/ecService");
const logger = require("../utils/logger");

async function getAll(req, res, next) {
  try {
    const data = await ecService.getAll();
    res.json(data);
  } catch (err) {
    logger.error("ec getAll error:", err);
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const data = await ecService.getById(req.params.id);
    res.json(data);
  } catch (err) {
    logger.error("ec getById error:", err);
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const data = await ecService.create(req.body);
    res.json(data);
  } catch (err) {
    logger.error("ec create error:", err);
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const data = await ecService.update(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    logger.error("ec update error:", err);
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const data = await ecService.remove(req.params.id);
    res.json(data);
  } catch (err) {
    logger.error("ec remove error:", err);
    next(err);
  }
}

module.exports = { getAll, getById, create, update, remove };
