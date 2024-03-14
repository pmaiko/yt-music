import axios from 'axios'
import ytdl from 'ytdl-core'
import ffmpeg from 'fluent-ffmpeg'
import ffmpegPath from '@ffmpeg-installer/ffmpeg'
import { sefonParser } from '../modules/SefonParser.js'
import { fmParser } from '../modules/FmParser.js'
// import { HttpsProxyAgent } from 'https-proxy-agent'
//
// console.log(HttpsProxyAgent)
// const proxy = 'http://23.227.38.217'
// const agent = new HttpsProxyAgent(proxy)

ffmpeg.setFfmpegPath(ffmpegPath.path)

export const musicController = async (req, res) => {
  const host = 'https://www.googleapis.com/youtube/v3/playlistItems'
  const playlistId = 'PLRUeMuoAjPeAEAPYC6wOWTkto-fXC5GRh'
  const perPage = 10
  const pageToken = req.query.pageToken || null

  const { data } = await axios.get(host, {
    params: {
      key: 'AIzaSyAqsPiR5CDAFGEyMwWBhSY2OHbkExcYHh8',
      part: 'id,snippet',
      playlistId,
      maxResults: perPage,
      pageToken
    },
  })

  let items = data.items || null
  if (items) {
    items = await Promise.all(items.map(async (item) => {
      const videoId = item.snippet.resourceId.videoId
      const videoOwnerChannelTitle = item.snippet.videoOwnerChannelTitle
      const title = item.snippet.title
      const description = item.snippet.description

      let audioSrc = null
      let format = null

      try {
        const info = await ytdl.getInfo(videoId)
        format = ytdl.chooseFormat(info.formats, { quality: '140' })
        audioSrc = format.url
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
        src: audioSrc,

        links: {
          saveFrom: `http://savefrom.net/?url=https://www.youtube.com/watch?v=${videoId}`,
          seFon: [
            await sefonParser(searchStr2),
            await sefonParser(searchStr1)
          ],
          fm: [
            await fmParser(searchStr2),
            await fmParser(searchStr1)
          ]
        }
      }
    }))
  }

  res.send({
    items,
    pageInfo: {
      total: data?.pageInfo?.totalResults || null,
      perPage,
      pageToken: data?.nextPageToken || null
    }
  })
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
