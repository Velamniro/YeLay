/* eslint-disable no-unused-vars */
require('dotenv').config();
const { SlashCommandBuilder } = require("discord.js");
const inviteLink = process.env.inviteLink;


module.exports = {
	data: new SlashCommandBuilder()
		.setName('invite')
		.setDescription('Присылает вам в лс ссылку на приглос бота'),
	async execute(client, interaction, db) {
		const author = interaction.user;
		await author.send(`${inviteLink}`);
		await interaction.reply(`Я тебе в лс кинул ссылку на мое приглашение`);
	},
};


module.exports.help = {
	name: "**`/invite`**",
	description: 'Отправляет вам в лс ссылку на приглос бота',
	chapter: 'Fun',
};