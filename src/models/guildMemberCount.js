const sequelize = require('../database/connection');
const { DataTypes } = require('sequelize');

const guildMemberCount = sequelize.define('guildMemberCount', {
    guildId: DataTypes.STRING,
    channelId: DataTypes.STRING,
});

module.exports = guildMemberCount;
