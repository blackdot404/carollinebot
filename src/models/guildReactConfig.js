const sequelize = require('../database/connection');
const { DataTypes } = require('sequelize');

const guildReactConfig = sequelize.define('guildReactConfig', {
    guildId: DataTypes.STRING,
    channelId: DataTypes.STRING,
});

module.exports = guildReactConfig;
