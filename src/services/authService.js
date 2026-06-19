const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/database");
const config = require("../config/index");
const AppError = require("../utils/AppError");

async function login(username, password) {
  const LOGIN_QUERY = "SELECT * from user WHERE username = ?";
  const data = await db.query(LOGIN_QUERY, [username]);

  if (!data || data.length === 0) {
    throw new AppError("Utilisateur non trouvé", 401);
  }

  const user = data[0];
  const isMatched = await bcrypt.compare(password, user.password);

  if (!isMatched) {
    throw new AppError("Mot de passe incorrect", 401);
  }

  const payload = { id: user.user_id, username: user.username };
  const token = jwt.sign(payload, config.jwt.secret);
  return { token };
}

async function signup(username, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const SIGNUP_QUERY = "INSERT INTO user (username, password) VALUES (?, ?)";
  return db.query(SIGNUP_QUERY, [username, hashedPassword]);
}

module.exports = { login, signup };
