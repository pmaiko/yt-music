import axios from 'axios'
import ytdl from 'ytdl-core'
import ffmpeg from 'fluent-ffmpeg'
import { Readable } from 'stream'
import ffmpegPath from '@ffmpeg-installer/ffmpeg'
import { fix } from '@ludovicm67/webm-tools'
import { EbmlStreamDecoder, EbmlStreamEncoder, EbmlTagId } from 'ebml-stream'
import ebml from 'ebml'
import fs from 'fs'
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
  const query = req.query
  const range = {
    start: +query.start,
    end: +query.end
  }
  const prevRange = {
    start: +query.prevStart,
    end: +query.prevEnd
  }

  try {
    const info = await ytdl.getInfo(videoId)
    const format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' })
    const title = info.videoDetails.title
    const lengthSeconds = info.videoDetails.lengthSeconds
    const contentLength = format.contentLength
    const sanitizedTitle = encodeURIComponent(title)
    // res.setHeader('Content-Type', 'audio/mpeg')
    res.setHeader('Content-Type', 'audio/webm')
    // res.setHeader('Content-Type', 'application/octet-stream')
    res.setHeader('Content-Disposition', `attachment; filename=${sanitizedTitle}.webm`)
    // res.setHeader('lengthSeconds', lengthSeconds)
    // res.setHeader('Content-Length', contentLength)
    // res.setHeader('Transfer-Encoding', 'chunked')

    const startReadable = ytdl(videoId, {quality: 'highestaudio', range: { start: 1024, end: 1024 * 10 } })
    const metaBuffer = await getMeta(startReadable)
    // console.log(startReadable)
    // const data = await streamToBuffer(startReadable)
    // console.log('streamToBuffer')
    // fs.createWriteStream('audioout.webm').write(metaBuffer)
    // res.write(metaBuffer)
    // res.end()
    const buffer = await streamToBuffer(ytdl(videoId, {quality: 'highestaudio', range }))

    // const headerStream = new Readable()
    // headerStream.push(header)
    // headerStream.push(null)  // Конец потока заголовка
    //
    // const combinedStream = new Readable()
    // combinedStream._read = () => {}
    // combinedStream.push(header)
    // readable.on('data', (chunk) => {
    //   combinedStream.push(chunk)
    // })
    // readable.on('end', () => {
    //   combinedStream.push(null)  // Конец потока данных
    // })

    // readable.pipe(res)
    // const response = await axios.get(format.url + `&range=${query.start}-${query.end}`, {
    //   // responseType: 'arraybuffer'
    //   params: {
    //     ump: 1
    //   }
    // })
    // console.log(response)
    // const readable = new Readable()
    // readable._read = () => {}
    // readable.push(response.data)
    // readable.push(null)
    // readable.on('progress', () => {
    // })
    // readable.on('data', () => {})

    // console.log('metaBuffer', metaBuffer)
    // console.log('buffer', buffer)
    const fixedBuffer = range.start > 0 ? Buffer.concat([metaBuffer, buffer]) : buffer
    const readable = new Readable()
    readable._read = () => {}
    readable.push(fixedBuffer)
    readable.push(null)

    ffmpeg()
      .input(readable)
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
//
// async function createWebMFile(buffer) {
//   // Create a new WebM file
//   const webm = createWebM()
//
//   const localCluster = cluster()
//   webm.add(localCluster)
//
//   const block = simpleBlock()
//   block.setTimecode(0)
//   block.addFrame(buffer)
//   cluster.add(block)
// }

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
        // console.log(chunk)
        // const metadataTags = ['Segment', 'Info', 'Tracks', 'Cues', 'SimpleBlock']
        // const requiredTags = ['Segment', 'Tracks', 'Cues']
        // const encoder = new EbmlStreamEncoder()
        // encoder.writeTag(chunk)
        // encoder.end()
        // const data = await streamToBuffer(encoder)
        // if (['Segment', 'Info', 'Tracks', 'Cues'].includes(tagName)) {
        //   metadataData.push(chunk)
        // }

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
        // const buffer = Buffer.concat(metadataData)
        // // const buffer = await streamToBuffer(encoder)
        // console.log('Cluster header extracted successfully.')
        // console.log(counts)

        metadataData.forEach(chunk => ebmlEncoder.write(chunk))
        const buffer = ebmlEncoder.read()

        resolve(buffer)
      })
      .on('error', (err) => {
        reject(err)
      })
    // parser.on('data', (chunk) => {
    //   if (chunk[0].name === 'Cluster' && chunk[0].type === 'm') {
    //     console.log(123123123)
    //     clusterHeaderData = Buffer.concat([clusterHeaderData, chunk[1].toBuffer()])
    //   }
    // })
  })
}
