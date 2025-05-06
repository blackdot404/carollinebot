const sequelize = require('../database/connection');
const { DataTypes } = require('sequelize');

const userGuild = sequelize.define('userGuild', {
    Guild: DataTypes.STRING,
    Channel: DataTypes.STRING,
    RoleChannel: DataTypes.STRING,
    Msg: DataTypes.STRING,
    Role: DataTypes.STRING,
});

module.exports = userGuild;
