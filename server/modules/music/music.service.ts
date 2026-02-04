import axios from 'axios'
import ytdl from 'ytdl-core'
import ffmpeg from 'fluent-ffmpeg'
import ffmpegPath from '@ffmpeg-installer/ffmpeg'
import { addThreeDots } from '../../helpers/addThreeDots'
import { sefonParser } from './parsers/sefon.parser'
import { fmParser } from './parsers/fm.parser'
import { mp3wrParser } from './parsers/mp3wr.parser'

ffmpeg.setFfmpegPath(ffmpegPath.path)

export class MusicService {
  static async get({ playlistId, pageToken, perPage }: any = {}) {
    const host = 'https://www.googleapis.com/youtube/v3/playlistItems'

    const { data } = await axios.get(host, {
      params: {
        key: process.env.GOOGLE_API_KEY,
        part: 'id,snippet',
        playlistId: playlistId || 'PLRUeMuoAjPeAEAPYC6wOWTkto-fXC5GRh',
        maxResults: perPage || 10,
        pageToken
      },
    })

    let items = data.items || null

    if (items) {
      items = await Promise.all(items.map(async (item: any) => {
        const videoId = item.snippet.resourceId.videoId
        const videoOwnerChannelTitle = item.snippet.videoOwnerChannelTitle || null
        const title = item.snippet.title
        const description = item.snippet.description

        let audioSrc = null
        let format = null

        try {
          const info = await ytdl.getInfo(videoId)
          format = ytdl.chooseFormat(info.formats, { quality: '140' })
          audioSrc = format.url
        } catch (error) {
          console.error('Error chooseFormat', error)
        }

        const searchStr1 = (`${videoOwnerChannelTitle} ${title}`).replace(/(\([^)]*\)|\[[^\]]*\])/g, '')
        const searchStr2 = (title).replace(/(\([^)]*\)|\[[^\]]*\])/g, '')

        audioSrc = await mp3wrParser(searchStr2)

        return {
          id: item.id,
          videoOwnerChannelTitle,
          videoId: videoId,
          title: title,
          description: addThreeDots(description),
          image: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.default?.url || null,
          src: audioSrc,

          links: [
            {
              id: 'audioSrc',
              label: 'audio src',
              link: audioSrc
            },
            {
              id: 'youtube',
              label: 'youtube',
              link: `https://www.youtube.com/watch?v=${videoId}`
            },
            {
              id: 'saveFrom',
              label: 'saveFrom',
              link: `http://savefrom.net/?url=https://www.youtube.com/watch?v=${videoId}`
            },
            {
              id: 'seFon1',
              label: 'seFon1',
              link: await sefonParser(searchStr2)
            },
            {
              id: 'seFon2',
              label: 'seFon2',
              link: await sefonParser(searchStr1)
            },
            {
              id: 'fm1',
              label: 'fm1',
              link: await fmParser(searchStr2)
            },
            {
              id: 'fm2',
              label: 'fm2',
              link: await fmParser(searchStr1)
            }
          ]
        }
      }))
    }

    return {
      items,
      pageInfo: {
        total: data?.pageInfo?.totalResults || null,
        perPage,
        pageToken: data?.nextPageToken || null
      }
    }
  }
}
