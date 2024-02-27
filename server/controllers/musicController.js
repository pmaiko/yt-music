import axios from 'axios'
import ytdl from 'ytdl-core'
import ffmpeg from 'fluent-ffmpeg'
// import { Readable } from 'stream'
import ffmpegPath from '@ffmpeg-installer/ffmpeg'
import { EbmlStreamDecoder, EbmlStreamEncoder, EbmlTagId } from 'ebml-stream'
import fs from 'fs'
// import path from 'path'
import { sefonParser } from '../modules/SefonParser.js'
import { fmParser } from '../modules/FmParser.js'
import express from 'express'
import { resolve } from 'path'
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

      const audioURL = null
      let format = null

      try {
        const info = await ytdl.getInfo(videoId)
        format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' })
        // audioURL = format.url
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
        audioData: {
          id: item.id,
          audioURL: `/${videoId}.mp3`,
          audioApiURL: `/yt-video/${videoId}`,
          contentLength: +format?.contentLength
        },

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
  // const query = req.query
  // const range = {
  //   start: +query.start,
  //   end: +query.end
  // }
  // const prevRange = {
  //   start: +query.prevStart,
  //   end: +query.prevEnd
  // }

  try {
    const info = await ytdl.getInfo(videoId)
    // const format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' })
    const title = info.videoDetails.title
    // const lengthSeconds = info.videoDetails.lengthSeconds
    // const contentLength = format.contentLength
    // const sanitizedTitle = encodeURIComponent(title)
    // res.setHeader('Content-Type', 'audio/mpeg')
    // res.setHeader('Content-Type', 'audio/webm')
    // res.setHeader('Content-Type', 'application/octet-stream')
    // res.setHeader('Content-Disposition', `attachment; filename=${sanitizedTitle}.mp3`)
    // res.setHeader('lengthSeconds', lengthSeconds)
    // res.setHeader('Content-Length', contentLength)
    // res.setHeader('Transfer-Encoding', 'chunked')

    const audioReadable = ytdl(videoId, {quality: 'highestaudio' })

    // const readable = new Readable()
    // readable._read = () => {}
    // readable.push(audioReadable)
    // readable.push(null)

    console.log(resolve(__dirname, process.env.NODE_ENV === 'production' ? `/tmp/${videoId}.mp3` : `../tmp/${videoId}.mp3`))
    const filestream = fs.createWriteStream(resolve(__dirname, process.env.NODE_ENV === 'production' ? `/tmp/${videoId}.mp3` : `../tmp/${videoId}.mp3`))
    const fileUrl = `${videoId}.mp3`
    ffmpeg()
      .input(audioReadable)
      // .audioCodec('libmp3lame')
      // .audioCodec('aac')
      .inputFormat('webm')
      .toFormat('mp3')
      .on('end', () => {
        console.log(`Conversion of ${title} finished`)
        res.end()
      })
      .on('error', (err) => {
        console.error('Error:', err)
      })
      .pipe(filestream, { end: true })

    res.send(fileUrl)

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

function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const chunks = []
    stream.on('data', (chunk) => {
      chunks.push(chunk)
    })
    stream.on('end', () => resolve(Buffer.concat(chunks)))
    stream.on('error', reject)
  })
}

const counts = {}

function getMeta (startReadable) {
  const parser = new EbmlStreamDecoder()
  const metadataData = []
  const ebmlEncoder = new EbmlStreamEncoder()

  let isFirst = true
  return new Promise((resolve, reject) => {
    startReadable
      .pipe(parser)
      .on('data', async (chunk) => {
        const tagName = EbmlTagId[chunk.id]
        console.log(tagName)

        metadataData.push(chunk)

        if (isFirst) {
          isFirst = false
        }

        if (!counts[chunk.id]) {
          counts[chunk.id] = 0
        }
        counts[chunk.id]++

      })
      .on('finish', async () => {
        metadataData.forEach(chunk => ebmlEncoder.write(chunk))
        const buffer = ebmlEncoder.read()

        resolve(buffer)
      })
      .on('error', (err) => {
        reject(err)
      })
  })
}
