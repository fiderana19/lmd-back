const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Ue = sequelize.define("ue", {
  id_ue: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  nom_ue: {
    type: DataTypes.STRING,
  },
  credit_ue: {
    type: DataTypes.INTEGER,
  },
}, {
  tableName: "ue",
  timestamps: false,
});

module.exports = Ue;
