const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const config = require("../config/index");
const AppError = require("../utils/AppError");

async function login(username, password) {
  const user = await User.findOne({ where: { username } });

  if (!user) {
    throw new AppError("Utilisateur non trouvé", 401);
  }

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
  return User.create({ username, password: hashedPassword });
}

module.exports = { login, signup };
