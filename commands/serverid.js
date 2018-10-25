const Discord = require("discord.js")

module.exports.run = async (bot, message, args) => {
    message.reply(`Server id: ${message.guild.id}`)
}

module.exports.help = {
    name:"serverid"
}