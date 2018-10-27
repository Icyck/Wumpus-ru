const botconfig = require("./botconfig.json");
const token = process.env.token;
const Discord = require("discord.js");
const errors = require("./utils/errors.js")

const fs = require("fs");
const ms = require("ms");

   
const bot = new Discord.Client({disableEveryone: true});
bot.commands = new Discord.Collection();
let coins = require('./coins.json');
let warns = JSON.parse(fs.readFileSync("./warnings.json", "utf8"));








fs.readdir("./commands/", (err, files) => {

  if(err) console.log(err)
  let jsfile = files.filter(f => f.split(".").pop() === "js")
  if(jsfile.lenght <= 0){
    console.log("Couldn't find command!")
    return;
  }

  jsfile.forEach((f, i) =>{
    let props = require(`./commands/${f}`);
    console.log(`${f} loaded!😀`);
    bot.commands.set(props.help.name, props);
  });
});





/*bot.on("ready", async () => {
  console.log(`${bot.user.username} loged at ${bot.guilds.size} servers!`);
  bot.user.setActivity("with Wumpus || h", {type:"WATCHING"});

});*/
bot.on("ready", () => {
   console.log("Wumpus online!")
  bot.user.setPresence({
      game: { 
          name: 'Wumpus || h',
          type: 'WATCHING'
      },
      status: "dnd"
  })
});

  bot.on("guildMemberAdd", async member => {
    console.log(`${member.id} joined the server.`);

    let welcomechannel = member.guild.channels.find(`name`, "welcome_leave");
    welcomechannel.send(`Смотрите все ${member} присоединился к вечеринке`);

  });
  bot.on("guildMemberRemove", async member => {
    console.log(`${member.user.username} left the server.`);

    let welcomechannel = member.guild.channels.find(`name`, "welcome_leave");
    welcomechannel.send(`Удачи!  ${member} вышел из сервера`);

  });
  bot.on("channelCreate", async channel => {
    console.log(`${channel.name} has been created.`);

    let sChannel = channel.guild.channels.find(`name`, "wumpuslog");
    let ccEmbed = new Discord.RichEmbed()
    .setDescription("Create Channel")
    .setColor('RANDOM')
    .addField(`${channel.name} был создан!`, channel.createdAt);

    sChannel.send(ccEmbed);
  });

  bot.on("channelDelete", async channel => {
    console.log(`${channel.name} has been created.`);

    let sChannel = channel.guild.channels.find(`name`, "wumpuslog");
    let delEmbed = new Discord.RichEmbed()
    .setDescription("Delete Channel")
    .setColor('RANDOM')
    .addField(`${channel.name} Удалили!`, "*End Embed*");

    sChannel.send(delEmbed);
  });


bot.on("message", async message => {
  if(message.author.bot) return;
  if(message.channel.type === "dm") return;


  let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"));
  if(!prefixes[message.guild.id]){
    prefixes[message.guild.id] = {
      prefixes: botconfig.prefix
    };
  }



  let prefix  = prefixes[message.guild.id].prefixes;
  //let prefix = botconfig.prefix
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0]
  let args = messageArray.slice(1);

   let commandfile = bot.commands.get(cmd.slice(prefix.lenght));
   if (commandfile) commandfile.run(bot,message,args);




  if(!coins[message.author.id]){
    coins [message.author.id] = {
      coins: 0
    };
  }

  


  

  if(cmd === `${prefix}`){
  let coinAmt = Math.floor(Math.random() * 1)+ 15;
  let baseAmt = Math.floor(Math.random() * 1)+ 15;
  console.log(`${coinAmt} ; ${baseAmt}`);

if(coinAmt === baseAmt ){
  coins[message.author.id] = {
    coins: coins[message.author.id].coins + coinAmt
  };
  fs.writeFile("./coins.json", JSON.stringify(coins), (err) => {
    if(err) console.log(err)
  });
  let coinEmbed = new Discord.RichEmbed()
  .setDescription("MONEY")
  .setAuthor(message.author.username)
  .setColor('RANDOM')
  .addField("💰", `${coinAmt} монеток добавленно`);

  message.channel.send(coinEmbed).then(msg => {msg.delete(5000)});
}

  }


  if(cmd === `${prefix}coins`){
    if(!coins[message.author.id]){
      coins [message.author.id] = {
        coins: 0
      };
    }
    let uCoins = coins[message.author.id].coins;
  
    let coinEmbed = new Discord.RichEmbed()
    .setAuthor(message.author.username)
    .setColor("#00000F")
    .addField("💰", uCoins);
  
    message.channel.send(coinEmbed).then(msg => {msg.delete(5000)});
  };
  


if(cmd === `${prefix}scount`){
  message.reply(`${bot.user.username} находится на ${bot.guilds.size} серверах!`)
}

  if(cmd === `${prefix}support`){
    message.reply("https://discord.gg/AtCPWM9")
  }


if(cmd === `invite`){
   message.reply("https://discordapp.com/oauth2/authorize?client_id=505018380839944192&scope=bot&permissions=2146958847");
 
  try {
    let link = await bot.generateInvite(["ADMINISTRATOR"]);
    console.log(link);
  } catch(e) {
    console.log(e.stack);
  }
}










if(cmd === `${prefix}setrole`){
 

  if(!message.member.hasPermission("MANAGE_MEMBERS")) return message.reply("Простиб но ты не можешь это сделать.");
  let pMember = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
  if(!pMember) return message.reply("Не найден пользователь.");
  let role = args.join(" ").slice(22);
  if(!role) return message.reply("Укажите роль!");
  let gRole = message.guild.roles.find(`name`, role)
  if(!gRole) return message.reply("Не найдена роль.");;

  if(pMember.roles.has(gRole.id))("У него уже есть эта роль");
  await(pMember.addRole(gRole.id));

  try{
  await    pMember.send(`Поздравляю <@${pMember.id}> вы получили роль:  ${gRole.name}. `);
  }catch(e){
  message.channel.send(`Поздравляю тебя, <@${pMember.id}> вы получили роль: ${gRole.name}.`);
  }
}

if(cmd === `${prefix}remrole`){

  if(!message.member.hasPermission("MANAGE_MEMBERS")) return message.reply("Ты не можешь это сделать.");
  let iMember = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
  if(!iMember) return message.reply("Не найден пользователь");
  let role = args.join(" ").slice(22);
  if(!role) return message.reply("Укажите роль!");
  let sRole = message.guild.roles.find(`name`, role)
  if(!sRole) return message.reply("Не найдена роль");;

  if(iMember.roles.has(sRole.id));
  await(iMember.removeRole(sRole.id));

  let remEmbed = new Discord.RichEmbed()
  .setTitle("Удаление роли")
  .setColor('RANDOM')
  .addField(`Прости ${iMember.user.username} у тебя убрали ${sRole.name} роль.`, "I don't know...Maybe this error!");

  try{
  await    iMember.send(`Прости <@${iMember.id}> у тебя убрали ${sRole.name} роль.`);
  }catch(e){
  message.channel.send(remEmbed);
  }
}


  if(cmd === `config`){
    let configEmbed = new Discord.RichEmbed()
    .setDescription("Config from Wumpus")
    .setColor('RANDOM')
    .addField("`Для установки приветствия, создайте канал::` 'welcome_leave'","*Wumpus*")
    .addField("`Для установки условного аудита, создайте канал:` 'wumpuslog'", "*Wumpus*")
    .addField("`Для установки комманды **report**, создайте канал:` 'reports' ", "*Wumpus*")
    .addField("`Для установки команды mute, создайте роль:` 'muted'", "*Wumpus*")
    .addField("`Для установки модераторских комманд, создайте канал:` 'incidents'", "*Wumpus*");
    message.channel.send(configEmbed);
  }

   if(cmd === `help`){

    let helpEmbed = new Discord.RichEmbed()
    .setColor('RANDOM')
    .addField("Prefix - Работает", "prefserver")
    .addField("Mod help - Работает", "mod")
    .addField("`Report` - Работает", `${prefix}report`)
  .addField("`Hello` - Работает", `${prefix}hello`)
    .addField("`Server info` - Работает", `${prefix}serverinfo`)
    .addField("`Bot Info` - Работает", `${prefix}botinfo`)
    .addField("`8b` - Работает", `${prefix}8b`)
    .addField("`!say` - Работает", `${prefix}say`)
    .addField("`Docs` - Работает", `${prefix}docs`)
    .addField("`Update` - Работает", `${prefix}update`)
    .addField("`Support` - Работает", `${prefix}support`)
    .addField("        ` Автор`: Famas_4sh", `Поддержка - напишите *${prefix}support*`);

    return message.channel.send(helpEmbed);
  };
   
   if(cmd === `${prefix}docs`){
  message.reply(`Привет дорогой пользователь бота. Это сообщение поможет тебе с Вампусом. Начнем с конфига: Для начала создай 4 канала их название можно узнать через команду - ***config***. Каждый канал отвечает за функцию: например без **welcome_leave** будет ошибка. Дальше мут комманда, создайте роль **mute** и в каждом из каналов настройте права доступа, что пользователь не может отправлять сообщения. Комманда *h* и *help*: всегда под коммандой есть пример как пользоватся. User id: для кое-каких комманд требуется ID пользователя, его можно узнать по комманде "userid", "userinfo", "ufo". Так-же если вы не поняли как пользоваться коммандой, введите **!<Ваша комманда> help**. Пример: **!report help**. Set role и rem role: самые сложные комманды, так-как Вампус реагирует на пробелы, как бык на красный цвет. Если пишет **Не найдена роль**, проверьте колличество пробелов.  Иногда префикс может слетать из-за ошибок, но его легко поменять обратно, проверить его можно по комманде **prefserver**.На этом все, Всем удачи в пользовании ботом. **P.S: там где стоят *!* ставьте свой префикс**  `)
}



   

  if(cmd === `mod`){

    let helpEmbed = new Discord.RichEmbed()
    .setTitle("HELP MOD")
    .setTimestamp()
    .setColor('RANDOM')
    .addField("Config bot  - Работает", "Напишите первой комманду 'config' ")
    .addField("Mute - Работает", `${prefix}mute <@user> <reason>`)
    .addField("Unmute - Работает", `${prefix}unmute <@user>`)
    .addField("Server id - Работает ", `${prefix}serverid`)
    .addField("Report - Работает", `${prefix}report`)
    .addField("User id - Работает", `${prefix}userid <@user>`)
    .addField("Warn - Работает", `${prefix}warn <@user> <Reason>`)
    .addField("Warn level - Работает", `${prefix}warnlevel <@user>`)
    .addField("Kick - Работает", `${prefix}kick`)
    .addField("Ban - Работает", `${prefix}ban <@user>`)
    .addField("Clear - Работает", `${prefix}clear `)
    .addField("Setrole - Работает", `${prefix}setrole <@user> <role>`)
    .addField("Remove role  - Работает", `${prefix}remrole <@User> <role>`)
    .addField("        ` Автор`: Famas_4sh", `Пусто`);

    return message.channel.send(helpEmbed);
  };


  if(cmd === `h`){

    let helpEmbed = new Discord.RichEmbed()
    .setColor('RANDOM')
    .addField("Prefix - Работает", "prefserver")
    .addField("Mod help - Работает", "mod")

  .addField("`Hello` - Работает", `${prefix}hello`)
    .addField("`Server info` - Работает", `${prefix}serverinfo`)
    .addField("`Bot Info` - Работает", `${prefix}botinfo`)
    .addField("`8b` - Работает", `${prefix}8b`)
    .addField("`!say` - Работает", `${prefix}say`)
   .addField("`Docs` - Работает", `${prefix}docs`)
    .addField("`Update` - Работает", `${prefix}update`)
    .addField("`Support` - Работает", `${prefix}support`)
    .addField("        ` Автор`: Famas_4sh", `Поддержка - напишите *${prefix}support*`);

    return message.channel.send(helpEmbed);
  };


  if(cmd === `${prefix}report`){
    message.delete();
    let rUser = message.guild.member(message.mentions.users.first() || msd.guild.members.get(args[0]));
    if(!rUser) return message.channel.send("Couldn't find user.");
    let reason = args.join(" ").slice(22);

    let reportEmbed = new Discord.RichEmbed()
      .setDescription("Репорт")
      .setColor("#15f152")
      .addField("Репорт пользователь", `${rUser} с ID: ${rUser.id}`)
      .addField("Автор репорта", `${message.author} с ID: ${message.author.id}`)
      .addField("Канал", message.channel)
      .setTimestamp()
      .addField("Причина:", reason);

      let reportschannel = message.guild.channels.find(`name`, "reports");
      if(!reportschannel) return message.channel.send("Не найден канал для репортов.");

      reportschannel.send(reportEmbed);
      message.member.send("Ваш отчёт был доставлен, это его вид:", reportEmbed)
  }

if(cmd === `${prefix}prefix`){
  if(!message.member.hasPermission("MANAGE_SERVER")) return message.reply("Нет нет нет...");


     let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"));

     prefixes[message.guild.id] = {
       prefixes: args[0]
     };

     fs.writeFile("./prefixes.json", JSON.stringify(prefixes), (err) => {
       if (err) console.log(err)
     });

     



     message.channel.send(`***Новый префикс был установлен, "prefserver" что-бы посмотреть префикс сейчас, последний префикс: ***: ${prefix}`);
}

if(cmd === `prefserver`){
  message.reply(`Префикс: ${prefix}`)
}
/*if(cmd === `${prefix}testban`){
  message.delete();
  if(!message.member.hasPermission("BAN_MEMBERS")) return errors.noPerms(message, "BAN_MEMBERS");
  if(args[0] == "help"){
    message.reply("Usage: !ban <user> <reason>");
    return;
  }
  let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if(!bUser) return errors.cantfindUser(message.channel);
  if(bUser.id === bot.user.id) return errors.botuser(message);
  let bReason = args.join(" ").slice(22);
  if(!bReason) return errors.noReason(message.channel);
  if(bUser.hasPermission("MANAGE_MESSAGES")) return errors.equalPerms(message, bUser, "MANAGE_MESSAGES");

  let banEmbed = new Discord.RichEmbed()
  .setDescription("~Ban~")
  .setColor("#bc0000")
  .addField("Banned User", `${bUser} with ID ${bUser.id}`)
  .addField("Banned By", `<@${message.author.id}> with ID ${message.author.id}`)
  .addField("Banned In", message.channel)
  .addField("Time", message.createdAt)
  .addField("Reason", bReason);


  let incidentchannel = message.guild.channels.find(`name`, "incidents");
  if(!incidentchannel) return message.channel.send("Can't find incidents channel.");

  message.guild.member(bUser).ban(bReason);
  incidentchannel.send(banEmbed);
}*/

if(cmd === `${prefix}hello`){
  return message.channel.send("Привет");

}







  if(cmd === `${prefix}clear`){
    let logchannel = message.guild.channels.find(`name`, "wumpuslog");
    if(!logchannel) return message.channel.send("Не найден wumpuslog канал.");
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return errors.noPerms(message, "MANAGE_MESSAGES");
    if(!args[0]) return message.channel.send("oof.");
    message.channel.bulkDelete(args[0]).then(() => {
        logchannel.send(`Удалено ${args[0]} сообщений.`).then(msg => message.delete(5000))
    });
  };

  if(cmd === `${prefix}ban`){

   

    let reason = args.slice(1).join(' ')
    let user = message.mentions.users.first();
   
    if(!message.member.hasPermission("BAN_MEMBERS")) return errors.noPerms(message, "BAN_MEMBERS");

    if(reason.length < 1) return message.reply("Укажите причину для бана!");
    if(message.mentions.users.size < 1) return message.reply('Вы должны упомянуть кого-то').catch(console.error);
    let incidentchannel = message.guild.channels.find(`name`, "incidents");
    if(!incidentchannel) return message.channel.send("Не найден incidents канал.");


    if(!message.guild.member(user).bannable) return message.reply("Нет.");
    message.guild.ban(user, 2);

    const banw = new Discord.RichEmbed()
    .setDescription("Function")
    .setColor('RANDOM')
    .setTimestamp()
    .addField("Action", "Бан")
    .addField("Пользователь:", `${user.username}#${message.author.discriminator}`)
    .addField("Модератор", `${message.author.username}#${message.author.discriminator}`);

    message.reply(`Пользователь ${user.username} забанен <:BanHammer:498911349061976074>`)
  user.send(`Вас забанили на сервере ${message.guild.name}, причина: ${reason}`)
    return incidentchannel.send(banw);
    

  };

  if(cmd === `${prefix}kick`){
    

    let reason = args.slice(1).join(' ');
    
    let user = message.mentions.users.first();
  
    if(!message.member.hasPermission("KICK_MEMBERS")) return errors.noPerms(message, "KICK_MEMBERS");
    
    let incidentchannel = message.guild.channels.find(`name`, "incidents");
    if(!incidentchannel) return message.channel.send("Не найден incidents канал.");
    if (reason.length < 1) return message.reply('Укажите причину.');
    if (message.mentions.users.size < 1) return message.reply('Вы должны упомянуть кого-то').catch(console.error);
  
    if (!message.guild.member(user).kickable) return message.reply('Я не могу кикнуть его');
    message.guild.member(user).kick();
  
    const embed = new Discord.RichEmbed()
      .setColor(0x00AE86)
      .setTimestamp()
      .addField('Action:', 'Кик')
      .addField('Пользователь', `${user.username}#${user.discriminator} (${user.id})`)
      .addField('Модератор:', `${message.author.username}#${message.author.discriminator}`)
      .addField('Причина', reason);

      user.send(`Вас кикнули с ${message.guild.name}, причина : ${reason}`)
      const msg = await message.channel.send("Kick function");
      msg.edit(`***Я изгнал пользователя! Id: ${user.id}***`);
 
    return bot.channels.get(incidentchannel.id).sendEmbed(embed);
    
  };

  /*if(cmd === `${prefix}createrole`){
    
    let pMember = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]) ;
    if(!pMember) return message.reply("Couldn't find rhat user, yo.");
    
    let gRole = message.guild.roles.find(`name`, "DJ")
    await(pMember.addRole(gRole.id));
    if(!gRole) return message.reply("Couldn't find that role.");;

    

    try{
    await    pMember.send(`Congrats to <@${pMember.id}> have been given the role ${gRole.name}. We tried to DM them, but their DMs are locked!`);
    }catch(e){
    message.channel.send(`Congrats to <@${pMember.id}> have been given the role ${gRole.name}.`);
    }
  }*/

  if(cmd === `${prefix}unban`){
    let reason = args.slice(1).join(' ')
    let user = args[0];
    if(reason.length < 1) return message.reply("Укажите причину unban!");
    if(!user) return message.reply('Укажите id пользователя!').catch(console.error);
    message.guild.unban(user);
    let incidentchannel = message.guild.channels.find(`name`, "incidents");
    if(!incidentchannel) return message.channel.send("Не найден incidents канал");


    const unban = new Discord.RichEmbed()
    .setColor('RANDOM')
    .setTimestamp()
    .addField("Action", "Unban")
    .addField("Пользователь:", `${user.username}#${message.author.discriminator}`)
    .addField("Модератор", `${message.author.username}#${message.author.discriminator}`);

    message.reply(`С пользователя сняли бан!`);
    user.send(`Вас разбанили на сервере ${message.guild.name}, Причина: ${reason}`);
    return incidentchannel.send(unban);

  };
  

if(cmd === `${prefix}avatar`){
  let user = message.mentions.users.first() || message.author;

  const avatar = new Discord.RichEmbed()
  .setImage(user.displayAvatarURL)
  .setAuthor(user.username);

  message.channel.send(avatar);
}





  if(cmd === `${prefix}lockdown`){
    if(!message.member.hasPermission("MANAGE_GUILD")) return errors.noPerms(message, "MANAGE_GUILD");
    if (!bot.lockit) bot.lockit = [];
    let time = args.join(' ');
    let validUnlocks = ['release', 'unlock'];
    if (!time) return message.reply('Установите время закрытия канала!');
  
    if (validUnlocks.includes(time)) {
      message.channel.overwritePermissions(message.guild.id, {
        SEND_MESSAGES: null
      }).then(() => {
        message.channel.sendMessage('Закрытие оконченно.');
        clearTimeout(bot.lockit[message.channel.id]);
        delete bot.lockit[message.channel.id];
      }).catch(error => {
        console.log(error);
      });
    } else {
      message.channel.overwritePermissions(message.guild.id, {
        SEND_MESSAGES: false
      }).then(() => {
        message.channel.sendMessage(`Канал закрыт на ${ms(ms(time), { long:true })}`).then(() => {
  
          bot.lockit[message.channel.id] = setTimeout(() => {
            message.channel.overwritePermissions(message.guild.id, {
              SEND_MESSAGES: null
            }).then(message.channel.sendMessage('Закрытие оконченно.')).catch(console.error);
            delete bot.lockit[message.channel.id];
          }, ms(time));
  
        }).catch(error => {
          console.log(error);
        });
      });
    }
  };

if(cmd === `${prefix}createrole`){
  message.reply("In Developing")
}

/*if(cmd === `${prefix}mute`){
  let reason = args.slice(1).join(' ')
    let user = message.mentions.users.first();
    let Muterole = bot.guilds.get(message.guild.id).roles.find(`name`, "muted")
    let incidentchannel = message.guild.channels.find(`name`, "incidents");
    let wumpuslog = message.guild.channels.find(`name`, "wumpuslog");
    if(!incidentchannel) return message.channel.send("Can't find incidents channel.");
    if(!Muterole) return message.reply("I cannot find muted role!");
    if(reason.length < 1) return message.reply("You must supply a reason of the mute!");
    if(message.mentions.users.size < 1) return message.reply('You must mentions someone to mute them').catch(console.error);

    const muteEmbed = new Discord.RichEmbed()
    .setDescription("Function")
    .setColor('RANDOM')
    .setTimestamp()
    .addField("Action", "Mute")
    .addField("User:", `${user.username}#${message.author.discriminator}`)
    .addField("Moderator", `${message.author.username}#${message.author.discriminator}`)
    .addField("User Id:", user.id)
    .addField("Moderator Id:", message.author.id);

if(!message.guild.member(bot.user).hasPermission("MANAGE_ROLES_OR_PERMISSIONS")) return message.react("I do not have correct permissions.").catch(console.error);

if(message.guild.member(user).roles.has(Muterole.id)) {
  message.guild.member(user).removeRole(Muterole).then() => {
    bot.channels.get(incidentchannel.id).sendEmbed(muteEmbed).catch(console.error);
  };

}else{
  message.guild.member(user).addRole(Muterole).then(() => {
    bot.channels.get(incidentchannel.id).sendEmbed(muteEmbed).cath(console.error)
  })

}

    incidentchannel.send(muteEmbed);
   // wumpuslog.send("User has been muted", `${user.username}#${message.author.discriminator}`)

}*/

  if(cmd === `${prefix}say`){
  //if(message.member.hasPermission("  ")) return message.reply("No");
    let botmessage = args.join(" ");
    message.delete().catch();
    message.channel.send(botmessage);
}

  if(cmd === `${prefix}userid`){
    let kiUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!kiUser) return errors.cantfindUser(message.channel);
    message.reply(`User id: ${kiUser.id}`);
  }

 

  if(cmd === `${prefix}serverid`){
    message.reply(`Server id: ${message.guild.id}`)
  }

if(cmd === `${prefix}8ball`){
  if(!args[2]) return message.reply("Скажите полный вопрос!");
      let replies = ["Да.", "Нет.","Возможно.", " Я не знаю.", "Скажите позже."];
      let result = Math.floor((Math.random() * replies.length));
      let question = args.slice(0).join(" ");


      let ballEmbed = new Discord.RichEmbed()
      .setAuthor(message.author.tag)
      .setColor("#aaaaaa")
      .addField("Вопрос", question)
      .addField("Ответ", replies[result]);

      message.channel.send(ballEmbed);
  };
  if(cmd === `${prefix}botinfo`){

    let bicon = bot.user.avatarURL;
    let botEmbed = new Discord.RichEmbed()
    .setDescription("Bot Информация")
    .setColor('RANDOM')
    .setThumbnail(bicon)
    .addField("Name", bot.user.username)
    .addField("Создан:", bot.user.createdAt);

    return message.channel.send(botEmbed);
  }

  

  if(cmd === `${prefix}warn`){
    message.delete();
    if(!message.member.hasPermission("WARN_MEMBERS")) return errors.noPerms(message, "WARN_MEMBERS");
    if(args[0] == "help"){
      message.reply("Usage: !warn <user> <reason>");
      return;
    }
    let warns = JSON.parse(fs.readFileSync("./warnings.json", "utf8"));
   // if(!message.member.hasPermission("MANAGE_MEMBERS")) return message.reply("No can do pal!");
    let wUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0])
    if(!wUser) return message.reply("Укажите пользователя");
    if(wUser.hasPermission("MANAGE_MESSAGES")) return message.reply("Это уже слишком");
    let reason = args.join(" ").slice(22);
     if(!warns[wUser.id]) warns[wUser.id] = {
      warns: 0
    };
     warns[wUser.id].warns++;
     fs.writeFile("./warnings.json", JSON.stringify(warns), (err) => {
      if (err) console.log(err)
    });
     let warnEmbed = new Discord.RichEmbed()
    .setDescription("Warns")
    .setAuthor(message.author.username)
    .setColor("#fc6400")
    .addField("Нарушитель", `<@${wUser.id}>`)
    .addField("Нарушениние было замеченно в", message.channel)
   
    .addField("Причина", reason);
     let warnchannel = message.guild.channels.find(`name`, "incidents");
    if(!warnchannel) return message.reply("Не найден incidents канал");
     warnchannel.send(warnEmbed);
     message.reply(`***Пользователя предупредили, причина: ${reason}***`);
     wUser.send(`Вас предепредили в  *${message.guild.name}* причина : ${reason}`);

  }




  if(cmd === `${prefix}warnlevel`){
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("You can't do that.");
    let wUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0])
    if(!wUser) return message.reply("Couldn't find them yo");
    let warnlevel = warns[wUser.id].warns;

    message.reply(`<@${wUser.id}> has ${warnlevel} warnings.<:wumpuss:498051622564528149>`);

  };

  if(cmd === `${prefix}ping`){
    const msg = await message.channel.send("Ping?");
    msg.edit(`Pong! Latency is "${msg.createdTimestamp - message.createdTimestamp}ms". API Latency is "${Math.round(bot.ping)}ms"`);
  };
  
 

  if(cmd === `${prefix}mute`){

    let reason = args.slice(1).join(' ');
  let user = message.mentions.users.first();
  
  
  if(!message.member.hasPermission("MANAGE_MESSAGES")) return errors.noPerms(message, "MANAGE_MESSAGES");
  
  let muteRole = bot.guilds.get(message.guild.id).roles.find('name', 'muted')
  let incidentchannel = message.guild.channels.find(`name`, "incidents");
  if(!incidentchannel) return message.channel.send("Не найден incidents канал.");
  if (!muteRole) return message.reply('Я не нашел muted роль!').catch(console.error);
  if (reason.length < 1) return message.reply('Укажите причину заглушки пользователя.').catch(console.error);
  if (message.mentions.users.size < 1) return message.reply('Вы должны упомянуть пользователя для заглушки.').catch(console.error);
  const embed = new Discord.RichEmbed()
    .setColor(0x00AE86)
    .setTimestamp()
    .addField('Функция:', 'Mute')
    .addField('Пользователь:', `${user.username}#${user.discriminator}`)
    .addField('Модератор:', `${message.author.username}#${message.author.discriminator}`);

  if (!message.guild.member(bot.user).hasPermission('MANAGE_ROLES_OR_PERMISSIONS')) return message.reply('I do not have the correct permissions.').catch(console.error);

  if (message.guild.member(user).roles.has(muteRole.id)) {
    message.guild.member(user).removeRole(muteRole).then(() => {
      bot.channels.get(incidentchannel.id).sendEmbed(embed).catch(console.error);
    });
  } else {
    message.guild.member(user).addRole(muteRole).then(() => {
      bot.channels.get(incidentchannel.id).sendEmbed(embed).catch(console.error);
    });
  }
  }
  if(cmd === `${prefix}unmute`){
    let user = message.mentions.users.first();
   
    let iMember = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
    if(!iMember) return message.reply("Не найден пользователь");

    let incidentchannel = message.guild.channels.find(`name`, "incidents");
    if(!incidentchannel) return message.channel.send("Не найден incidents канал.");

  ///let muteRole = bot.guilds.get(message.guild.id).roles.find('name', 'muted');
  
  let sRole = message.guild.roles.find(`name`, `muted`)
  if(!sRole) return message.reply("Не найденно muted роль");;

  
  if(iMember.roles.has(sRole.id));
    await(iMember.removeRole(sRole.id));

  const embed = new Discord.RichEmbed()
    .setColor(0x00AE86)
    .setTimestamp()
    .addField('Функция:', 'Unmute')
    .addField('Пользователь:', `${user.username}#${user.discriminator}`)
    .addField('Модератор:', `${message.author.username}#${message.author.discriminator}`);

    
    incidentchannel.send(embed);
    message.reply("***С пользователя снята заглушка!***")
  }

  
  bot.on('message', message => {
    // If the message is "how to embed"
    if (message.content === 'Example embed') {
      // We can create embeds using the MessageEmbed constructor
      // Read more about all that you can do with the constructor
      // over at https://discord.js.org/#/docs/main/stable/class/RichEmbed
      const embed = new Discord.RichEmbed()
        // Set the title of the field
        .setTitle('This is example')
        // Set the color of the embed
        .setColor(0xFF0000)
        // Set the main content of the embed
        .setDescription('Now you see that)');
      // Send the embed to the same channel as the message
      message.channel.send(embed);
    }
  });

   




   

if(cmd === `${prefix}userinfo`){
  message.delete();
  let kUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if(!kUser) return errors.cantfindUser(message.channel);

  let bicon = kUser.user.avatarURL;
  let botiEmbed = new Discord.RichEmbed()
  .setDescription("Информация про пользователя")
  .setColor("#3390f")
  .setThumbnail(bicon)
  .addField("Имя пользователя", kUser.user.username)
  .addField("ID:", kUser.id)
  .addField("Зашел на сервер:", kUser.joinedAt);
  
  return message.channel.send(botiEmbed);
  
}

  
if(cmd === `${prefix}ufo`){
  let kUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if(!kUser) return errors.cantfindUser(message.channel);

  let bicon = kUser.user.avatarURL;
  let botiEmbed = new Discord.RichEmbed()
  .setDescription("Информация про пользователя")
  .setColor("#3390f")
  .setThumbnail(bicon)
  .addField("Имя пользователя", kUser.user.username)
  .addField("ID:", kUser.id)
  .addField("Зашел на сервер:", kUser.joinedAt);
  
  return message.channel.send(botiEmbed);
  
}

if(cmd === `${prefix}serverinfo`){

  let sicon = message.guild.iconURL;
  let serverembed = new Discord.RichEmbed()
  .setDescription("Информация про сервер")
  .setColor("#15f153")
  .setThumbnail(sicon)
  .addField("Имя сервера", message.guild.name)
  .addField("Создан в", message.guild.createdAt)
  .addField("Вы зашли", message.member.joinedAt)
  .addField("ID:", message.guild.id)
  .addField("Всего пользователей", message.guild.memberCount);

  message.channel.send(serverembed);
   return;
}

if(cmd === `${prefix}sinfo`){

 
  let sicon = message.guild.iconURL;
  let serverembed = new Discord.RichEmbed()
  .setDescription("Информация про сервер")
  .setColor("#15f153")
  .setThumbnail(sicon)
  .addField("Имя сервера", message.guild.name)
  .addField("Создан в", message.guild.createdAt)
  .addField("Вы зашли", message.member.joinedAt)
  .addField("ID:", message.guild.id)
  .addField("Всего пользователей", message.guild.memberCount);

  message.channel.send(serverembed);
   return;
}

});

bot.login(token);
