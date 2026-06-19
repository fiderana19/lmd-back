const request = require("supertest");
const { app, seedDB } = require("../setup");
const { getToken } = require("../helpers/authHelper");

let token;

beforeAll(async () => {
  await seedDB();
  token = await getToken(app);
});

describe("Routes /etudiant", () => {
  describe("GET /etudiant/", () => {
    it("devrait retourner 401 sans token", async () => {
      const res = await request(app).get("/etudiant/");
      expect(res.status).toBe(401);
    });

    it("devrait retourner la liste des étudiants", async () => {
      const res = await request(app)
        .get("/etudiant/")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("GET /etudiant/get/:id", () => {
    it("devrait retourner un étudiant par ID", async () => {
      const res = await request(app)
        .get("/etudiant/get/1")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
    });

    it("devrait retourner null pour un ID inexistant", async () => {
      const res = await request(app)
        .get("/etudiant/get/999")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body).toBeNull();
    });
  });

  describe("POST /etudiant/create", () => {
    it("devrait créer un étudiant", async () => {
      const res = await request(app)
        .post("/etudiant/create")
        .set("Authorization", `Bearer ${token}`)
        .send({ id_etudiant: 3, matricule: "ET003", nom: "Rakoto", prenom: "Paul", date_naiss: "2002-06-10", lieu_naiss: "Toamasina" });
      expect(res.status).toBe(200);
    });

    it("devrait retourner une erreur sans données", async () => {
      const res = await request(app)
        .post("/etudiant/create")
        .set("Authorization", `Bearer ${token}`)
        .send({});
      expect(res.status).toBe(500);
    });
  });

  describe("PATCH /etudiant/edit/:id", () => {
    it("devrait modifier un étudiant", async () => {
      const res = await request(app)
        .patch("/etudiant/edit/1")
        .set("Authorization", `Bearer ${token}`)
        .send({ nom: "Dupont Modifié" });
      expect(res.status).toBe(200);
    });
  });

  describe("DELETE /etudiant/delete/:id", () => {
    it("devrait supprimer un étudiant", async () => {
      const res = await request(app)
        .delete("/etudiant/delete/2")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
    });
  });
});
