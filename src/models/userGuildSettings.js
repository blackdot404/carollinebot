const sequelize = require('../database/connection');
const { DataTypes } = require('sequelize');

const userGuildSettings = sequelize.define('userGuildSettings', {
    Guild: DataTypes.STRING,
    LogChannel: DataTypes.STRING,
});

module.exports = userGuildSettings;
