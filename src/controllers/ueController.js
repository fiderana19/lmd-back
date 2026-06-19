const ueService = require("../services/ueService");
const logger = require("../utils/logger");

async function getAll(req, res, next) {
  try {
    const data = await ueService.getAll();
    res.json(data);
  } catch (err) {
    logger.error("ue getAll error:", err);
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const data = await ueService.getById(req.params.id);
    res.json(data);
  } catch (err) {
    logger.error("ue getById error:", err);
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const { nom_ue, credit_ue } = req.body;
    const data = await ueService.create(nom_ue, credit_ue);
    res.json(data);
  } catch (err) {
    logger.error("ue create error:", err);
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const { nom_ue, credit_ue } = req.body;
    const data = await ueService.update(req.params.id, nom_ue, credit_ue);
    res.json(data);
  } catch (err) {
    logger.error("ue update error:", err);
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const data = await ueService.remove(req.params.id);
    res.json(data);
  } catch (err) {
    logger.error("ue remove error:", err);
    next(err);
  }
}

module.exports = { getAll, getById, create, update, remove };
