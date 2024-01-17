const axios = require('axios')

exports.searchTrack = async (track, artist) => {
	const token = process.env.DISCOGS_TOKEN
	
	let config = {
		method: 'get',
		maxBodyLength: Infinity,
		url: `https://api.discogs.com/database/search?query=${track}&token=${token}&artist=${artist}`
	}

	const response = await axios.request(config)
	const result = response.data.results[0]
	//console.log(JSON.stringify(result, null, 4))

	console.log(result.title, result.genre, result.resource_url)

	return {
		title: result.title,
		genre: result.genre,
		style : result.style,
		url: result.resource_url,
		cover : result.cover_image
	}
}