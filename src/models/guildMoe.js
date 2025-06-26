const sequelize = require('../database/connection');
const { DataTypes } = require('sequelize');

const guildMoe = sequelize.define('guildMoe', {
    guildId: DataTypes.STRING,
    channelId: DataTypes.STRING,
});

module.exports = guildMoe;
