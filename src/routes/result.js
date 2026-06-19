const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/guard");
const resultController = require("../controllers/resultController");

router.post("/unity", authMiddleware, resultController.getUnity);
router.post("/result", authMiddleware, resultController.getResult);
router.post("/final", authMiddleware, resultController.getFinal);
router.post("/", authMiddleware, resultController.getEtudiantInfo);

module.exports = router;
