const dotenv = require("dotenv");
dotenv.config({ path: __dirname + "/.env.test" });

const sequelize = require("../src/config/sequelize");
const { User, Annee, Ue, Ec, Niveau, Etudiant, Note } = require("../src/models");
const bcrypt = require("bcrypt");
const app = require("../src/app");

async function seedDB() {
  await sequelize.sync({ force: true });

  const hashedPassword = await bcrypt.hash("testpass123", 10);
  await User.create({ username: "testuser", password: hashedPassword });

  await Annee.bulkCreate([
    { id_annee: 1, libelle: "2023-2024" },
    { id_annee: 2, libelle: "2024-2025" },
  ]);

  await Niveau.bulkCreate([
    { id_niveau: 1, titre_niveau: "L3", descri_niveau: "Licence 3", domaine: "Informatique", mention: "Sciences", parcours: "Génie Logiciel" },
    { id_niveau: 2, titre_niveau: "M1", descri_niveau: "Master 1", domaine: "Informatique", mention: "Sciences", parcours: "Génie Logiciel" },
  ]);

  await Ue.bulkCreate([
    { id_ue: 1, nom_ue: "UE1", credit_ue: 10 },
    { id_ue: 2, nom_ue: "UE2", credit_ue: 10 },
  ]);

  await Ec.bulkCreate([
    { id_ec: 1, nom_ec: "EC1", semestre: 1, et: 0.4, ed: 0.3, ep: 0.3, credit_ec: 5, poids_ec: 0.5, id_ue: 1 },
    { id_ec: 2, nom_ec: "EC2", semestre: 1, et: 0.4, ed: 0.3, ep: 0.3, credit_ec: 5, poids_ec: 0.5, id_ue: 1 },
    { id_ec: 3, nom_ec: "EC3", semestre: 1, et: 0.4, ed: 0.3, ep: 0.3, credit_ec: 5, poids_ec: 0.5, id_ue: 2 },
  ]);

  await Etudiant.bulkCreate([
    { id_etudiant: 1, matricule: "ET001", nom: "Dupont", prenom: "Jean", date_naiss: "2000-01-15", lieu_naiss: "Antananarivo" },
    { id_etudiant: 2, matricule: "ET002", nom: "Rabe", prenom: "Marie", date_naiss: "2001-03-20", lieu_naiss: "Fianarantsoa" },
  ]);

  await Note.bulkCreate([
    { valeur: 14, id_etudiant: 1, id_niveau: 1, id_ec: 1, id_annee: 1, date: new Date("2024-01-01") },
    { valeur: 12, id_etudiant: 1, id_niveau: 1, id_ec: 2, id_annee: 1, date: new Date("2024-01-01") },
    { valeur: 10, id_etudiant: 1, id_niveau: 1, id_ec: 3, id_annee: 1, date: new Date("2024-01-01") },
    { valeur: 8, id_etudiant: 2, id_niveau: 1, id_ec: 1, id_annee: 1, date: new Date("2024-01-01") },
    { valeur: 15, id_etudiant: 2, id_niveau: 1, id_ec: 2, id_annee: 1, date: new Date("2024-01-01") },
  ]);
}

async function closeDB() {
  await sequelize.close();
}

module.exports = { app, seedDB, closeDB };
