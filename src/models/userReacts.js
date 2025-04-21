const sequelize = require('../database/connection');
const { DataTypes } = require('sequelize');

const userReacts = sequelize.define('userReacts', {
    idEmoji: DataTypes.STRING,
    strName: DataTypes.STRING,
    idRole: DataTypes.STRING,
    strRole: DataTypes.STRING,
    idGroup: DataTypes.INTEGER,
    idGuild: DataTypes.STRING,
});

module.exports = userReacts;
