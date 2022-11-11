require('dotenv').config();
const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require("discord.js");
const inviteLink = process.env.inviteLink;
const iconURL = process.env.iconURL;


module.exports = {
	data: new SlashCommandBuilder()
		.setName('guildinfo')
		.setDescription('Показывает инфу про гильдию(сервер)'),
	// eslint-disable-next-line no-unused-vars
	async execute(client, interaction, db) {
		try {
		const guild = interaction.guild;
		let members = await guild.members.fetch();
		// eslint-disable-next-line no-unused-vars
		const guildMembersTotal = await guild.memberCount;
		const guildHumansTotal = members.reduce((humansTotal, member) => {
			if (member.user.bot) return humansTotal;
			return humansTotal + 1;
		}, 0);
		const guildBotsTotal = guildMembersTotal - guildHumansTotal;
		members = null;

		let channels = await guild.channels.fetch();
		// eslint-disable-next-line no-unused-vars
		const guildTextChannelsTotal = channels.reduce((txtchannelsTotal, textChannel) => {
			const a = textChannel.type === ChannelType.GuildText;
			if (a === true) {
				return txtchannelsTotal + 1;
			}
			else {
				return txtchannelsTotal;
			}
		}, 0);
		const guildVoiceChannelsTotal = channels.reduce((voicechannelsTotal, voiceChannel) => {
			const a = voiceChannel.type === ChannelType.GuildVoice;
			if (a === true) {
				return voicechannelsTotal + 1;
			}
			else {
				return voicechannelsTotal;
			}
		}, 0);
		channels = null;

		const guildOwner = await client.users.fetch(guild.ownerId);

		const guildCreatedDateTime = guild.createdAt.toDateString();

		const embed = new EmbedBuilder()
			.setTitle(`Название гильдии — ${guild.name}`)
			.setColor("Random")
			.setTimestamp()
			.setAuthor({ name: "YeLay", url: inviteLink, iconURL: iconURL })
			.setFields([{ name: "Участники", value: `Всего участников — ${guildMembersTotal}\nЛюдей — ${guildHumansTotal}\nБотов — ${guildBotsTotal}`, inline: true },
				{ name: "Каналы",
					value: `Всего каналов — ${guildTextChannelsTotal + guildVoiceChannelsTotal}\nТекстовых каналов — ${guildTextChannelsTotal}\n\
Голосовых каналов — ${guildVoiceChannelsTotal}`, inline: true },
				{ name: "Владелец", value: `Владелец сервера — ${guildOwner.toString()}(${guildOwner.id})`, inline: true },
				{ name: "Дата создания", value: `${guildCreatedDateTime}`, inline: true }]);
		if (guild.bannerURL()) embed.setImage(`${guild.bannerURL()}`);
		if (guild.iconURL()) {
			embed.setThumbnail(`${guild.iconURL()}`);
			embed.setFooter({ text: `Гильдия — ${guild.name}`, iconURL: `${guild.iconURL()}` });
		}
		else {
			embed.setFooter({ text: `Гильдия — ${guild.name}` });
		}

		interaction.reply({ embeds: [embed] });
		}
		catch {
			const embed = new MessageEmbed()
				.setTitle(`Ошибка!`)
				.setDescription(`Обратитесь к FawnFlipper#0084`)
				.setColor("Random")
				.setFooter({ text: `Ошибка`, iconURL: `${client.user.avatarURL()}` })
				.setTimestamp()
				.setAuthor({ name: "YeLay", url: inviteLink, iconURL: iconURL });
			interaction.reply({ embeds: [embed] });
		}
	},
};


module.exports.help = {
	name: "**`/guildinfo`**",
	description: 'Показывает инфу гильдии',
	chapter: 'Fun',
};