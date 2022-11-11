require('dotenv').config();
const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");
const inviteLink = process.env.inviteLink;
const iconURL = process.env.iconURL;


module.exports = {
	data: new SlashCommandBuilder()
		.setName('unban')
		.setDescription('Ломает стену бана')
		.addStringOption(option =>
			option.setName('member')
				.setDescription('Участник, у которого вы сломаете стену бана(его ID)')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('reason')
				.setDescription('Причина, по которой вы сломали стену бана')
				.setRequired(false)),
	// eslint-disable-next-line no-unused-vars
	async execute(client, interaction, db) {
		try {
			const member = await client.users.fetch(interaction.options.getString('member'));
			let reason = interaction.options.getString('reason');
			const author = interaction.member;

			if (!author.permissions.has(PermissionsBitField.Flags.BanMembers)) return await interaction.reply('Вы не можете ломать такие толстые стены бана!\nСилёнок маловато');
			if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) return await interaction.reply('Я не могу ломать такие толстые стены бана!\nСилёнок маловато');

			if (!reason) reason = 'Нету | None';
			const fullReason = `${interaction.user.tag}(${author.id}) -> ${reason}`;

			const embed = new EmbedBuilder()
				.setTitle(`Была сломана стена бана пользователя \`${member.tag}\`!`)
				.setDescription(`${author.toString()}(${author.id}) своей силой духа сломал стену бана пользователя \`${member.tag}\` по причине: ${reason}`)
				.setColor(0x12ff00)
				.setFooter({ text: `${author.displayName} разбанил ${member.tag}`, iconURL: iconURL })
				.setAuthor({ name: "YeLay", url: inviteLink, iconURL: iconURL })
				.setTimestamp();

			await interaction.guild.members.unban(member.id, fullReason);
			await interaction.reply({ embeds: [embed] });
		}
		catch {
			const embed = new EmbedBuilder()
				.setTitle(`Ошибка`)
				.setDescription(`Произошла ошибка! Скорее всего этого пользователя нет в списке бана или вы неправильно что-то ввели`)
				.setColor(0xff0000)
				.setFooter({ text: `Ошибка разбана`, iconURL: iconURL })
				.setAuthor({ name: "YeLay", url: inviteLink, iconURL: iconURL })
				.setTimestamp();
			interaction.reply({ embeds: [embed] });
		}
	},
};


module.exports.help = {
	name: "**`/unban`**",
	description: 'Разбанивает участника\nДолжно быть включено "Банить участников" в роле пользователя',
	chapter: 'Moderation',
};