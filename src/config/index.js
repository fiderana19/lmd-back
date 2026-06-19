require("dotenv").config();

const config = {
  port: parseInt(process.env.PORT, 10) || 3002,
  db: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_DATABASE || "noteuniversitaire",
  },
  jwt: {
    secret: process.env.ACCESS_TOKEN_SECRET,
  },
};

module.exports = config;
