import axios from 'axios'
import ytdl from 'ytdl-core'
import ffmpeg from 'fluent-ffmpeg'
// import { Readable } from 'stream'
import ffmpegPath from '@ffmpeg-installer/ffmpeg'
// import fs from 'fs'
// import path from 'path'
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

      try {
        const info = await ytdl.getInfo(videoId)
        const format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' })
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
        audioURL: `/api/yt-video/${videoId}`,

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

export const getAudioURL  = async (req, res) => {
  const { videoId } = req.params

  try {
    const info = await ytdl.getInfo(videoId)
    const format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' })
    const title = info.videoDetails.title
    // const lengthSeconds = info.videoDetails.lengthSeconds
    const contentLength = format.contentLength
    const sanitizedTitle = encodeURIComponent(title)
    res.setHeader('Content-Type', 'audio/mpeg')
    res.setHeader('Transfer-Encoding', 'chunked')
    res.setHeader('Content-Disposition', `attachment; filename=${sanitizedTitle}.mp3`)
    // res.setHeader('Content-Length', contentLength)

    const readable = ytdl(videoId, {quality: 'highestaudio'})
    readable.on('progress', () => {
    })
    readable.on('data', () => {})

    ffmpeg()
      .input(readable)
      .audioCodec('libmp3lame')
      .toFormat('mp3')
      .on('end', () => {
        console.log(`Conversion of ${title} finished`)
        res.end()
      })
      .on('error', (err) => {
        console.error('Error:', err)
        res.status(500).send('Internal Server Error')
      })
      .pipe(res, { end: true })

  } catch (error) {
    console.error('Error:', error)
    res.status(500).send('Internal Server Error')
  }
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
