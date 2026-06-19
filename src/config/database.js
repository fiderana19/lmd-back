const mysql = require("mysql");
const { promisify } = require("util");
const config = require("./index");

const pool = mysql.createPool({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  connectionLimit: 10,
});

pool.query = promisify(pool.query);

module.exports = pool;
