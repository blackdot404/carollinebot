const sequelize = require('../database/connection');
const { DataTypes } = require('sequelize');

const userGuildLevel = sequelize.define('userGuildLevel', {
    guildId: { type: DataTypes.STRING, allowNull: false },
    channelId: { type: DataTypes.STRING, allowNull: false },
    useEmbed: { type: DataTypes.BOOLEAN, defaultValue: false },
});

module.exports = userGuildLevel;
