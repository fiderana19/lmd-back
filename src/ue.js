/*
----------------------------------
|   UNITE D'ENSEIGNEMENT FILE    |
----------------------------------
*/
const express = require("express");
const router = express.Router();
const Connect = require("./db/connection");
const authMiddleware = require('./middleware/guard')
//Database connection
const db = Connect();

// Afficher tous les ue
router.get("/", authMiddleware, (req, res) => {
  const SELECT_ALL_EC_QUERY = "SELECT * FROM ue";

  db.query(SELECT_ALL_EC_QUERY, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    return res.json(data);
  });
});

// Ajout ec
router.post("/create", authMiddleware, (req, res) => {
  const { nom_ue, credit_ue } = req.body;

  const INSERT_EC_QUERY = "INSERT INTO ue (nom_ue, credit_ue) VALUES (?, ?)";

  db.query(INSERT_EC_QUERY, [nom_ue, credit_ue], (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    return res.json(data);
  });
});

// Delete ec
router.delete("/delete/:id", authMiddleware, (req, res) => {
  const id = req.params.id;

  const DELETE_EC_QUERY = "DELETE FROM ue WHERE id_ue = ?";

  db.query(DELETE_EC_QUERY, [id], (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    return res.json(data);
  });
});

// update ec
router.patch("/edit/:id", authMiddleware, (req, res) => {
  const id = req.params.id;
  const { nom_ue, credit_ue } = req.body;

  const UPDATE_EC_QUERY =
    "UPDATE ue SET nom_ue = ?, credit_ue = ? WHERE id_ue = ?";

  db.query(UPDATE_EC_QUERY, [nom_ue, credit_ue, id], (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    return res.json(data);
  });
});

// Get ue by id
router.get("/get/:id", authMiddleware, (req, res) => {
  const id = req.params.id;

  const SELECT_UE_BYID_QUERY = "SELECT * FROM ue WHERE id_ue = ?";

  db.query(SELECT_UE_BYID_QUERY, [id], (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    return res.json(data);
  });
});

module.exports = router;
