const sequelize = require('../database/connection');
const { DataTypes } = require('sequelize');

const UserReacts = sequelize.define('UserReacts', {
    idEmoji: DataTypes.STRING,
    strName: DataTypes.STRING,
    idRole: DataTypes.STRING,
    strRole: DataTypes.STRING,
    idGroup: DataTypes.INTEGER,
    idGuild: DataTypes.STRING,
});

module.exports = UserReacts;
