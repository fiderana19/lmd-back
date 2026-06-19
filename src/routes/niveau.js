const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/guard");
const niveauController = require("../controllers/niveauController");

router.get("/", authMiddleware, niveauController.getAll);
router.get("/get/:id", authMiddleware, niveauController.getById);
router.post("/create", authMiddleware, niveauController.create);
router.patch("/edit/:id", authMiddleware, niveauController.update);
router.delete("/delete/:id", authMiddleware, niveauController.remove);

module.exports = router;
