require('dotenv').config();
const { SlashCommandBuilder, EmbedBuilder, SelectMenuBuilder, ActionRowBuilder,
	SelectMenuOptionBuilder } = require("discord.js");
const fs = require('fs');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Это help')
		.addStringOption(option =>
			option.setName('chapter')
				.setDescription('Раздел')
				.setRequired(false)
				.addChoices({ name: 'Moderation', value: 'moder' },
							 { name: 'Role', value: 'role' },
							 { name: 'Fun', value: 'fun' },)),
	// eslint-disable-next-line no-unused-vars
	async execute(client, interaction, db) {
		// try {
			const chapter = interaction.options.getString('chapter');

			switch (chapter) {
			case null: {
				await interaction.deferReply();
				const commands = [];
				const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
				for (const file of commandFiles) {
					const command = require(`./${file}`);
					commands.push(command.help);
				}

				const nameModerCommands = [];
				const nameRoleCommands = [];
				const nameFunCommands = [];
				for (const cmd of commands) {
					switch (cmd.chapter) {
					case 'Moderation':
						nameModerCommands.push(cmd.name);
						break;
					case 'Role':
						nameRoleCommands.push(cmd.name);
						break;
					case 'Fun':
						nameFunCommands.push(cmd.name);
						break;
					}
				}

				const embed = new EmbedBuilder()
					.setTitle('_***Списока команд бота YeLay***_')
					.setColor(0x00b5f8)
					.setImage('https://clck.ru/ZKZbd')
					.setFooter({ text:'Команды бота YeLay' })
					.setTimestamp()
					.setThumbnail('https://media.discordapp.net/attachments/925726223114584076/944952687923978320/wX2sJY7.png')
					.setAuthor({ name:"FawnFlipper(вкусный олень)", iconURL:"https://cdn.discordapp.com/avatars/631042204067954688/78dd99c9516982d4726a979e3df52b33.webp?size=128", url:"https://vk.com/fawnflipper" })
					.setFields({ name:"***Модераторские команды (`/help Moderation`)***", value:`${nameModerCommands}`, inline:false },
						{ name:"***Фановые команды(`/help Fun`)***", value:`${nameFunCommands}`, inline:false },
						{ name:"***Команды ролей(`/help Role`)***", value:`${nameRoleCommands}`, inline:false });


				const labelModeration = new SelectMenuOptionBuilder({
					label: "Модерация",
					value: "Moderation",
					description: "Если выберешь, покажет команды модерации",
					emoji: "🛡️",
					default: false,
				});

				const labelFun = new SelectMenuOptionBuilder({
					label: "Фан",
					value: "Fun",
					description: "Если выберешь, покажет фановые команды(включая y!ping и y!invite)",
					emoji: "😆",
					default: false,
				});

				const labelRole = new SelectMenuOptionBuilder({
					label: "Роли",
					value: "Role",
					description: "Если выберешь, покажет команды ролей",
					emoji: "📜",
					default: false,
				});


				const selectMenu = new SelectMenuBuilder()
					.setCustomId('helpMenu')
					.setPlaceholder('Раздел')
					.setMinValues(1)
					.setMaxValues(1)
					.setOptions([labelModeration, labelFun, labelRole])
					.setDisabled(false)

				const action = new ActionRowBuilder()
					.setComponents([selectMenu]);


				await interaction.editReply({
					embeds: [embed],
					components: [action],
				});


				setTimeout(function() {
					try {
						interaction.deleteReply();
					}
					catch {
						// Если его уже удалили(модеры к примеру), то ошибка не вылетет
					}
				}, 30000);
				break;
			}
			case "moder": {
				await interaction.deferReply({ ephemeral: true });
				const commands = [];
				const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
				for (const file of commandFiles) {
					const command = require(`./${file}`);
					commands.push(command.help);
				}

				const commandsModer = [];
				for (const cmd of commands) {
					if (cmd.chapter !== "Moderation") continue;
					commandsModer.push({ name: `${cmd.name}`, description: `${cmd.description}` });
				}

				const embed = new EmbedBuilder()
					.setTitle('***Модераторские команды бота YeLay***')
					.setColor('Random')
					.setImage('https://clck.ru/ZKZbd')
					.setFooter({ text:'Модераторские команды бота YeLay' })
					.setTimestamp()
					.setThumbnail('https://media.discordapp.net/attachments/925726223114584076/944952687923978320/wX2sJY7.png')
					.setAuthor({ name:"FawnFlipper(вкусный олень)", iconURL:"https://cdn.discordapp.com/avatars/631042204067954688/78dd99c9516982d4726a979e3df52b33.webp?size=128", url:"https://vk.com/fawnflipper" });
				for (const cmd of commandsModer) {
					embed.addFields({
						name: cmd.name,
						value: cmd.description,
						inline: false,
					});
				}

				await interaction.editReply({ embeds: [embed] });
				break;
			}
			case "fun": {
				await interaction.deferReply({ ephemeral: true });
				const commands = [];
				const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
				for (const file of commandFiles) {
					const command = require(`./${file}`);
					commands.push(command.help);
				}

				const commandsFun = [];
				for (const cmd of commands) {
					if (cmd.chapter !== "Fun") continue;
					commandsFun.push({ name: `${cmd.name}`, description: `${cmd.description}` });
				}

				const embed = new EmbedBuilder()
					.setTitle('***Фановые команды бота YeLay***')
					.setColor('Random')
					.setImage('https://clck.ru/ZKZbd')
					.setFooter({ text:'Фановые команды бота YeLay' })
					.setTimestamp()
					.setThumbnail('https://media.discordapp.net/attachments/925726223114584076/944952687923978320/wX2sJY7.png')
					.setAuthor({ name:"FawnFlipper(вкусный олень)", iconURL:"https://cdn.discordapp.com/avatars/631042204067954688/78dd99c9516982d4726a979e3df52b33.webp?size=128", url:"https://vk.com/fawnflipper" });
				for (const cmd of commandsFun) {
					embed.addFields({
						name: cmd.name,
						value: cmd.description,
						inline: false,
					});
				}

				await interaction.editReply({ embeds: [embed] });
				break;
			}
			case "role": {
				await interaction.deferReply({ ephemeral: true });
				const commands = [];
				const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
				for (const file of commandFiles) {
					const command = require(`./${file}`);
					commands.push(command.help);
				}

				const commandsRole = [];
				for (const cmd of commands) {
					if (cmd.chapter !== "Role") continue;
					commandsRole.push({ name: `${cmd.name}`, description: `${cmd.description}` });
				}

				const embed = new EmbedBuilder()
					.setTitle('***Ролевые команды бота YeLay***')
					.setColor('Random')
					.setImage('https://clck.ru/ZKZbd')
					.setFooter({ text:'Ролевые команды бота YeLay' })
					.setTimestamp()
					.setThumbnail('https://media.discordapp.net/attachments/925726223114584076/944952687923978320/wX2sJY7.png')
					.setAuthor({ name:"FawnFlipper(вкусный олень)", iconURL:"https://cdn.discordapp.com/avatars/631042204067954688/78dd99c9516982d4726a979e3df52b33.webp?size=128", url:"https://vk.com/fawnflipper" });
				for (const cmd of commandsRole) {
					embed.addFields({
						name: cmd.name,
						value: cmd.description,
						inline: false,
					});
				}

				await interaction.editReply({ embeds: [embed] });
				break;
			}
			}

		// }
		// catch {
		// 	const embed = new EmbedBuilder()
		// 		.setTitle(`Ошибка`)
		// 		.setDescription(`Произошла ошибка! Обратитесь к FawnFlipper#0084`)
		// 		.setColor(0xff0000)
		// 		.setFooter({ text: `Ошибка help` })
		// 		.setTimestamp();
		// 	interaction.editReply({ embeds: [embed] });
		// }
	},
};


module.exports.help = {
	name: "**`/help`**",
	description: 'это help',
	chapter: 'Moderation',
};