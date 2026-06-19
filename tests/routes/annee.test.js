const request = require("supertest");
const { app, seedDB } = require("../setup");
const { getToken } = require("../helpers/authHelper");

let token;

beforeAll(async () => {
  await seedDB();
  token = await getToken(app);
});

describe("Routes /annee", () => {
  describe("GET /annee/", () => {
    it("devrait retourner 401 sans token", async () => {
      const res = await request(app).get("/annee/");
      expect(res.status).toBe(401);
    });

    it("devrait retourner 401 avec un token invalide", async () => {
      const res = await request(app)
        .get("/annee/")
        .set("Authorization", "Bearer invalidtoken");
      expect(res.status).toBe(401);
    });

    it("devrait retourner la liste des années avec un token valide", async () => {
      const res = await request(app)
        .get("/annee/")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(2);
    });
  });
});
