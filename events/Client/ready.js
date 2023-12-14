require('dotenv').config();
const sequelize = require('../../config/database');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        sequelize
            .sync()
            .then(() => console.log('Connection to database was successful.'));
        console.log(`${client.user.tag} is now online.`);
    },
};
