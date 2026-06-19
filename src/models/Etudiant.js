const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Etudiant = sequelize.define("etudiant", {
  id_etudiant: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  matricule: {
    type: DataTypes.STRING,
  },
  nom: {
    type: DataTypes.STRING,
  },
  prenom: {
    type: DataTypes.STRING,
  },
  date_naiss: {
    type: DataTypes.DATEONLY,
  },
  lieu_naiss: {
    type: DataTypes.STRING,
  },
}, {
  tableName: "etudiant",
  timestamps: false,
});

module.exports = Etudiant;
