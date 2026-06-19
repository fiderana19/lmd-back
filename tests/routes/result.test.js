const request = require("supertest");
const { app, seedDB } = require("../setup");
const { getToken } = require("../helpers/authHelper");

let token;

beforeAll(async () => {
  await seedDB();
  token = await getToken(app);
});

describe("Routes /result/etudiant", () => {
  describe("POST /result/etudiant/unity", () => {
    it("devrait retourner 401 sans token", async () => {
      const res = await request(app).post("/result/etudiant/unity");
      expect(res.status).toBe(401);
    });

    it("devrait retourner les résultats par UE", async () => {
      const res = await request(app)
        .post("/result/etudiant/unity")
        .set("Authorization", `Bearer ${token}`)
        .send({ id_etudiant: 1, id_annee: 1, id_niveau: 1 });
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("devrait retourner une erreur sans body", async () => {
      const res = await request(app)
        .post("/result/etudiant/unity")
        .set("Authorization", `Bearer ${token}`)
        .send({});
      expect(res.status).toBe(500);
    });
  });

  describe("POST /result/etudiant/result", () => {
    it("devrait retourner le résultat général", async () => {
      const res = await request(app)
        .post("/result/etudiant/result")
        .set("Authorization", `Bearer ${token}`)
        .send({ id_etudiant: 1, id_annee: 1, id_niveau: 1 });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("moyenne_generale");
      expect(res.body).toHaveProperty("total_credits");
    });
  });

  describe("POST /result/etudiant/final", () => {
    it("devrait retourner la décision finale", async () => {
      const res = await request(app)
        .post("/result/etudiant/final")
        .set("Authorization", `Bearer ${token}`)
        .send({ id_etudiant: 1, id_annee: 1, id_niveau: 1 });
      expect(res.status).toBe(200);
    });
  });

  describe("POST /result/etudiant/", () => {
    it("devrait retourner les infos d'un étudiant", async () => {
      const res = await request(app)
        .post("/result/etudiant/")
        .set("Authorization", `Bearer ${token}`)
        .send({ id_etudiant: 1, id_annee: 1, id_niveau: 1 });
      expect(res.status).toBe(200);
    });
  });
});
