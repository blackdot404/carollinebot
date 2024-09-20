const sequelize = require('../database/connection');
const { DataTypes } = require('sequelize');

const UserGuild = sequelize.define('UserGuild', {
    Guild: DataTypes.STRING,
    Channel: DataTypes.STRING,
    RoleChannel: DataTypes.STRING,
    ClassChannel: DataTypes.STRING,
    Msg: DataTypes.STRING,
    Role: DataTypes.STRING,
});

module.exports = UserGuild;
