/* eslint-disable no-unused-vars */
require('dotenv').config();
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const inviteLink = process.env.inviteLink;
const iconURL = process.env.iconURL;
const puppeteer = require('puppeteer');
const ytdl = require('ytdl-core');
const ms = require('ms');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('search_youtube')
		.setDescription('Ищет первое видео на YouTube по вашему запросу')
		.addStringOption(option =>
			option.setName('search')
				.setDescription('Ваш запрос')
				.setRequired(true)),
	async execute(client, interaction, db) {
		try {
			const search = interaction.options.getString('search');
			await interaction.deferReply();
			const getVideoURL = async (search1 = 'a') => {
				search.split(" ").join('+');
				const browser = await puppeteer.launch({ headless: true });
				const page = await browser.newPage();
				await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');
				await page.goto('https://www.youtube.com/results?search_query=' + search1);
				await page.waitForTimeout('#contents > ytd-video-renderer:nth-child(1)');

				await page.click('#contents > ytd-video-renderer:nth-child(1) > #dismissible > ytd-thumbnail > #thumbnail');
				await page.waitForTimeout('#info-contents');
				const result = await page.url();

				browser.close();
				return result;
			};

			getVideoURL(search).then(async videoURL => {
				try {
				// eslint-disable-next-line no-var
					var videoMeta = await ytdl.getInfo(videoURL);
				}
				catch {
					return interaction.reply("Ошибка! Попробуйте перефразировать запрос");
				}

				const title = videoMeta.player_response.videoDetails.title;
				const countView = videoMeta.player_response.videoDetails.viewCount;
				const author = videoMeta.player_response.videoDetails.author;
				const duration = ms(ms(videoMeta.player_response.videoDetails.lengthSeconds + 's'));
				const authorURL = videoMeta.videoDetails.ownerProfileUrl;
				const category = videoMeta.videoDetails.category;
				const publishDate = videoMeta.videoDetails.publishDate;
				const uploadDate = videoMeta.videoDetails.uploadDate;
				const likes = videoMeta.videoDetails.likes ? videoMeta.videoDetails.likes : 0;
				const videoID = videoMeta.player_response.videoDetails.videoId;

				console.log(videoMeta.videoDetails)

				const embed = new EmbedBuilder()
					.setTitle(title)
					.setDescription(`Запрос —> **${search}**\nНазвание видео —> **${title}**`)
					.setColor('Random')
					.setAuthor({ name: "YeLay", url: inviteLink, iconURL: iconURL })
					.setImage(`https://i.ytimg.com/vi/${videoID}/hqdefault.jpg`)
					.setFooter({ text: `${title}`, iconURL: iconURL })
					.setTimestamp()
					.setFields([{ name: "Мета видео(общая информация)", value: `Название видео —> **${title}**\nСсылка на видео —> **${videoURL}**\nАвтор —> **${author}**\nКол-во просмотров —> **${countView}**\n` +
`Длительность —> ≈**${duration}**\nКол-во лайков —> **${likes}**`, inline: false },
					{ name: "Доп. информация", value: `Категория —> **${category}**\nДата загрузки на YouTube —> **${uploadDate}**\nДата публикации на YouTube —> **${publishDate}**`,
						inline: false }, { name: "Автор", value: `Название канала автора —> **${author}**\nСсылка на канал автора —> **${authorURL}**` }]);
				await interaction.editReply({ embeds: [embed] });
			});
		}
		catch {
			const embed = new EmbedBuilder()
				.setTitle("Ошибка")
				.setDescription("Ошибка! Поробуйте ввести другой запрос, или обратитесь к `FawnFlipper#0084`")
				.setColor("Random")
				.setFooter({ text: "Ошибка поиска", iconURL: iconURL })
				.setTimestamp()
				.setAuthor({ name: "YeLay",	url: inviteLink, iconURL: iconURL });
			interaction.reply({ embeds: [embed] });
		}
	},
};


module.exports.help = {
	name: "**`/search_youtube`**",
	description: 'Ищет видео на ютуб по запросу',
	chapter: 'Fun',
};