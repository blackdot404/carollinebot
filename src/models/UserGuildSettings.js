const sequelize = require('../database/connection');
const { DataTypes } = require('sequelize');

const UserGuildSettings = sequelize.define('UserGuildSettings', {
    Guild: DataTypes.STRING,
    LogChannel: DataTypes.STRING,
});

module.exports = UserGuildSettings;
