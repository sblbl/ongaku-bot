const { SlashCommandBuilder } = require('discord.js')
const { writeRawTrack } = require('../../utils')

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('raw_track')
		.setDescription('Add a track\'s raw metadata')
		.addStringOption(option =>
			option.setName('track')
				.setDescription('The track title')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('artist')
				.setDescription('The track artist')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('album')
				.setDescription('The track album')
				.setRequired(false))
		.addStringOption(option =>
			option.setName('genre')
				.setDescription('The track genres, divided by commas')
				.setRequired(false))
		.addStringOption(option =>
			option.setName('cover')
				.setDescription('The track cover link')
				.setRequired(false))
		.addStringOption(option =>
			option.setName('link')
				.setDescription('The track link')	
				.setRequired(false)),
	async execute(interaction) {
		await interaction.reply({ content: 'Adding track...', ephemeral: true })
		await writeRawTrack(
			{
				
				track: interaction.options.getString('track'),
				artist: interaction.options.getString('artist'),
				album: interaction.options.getString('album'),
				genre: interaction.options.getString('album'),
				cover: interaction.options.getString('cover'),
				link: interaction.options.getString('link')
			}
		)

		const trackEmbed = {
			color: 0xfeda32,
			title: trackInfo.track,
			url: trackInfo.link,
			description: `Artist: ${trackInfo.artist}\nAlbum: ${trackInfo.album}\nGenre: ${trackInfo.genre}`,
			thumbnail: {
				url: trackInfo.cover,
			},
		}

		await interaction.editReply({ embeds: [trackEmbed], content: '', ephemeral: true })
	}
}