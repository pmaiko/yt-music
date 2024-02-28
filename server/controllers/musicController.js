import axios from 'axios'
import ytdl from 'ytdl-core'
import ffmpeg from 'fluent-ffmpeg'
import ffmpegPath from '@ffmpeg-installer/ffmpeg'
import { sefonParser } from '../modules/SefonParser.js'
import { fmParser } from '../modules/FmParser.js'

ffmpeg.setFfmpegPath(ffmpegPath.path)

export const musicController = async (req, res) => {
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

  let ytList = data.items || null
  if (ytList) {
    ytList = await Promise.all(ytList.map(async (item) => {
      const videoId = item.snippet.resourceId.videoId
      const videoOwnerChannelTitle = item.snippet.videoOwnerChannelTitle
      const title = item.snippet.title
      const description = item.snippet.description

      let audioURL = null
      let format = null

      try {
        const info = await ytdl.getInfo(videoId)
        format = ytdl.chooseFormat(info.formats, { quality: '140' })
        audioURL = format.url
      } catch (event) {
        console.error('Error chooseFormat')
      }

      const searchStr1 = (`${videoOwnerChannelTitle} ${title}`).replace(/(\([^)]*\)|\[[^\]]*\])/g, '')
      const searchStr2 = (title).replace(/(\([^)]*\)|\[[^\]]*\])/g, '')

      return {
        id: item.id,
        videoOwnerChannelTitle,
        videoId: videoId,
        title: title,
        description: addThreeDots(description),
        image: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.default?.url,
        audioURL,

        search: {
          savefrom: `http://savefrom.net/?url=https://www.youtube.com/watch?v=${videoId}`,
          sefon: [
            await sefonParser(searchStr1),
            await sefonParser(searchStr2)
          ],
          fm: [
            await fmParser(searchStr1),
            await fmParser(searchStr2)
          ]
        }
      }
    }))
  }

  res.send(ytList)
}

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
