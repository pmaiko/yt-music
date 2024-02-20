import express from 'express'
import axios from 'axios'
import { sefonParser } from './modules/SefonParser.js'
import { fmParser } from './modules/FmParser.js'

const app = express()
const port = 3000
app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', async (req, res) => {
  const host = 'https://www.googleapis.com/youtube/v3/playlistItems'
  const playlistId = 'PLRUeMuoAjPeAEAPYC6wOWTkto-fXC5GRh'
  const perPage = 20

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

      const searchStr1 = (`${videoOwnerChannelTitle} ${title}`).replace(/(\([^)]*\)|\[[^\]]*\])/g, '')
      const searchStr2 = (title).replace(/(\([^)]*\)|\[[^\]]*\])/g, '')

      const sefonMp3 = await sefonParser(searchStr1) || await sefonParser(searchStr2)
      const fmMp3 = sefonMp3 || await fmParser(searchStr1) || await fmParser(searchStr2)

      return {
        id: item.id,
        videoOwnerChannelTitle,
        videoId: videoId,
        title: title,
        description: addThreeDots(description),
        image: item.snippet.thumbnails.default.url,
        saveFrom: `http://savefrom.net/?url=https://www.youtube.com/watch?v=${videoId}`,
        mp3: sefonMp3 || fmMp3
      }
    }))


    // console.log(ytVideoList)
    res.render('index', {
      title: 'START',
      description: 'description',
      items: ytVideoList
    })
  }
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
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
