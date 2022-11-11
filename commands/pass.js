require('dotenv').config();
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const inviteLink = process.env.inviteLink;
const iconURL = process.env.iconURL;


module.exports = {
	data: new SlashCommandBuilder()
		.setName('pass')
		.setDescription('Передает слова')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('Пользователь, которому будут переданы слова')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('words')
				.setDescription('Слова, которые я передам')
				.setRequired(true)),
	// eslint-disable-next-line no-unused-vars
	async execute(client, interaction, db) {
		try {
			const user = interaction.options.getUser('user');
			const words = interaction.options.getString('words');
			if (user.id === client.user.id) return interaction.reply("Я Не могу самому себе написать, но слова прочитал");
			const channelEmbed = new EmbedBuilder()
				.setTitle("Передал")
				.setDescription(`Я передал ${user.tag} в лс ваши слова!`)
				.setColor("Random")
				.setFooter({ text: "Передача слов" })
				.setTimestamp()
				.setAuthor({ name: "YeLay", url: inviteLink, iconURL: iconURL });
			const embed = new EmbedBuilder()
				.setTitle("Передача слов")
				.setDescription(`Слова пользователя ${interaction.user.tag}:\n${words}`)
				.setColor("Random")
				.setFooter({ text: "Передача слов" })
				.setTimestamp()
				.setAuthor({ name: "YeLay", url: inviteLink, iconURL: iconURL });
			user.send({ embeds: [embed] });
			interaction.reply({ embeds: [channelEmbed] });
		}
		catch {
			const embed = new EmbedBuilder()
				.setTitle("Ошибка передачи слов")
				.setDescription(`Ошибка!
				Скорее всего у этого юзера заблокирован лс для меня`)
				.setColor("Random")
				.setFooter({ text: "Error передачи слов" })
				.setTimestamp()
				.setAuthor({ name: "YeLay", url: inviteLink, iconURL: iconURL });
			interaction.reply({ embeds: [embed] });
		}
	},
};


module.exports.help = {
	name: "**`/pass`**",
	description: 'Передает слова пользователю',
	chapter: 'Fun',
};