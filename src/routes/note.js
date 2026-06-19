const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/guard");
const noteController = require("../controllers/noteController");

router.get("/", authMiddleware, noteController.getAll);
router.get("/note/:id", authMiddleware, noteController.getById);
router.post("/create", authMiddleware, noteController.create);
router.patch("/edit/:id", authMiddleware, noteController.update);
router.delete("/delete/:id", authMiddleware, noteController.remove);
router.get("/notes/etudiant/:id_etudiant", authMiddleware, noteController.getByEtudiant);
router.get("/notes/etudiant/:id_etudiant/niveau/:id_niveau", authMiddleware, noteController.getByEtudiantAndNiveau);
router.get("/etudiant/:id_etudiant/annee/:annee", authMiddleware, noteController.getByEtudiantAndYear);
router.post("/niveau/", authMiddleware, noteController.getByNiveauAndYear);

module.exports = router;
