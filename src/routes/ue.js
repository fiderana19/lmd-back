const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/guard");
const ueController = require("../controllers/ueController");

router.get("/", authMiddleware, ueController.getAll);
router.get("/get/:id", authMiddleware, ueController.getById);
router.post("/create", authMiddleware, ueController.create);
router.patch("/edit/:id", authMiddleware, ueController.update);
router.delete("/delete/:id", authMiddleware, ueController.remove);

module.exports = router;
