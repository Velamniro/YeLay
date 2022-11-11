const { SlashCommandBuilder } = require("discord.js");


module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Пишет вам пинг бота!'),
	// eslint-disable-next-line no-unused-vars
	async execute(client, interaction, db) {
		const ping = Date.now() - interaction.createdTimestamp;
		await interaction.reply(`Pong! Мой пинг ${ping}ms! :ping_pong:`);
	},
};


module.exports.help = {
	name: "**`/ping`**",
	description: 'Показывает пинг бота',
	chapter: 'Fun',
};