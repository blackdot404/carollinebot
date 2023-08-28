const Sequelize = require('sequelize');
const sequelize = new Sequelize('bot-db', 'user', 'pwd', {
    dialect: 'sqlite',
    host: './dev.sqlite',
    logging: false,
});

module.exports = sequelize;
