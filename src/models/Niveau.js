const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Niveau = sequelize.define("niveau", {
  id_niveau: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  titre_niveau: {
    type: DataTypes.STRING,
  },
  descri_niveau: {
    type: DataTypes.STRING,
  },
  domaine: {
    type: DataTypes.STRING,
  },
  mention: {
    type: DataTypes.STRING,
  },
  parcours: {
    type: DataTypes.STRING,
  },
}, {
  tableName: "niveau",
  timestamps: false,
});

module.exports = Niveau;
