/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
require('dotenv').config();
const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");
const inviteLink = process.env.inviteLink;
const iconURL = process.env.iconURL;
const ms = require('ms');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('mute')
		.setDescription('Заклеевает рот участнику в чате на время')
		.addUserOption(option =>
			option.setName('member')
				.setDescription('Участник, которому вы хотите заклееть рот')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('time')
				.setDescription('Время, на которое вы хотите заклееть рот(писать в формате 1s/m/h/d)')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('reason')
				.setDescription('Причина, по которой вы хотите заклееть рот')
				.setRequired(false)),
	async execute(client, interaction, db) {
		// try {
			const memberGuild = await interaction.guild.members.fetch(interaction.options.getUser('member').id);
			let reason = interaction.options.getString('reason');
			const time = interaction.options.getString('time');
			let muteRole;
			const author = interaction.member;

			if (!author.permissions.has(PermissionsBitField.Flags.BanMembers)) return await interaction.reply('Вы не можете расклеевать рты!');
			if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) return await interaction.reply('Я не могу расклеевать рты');
			if (memberGuild.id === author.id) return await interaction.reply('Вы не можете заклееть рот самому себе!');

			if (!reason) reason = 'Нету | None';

			try {
				const Roles = await interaction.guild.roles.fetch();
				muteRole = await Roles.find(role => role.name === 'Mute');
				// eslint-disable-next-line no-const-assign
				if (!muteRole) time = 1; // Вызываем ошибку
			}
			catch {
				muteRole = await interaction.guild.roles.create({
					name: 'Mute',
				});
				const channels = await interaction.guild.channels.fetch()
				channels.forEach(channel => {
					channel.permissionOverwrites.create(muteRole, {
						'SendMessages': false,
						'SendTTSMessages': false,
						'EmbedLinks': false,
						'AttachFiles': false,
						"MentionEveryone": false,
						"UseExternalEmojis": false,
					});
				});
			}

			const embed = new EmbedBuilder()
				.setTitle(`Рот \`${memberGuild.displayName}\` был заклеен!`)
				.setDescription(`${author.toString()}(${author.id}) заклеел рот \`${memberGuild.displayName}\` по причине: ${reason}, но через ${ms(ms(time))} его рот будет расклеен!`)
				.setColor(0x12ff00)
				.setFooter({ text: `${author.displayName} замутил ${memberGuild.displayName} на ${ms(ms(time))}`,
					iconURL: iconURL })
				.setAuthor({ name: "YeLay", url: inviteLink, iconURL: iconURL })
				.setTimestamp();

			await memberGuild.roles.add(muteRole);
			await interaction.reply({ embeds: [embed] });

			setTimeout(function() {
				try {
					memberGuild.roles.remove(muteRole);
					interaction.channel.send(`У ${memberGuild.displayName} был успешно расклеен рот!`);
				}
				catch {
				// чтобы eslint и VS Code не ругались что catch пустой
				}
			}, ms(time));
		// }
		// catch {
		// 	const embed = new EmbedBuilder()
		// 		.setTitle(`Ошибка`)
		// 		.setDescription(`Произошла ошибка! Скорее всего вы неправильно что-то ввели`)
		// 		.setColor(0xff0000)
		// 		.setFooter({ text: `Ошибка мута`, iconURL: iconURL })
		// 		.setAuthor({ name: "YeLay", url: inviteLink, iconURL: iconURL })
		// 		.setTimestamp();
		// 	interaction.reply({ embeds: [embed] });
		// }
	},
};


module.exports.help = {
	name: "**`/mute`**",
	description: 'Мутит участника на время\nДолжно быть включено "Банить участников" в роле пользователя',
	chapter: 'Moderation',
};