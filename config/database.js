require('dotenv').config();

const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    process.env.NAMEDB,
    process.env.USERDB,
    process.env.PASSDB,
    {
        host: process.env.HOSTDB,
        dialect: 'mysql',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
        logging: false,
    }
);

module.exports = sequelize;
