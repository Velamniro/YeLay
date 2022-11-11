require('dotenv').config();
const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");
const inviteLink = process.env.inviteLink;
const iconURL = process.env.iconURL;
const ms = require('ms');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('tempban')
		.setDescription('Выдает бан молотом бана, а потом ломает стену бана')
		.addUserOption(option =>
			option.setName('member')
				.setDescription('Участник, в которого вы хотите кинуть молот бана, а потом сломать стену бана')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('time')
				.setDescription('Время, после которого вы сломаете стену бана(писать в формате 1s/m/h/d)')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('reason')
				.setDescription('Причина, по которой вы хотите кинуть молот бана, а потом сломать стену бана')
				.setRequired(false)),
	// eslint-disable-next-line no-unused-vars
	async execute(client, interaction, db) {
		try {
			const memberGuild = await interaction.guild.members.fetch(interaction.options.getUser('member').id);
			const member = interaction.options.getUser('member');
			let reason = interaction.options.getString('reason');
			const time = interaction.options.getString('time');
			const author = interaction.member;

			if (!author.permissions.has(PermissionsBitField.Flags.BanMembers)) return await interaction.reply('Вы не можете кидаться молотом бана и ломать стены бана!\nСилёнок ещё маловато');
			if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) return await interaction.reply('Я не могу кидаться молотом бана и ломать стены бана!\nСилёнок маловато');
			if (member.id === author.id) return await interaction.reply('Вы не можете ударить молотом бана самого себя!');

			if (!reason) reason = 'Нету | None';
			fullReason = `${author.tag}(${author.id}) ->  ${reason} <- ${time}`;

			const embed = new EmbedBuilder()
				.setTitle(`Молот бана ударил \`${member.tag}\`!`)
				.setDescription(`${author.toString()}(${author.id}) ударил молотом бана участника \`${member.tag}\` по причине: ${reason}, но через ${ms(ms(time))} его стена бана будет сломана!`)
				.setColor(0x12ff00)
				.setFooter({ text: `${author.displayName} забанил ${member.tag} на ${ms(ms(time))}`, iconURL: iconURL })
				.setAuthor({ name: "YeLay", url: inviteLink, iconURL: iconURL })
				.setTimestamp();

			await memberGuild.ban({ reason: fullReason });
			await interaction.reply({ embeds: [embed] });

			setTimeout(function() {
				try {
					interaction.guild.members.unban(member.id);
					interaction.channel.send(`У ${member.tag} была успешно сломана стена бана из-за истечение времени!`);
				}
				catch {
					// чтобы eslint и VS Code не ругались что catch пустой
				}
			}, ms(time));
		}
		catch {
			const embed = new EmbedBuilder()
				.setTitle(`Ошибка`)
				.setDescription(`Произошла ошибка! Скорее всего этого пользователя нет на сервере или вы неправильно что-то ввели`)
				.setColor(0xff0000)
				.setFooter({ text: `Ошибка бана`, iconURL: iconURL })
				.setAuthor({ name: "YeLay", url: inviteLink, iconURL: iconURL })
				.setTimestamp();
			interaction.reply({ embeds: [embed] });
		}
	},
};


module.exports.help = {
	name: "**`/tempban`**",
	description: 'Банит участника на время\nДолжно быть включено "Банить участников" в роле пользователя',
	chapter: 'Moderation',
};