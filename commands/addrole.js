require('dotenv').config();
const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");
const inviteLink = process.env.inviteLink;
const iconURL = process.env.iconURL;


module.exports = {
	data: new SlashCommandBuilder()
		.setName('addrole')
		.setDescription('Выдает роль')
		.addRoleOption(option =>
			option.setName('role')
				.setDescription('Роль, которая будет выдана участнику')
				.setRequired(true))
		.addUserOption(option =>
			option.setName('member')
				.setDescription('Участник, которому будет выдана роль')
				.setRequired(false)),
	// eslint-disable-next-line no-unused-vars
	async execute(client, interaction, db) {
		try {
			let member = interaction.options.getUser('member');
			const role = interaction.options.getRole('role');

			if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) return await interaction.reply('Вы не имеете права на использование данной команды!\nНедостающее право: Управление ролями!');
			if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) return await interaction.reply('Я не могу менять роли у пользователя!\nНадо в права моей роли добавить Управление Ролями');

			member = member ? await interaction.guild.members.fetch(member) : interaction.member;

			if (interaction.member.roles.highest.position <= role.position) return interaction.reply('Вы не можете выдать роль которая выше вашей или же ваша!');
			if (interaction.guild.members.me.roles.highest.position <= role.position) return interaction.reply('Эта роль выше моей! Я не могу её выдать!');

			const embed = new EmbedBuilder()
				.setTitle(`Пользователю ${member.displayName} была успешно добавлена роль ${role.name}.`)
				.setColor(0x00b5f8)
				.setThumbnail(`${member.displayAvatarURL()}`)
				.setFooter({ text: `Добавление роли участнику ${member.displayName}`, iconURL: iconURL })
				.setTimestamp()
				.setAuthor({ name: "YeLay",	url: inviteLink, iconURL: iconURL });

			await member.roles.add(role);
			await interaction.reply({ embeds: [embed] });
		}
		catch {
			const embed = new EmbedBuilder()
				.setTitle("Ошибка")
				.setDescription("Ошибка! Скорее всего вы что-то не так передали или допустили ошибку")
				.setColor(0x00b5f8)
				.setFooter({ text: "Ошибка добавление роли", iconURL: iconURL })
				.setTimestamp()
				.setAuthor({ name: "YeLay", url: inviteLink, iconURL: iconURL });
			interaction.reply({ embeds: [embed] });
		}
	},
};


module.exports.help = {
	name: "**`/addrole`**",
	description: 'Выдает роль\nТребуется право "Изменение ролей"',
	chapter: 'Role',
};