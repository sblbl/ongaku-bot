const { SlashCommandBuilder } = require('discord.js')
const { searchTrack } = require('../../utils')

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('track')
		.setDescription('Add a track')
		.addStringOption(option =>
			option.setName('artist')
				.setDescription('The track artist')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('track')
				.setDescription('The track name')
				.setRequired(true)),
	async execute(interaction) {
		const trackInfo = await searchTrack(interaction.options.getString('track'), interaction.options.getString('artist'))
		// make an embed with the track info
		const trackEmbed = {
			color: 0xfeda32,
			title: trackInfo.title,
			url: trackInfo.url,
			description: `Genre: ${trackInfo.genre}\nStyle: ${trackInfo.style}`,
			thumbnail: {
				url: trackInfo.cover,
			},
		}

		await interaction.reply({ embeds: [trackEmbed] })
	}
}