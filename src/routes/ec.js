const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/guard");
const ecController = require("../controllers/ecController");

router.get("/", authMiddleware, ecController.getAll);
router.get("/get/:id", authMiddleware, ecController.getById);
router.post("/create", authMiddleware, ecController.create);
router.patch("/edit/:id", authMiddleware, ecController.update);
router.delete("/delete/:id", authMiddleware, ecController.remove);

module.exports = router;
