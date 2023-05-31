require('dotenv').config();
// const { Client } = require('discord.js');
const mongoose = require('mongoose');
const { DB_CONNECTION } = process.env;

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        await mongoose.connect(`${DB_CONNECTION}` || '', {
            keepAlive: true,
        });
        if (mongoose.connect) {
            console.log('Connection to MongoDB database was successful.');
        }

        console.log(`${client.user.username} is now online.`);
    },
};
