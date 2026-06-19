const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Ec = sequelize.define("ec", {
  id_ec: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  nom_ec: {
    type: DataTypes.STRING,
  },
  semestre: {
    type: DataTypes.STRING,
  },
  et: {
    type: DataTypes.FLOAT,
  },
  ed: {
    type: DataTypes.FLOAT,
  },
  ep: {
    type: DataTypes.FLOAT,
  },
  credit_ec: {
    type: DataTypes.INTEGER,
  },
  poids_ec: {
    type: DataTypes.FLOAT,
  },
  id_ue: {
    type: DataTypes.INTEGER,
  },
}, {
  tableName: "ec",
  timestamps: false,
});

module.exports = Ec;
