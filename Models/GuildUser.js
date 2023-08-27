const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const GuildUser = sequelize.define('GuildUser', {
    Guild: DataTypes.STRING,
    Channel: DataTypes.STRING,
    RoleChannel: DataTypes.STRING,
    Msg: DataTypes.STRING,
    Role: DataTypes.STRING,
});

module.exports = GuildUser;
