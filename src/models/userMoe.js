const sequelize = require('../database/connection');
const { DataTypes } = require('sequelize');

const userMoe = sequelize.define('userMoe', {
    guildId: DataTypes.STRING,
    userId: DataTypes.STRING,
    moeIds: DataTypes.ARRAY(DataTypes.INTEGER),
});

module.exports = userMoe;
