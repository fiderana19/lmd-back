const request = require("supertest");
const { app, seedDB } = require("../setup");

beforeAll(async () => {
  await seedDB();
});

describe("Routes /auth", () => {
  describe("POST /auth/signup", () => {
    it("devrait créer un utilisateur avec username et password", async () => {
      const res = await request(app)
        .post("/auth/signup")
        .send({ username: "newuser", password: "newpass123" });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("message", "Inscription réussie");
    });

    it("devrait retourner une erreur sans username", async () => {
      const res = await request(app)
        .post("/auth/signup")
        .send({ password: "pass123" });
      expect(res.status).toBe(500);
    });
  });

  describe("POST /auth/login", () => {
    it("devrait retourner un token avec des identifiants valides", async () => {
      const res = await request(app)
        .post("/auth/login")
        .send({ username: "testuser", password: "testpass123" });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("token");
    });

    it("devrait retourner 401 avec un mauvais mot de passe", async () => {
      const res = await request(app)
        .post("/auth/login")
        .send({ username: "testuser", password: "wrongpass" });
      expect(res.status).toBe(401);
    });

    it("devrait retourner 401 avec un utilisateur inexistant", async () => {
      const res = await request(app)
        .post("/auth/login")
        .send({ username: "nonexistent", password: "pass123" });
      expect(res.status).toBe(401);
    });
  });
});
