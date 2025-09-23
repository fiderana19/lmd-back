/*
---------------------------------
|   ANNEE FILE    |
---------------------------------
*/
const express = require("express");
const Connect = require("./db/connection");
const router = express.Router();
const authMiddleware = require('./middleware/guard')
//Database connection
const db = Connect();

// Afficher tous les années
router.get("/", authMiddleware, (req, res) => {
  const SELECT_ALL_EC_QUERY = "SELECT * FROM annee";

  db.query(SELECT_ALL_EC_QUERY, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    return res.json(data);
  });
});

module.exports = router;
