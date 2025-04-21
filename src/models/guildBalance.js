const sequelize = require('../database/connection');
const { DataTypes } = require('sequelize');

const guildBalance = sequelize.define('guildBalance', {
    userId: DataTypes.STRING,
    guildId: DataTypes.STRING,
    balance: { type: DataTypes.NUMBER, defaultValue: 0 },
});

module.exports = guildBalance;
