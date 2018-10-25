const Discord = require("discord.js")

module.exports.run = async (bot, message, args) => {
    if(cmd === `${prefix}serverinfo`){

        let sicon = message.guild.displayAvatarURL;
        let serEmbed = new Discord.RichEmbed()
        .setDescription("Server Information")
        .setColor("#3390f")
        .setThumbnail(sicon)
        .addField("Server Name", message.guild.name)
        .addField("Created On", message.guild.createdAt)
        .addField("You joined", message.member.joinedAt)
        .addField("Total Members", message.guild.memberCount)
        
        
        return message.channel.send(serEmbed);
      }
}

module.exports.help = {
    name:"serverinfo"
}