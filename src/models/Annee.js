const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Annee = sequelize.define("annee", {
  id_annee: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
}, {
  tableName: "annee",
  timestamps: false,
});

module.exports = Annee;
