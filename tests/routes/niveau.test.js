const request = require("supertest");
const { app, seedDB } = require("../setup");
const { getToken } = require("../helpers/authHelper");

let token;

beforeAll(async () => {
  await seedDB();
  token = await getToken(app);
});

describe("Routes /niveau", () => {
  describe("GET /niveau/", () => {
    it("devrait retourner 401 sans token", async () => {
      const res = await request(app).get("/niveau/");
      expect(res.status).toBe(401);
    });

    it("devrait retourner la liste des niveaux", async () => {
      const res = await request(app)
        .get("/niveau/")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("GET /niveau/get/:id", () => {
    it("devrait retourner un niveau par ID", async () => {
      const res = await request(app)
        .get("/niveau/get/1")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
    });
  });

  describe("POST /niveau/create", () => {
    it("devrait créer un niveau", async () => {
      const res = await request(app)
        .post("/niveau/create")
        .set("Authorization", `Bearer ${token}`)
        .send({ id_niveau: 3, titre_niveau: "L2", descri_niveau: "Licence 2", domaine: "Maths", mention: "Sciences", parcours: "Maths Appliquées" });
      expect(res.status).toBe(200);
    });

    it("devrait retourner une erreur sans données", async () => {
      const res = await request(app)
        .post("/niveau/create")
        .set("Authorization", `Bearer ${token}`)
        .send({});
      expect(res.status).toBe(500);
    });
  });

  describe("PATCH /niveau/edit/:id", () => {
    it("devrait modifier un niveau", async () => {
      const res = await request(app)
        .patch("/niveau/edit/2")
        .set("Authorization", `Bearer ${token}`)
        .send({ titre_niveau: "M1 Modifié" });
      expect(res.status).toBe(200);
    });
  });

  describe("DELETE /niveau/delete/:id", () => {
    it("devrait supprimer un niveau", async () => {
      const res = await request(app)
        .delete("/niveau/delete/1")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
    });
  });
});
