const request = require("supertest");
const { app, seedDB } = require("../setup");
const { getToken } = require("../helpers/authHelper");

let token;

beforeAll(async () => {
  await seedDB();
  token = await getToken(app);
});

describe("Routes /ec", () => {
  describe("GET /ec/", () => {
    it("devrait retourner 401 sans token", async () => {
      const res = await request(app).get("/ec/");
      expect(res.status).toBe(401);
    });

    it("devrait retourner la liste des EC", async () => {
      const res = await request(app)
        .get("/ec/")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("GET /ec/get/:id", () => {
    it("devrait retourner un EC par ID", async () => {
      const res = await request(app)
        .get("/ec/get/1")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
    });
  });

  describe("POST /ec/create", () => {
    it("devrait créer un EC", async () => {
      const res = await request(app)
        .post("/ec/create")
        .set("Authorization", `Bearer ${token}`)
        .send({ id_ec: 10, nom_ec: "EC Nouveau", semestre: 1, et: 0.4, ed: 0.3, ep: 0.3, credit_ec: 4, poids_ec: 0.5, id_ue: 2 });
      expect(res.status).toBe(200);
    });

    it("devrait retourner une erreur sans données", async () => {
      const res = await request(app)
        .post("/ec/create")
        .set("Authorization", `Bearer ${token}`)
        .send({});
      expect(res.status).toBe(500);
    });
  });

  describe("PATCH /ec/edit/:id", () => {
    it("devrait modifier un EC", async () => {
      const res = await request(app)
        .patch("/ec/edit/1")
        .set("Authorization", `Bearer ${token}`)
        .send({ nom_ec: "EC Modifié", semestre: 2 });
      expect(res.status).toBe(200);
    });
  });

  describe("DELETE /ec/delete/:id", () => {
    it("devrait supprimer un EC", async () => {
      const res = await request(app)
        .delete("/ec/delete/3")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
    });
  });
});
