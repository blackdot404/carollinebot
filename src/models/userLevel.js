const sequelize = require('../database/connection');
const { DataTypes } = require('sequelize');

const userLevel = sequelize.define('userLevel', {
    guildId: { type: DataTypes.STRING, allowNull: false },
    userId: { type: DataTypes.STRING, allowNull: false },
    userXp: { type: DataTypes.INTEGER, defaultValue: 0 },
    userLevel: { type: DataTypes.INTEGER, defaultValue: 1 },
});

module.exports = userLevel;
