const request = require("supertest");
const { app, seedDB } = require("../setup");
const { getToken } = require("../helpers/authHelper");

let token;

beforeAll(async () => {
  await seedDB();
  token = await getToken(app);
});

describe("Routes /ue", () => {
  describe("GET /ue/", () => {
    it("devrait retourner 401 sans token", async () => {
      const res = await request(app).get("/ue/");
      expect(res.status).toBe(401);
    });

    it("devrait retourner la liste des UE", async () => {
      const res = await request(app)
        .get("/ue/")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("GET /ue/get/:id", () => {
    it("devrait retourner une UE par ID", async () => {
      const res = await request(app)
        .get("/ue/get/1")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
    });
  });

  describe("POST /ue/create", () => {
    it("devrait créer une UE", async () => {
      const res = await request(app)
        .post("/ue/create")
        .set("Authorization", `Bearer ${token}`)
        .send({ id_ue: 10, nom_ue: "UE Nouvelle", credit_ue: 5 });
      expect(res.status).toBe(200);
    });

    it("devrait retourner une erreur sans nom_ue", async () => {
      const res = await request(app)
        .post("/ue/create")
        .set("Authorization", `Bearer ${token}`)
        .send({ credit_ue: 5 });
      expect(res.status).toBe(500);
    });
  });

  describe("PATCH /ue/edit/:id", () => {
    it("devrait modifier une UE", async () => {
      const res = await request(app)
        .patch("/ue/edit/1")
        .set("Authorization", `Bearer ${token}`)
        .send({ nom_ue: "UE Modifiée", credit_ue: 8 });
      expect(res.status).toBe(200);
    });
  });

  describe("DELETE /ue/delete/:id", () => {
    it("devrait supprimer une UE", async () => {
      const res = await request(app)
        .delete("/ue/delete/2")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
    });
  });
});
