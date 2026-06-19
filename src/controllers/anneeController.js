const anneeService = require("../services/anneeService");
const logger = require("../utils/logger");

async function getAll(req, res, next) {
  try {
    const data = await anneeService.getAll();
    res.json(data);
  } catch (err) {
    logger.error("annee getAll error:", err);
    next(err);
  }
}

module.exports = { getAll };
