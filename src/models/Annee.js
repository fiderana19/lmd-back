const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Annee = sequelize.define("annee", {
  id_annee: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  libelle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: "annee",
  timestamps: false,
});

module.exports = Annee;
