const Discord = require("discord.js")

module.exports.run = async (bot, message, args) => {
    if(!args[2]) return message.reply("Please ask a full question!");
    let replies = ["Yes.", "No.","Maybe.", " I don't know.", "Ask later."];
    let result = Math.floor((Math.random() * replies.length));
    let question = args.slice(1).join(" ");


    let ballEmbed = new Discord.RichEmbed()
    .setAuthor(message.author.tag)
    .setColor(random.Color)
    .addField("Question", question)
    .addField("Answer", replies[result]);

    message.channel.send(ballEmbed);
};

module.exports.help = {
    name:"8ball"
};