const { SlashCommandBuilder } = require('discord.js')
const { searchTrack } = require('../../utils')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('nts')
		.setDescription('Add a track from NTS')
		.addStringOption(option =>
			option.setName('nts_track')
				.setDescription('The track data from NTS')
				.setRequired(true)),
	async execute(interaction) {
		const trackData = interaction.options.getString('nts_track')
		const trackArtist = trackData.split(' - ')[0]
		const trackName = trackData.split(' - ')[1]
		const trackInfo = await searchTrack(trackName, trackArtist)
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