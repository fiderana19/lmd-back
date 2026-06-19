const User = require("./User");
const Ue = require("./Ue");
const Ec = require("./Ec");
const Note = require("./Note");
const Etudiant = require("./Etudiant");
const Niveau = require("./Niveau");
const Annee = require("./Annee");

Ue.hasMany(Ec, { foreignKey: "id_ue" });
Ec.belongsTo(Ue, { foreignKey: "id_ue" });

Ec.hasMany(Note, { foreignKey: "id_ec" });
Note.belongsTo(Ec, { foreignKey: "id_ec" });

Etudiant.hasMany(Note, { foreignKey: "id_etudiant" });
Note.belongsTo(Etudiant, { foreignKey: "id_etudiant" });

Niveau.hasMany(Note, { foreignKey: "id_niveau" });
Note.belongsTo(Niveau, { foreignKey: "id_niveau" });

Annee.hasMany(Note, { foreignKey: "id_annee" });
Note.belongsTo(Annee, { foreignKey: "id_annee" });

module.exports = { User, Ue, Ec, Note, Etudiant, Niveau, Annee };
