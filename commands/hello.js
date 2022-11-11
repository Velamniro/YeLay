require('dotenv').config();
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const inviteLink = process.env.inviteLink;
const iconURL = process.env.iconURL;


module.exports = {
	data: new SlashCommandBuilder()
		.setName('hello')
		.setDescription('Передает привет')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('Пользователь, которому я передам привет')
				.setRequired(true)),
	// eslint-disable-next-line no-unused-vars
	async execute(client, interaction, db) {
		try {
			const user = interaction.options.getUser('user');

			if (user.id === client.user.id) return interaction.reply("Я не могу самому себе передать привет, но тебе тоже привет)");

			const channelEmbed = new EmbedBuilder()
				.setTitle("Привет")
				.setDescription(`Я передал ${user.tag} привет!`)
				.setColor("Random")
				.setFooter({ text: "Hello!", iconURL: iconURL })
				.setTimestamp()
				.setAuthor({ name: "YeLay", url: inviteLink, iconURL: iconURL })
				.setImage("https://c.tenor.com/pvFJwncehzIAAAAM/hello-there-private-from-penguins-of-madagascar.gif");
			const embed = new EmbedBuilder()
				.setTitle("Привет!")
				.setDescription(`${interaction.user.tag} передал вам привет`)
				.setColor("Random")
				.setFooter({ text: "Hello!", iconURL: iconURL })
				.setTimestamp()
				.setAuthor({ name: "YeLay", url: inviteLink, iconURL: iconURL })
				.setImage("https://c.tenor.com/pvFJwncehzIAAAAM/hello-there-private-from-penguins-of-madagascar.gif");

			await user.send({ embeds: [embed] });
			interaction.reply({ embeds: [channelEmbed] });
		}
		catch {
			const embed = new EmbedBuilder()
				.setTitle('Ошибка')
				.setDescription("Произошла ошибка! Скорее всего вы что-то неправильно ввели или я не могу отправлять сообщения этому юзеру!")
				.setColor("Random")
				.setFooter({ text: "Hello Error!", iconURL: iconURL })
				.setTimestamp()
				.setAuthor({ name: "YeLay", url: inviteLink, iconURL: iconURL });
			interaction.reply({ embeds: [embed] });
		}
	},
};


module.exports.help = {
	name: "**`/hello`**",
	description: 'Передает привет участнику',
	chapter: 'Fun',
};