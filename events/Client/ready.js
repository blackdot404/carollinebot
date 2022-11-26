require("dotenv").config();
const { Client } = require("discord.js");
const mongoose = require("mongoose");
const { USER_DB, PASS_DB } = process.env;

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        await mongoose.connect(
            `mongodb+srv://${USER_DB}:${PASS_DB}@cronus.dfu2wp6.mongodb.net/?retryWrites=true&w=majority` ||
                "",
            {
                keepAlive: true,
            }
        );
        if (mongoose.connect) {
            console.log("Connection to NoSQL database was successful.");
        }

        console.log(`${client.user.username} is now online.`);
    },
};
