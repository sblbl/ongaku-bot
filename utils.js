require('dotenv').config()
const axios = require('axios')
const { GoogleSpreadsheet } = require('google-spreadsheet')
const { JWT } = require('google-auth-library')
const qs = require('qs')

const spotifyLogin = async () => {
	const clientId = process.env.SPOTIFTY_CLIENT
	const clientSecret = process.env.SPOTIFY_TOKEN
	const accessToken = Buffer.from(`${clientId}:${clientSecret}`, 'utf-8').toString('base64')

	try {
		const tokenUrl = 'https://accounts.spotify.com/api/token'
		const data = qs.stringify({'grant_type':'client_credentials'})

		const response = await axios.post(tokenUrl, data, {
			headers: { 
				'Authorization': `Basic ${accessToken}`,
				'Content-Type': 'application/x-www-form-urlencoded' 
			}
		})
		console.log(response.data.access_token)
		return response.data.access_token
	} catch(error) {
		console.log(error)
	}
}

exports.searchTrack = async (track, artist) => {
	const accessToken = await spotifyLogin()
	// paolo conte - angiolino
	const config = {
		method: 'get',
		url: `https://api.spotify.com/v1/search`,
		params: {
			q: `${artist} - ${track}`,
			type: 'track',
			limit: 1
		},
		headers: {
			'Authorization': `Bearer ${accessToken}`
		},
		timeout: 20000
	}
	const response = await axios.request(config)
	console.log('track', response.data)
	
	const result = response.data.tracks.items[0]
	
	const data = {}

	data.track = result.name
	data.preview = result.preview_url
	data.id = result.id
	data.album = result.album.name
	data.cover = result.album.images[0].url
	data.artist = result.artists[0].name
	data.link = result.external_urls.spotify
	
	const artistId = result.artists[0].id

	const configArtist = {
		method: 'get',
		url: `https://api.spotify.com/v1/artists/${artistId}`,
		headers: {
			'Authorization': `Bearer ${accessToken}`
		},
		timeout: 20000
	}
	const responseArtist = await axios.request(configArtist)
	console.log('artist', responseArtist.data)
	
	const resultArtist = responseArtist.data
	data.genre = resultArtist.genres

	await writeTrack(data)
	return data
}

const spreadheetLogin = async (sheet = 0) => {
	const serviceAccountAuth = new JWT({
		// env var values here are copied from service account credentials generated by google
		// see "Authentication" section in docs for more info
		email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
		key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
		scopes: [
			'https://www.googleapis.com/auth/spreadsheets',
		],
	})
	const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID, serviceAccountAuth)
	await doc.loadInfo() // loads document properties and worksheets
	//console.log(doc.title)
	const spreadsheet = doc.sheetsByIndex[sheet]
	return spreadsheet
}

const writeTrack = async data => {
	console.log(data)
	const sheet = await spreadheetLogin()

	await sheet.addRow({ 
		id : data.id,
		track: data.track,
		artist: data.artist,
		album: data.album,
		genre: data.genre.toString(),
		cover: data.cover,
		link: data.link,
		preview: data.preview
	})
}

exports.writeRawTrack = async data => {
	const sheet = await spreadheetLogin()
	
	await sheet.addRow({ 
		id : data.id,
		track: data.track,
		artist: data.artist,
		album: data.album,
		genre: data.genre,
		cover: data.cover,
		link: data.link,
		preview: data.preview
	})
}

exports.pokemon = async () => {
	const config = {
		method: 'get',
		maxBodyLength: Infinity,
		url: 'https://pokeapi.co/api/v2/pokemon/ditto',
		headers: { }
	}

	const response = await axios.request(config)	
	console.log('pokemon', JSON.stringify(response.data.forms[0].name))
}