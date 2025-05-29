const sequelize = require('../database/connection');
const { DataTypes } = require('sequelize');

const guildMemberCount = sequelize.define('guildMemberCount', {
    guildId: { type: DataTypes.STRING, allowNull: false, unique: true },
    channelId: DataTypes.STRING,
});

module.exports = guildMemberCount;
