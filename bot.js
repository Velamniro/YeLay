/* eslint-disable no-shadow */
// Require the necessary discord.js classes
const Discord = require('discord.js');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();
const path = require('node:path');
const token = process.env.TOKEN_TEST;
const clientId = process.env.clientId_TEST;
// eslint-disable-next-line no-unused-vars
const guildId = process.env.guildId;

// Create a new client instance
const client = new Discord.Client({ intents: [Discord.GatewayIntentBits.Guilds, Discord.GatewayIntentBits.GuildMessages, Discord.GatewayIntentBits.GuildMembers, Discord.GatewayIntentBits.GuildBans] });
const db = new sqlite3.Database('./db.sqlite3', sqlite3.OPEN_READWRITE, (err) => {
	if (err) return console.log(err);
	console.log("БД успешно подключено");
});


client.commands = new Discord.Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

// When the client is ready, run this code (only once)
client.once("ready", async () => {
	client.user.setStatus('idle');
	client.user.setActivity('Liryz', { type: "WATCHING" });
	for (let guild of await client.guilds.fetch()) {
		guild = await client.guilds.fetch(guild[0]);
		db.each(
			`SELECT id FROM guild_${guild.id}`, (err) => {
				if (err) {
					db.each(
						`CREATE TABLE guild_${guild.id} (
							id    TEXT NOT NULL
											   PRIMARY KEY,
							money INT (1, 999) NOT NULL
											   DEFAULT (0),
							warn_names TEXT,
							warn_ids   TEXT,
							warn_times TEXT
						)`);
				}
			});
		// for (let member of await guild.members.fetch()) {
		// 	member = member[1];
		// 	db.each(
		// 		// eslint-disable-next-line no-unused-vars
		// 		`INSERT INTO guild_${guild.id} VALUES (${member.id}, 0, "")`, (err) => {
		// 			// abc
		// 		});
	}
	setTimeout(() => {
		console.log('####################');
		console.log(`Бот ${client.user.tag} был успешно запущен и залогинен!`);
	}, 100);
});

client.on('guildCreate', async guild => {
	db.each(
		`CREATE TABLE guild_${guild.id} (
			id    TEXT NOT NULL
							   PRIMARY KEY,
			money INT (1, 999) NOT NULL
							   DEFAULT (0),
			warn_names TEXT,
			warn_ids   TEXT,
			warn_times TEXT
		)`, (err) => {
			console.log(err);
		});
	for (let member of await guild.members.fetch()) {
		member = member[1];
		db.each(
			`INSERT INTO guild_${guild.id} VALUES (${member.id}, 0, "[]")`, (err) => {
				console.log(err);
			});
	}
});

client.on('guildDelete', async guild => {
	db.each(
		`DROP TABLE guild_${guild.id}`, (err) => {
			console.log(err);
		});
});

client.on('guildMemberAdd', async member => {
	const guildID = member.guild.id;
	db.each(
		`INSERT INTO guild_${guildID} VALUES (${member.id}, 0, "")`, (err) => {
			console.log(err);
		});
});

client.on('interactionCreate', async interaction => {
	if (interaction.type === Discord.InteractionType.ApplicationCommand) {

		const command = client.commands.get(interaction.commandName);

		if (!command) return;

		try {
			await command.execute(client, interaction, db);
		}
		catch (error) {
			console.error(error);
			try {
				await interaction.reply({ content: 'Произошла ошибка! Обратитесь к создателю бота FawnFlipper#0084', ephemeral: true });
			}
			catch {
				await interaction.editReply({ content: 'Произошла ошибка! Обратитесь к создателю бота FawnFlipper#0084', ephemeral: true });
			}
		}
	} else if (interaction.type === Discord.InteractionType.MessageComponent) {
		switch (interaction.customId) {
		case 'helpMenu':
			switch (interaction.values[0]) {
			case "Moderation": {
				await interaction.deferReply({ ephemeral: true });
				await interaction.editReply({ embeds: [createModerEmbed()] });
				break;
			}
			case "Role":
				await interaction.deferReply({ ephemeral: true });
				await interaction.editReply({ embeds: [createRoleEmbed()] });
				break;
			case "Fun":
				await interaction.deferReply({ ephemeral: true });
				await interaction.editReply({ embeds: [createFunEmbed()] });
				break;
			}
			break;
		}
	}
});

client.on('messageCreate', (message) => {
	if (message.author.bot) return;
	const messageArray = message.content.split(' ');
	// команда после префикса
	const command = messageArray[0];
	// аргументы после команды
	if ((command.replace(/[^0-9]/g, '')) === clientId) {
		const embed = new Discord.EmbedBuilder()
			.setTitle("Привет!")
			.setDescription("*Ты меня упомянул и я пришел.*\n *Я бот пользователя `FawnFlipper#0084`, в случае ошибки в боте писать ему в лс.*")
			.setColor("Random")
			.setTimestamp()
			.setFooter({ text: "Я - YeLay!" })
			.setAuthor({ name: "FawnFlipper", url: "https://vk.com/fawnflipper",
				iconURL: "https://cdn.discordapp.com/avatars/631042204067954688/78dd99c9516982d4726a979e3df52b33.webp?size=128" })
			.setImage("https://clck.ru/ZKZbd")
			.setThumbnail("https://i.imgur.com/wX2sJY7.png")
			.setFields({ name: "**Мои команды**", value: "*Чтобы увидить мои команды пропиши `/help`*", inline: false },
				{ name: "**Как меня пригласить на свой сервер?**",
					value: "*Пропиши `/invite` и тебе в лс придет ссылка на мое приглашение!*" });
		message.reply({ embeds: [embed] });
	}
});

// Всякие функции
function createModerEmbed() {
	const commandModer = [];
	const commandFilesModer = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

	for (const file of commandFilesModer) {
		const command = require(`./commands/${file}`);
		commandModer.push(command.help);
	}
	const commandsModer = [];
	for (const cmd of commandModer) {
		if (cmd.chapter !== "Moderation") continue;
		commandsModer.push({ name: `${cmd.name}`, description: `${cmd.description}` });
	}
	const moderEmbed = new Discord.EmbedBuilder()
		.setTitle('***Модераторские команды бота YeLay***')
		.setColor('Random')
		.setImage('https://clck.ru/ZKZbd')
		.setFooter({ text:'Модераторские команды бота YeLay' })
		.setTimestamp()
		.setThumbnail('https://i.imgur.com/wX2sJY7.png')
		.setAuthor({ name:"FawnFlipper(вкусный олень)", iconURL:"https://cdn.discordapp.com/avatars/631042204067954688/78dd99c9516982d4726a979e3df52b33.webp?size=128", url:"https://vk.com/fawnflipper" });
	for (const cmd of commandsModer) {
		moderEmbed.addFields({
			name: cmd.name,
			value: cmd.description,
			inline: false,
		});
	}
	return moderEmbed;
}

function createRoleEmbed() {
	const commandRole = [];
	const commandFilesRole = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

	for (const file of commandFilesRole) {
		const command = require(`./commands/${file}`);
		commandRole.push(command.help);
	}
	const commandsRole = [];
	for (const cmd of commandRole) {
		if (cmd.chapter !== "Role") continue;
		commandsRole.push({ name: `${cmd.name}`, description: `${cmd.description}` });
	}
	const roleEmbed = new Discord.EmbedBuilder()
		.setTitle('***Ролевые команды бота YeLay***')
		.setColor('Random')
		.setImage('https://clck.ru/ZKZbd')
		.setFooter({ text:'Ролевые команды бота YeLay' })
		.setTimestamp()
		.setThumbnail('https://i.imgur.com/wX2sJY7.png')
		.setAuthor({ name:"FawnFlipper(вкусный олень)", iconURL:"https://cdn.discordapp.com/avatars/631042204067954688/78dd99c9516982d4726a979e3df52b33.webp?size=128", url:"https://vk.com/fawnflipper" });
	for (const cmd of commandsRole) {
		roleEmbed.addFields({
			name: cmd.name,
			value: cmd.description,
			inline: false,
		});
	}
	return roleEmbed;
}

function createFunEmbed() {
	const commandFun = [];
	const commandFilesFun = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

	for (const file of commandFilesFun) {
		const command = require(`./commands/${file}`);
		commandFun.push(command.help);
	}
	const commandsFun = [];
	for (const cmd of commandFun) {
		if (cmd.chapter !== "Fun") continue;
		commandsFun.push({ name: `${cmd.name}`, description: `${cmd.description}` });
	}
	const funEmbed = new Discord.EmbedBuilder()
		.setTitle('***Фановые команды бота YeLay***')
		.setColor('Random')
		.setImage('https://clck.ru/ZKZbd')
		.setFooter({ text:'Фановые команды бота YeLay' })
		.setTimestamp()
		.setThumbnail('https://i.imgur.com/wX2sJY7.png')
		.setAuthor({ name:"FawnFlipper(вкусный олень)", iconURL:"https://cdn.discordapp.com/avatars/631042204067954688/78dd99c9516982d4726a979e3df52b33.webp?size=128", url:"https://vk.com/fawnflipper" });
	for (const cmd of commandsFun) {
		funEmbed.addFields({
			name: cmd.name,
			value: cmd.description,
			inline: false,
		});
	}
	return funEmbed;
}
// Регаем бота
client.login(token);