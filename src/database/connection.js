require('dotenv').config();

const Sequelize = require('sequelize');
const fs = require('fs');

const sequelize = new Sequelize(
    process.env.AIVEN_DB,
    process.env.AIVEN_USER,
    process.env.AIVEN_PWD,
    {
        host: process.env.AIVEN_HOST,
        port: process.env.AIVEN_PORT,
        dialect: 'postgres',
        logging: true,
    },
);
module.exports = sequelize;
