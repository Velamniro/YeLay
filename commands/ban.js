require('dotenv').config();
const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");
const inviteLink = process.env.inviteLink;
const iconURL = process.env.iconURL;


module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Выдает бан молотом бана')
		.addUserOption(option =>
			option.setName('member')
				.setDescription('Участник, в которого вы хотите кинуть молот бана')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('reason')
				.setDescription('Причина, по которой вы хотите кинуть молот бана')
				.setRequired(false)),
	// eslint-disable-next-line no-unused-vars
	async execute(client, interaction, db) {
		try {
			const member = await interaction.guild.members.fetch(interaction.options.getUser('member').id);
			let reason = interaction.options.getString('reason');
			const author = interaction.member;

			if (!author.permissions.has(PermissionsBitField.Flags.BanMembers)) return await interaction.reply('Вы не можете кидаться молотом!\nСилёнок ещё маловато');
			if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) return await interaction.reply('Я не могу кидаться молотом бана!\nСилёнок маловато');
			if (member.id === author.id) return await interaction.reply('Вы не можете ударить молотом бана самого себя!');
			if (member.moderatable) return await interaction.reply("Вы не можете забанить модератора обычным /ban!\nИспользуйте /softban");

			if (!reason) reason = 'Нету | None';
			const fullReason = `${interaction.user.tag}(${author.id}) -> ${reason}`;

			const embed = new EmbedBuilder()
				.setTitle(`Молот бана ударил \`${member.displayName}\`!`)
				.setDescription(`${author.displayName} (${author.id}) ударил молотом бана участника \`${member.displayName}\` по причине: ${reason}`)
				.setColor(0x12ff00)
				.setFooter({ text: `${author.displayName} забанил ${member.displayName}`, iconURL: iconURL })
				.setTimestamp()
				.setAuthor({ name: "YeLay", url: inviteLink, iconURL: iconURL });

			await member.ban({ reason: fullReason });
			await interaction.reply({ embeds: [embed] });
		}
		catch {
			const embed = new EmbedBuilder()
				.setTitle(`Ошибка`)
				.setDescription(`Произошла ошибка! Скорее всего этого пользователя нет на сервере или вы неправильно что-то ввели`)
				.setColor(0xff0000)
				.setFooter({ text: `Ошибка бана`, iconURL: iconURL })
				.setTimestamp()
				.setAuthor({ name: "YeLay", url: inviteLink, iconURL: iconURL });
			interaction.reply({ embeds: [embed] });
		}
	},
};


module.exports.help = {
	name: "**`/ban`**",
	description: 'Банит участника\nДолжно быть включено "Банить участников" в роле пользователя',
	chapter: 'Moderation',
};