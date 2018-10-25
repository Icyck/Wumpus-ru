const Discord = require("discord.js")
const errors = require("../utils/errors")

module.exports.run = async (bot, message, args) => {
    
    message.delete();
    if(args[0] == "help"){
      message.reply("Usage: !report <user> <reason>");
      return;
    }
        let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!rUser) return message.channel.send("Couldn't find user.");
        let reason = args.join(" ").slice(22);
      
        let reportEmbed = new Discord.RichEmbed()
          .setDescription("Reports")
          .setColor("#15f152")
          .addField("Reported User", `${rUser} with ID: ${rUser.id}`)
          .addField("Reported By", `${message.author} with ID: ${message.author.id}`)
          .addField("Channel", message.channel)
          .addField("Time", message.createdAt)
          .addField("Reason", reason);
      
          let reportschannel = message.guild.channels.find(`name`, "reports");
          if(!reportschannel) return message.channel.send("Couldn't find reports channel.");
      
          reportschannel.send(reportEmbed);
      
}

module.exports.help = {
    name:"report"
}