const Discord = require("discord.js")

module.exports.run = async (bot, message, args) => {
    if(cmd === `${prefix}botinfo`){

        let bicon = bot.user.avatarURL;
        let botEmbed = new Discord.RichEmbed()
        .setDescription("Bot Information")
        .setColor('RANDOM')
        .setThumbnail(bicon)
        .addField("Bot Name", bot.user.username)
        .addField("Created At", bot.user.createdAt);
    
        return message.channel.send(botEmbed);
        
        
      }
}

module.exports.help = {
    name:"serverinfo"
}