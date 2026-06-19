const authService = require("../services/authService");
const logger = require("../utils/logger");

async function login(req, res, next) {
  try {
    const { username, password } = req.body;
    const result = await authService.login(username, password);
    res.status(200).send({ token: result.token });
  } catch (err) {
    logger.error("login error:", err);
    next(err);
  }
}

async function signup(req, res, next) {
  try {
    const { username, password } = req.body;
    await authService.signup(username, password);
    res.status(201).send({ message: "Inscription réussie" });
  } catch (err) {
    logger.error("signup error:", err);
    next(err);
  }
}

module.exports = { login, signup };
