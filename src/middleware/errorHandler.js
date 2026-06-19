const logger = require("../utils/logger");

const errorHandler = (err, req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : "Erreur interne du serveur";

  if (!err.isOperational) {
    logger.error("Erreur inattendue :", err);
  }

  res.status(statusCode).json({ message });
};

module.exports = errorHandler;
