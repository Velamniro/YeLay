require('dotenv').config();
const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");
const inviteLink = process.env.inviteLink;
const iconURL = process.env.iconURL;


module.exports = {
	data: new SlashCommandBuilder()
		.setName('removerole')
		.setDescription('Забирает роль')
		.addRoleOption(option =>
			option.setName('role')
				.setDescription('Роль, которая будет забрана у участника')
				.setRequired(true))
		.addUserOption(option =>
			option.setName('member')
				.setDescription('Участник, у которого будет забрана роль')
				.setRequired(false)),
	// eslint-disable-next-line no-unused-vars
	async execute(client, interaction, db) {
		try {
			let member = interaction.options.getUser('member');
			const role = interaction.options.getRole('role');
			const author = interaction.member;

			if (!author.permissions.has(PermissionsBitField.Flags.ManageRoles)) return await interaction.reply('Вы не имеете права на использование данной команды!\nНедостающее право: Управление ролями!');
			if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) return await interaction.reply('Я не могу менять роли у пользователя!\nНадо в права моей роли добавить Управление Ролями');

			member = member ? await interaction.guild.members.fetch(member.id) : author;

			if (interaction.member.roles.highest.position <= role.position) return interaction.reply('Вы не можете забрать роль которая выше вашей или же ваша!');
			if (interaction.guild.members.me.roles.highest.position <= role.position) return interaction.reply('Эта роль выше моей! Я не могу её забрать');

			const embed = new EmbedBuilder()
				.setTitle(`У пользователя ${member.displayName} была успешно забрана роль ${role.name}.`)
				.setColor(0x00b5f8)
				.setThumbnail(`${member.displayAvatarURL()}`)
				.setFooter({ text: `Удаление роли у участника ${member.displayName}`, iconURL: iconURL })
				.setAuthor({ name: "YeLay", url: inviteLink, iconURL: iconURL })
				.setTimestamp();

			await member.roles.remove(role);
			await interaction.reply({ embeds: [embed] });
		}
		catch {
			const embed = new EmbedBuilder()
				.setTitle("Ошибка")
				.setDescription("Ошибка! Скорее всего вы что-то не так передали или допустили ошибку")
				.setColor("Random")
				.setFooter({ text: "Ошибка добавление роли", iconURL: iconURL })
				.setAuthor({ name: "YeLay", url: inviteLink, iconURL: iconURL })
				.setTimestamp();
			interaction.reply({ embeds: [embed] });
		}
	},
};


module.exports.help = {
	name: "**`/removerole`**",
	description: 'Забирает у участника роль\nДолжно быть включено право "Управлять ролями" в роле пользователя',
	chapter: 'Role',
};