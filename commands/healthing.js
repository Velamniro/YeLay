require('dotenv').config();
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const inviteLink = process.env.inviteLink;
const iconURL = process.env.iconURL;


module.exports = {
	data: new SlashCommandBuilder()
		.setName('healthing')
		.setDescription('Хилит участника')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('Участник, которого вы захилите')
				.setRequired(true)),
	// eslint-disable-next-line no-unused-vars
	async execute(client, interaction, db) {
		try {
			const user = interaction.options.getUser('user');

			if (user.id === client.user.id) return interaction.reply("Я не могу самого себя захилить, но спасибо)");

			const channelEmbed = new EmbedBuilder()
				.setTitle("Хил!")
				.setDescription(`Я захилил ${user.tag}!`)
				.setColor("Random")
				.setFooter({ text: "Хил!", iconURL: iconURL })
				.setTimestamp()
				.setAuthor({ name: "YeLay", url: inviteLink, iconURL: iconURL })
				.setImage("https://cdn.discordapp.com/attachments/771299913157181470/940230791278002256/1.gif");
			const embed = new EmbedBuilder()
				.setTitle("Хил!")
				.setDescription(`Вас захилил ${interaction.user.tag}!`)
				.setColor("Random")
				.setFooter({ text: "Хил", iconURL: iconURL })
				.setTimestamp()
				.setAuthor({ name: "YeLay", url: inviteLink, iconURL: iconURL })
				.setImage("https://cdn.discordapp.com/attachments/771299913157181470/940230791278002256/1.gif");

			await user.send({ embeds: [embed] });
			interaction.reply({ embeds: [channelEmbed] });
		}
		catch {
			const embed = new EmbedBuilder()
				.setTitle("Ошибка")
				.setDescription("Ошибка! Вы наверное что-то неправильно ввели или я не могу отправлять сообщения этому юзеру")
				.setColor("Random")
				.setFooter({ text: "Ошибка хила", iconURL: iconURL })
				.setTimestamp()
				.setAuthor({ name: "YeLay",	url: inviteLink, iconURL: iconURL });
			interaction.reply({ embeds: [embed] });
		}
	},
};


module.exports.help = {
	name: "**`/healthing`**",
	description: 'Хилит участника',
	chapter: 'Fun',
};