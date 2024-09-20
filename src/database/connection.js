require('dotenv').config();

const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');

/**
 * Por utilizar o Aiven como host de banco de dados
 * temos a necessidade de importar o certificado.
 */

const caPath = path.resolve(__dirname, './ca.pem');
const caCert = fs.readFileSync(caPath, 'utf8');

const sequelize = new Sequelize(
    process.env.AIVEN_DB,
    process.env.AIVEN_USER,
    process.env.AIVEN_PWD,
    {
        host: process.env.AIVEN_HOST,
        port: process.env.AIVEN_PORT,
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                rejectUnauthorized: false,
                ca: caCert.toString(),
            },
        },
        logging: false,
    },
);
module.exports = sequelize;
