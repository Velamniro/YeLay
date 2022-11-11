require('dotenv').config();
const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");
const inviteLink = process.env.inviteLink;
const iconURL = process.env.iconURL;


module.exports = {
	// делаем команду slash
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Удаляет сообщения')
		.addIntegerOption(option =>
			option.setName('amount')
				.setDescription('Количество сообщений, которое будет удалено')
				.setRequired(true)),
	// eslint-disable-next-line no-unused-vars
	async execute(client, interaction, db) {
		let amount = interaction.options.getInteger('amount');
		amount = +amount;
		const author = interaction.member;

		if (!author.permissions.has(PermissionsBitField.Flags.ManageMessages)) return await interaction.reply('Вы не имеете права на использование данной команды!\nНедостающее право: Управление сообщениями!');
		if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) return await interaction.reply('Я не могу удалять сообщения!\nНадо в права моей роли добавить Управление Сообщениями');

		if (!amount) return await interaction.reply('Укажите количество сообщений больше нуля!');

		const messages = await interaction.channel.messages.fetch({ limit: amount, before: (interaction.channel.lastMessageId) });
		setTimeout(async () => {
			await interaction.deferReply();
			try {
				await messages.forEach(async msg => {
					await msg.delete();
				});

				const embed = new EmbedBuilder()
					.setTitle(`Успешно!`)
					.setDescription(`Последние ${amount} сообщений были удалены модератором ${author.toString()}!\n\
					Были пропущены сообщения 2-х недельной давности, если они имелись`)
					.setFooter({ text: "Очистка сообщений", iconURL: iconURL })
					.setColor(0x12ff00)
					.setTimestamp()
					.setAuthor({ name: "YeLay", url: inviteLink, iconURL: iconURL });
				await interaction.editReply({ embeds: [embed] });
			}
			catch (err) {
				const embed = new EmbedBuilder()
					.setTitle(`Ошибка удаления!`)
					.setDescription(`Ошибка удаления сообщений!\n\
					Скорее всего вы попытались сообщения 14-дневной давности. \
					Попробуйте удалить меньше сообщений или придется удалять вручную(`)
					.setFooter({ text: "Ошибка очистки сообщений", iconURL: iconURL })
					.setColor(0xff0000)
					.setTimestamp()
					.setAuthor({ name: "YeLay", url: inviteLink, iconURL: iconURL });
				await interaction.editReply({ embeds: [embed] });
			}
		}, 1000);
	},
};


module.exports.help = {
	name: "**`/clear`**",
	description: 'Удаляет сообщения\nДолжно быть включено право "Управлять сообщениями" в роле участника',
	chapter: 'Moderation',
};