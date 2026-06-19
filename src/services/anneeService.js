const db = require("../config/database");

async function getAll() {
  return db.query("SELECT * FROM annee");
}

module.exports = { getAll };
