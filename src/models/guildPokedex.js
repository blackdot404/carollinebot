const sequelize = require('../database/connection');
const { DataTypes } = require('sequelize');

const guildPokedex = sequelize.define('guildPokedex', {
    guildId: DataTypes.STRING,
    channelId: DataTypes.STRING,
});

module.exports = guildPokedex;
