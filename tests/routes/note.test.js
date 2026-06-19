const request = require("supertest");
const { app, seedDB } = require("../setup");
const { getToken } = require("../helpers/authHelper");

let token;

beforeAll(async () => {
  await seedDB();
  token = await getToken(app);
});

describe("Routes /note", () => {
  describe("GET /note/", () => {
    it("devrait retourner 401 sans token", async () => {
      const res = await request(app).get("/note/");
      expect(res.status).toBe(401);
    });

    it("devrait retourner la liste des notes", async () => {
      const res = await request(app)
        .get("/note/")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("GET /note/note/:id", () => {
    it("devrait retourner une note par ID", async () => {
      const res = await request(app)
        .get("/note/note/1")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
    });
  });

  describe("POST /note/create", () => {
    it("devrait créer une note", async () => {
      const res = await request(app)
        .post("/note/create")
        .set("Authorization", `Bearer ${token}`)
        .send({ valeur: 16, id_etudiant: 1, id_niveau: 1, id_ec: 1, id_annee: 1 });
      expect(res.status).toBe(200);
    });

    it("devrait retourner une erreur sans valeur", async () => {
      const res = await request(app)
        .post("/note/create")
        .set("Authorization", `Bearer ${token}`)
        .send({});
      expect(res.status).toBe(500);
    });
  });

  describe("PATCH /note/edit/:id", () => {
    it("devrait modifier une note", async () => {
      const res = await request(app)
        .patch("/note/edit/1")
        .set("Authorization", `Bearer ${token}`)
        .send({ valeur: 18 });
      expect(res.status).toBe(200);
    });
  });

  describe("DELETE /note/delete/:id", () => {
    it("devrait supprimer une note", async () => {
      const res = await request(app)
        .delete("/note/delete/5")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
    });
  });

  describe("GET /note/notes/etudiant/:id_etudiant", () => {
    it("devrait retourner les notes d'un étudiant", async () => {
      const res = await request(app)
        .get("/note/notes/etudiant/1")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("GET /note/notes/etudiant/:id_etudiant/niveau/:id_niveau", () => {
    it("devrait retourner les notes d'un étudiant par niveau", async () => {
      const res = await request(app)
        .get("/note/notes/etudiant/1/niveau/1")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("GET /note/etudiant/:id_etudiant/annee/:annee", () => {
    it("devrait retourner les notes d'un étudiant pour une année", async () => {
      const res = await request(app)
        .get("/note/etudiant/1/annee/2024")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe("POST /note/niveau/", () => {
    it("devrait retourner les notes par niveau et année", async () => {
      const res = await request(app)
        .post("/note/niveau/")
        .set("Authorization", `Bearer ${token}`)
        .send({ id_ec: 1, id_niveau: 1, id_annee: 1 });
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});
