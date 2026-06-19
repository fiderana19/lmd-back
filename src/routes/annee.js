const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/guard");
const anneeController = require("../controllers/anneeController");

router.get("/", authMiddleware, anneeController.getAll);

module.exports = router;
