require('dotenv').config();
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const token = process.env.TOKEN;


module.exports = {
	data: new SlashCommandBuilder()
		.setName('restart')
		.setDescription('Перезагружает бота'),
	// eslint-disable-next-line no-unused-vars
	async execute(client, interaction, db) {
		if (interaction.member.id !== '631042204067954688') return interaction.reply('Вы не FawnFlipper#0084, так что идите-ка вы!');
		const embed = new EmbedBuilder()
			.setTitle('Перезагрузка...')
			.setColor("Random")
			.setTimestamp()
			.setFooter({ text: "Перезагрузка..." });
		await interaction.reply({ embeds: [embed] });
		client.destroy();
		client.login(token);
		const embedTwo = new EmbedBuilder()
			.setTitle('Прошла успешно!')
			.setColor("Random")
			.setTimestamp()
			.setFooter({ text: "Успех!" });
		interaction.channel.send({ embeds: [embedTwo] });
		setTimeout(() => {
			client.user.setStatus('idle');
		}, 2000);
	},
};


module.exports.help = {
	name: "**`/restart`**",
	description: 'Перезагружает бота',
	chapter: 'Moderation',
};