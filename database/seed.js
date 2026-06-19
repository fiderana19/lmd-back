const sequelize = require("../src/config/sequelize");
const { User, Annee, Ue, Ec, Niveau, Etudiant, Note } = require("../src/models");
const bcrypt = require("bcrypt");

const NOTES_L3_ANNEE1 = [
  // Dupont: 14,12,16 | 8,11 | 14,13 -> UE1 ok(9cr), UE2 fail(0), UE3 ok(9cr) -> 18cr, moy≈11.90, "AUTORISE A PASSE AU NIVEAU SUPERIEUR"
  { e: 1, notes: [14, 12, 16, 8, 11, 14, 13] },
  // Rabe: 18,4,16 | 10,9 | 12,11 -> UE1 fail(0, note elim 4), UE2 fail(0), UE3 ok(9cr) -> 9cr, moy≈11.70, "AUTORISER A REDOUBLER"
  { e: 2, notes: [18, 4, 16, 10, 9, 12, 11] },
  // Rakoto: 5,6,5 | 7,6 | 8,7 -> tout fail -> 0cr, moy≈6.29, "EXCLUS"
  { e: 3, notes: [5, 6, 5, 7, 6, 8, 7] },
  // Ravao: 11,10,9 | 11,12 | 10,12 -> UE1 fail(9<10), UE2 ok(12cr), UE3 ok(9cr) -> 21cr, moy≈10.93, "AUTORISE A PASSE AU NIVEAU SUPERIEUR"
  { e: 4, notes: [11, 10, 9, 11, 12, 10, 12] },
  // Andria: 17,15,18 | 14,16 | 15,14 -> tout ok -> 30cr, moy≈15.69, "ADMIS" TB
  { e: 5, notes: [17, 15, 18, 14, 16, 15, 14] },
  // Randria: 10,8,12 | 14,15 | 10,12 -> UE1 fail(8.8<10), UE2 ok(12cr), UE3 ok(9cr) -> 21cr
  { e: 6, notes: [10, 8, 12, 14, 15, 10, 12] },
  // Raharimanana: 7,9,6 | 8,10 | 9,8 -> tout fail -> 0cr
  { e: 7, notes: [7, 9, 6, 8, 10, 9, 8] },
  // Razafy: 16,14,15 | 12,13 | 17,16 -> tout ok -> 30cr, "ADMIS" B
  { e: 8, notes: [16, 14, 15, 12, 13, 17, 16] },
  // Rasoa: 12,13,10 | 9,7 | 11,10 -> UE2 fail(7.8<10), UE3 ok(9cr), UE1 fail(11.5 ok mais 10<5? non, 10≥5, moyenne UE1=11.5≥10, credits=9) -> wait
  // 12*0.3+13*0.4+10*0.3 = 3.6+5.2+3.0 = 11.8 ≥10, no note <5 -> UE1 ok 9cr
  // 9*0.6+7*0.4 = 5.4+2.8 = 8.2 <10 -> UE2 fail 0cr
  // 11*0.5+10*0.5 = 5.5+5.0 = 10.5 ≥10, no note <5 -> UE3 ok 9cr
  // total: 18cr
  { e: 9, notes: [12, 13, 10, 9, 7, 11, 10] },
  // Randrianarisoa: 19,18,20 | 17,18 | 16,19 -> tout ok -> 30cr, "ADMIS" TB
  { e: 10, notes: [19, 18, 20, 17, 18, 16, 19] },
  // Rajaonary: 8,7,9 | 6,10 | 10,9 -> UE1 fail(7.9<10), UE2 fail(7.6<10), UE3 ok(9.5<10? non 10*0.5+9*0.5=9.5<10) -> tout fail -> 0cr
  { e: 11, notes: [8, 7, 9, 6, 10, 10, 9] },
  // Rakotondrabe: 13,14,12 | 10,14 | 13,12 -> tout ok -> 30cr, "ADMIS" AB
  { e: 12, notes: [13, 14, 12, 10, 14, 13, 12] },
  // Rabemananjara: 15,16,14 | 13,15 | 14,13 -> tout ok -> 30cr, "ADMIS" B
  { e: 13, notes: [15, 16, 14, 13, 15, 14, 13] },
  // Randrianantenaina: 6,10,7 | 11,12 | 12,13 -> UE1 fail(7.9<10), UE2 ok(11.4≥10), UE3 ok(12.5≥10) -> 21cr
  { e: 14, notes: [6, 10, 7, 11, 12, 12, 13] },
  // Ramanantenasoa: 9,11,8 | 10,9 | 11,10 -> UE1 fail(9.5<10), UE2 fail(9.6<10), UE3 ok(10.5≥10) -> 9cr
  { e: 15, notes: [9, 11, 8, 10, 9, 11, 10] },
];

const NOTES_L3_ANNEE2 = [
  { e: 1, notes: [16, 15, 17, 14, 16, 15, 14] }, // Dupont -> tout ok 30cr
  { e: 4, notes: [13, 14, 12, 15, 16, 14, 15] }, // Ravao -> tout ok 30cr
  { e: 5, notes: [18, 17, 19, 18, 17, 16, 18] }, // Andria -> tout ok 30cr
  { e: 8, notes: [17, 16, 18, 15, 16, 18, 17] }, // Razafy -> tout ok 30cr
  { e: 9, notes: [14, 15, 13, 10, 12, 14, 13] }, // Rasoa -> tout ok 30cr
  { e: 10, notes: [20, 19, 20, 18, 19, 18, 20] }, // Randrianarisoa -> tout ok 30cr
  { e: 12, notes: [15, 16, 14, 12, 15, 14, 13] }, // Rakotondrabe -> tout ok 30cr
  { e: 13, notes: [17, 18, 16, 15, 17, 16, 15] }, // Rabemananjara -> tout ok 30cr
  { e: 14, notes: [12, 14, 11, 13, 14, 14, 15] }, // Randrianantenaina -> tout ok 30cr
];

const NOTES_M1_ANNEE1 = [
  { e: 1, notes: [15, 14, 16, 12, 13, 11] },
  { e: 5, notes: [18, 17, 19, 16, 17, 15] },
  { e: 8, notes: [14, 13, 15, 16, 14, 12] },
  { e: 10, notes: [19, 18, 20, 17, 18, 16] },
  { e: 13, notes: [16, 15, 17, 14, 16, 13] },
];

async function seed() {
  await sequelize.sync({ force: true });

  const hashedPassword = await bcrypt.hash("testpass123", 10);
  await User.create({ username: "testuser", password: hashedPassword });

  // ---- Annees ----
  await Annee.bulkCreate([
    { id_annee: 1, libelle: "2023-2024" },
    { id_annee: 2, libelle: "2024-2025" },
    { id_annee: 3, libelle: "2025-2026" },
    { id_annee: 4, libelle: "2026-2027" },
    { id_annee: 5, libelle: "2027-2028" },
  ]);

  // ---- Niveaux ----
  await Niveau.bulkCreate([
    { id_niveau: 1, titre_niveau: "L3", descri_niveau: "Licence 3", domaine: "Informatique", mention: "Sciences", parcours: "Génie Logiciel" },
    { id_niveau: 2, titre_niveau: "M1", descri_niveau: "Master 1", domaine: "Informatique", mention: "Sciences", parcours: "Génie Logiciel" },
  ]);

  // ---- UEs L3: 6 UEs = 60 credits ----
  await Ue.bulkCreate([
    { id_ue: 1, nom_ue: "Programmation", credit_ue: 9 },
    { id_ue: 2, nom_ue: "Mathématiques", credit_ue: 12 },
    { id_ue: 3, nom_ue: "Communication", credit_ue: 9 },
    { id_ue: 4, nom_ue: "Réseaux", credit_ue: 10 },
    { id_ue: 5, nom_ue: "Base de données", credit_ue: 10 },
    { id_ue: 6, nom_ue: "Projet et Stage", credit_ue: 10 },
    // UEs M1
    { id_ue: 7, nom_ue: "Algorithmique avancée", credit_ue: 10 },
    { id_ue: 8, nom_ue: "Intelligence artificielle", credit_ue: 10 },
    { id_ue: 9, nom_ue: "Systèmes distribués", credit_ue: 10 },
  ]);

  // ---- ECs ----
  await Ec.bulkCreate([
    // S5 - UE1 Programmation (3 ECs)
    { id_ec: 1, nom_ec: "Algorithmique", semestre: "Impaire", et: 0.4, ed: 0.3, ep: 0.3, credit_ec: 5, poids_ec: 0.30, id_ue: 1 },
    { id_ec: 2, nom_ec: "Langage C", semestre: "Impaire", et: 0.4, ed: 0.3, ep: 0.3, credit_ec: 5, poids_ec: 0.40, id_ue: 1 },
    { id_ec: 3, nom_ec: "Structures de données", semestre: "Impaire", et: 0.4, ed: 0.3, ep: 0.3, credit_ec: 5, poids_ec: 0.30, id_ue: 1 },
    // S5 - UE2 Mathématiques (2 ECs)
    { id_ec: 4, nom_ec: "Analyse", semestre: "Impaire", et: 0.4, ed: 0.3, ep: 0.3, credit_ec: 6, poids_ec: 0.60, id_ue: 2 },
    { id_ec: 5, nom_ec: "Algèbre", semestre: "Impaire", et: 0.4, ed: 0.3, ep: 0.3, credit_ec: 6, poids_ec: 0.40, id_ue: 2 },
    // S5 - UE3 Communication (2 ECs)
    { id_ec: 6, nom_ec: "Français", semestre: "Impaire", et: 0.4, ed: 0.3, ep: 0.3, credit_ec: 5, poids_ec: 0.50, id_ue: 3 },
    { id_ec: 7, nom_ec: "Anglais", semestre: "Impaire", et: 0.4, ed: 0.3, ep: 0.3, credit_ec: 5, poids_ec: 0.50, id_ue: 3 },
    // S6 - UE4 Réseaux (3 ECs)
    { id_ec: 8, nom_ec: "TCP/IP", semestre: "Paire", et: 0.4, ed: 0.3, ep: 0.3, credit_ec: 4, poids_ec: 0.40, id_ue: 4 },
    { id_ec: 9, nom_ec: "Routage", semestre: "Paire", et: 0.4, ed: 0.3, ep: 0.3, credit_ec: 3, poids_ec: 0.30, id_ue: 4 },
    { id_ec: 10, nom_ec: "Sécurité", semestre: "Paire", et: 0.4, ed: 0.3, ep: 0.3, credit_ec: 3, poids_ec: 0.30, id_ue: 4 },
    // S6 - UE5 Base de données (2 ECs)
    { id_ec: 11, nom_ec: "SQL", semestre: "Paire", et: 0.4, ed: 0.3, ep: 0.3, credit_ec: 5, poids_ec: 0.50, id_ue: 5 },
    { id_ec: 12, nom_ec: "NoSQL", semestre: "Paire", et: 0.4, ed: 0.3, ep: 0.3, credit_ec: 5, poids_ec: 0.50, id_ue: 5 },
    // S6 - UE6 Projet et Stage (2 ECs)
    { id_ec: 13, nom_ec: "Gestion de projet", semestre: "Paire", et: 0.4, ed: 0.3, ep: 0.3, credit_ec: 5, poids_ec: 0.50, id_ue: 6 },
    { id_ec: 14, nom_ec: "Méthodologie", semestre: "Paire", et: 0.4, ed: 0.3, ep: 0.3, credit_ec: 5, poids_ec: 0.50, id_ue: 6 },
    // M1 S7 - UE7 Algorithmique avancée (2 ECs)
    { id_ec: 15, nom_ec: "Complexité", semestre: "Impaire", et: 0.4, ed: 0.3, ep: 0.3, credit_ec: 5, poids_ec: 0.50, id_ue: 7 },
    { id_ec: 16, nom_ec: "Optimisation", semestre: "Impaire", et: 0.4, ed: 0.3, ep: 0.3, credit_ec: 5, poids_ec: 0.50, id_ue: 7 },
    // M1 S7 - UE8 Intelligence artificielle (2 ECs)
    { id_ec: 17, nom_ec: "Machine Learning", semestre: "Impaire", et: 0.4, ed: 0.3, ep: 0.3, credit_ec: 5, poids_ec: 0.60, id_ue: 8 },
    { id_ec: 18, nom_ec: "Deep Learning", semestre: "Impaire", et: 0.4, ed: 0.3, ep: 0.3, credit_ec: 5, poids_ec: 0.40, id_ue: 8 },
    // M1 S7 - UE9 Systèmes distribués (2 ECs)
    { id_ec: 19, nom_ec: "Cloud Computing", semestre: "Impaire", et: 0.4, ed: 0.3, ep: 0.3, credit_ec: 5, poids_ec: 0.50, id_ue: 9 },
    { id_ec: 20, nom_ec: "Architectures microservices", semestre: "Impaire", et: 0.4, ed: 0.3, ep: 0.3, credit_ec: 5, poids_ec: 0.50, id_ue: 9 },
  ]);

  // ---- Etudiants (15) ----
  await Etudiant.bulkCreate([
    { id_etudiant: 1,  matricule: "ET001", nom: "Dupont", prenom: "Jean", date_naiss: "2000-01-15", lieu_naiss: "Antananarivo" },
    { id_etudiant: 2,  matricule: "ET002", nom: "Rabe", prenom: "Marie", date_naiss: "2001-03-20", lieu_naiss: "Fianarantsoa" },
    { id_etudiant: 3,  matricule: "ET003", nom: "Rakoto", prenom: "Paul", date_naiss: "1999-07-10", lieu_naiss: "Toamasina" },
    { id_etudiant: 4,  matricule: "ET004", nom: "Ravao", prenom: "Lala", date_naiss: "2002-11-05", lieu_naiss: "Mahajanga" },
    { id_etudiant: 5,  matricule: "ET005", nom: "Andria", prenom: "Michel", date_naiss: "2000-09-22", lieu_naiss: "Toliara" },
    { id_etudiant: 6,  matricule: "ET006", nom: "Randria", prenom: "Solofo", date_naiss: "2001-06-14", lieu_naiss: "Antsiranana" },
    { id_etudiant: 7,  matricule: "ET007", nom: "Raharimanana", prenom: "Haja", date_naiss: "2000-12-01", lieu_naiss: "Antananarivo" },
    { id_etudiant: 8,  matricule: "ET008", nom: "Razafy", prenom: "Tiana", date_naiss: "2002-04-18", lieu_naiss: "Fianarantsoa" },
    { id_etudiant: 9,  matricule: "ET009", nom: "Rasoa", prenom: "Miora", date_naiss: "2001-08-25", lieu_naiss: "Toamasina" },
    { id_etudiant: 10, matricule: "ET010", nom: "Randrianarisoa", prenom: "Fiderana", date_naiss: "2000-02-28", lieu_naiss: "Antananarivo" },
    { id_etudiant: 11, matricule: "ET011", nom: "Rajaonary", prenom: "Herizo", date_naiss: "2001-11-12", lieu_naiss: "Mahajanga" },
    { id_etudiant: 12, matricule: "ET012", nom: "Rakotondrabe", prenom: "Mamy", date_naiss: "1999-05-30", lieu_naiss: "Antsiranana" },
    { id_etudiant: 13, matricule: "ET013", nom: "Rabemananjara", prenom: "Clément", date_naiss: "2000-10-08", lieu_naiss: "Toliara" },
    { id_etudiant: 14, matricule: "ET014", nom: "Randrianantenaina", prenom: "Mihaja", date_naiss: "2002-07-16", lieu_naiss: "Antananarivo" },
    { id_etudiant: 15, matricule: "ET015", nom: "Ramanantenasoa", prenom: "Nambinina", date_naiss: "2001-01-22", lieu_naiss: "Fianarantsoa" },
  ]);

  // ---- Notes L3 Annee 1 (ECs 1-7) ----
  const notesL3A1 = [];
  for (const s of NOTES_L3_ANNEE1) {
    for (let ec = 1; ec <= 7; ec++) {
      notesL3A1.push({
        valeur: s.notes[ec - 1],
        id_etudiant: s.e,
        id_niveau: 1,
        id_ec: ec,
        id_annee: 1,
        date: new Date("2024-01-15"),
      });
    }
  }
  await Note.bulkCreate(notesL3A1);

  // ---- Notes L3 Annee 2 (ECs 1-7) - recours/amelioration ----
  const notesL3A2 = [];
  for (const s of NOTES_L3_ANNEE2) {
    for (let ec = 1; ec <= 7; ec++) {
      notesL3A2.push({
        valeur: s.notes[ec - 1],
        id_etudiant: s.e,
        id_niveau: 1,
        id_ec: ec,
        id_annee: 2,
        date: new Date("2025-01-15"),
      });
    }
  }
  await Note.bulkCreate(notesL3A2);

  // ---- Notes M1 Annee 1 (ECs 15-20) ----
  const notesM1A1 = [];
  for (const s of NOTES_M1_ANNEE1) {
    for (let ec = 15; ec <= 20; ec++) {
      const idx = ec - 15;
      notesM1A1.push({
        valeur: s.notes[idx],
        id_etudiant: s.e,
        id_niveau: 2,
        id_ec: ec,
        id_annee: 1,
        date: new Date("2024-09-15"),
      });
    }
  }
  await Note.bulkCreate(notesM1A1);

  // Stats
  const totalNotes = await Note.count();
  const totalEtudiants = await Etudiant.count();
  const totalUes = await Ue.count();
  const totalEcs = await Ec.count();

  console.log("========================================");
  console.log("  SEED COMPLETED SUCCESSFULLY");
  console.log("========================================");
  console.log("");
  console.log("  Utilisateur:");
  console.log("    username: testuser");
  console.log("    password: testpass123");
  console.log("");
  console.log("  Données insérées:");
  console.log(`    ${totalEtudiants} étudiants`);
  console.log(`    ${totalUes} UE`);
  console.log(`    ${totalEcs} EC`);
  console.log(`    ${totalNotes} notes`);
  console.log("");
  console.log("  Niveaux:");
  console.log("    L3 (Licence 3) - Génie Logiciel");
  console.log("    M1 (Master 1) - Génie Logiciel");
  console.log("");
  console.log("  UEs L3:");
  console.log("    Programmation (9cr) - Mathématiques (12cr) - Communication (9cr)");
  console.log("    Réseaux (10cr) - Base de données (10cr) - Projet et Stage (10cr)");
  console.log("");
  console.log("  UEs M1:");
  console.log("    Algorithmique avancée (10cr) - IA (10cr) - Systèmes distribués (10cr)");
  console.log("");
  console.log("  Cas de test:");
  console.log("    ET001 Dupont Jean     -> 18cr Année1, 30cr Année2");
  console.log("    ET002 Rabe Marie      -> 9cr Année1 (note elim 4/20 en Langage C)");
  console.log("    ET003 Rakoto Paul     -> 0cr Année1 (EXCLUS)");
  console.log("    ET004 Ravao Lala      -> 21cr Année1, 30cr Année2");
  console.log("    ET005 Andria Michel   -> 30cr Année1 TB, M1 Année1");
  console.log("    ET008 Razafy Tiana    -> 30cr Année1 B, Année2, M1 Année1");
  console.log("    ET010 Randrianarisoa  -> 30cr Année1 TB, M1 Année1");
  console.log("    ET011 Rajaonary Herizo-> 0cr Année1");
  console.log("========================================");

  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
