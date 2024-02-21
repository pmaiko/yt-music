import express from 'express'
import ViteExpress from 'vite-express'
import axios from 'axios'
import ytdl from 'ytdl-core'
import { sefonParser } from './modules/SefonParser.js'
import { fmParser } from './modules/FmParser.js'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const app = express()
const port = 3000

app.use(express.static('dist'))
app.get('/api', async (req, res) => {
  const host = 'https://www.googleapis.com/youtube/v3/playlistItems'
  const playlistId = 'PLRUeMuoAjPeAEAPYC6wOWTkto-fXC5GRh'
  const perPage = 10

  const { data } = await axios.get(host, {
    params: {
      key: 'AIzaSyAqsPiR5CDAFGEyMwWBhSY2OHbkExcYHh8',
      part: 'id,snippet',
      playlistId,
      maxResults: perPage
    },
  })

  let ytVideoList = data.items
  if (ytVideoList) {
    ytVideoList = await Promise.all(ytVideoList.map(async (item) => {
      const videoId = item.snippet.resourceId.videoId
      const videoOwnerChannelTitle = item.snippet.videoOwnerChannelTitle
      const title = item.snippet.title
      const description = item.snippet.description

      let info = await ytdl.getInfo(videoId)
      let format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' })

      const searchStr1 = (`${videoOwnerChannelTitle} ${title}`).replace(/(\([^)]*\)|\[[^\]]*\])/g, '')
      const searchStr2 = (title).replace(/(\([^)]*\)|\[[^\]]*\])/g, '')

      return {
        id: item.id,
        videoOwnerChannelTitle,
        videoId: videoId,
        title: title,
        description: addThreeDots(description),
        image: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.default?.url,
        saveFrom: `http://savefrom.net/?url=https://www.youtube.com/watch?v=${videoId}`,
        sefonSearchLink1: await sefonParser(searchStr1),
        sefonSearchLink2: await sefonParser(searchStr2),
        fmSearchLink1: await fmParser(searchStr1),
        fmSearchLink2: await fmParser(searchStr2),
        audio: format.url
      }
    }))

    res.send(ytVideoList)
  }
})

ViteExpress.listen(app, port, () => {
  console.log(`App listening on port http://localhost:${port}`)
})

function addThreeDots (text, limit = 200) {
  text = text.trim()
  if (text.length <= limit) return text
  text = text.slice(0, limit)
  const lastSpace = text.lastIndexOf(' ')
  if (lastSpace > 0) {
    text = text.substr(0, lastSpace)
  }
  return text + '...'
}
