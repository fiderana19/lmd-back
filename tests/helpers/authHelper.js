const request = require("supertest");

async function getToken(app) {
  const res = await request(app)
    .post("/auth/login")
    .send({ username: "testuser", password: "testpass123" });
  return res.body.token;
}

async function createUserAndGetToken(app) {
  await request(app)
    .post("/auth/signup")
    .send({ username: "testuser", password: "testpass123" });
  return getToken(app);
}

module.exports = { getToken, createUserAndGetToken };
