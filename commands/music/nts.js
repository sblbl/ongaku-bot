const { SlashCommandBuilder } = require('discord.js')
const { searchTrack } = require('../../utils')

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('nts')
		.setDescription('Add a track from NTS')
		.addStringOption(option =>
			option.setName('nts_track')
				.setDescription('The track data from NTS')
				.setRequired(true)),
	async execute(interaction) {
		const trackData = interaction.options.getString('nts_track')

		await interaction.reply({ content: 'Searching for track...', ephemeral: true })

		const trackArtist = trackData.split(' - ')[0]
		const trackName = trackData.split(' - ')[1]
		const trackInfo = await searchTrack(trackName, trackArtist)

		// make an embed with the track info
		const trackEmbed = {
			color: 0xfeda32,
			title: trackInfo.track,
			url: trackInfo.preview,
			description: `Artist: ${trackInfo.artist}\nAlbum: ${trackInfo.album}\nGenre: ${trackInfo.genre}`,
			thumbnail: {
				url: trackInfo.cover,
			},
		}
		await interaction.editReply({ embeds: [trackEmbed], content: '', ephemeral: false })
	}
}