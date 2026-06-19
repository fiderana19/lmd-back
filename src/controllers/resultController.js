const resultService = require("../services/resultService");
const logger = require("../utils/logger");

async function getUnity(req, res, next) {
  try {
    const { id_etudiant, id_annee, id_niveau } = req.body;
    const data = await resultService.getUnity(id_etudiant, id_annee, id_niveau);
    res.json(data);
  } catch (err) {
    logger.error("getUnity error:", err);
    next(err);
  }
}

async function getResult(req, res, next) {
  try {
    const { id_etudiant, id_annee, id_niveau } = req.body;
    const data = await resultService.getResult(id_etudiant, id_annee, id_niveau);
    res.json(data);
  } catch (err) {
    logger.error("getResult error:", err);
    next(err);
  }
}

async function getFinal(req, res, next) {
  try {
    const { id_etudiant, id_annee, id_niveau } = req.body;
    const data = await resultService.getFinal(id_etudiant, id_annee, id_niveau);
    res.json(data);
  } catch (err) {
    logger.error("getFinal error:", err);
    next(err);
  }
}

async function getEtudiantInfo(req, res, next) {
  try {
    const { id_etudiant, id_annee, id_niveau } = req.body;
    const data = await resultService.getEtudiantInfo(id_etudiant, id_annee, id_niveau);
    res.json(data);
  } catch (err) {
    logger.error("getEtudiantInfo error:", err);
    next(err);
  }
}

async function getNiveauFinal(req, res, next) {
  try {
    const obs = req.body.obs;
    const { id_annee, id_niveau } = req.body;
    const data = await resultService.getNiveauFinal(id_annee, id_niveau);
    const result = resultService.filterFinalResult(data, obs);
    res.json(result);
  } catch (err) {
    logger.error("getNiveauFinal error:", err);
    next(err);
  }
}

async function getNiveauInfo(req, res, next) {
  try {
    const { id_annee, id_niveau } = req.body;
    const data = await resultService.getNiveauInfo(id_annee, id_niveau);
    res.json(data);
  } catch (err) {
    logger.error("getNiveauInfo error:", err);
    next(err);
  }
}

module.exports = {
  getUnity, getResult, getFinal, getEtudiantInfo,
  getNiveauFinal, getNiveauInfo,
};
