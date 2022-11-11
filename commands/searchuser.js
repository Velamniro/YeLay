require('dotenv').config();
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const inviteLink = process.env.inviteLink;
const iconURL = process.env.iconURL;


module.exports = {
	data: new SlashCommandBuilder()
		.setName('searchuser')
		.setDescription('Ищет пользователя по ID')
		.addStringOption(option =>
			option.setName('id')
				.setDescription('ID пользователя')
				.setRequired(true)),
	// eslint-disable-next-line no-unused-vars
	async execute(client, interaction, db) {
		try {
			const ID = interaction.options.getString('id');
			if (ID.length !== 18) return interaction.reply("ID состоит из 18 символов!");
			if (ID === client.user.id) return interaction.reply("Так это же я!");

			let user;
			try {
				user = await client.users.fetch(ID);
			}
			catch {
				return interaction.reply("Я не нашел его(");
			}

			const userIsBot = user.bot ? "Да" : "Нет";
			const userIsSystemBot = user.system ? "Да" : "Нет";

			let userInGuild;
			try {
				let member = await interaction.guild.members.fetch(ID);
				userInGuild = member ? "Да" : "Нет";
				member = null;
			}
			catch {
				userInGuild = "Нет";
			}

			const userCreatedDateTime = user.createdAt.toISOString().split('T');
			userCreatedDateTime[1] = userCreatedDateTime[1].slice(0, -5) + " по UTC";

			const userAvatar = user.displayAvatarURL();

			const embed = new EmbedBuilder()
				.setTitle(`${user.tag}`)
				.setDescription(`**Ник** - ${user.tag}\n**Аватарка** - ${userAvatar}\n**Аккаунт был создан** - ${userCreatedDateTime[0]} ${userCreatedDateTime[1]}\n\
**Является ли он ботом** - ${userIsBot}\n**Является ли он системным ботом** - ${userIsSystemBot}\n\
**Есть ли он на этом сервере** - ${userInGuild}\n**Его упонимание** - ${user.toString()}`)
				.setColor("Random")
				.setFooter({ text: `Найден ${user.tag}!`, iconURL: `${client.user.avatarURL()}` })
				.setThumbnail(`${userAvatar}`)
				.setTimestamp()
				.setAuthor({ name: "YeLay",
					url: inviteLink,
					iconURL: iconURL });
			interaction.reply({ embeds: [embed] });
		}
		catch {
			const embed = new EmbedBuilder()
				.setTitle(`Ошибка!`)
				.setDescription(`Обратитесь к FawnFlipper#0084`)
				.setColor("Random")
				.setFooter({ text: `Ошибка`, iconURL: `${client.user.avatarURL()}` })
				.setTimestamp()
				.setAuthor({ name: "YeLay",
					url: inviteLink,
					iconURL: iconURL });
			interaction.reply({ embeds: [embed] });
		}
	},
};


module.exports.help = {
	name: "**`/searchuser`**",
	description: 'Ищет пользователя по его ID',
	chapter: 'Fun',
};