require('dotenv').config()
const fs = require('fs')
const csv = require('csv-parser')
const PlexAPI = require("plex-api");

// Configure with .env
const PLEX = {
  hostname: process.env.PLEX_HOSTNAME,
  port: process.env.PLEX_PORT,
  username: process.env.PLEX_USERNAME,
  password: process.env.PLEX_PASSWORD
}

// This covers most libraries, but you can change it to your library name if needed
const MOVIE_LIBRARY_NAME = "Movies"

// watched.csv available from your Letterboxd export at https://letterboxd.com/settings/data
const WATCHED_CSV = "watched.csv"

let watched = []
const file = fs.readFileSync(WATCHED_CSV)
fs.createReadStream(WATCHED_CSV)
  .pipe(csv())
  .on('data', (data) => watched.push(data))

const client = new PlexAPI(PLEX);

const checkWatched = async (film) => {
  const foundfilm = watched.find(f => f.Name === film.title)
  return foundfilm
}

const processFilm = async film => {
  const watched = await checkWatched(film)
  if (watched) {
    console.log(`✅ ${film.title}`)
    const url = `/:/scrobble?key=${film.ratingKey}&identifier=com.plexapp.plugins.library`
    const resp = await client.query(url)
  }
}

const getPlexFilms = async () => {
  const sectionsResp = await client.query("/library/sections")
  const { MediaContainer: { Directory } } = sectionsResp
  const movieLibrary = Directory.find(dir => dir.title === MOVIE_LIBRARY_NAME)

  const { MediaContainer: { Metadata } } = await client.query(`/library/sections/${movieLibrary.key}/all`)
  return Metadata
}

const main = async () => {
  const films = await getPlexFilms()
  await Promise.all(films.map(async film => processFilm(film)))
}

main()
