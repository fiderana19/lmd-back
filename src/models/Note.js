const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Note = sequelize.define("note", {
  id_note: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  valeur: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  id_etudiant: {
    type: DataTypes.INTEGER,
  },
  id_niveau: {
    type: DataTypes.INTEGER,
  },
  id_ec: {
    type: DataTypes.INTEGER,
  },
  id_annee: {
    type: DataTypes.INTEGER,
  },
  date: {
    type: DataTypes.DATE,
  },
}, {
  tableName: "note",
  timestamps: false,
});

module.exports = Note;
