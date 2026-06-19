const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/guard");
const etudiantController = require("../controllers/etudiantController");

router.get("/", authMiddleware, etudiantController.getAll);
router.get("/get/:id", authMiddleware, etudiantController.getById);
router.post("/create", authMiddleware, etudiantController.create);
router.patch("/edit/:id", authMiddleware, etudiantController.update);
router.delete("/delete/:id", authMiddleware, etudiantController.remove);

module.exports = router;
