const sequelize = require('../database/connection');
const { DataTypes } = require('sequelize');

const userPokedex = sequelize.define('userPokedex', {
    guildId: DataTypes.STRING,
    userId: DataTypes.STRING,
    pokemonsIds: DataTypes.ARRAY(DataTypes.INTEGER),
});

module.exports = userPokedex;
