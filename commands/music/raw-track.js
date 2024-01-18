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
			option.setName('genre')
				.setDescription('The track genres, divided by commas')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('style')
				.setDescription('The track styles, divided by commas')
				.setRequired(false))
		.addStringOption(option =>
			option.setName('link')
				.setDescription('The track discogs or other platform link')	
				.setRequired(false))
		.addStringOption(option =>
			option.setName('cover')
				.setDescription('The track discogs or other platform link')	
				.setRequired(false)),
	async execute(interaction) {
		//const trackData = interaction.options.getString('nts_track')

		await interaction.reply({ content: 'Adding track...', ephemeral: true })

		await writeRawTrack(
			{
				track: interaction.options.getString('track'),
				artist: interaction.options.getString('artist'),
				genre: interaction.options.getString('genre'),
				style: interaction.options.getString('style'),
				link: interaction.options.getString('link'),
				cover: interaction.options.getString('cover')
			}
		)

		await interaction.editReply({ content: 'ダン' })
	}
}