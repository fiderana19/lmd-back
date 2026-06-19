const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/guard");
const resultController = require("../controllers/resultController");

router.post("/final/", authMiddleware, resultController.getNiveauFinal);
router.post("/info", authMiddleware, resultController.getNiveauInfo);

module.exports = router;
