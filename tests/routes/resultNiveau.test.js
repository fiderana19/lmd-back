const request = require("supertest");
const { app, seedDB } = require("../setup");
const { getToken } = require("../helpers/authHelper");

let token;

beforeAll(async () => {
  await seedDB();
  token = await getToken(app);
});

describe("Routes /result/niveau", () => {
  describe("POST /result/niveau/info", () => {
    it("devrait retourner 401 sans token", async () => {
      const res = await request(app).post("/result/niveau/info");
      expect(res.status).toBe(401);
    });

    it("devrait retourner les infos du niveau", async () => {
      const res = await request(app)
        .post("/result/niveau/info")
        .set("Authorization", `Bearer ${token}`)
        .send({ id_annee: 1, id_niveau: 1 });
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("POST /result/niveau/final", () => {
    it("devrait retourner les résultats finaux du niveau", async () => {
      const res = await request(app)
        .post("/result/niveau/final")
        .set("Authorization", `Bearer ${token}`)
        .send({ id_annee: 1, id_niveau: 1 });
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("devrait filtrer par observation", async () => {
      const res = await request(app)
        .post("/result/niveau/final")
        .set("Authorization", `Bearer ${token}`)
        .send({ id_annee: 1, id_niveau: 1, obs: "ADMIS" });
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});
