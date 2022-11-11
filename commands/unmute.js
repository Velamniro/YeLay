/* eslint-disable no-undef */
require('dotenv').config();
const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");
const inviteLink = process.env.inviteLink;
const iconURL = process.env.iconURL;


module.exports = {
	data: new SlashCommandBuilder()
		.setName('unmute')
		.setDescription('Расклеевает рот участнику в чате')
		.addUserOption(option =>
			option.setName('member')
				.setDescription('Участник, которому вы хотите расклееть рот')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('reason')
				.setDescription('Причина, по которой вы хотите расклееть рот')
				.setRequired(false)),
	// eslint-disable-next-line no-unused-vars
	async execute(client, interaction, db) {
		try {
			const memberGuild = await interaction.guild.members.fetch(interaction.options.getUser('member').id);
			let reason = interaction.options.getString('reason');
			let muteRole;
			const author = interaction.member;

			if (!author.permissions.has(PermissionsBitField.Flags.BanMembers)) return await interaction.reply('Вы не можете рассклеевать рты!');
			if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) return await interaction.reply('Я не могу расклеевать рты');
			if (memberGuild.id === author.id) return await interaction.reply('Вы не можете расклееть рот самому себе!');

			if (!reason) reason = 'Нету | None';

			try {
				const Roles = await interaction.guild.roles.fetch();
				muteRole = Roles.find(role => role.name === 'Mute');
				// eslint-disable-next-line no-const-assign
				if (!muteRole) memberGuild = 'aaa';
			}
			catch {
				return interaction.reply('Участник не может быть замучен, ведь роли для мута нету! Или, если я ее не нашел, то это ошибка... Обратитесь к **FawnFlipper#0084**');
			}

			await memberGuild.roles.remove(muteRole);

			const embed = new EmbedBuilder()
				.setTitle(`Рот \`${memberGuild.displayName}\` был расклеен!`)
				.setDescription(`\`${author.displayName}\` расклеет рот \`${memberGuild.displayName}\` по причине: ${reason}`)
				.setColor(0x12ff00)
				.setFooter({ text: `${author.displayName} размутил ${memberGuild.displayName}`, iconURL: iconURL })
				.setAuthor({ name: "YeLay", url: inviteLink, iconURL: iconURL })
				.setTimestamp();

			await interaction.reply({ embeds: [embed] });
		}
		catch (err) {
			console.log(`${err}\n#############`);
			const embed = new EmbedBuilder()
				.setTitle(`Ошибка`)
				.setDescription(`Произошла ошибка! Скорее всего вы неправильно что-то ввели`)
				.setColor(0xff0000)
				.setFooter({ text: `Ошибка мута`, iconURL: iconURL })
				.setAuthor({ name: "YeLay", url: inviteLink, iconURL: iconURL })
				.setTimestamp();
			interaction.reply({ embeds: [embed] });
		}
	},
};


module.exports.help = {
	name: "**`/mute`**",
	description: 'Мутит участника на время\nДолжно быть включено "Банить участников" в роле пользователя',
	chapter: 'Moderation',
};