require('dotenv').config();
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const inviteLink = process.env.inviteLink;
const iconURL = process.env.iconURL;


module.exports = {
	data: new SlashCommandBuilder()
		.setName('embed')
		.setDescription('Делает красивый embed')
		.addStringOption(option =>
			option.setName('json')
				.setDescription('Json текст для создания embed')
				.setRequired(true)),
	// eslint-disable-next-line no-unused-vars
	async execute(client, interaction, db) {
		try {
			let json = interaction.options.getString('json');

			if (!interaction.member.permissions.has('ADMINISTRATOR')) return await interaction.reply('Вы не можете делать embed\'ы\nНедостающее право "Администратор"');

			json = JSON.parse(json);
			const embed = new EmbedBuilder(json);

			await interaction.reply({ embeds: [embed] });
		}
		catch {
			const embed = new EmbedBuilder()
				.setTitle(`Ошибка`)
				.setDescription(`Произошла ошибка! Вы скорей всего что0то ввели неверно!\n\
				Если это не так то обратитесь к FawnFlipper#0084`)
				.setColor(0xff0000)
				.setFooter({ text: `Ошибка embed`, iconURL: iconURL })
				.setTimestamp()
				.setAuthor({ name: "YeLay", url: inviteLink, iconURL: iconURL });
			interaction.reply({ embeds: [embed] });
		}
	},
};


module.exports.help = {
	name: "**`/embed`**",
	description: 'Делает embed.\
	Пример: `{"title":"Это белая надпись наверху embed", "description":"Это серый текст ниже title",\
	"color":"Цвет текста в hex формате или RANDOM для рандом цвета",\
	"author":{"name":"Тут надпись которая выше title(типо имя автора)", "url":"Ссылка на сайт на который вы будете попадать при нажатии на ваше name. Писать в формате https://youtube.com/, https:// обязательно!", "icon_url":"ссылка на изображение левее name"},\
	"footer":{"text":"текст в самом низу(очень маленький)"}, "image":{"url":"ссылка на изображение(или гифку) в самом низу embed"},\
	"thumbnail":{"url":"ссылка на изображение(или гифку) справа сверху title"}}`\nОбязательный пункт это только title',
	chapter: 'Moderation',
};