require('dotenv').config();
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const inviteLink = process.env.inviteLink;
const iconURL = process.env.iconURL;


module.exports = {
	data: new SlashCommandBuilder()
		.setName('shutdown')
		.setDescription('Выключает бота'),
	// eslint-disable-next-line no-unused-vars
	async execute(client, interaction, db) {
		if (interaction.member.id !== '631042204067954688') return interaction.reply('Вы не FawnFlipper#0084, так что идите-ка вы!');
		const embed = new EmbedBuilder()
			.setTitle('Сворачиваю лавочку')
			.setColor("Random")
			.setFooter({ text: "Выключение бота", iconURL: iconURL })
			.setAuthor({ name: "YeLay", url: inviteLink, iconURL: iconURL })
			.setTimestamp();
		interaction.reply({ embeds: [embed] });
		client.destroy();
	},
};


module.exports.help = {
	name: "**`/shutdown`**",
	description: 'Выключает бота',
	chapter: 'Moderation',
};