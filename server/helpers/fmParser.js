import axios from 'axios'

import { parse } from 'node-html-parser'

const domain = 'https://z3.fm'
export const fmParser = async (search) => {
  try {
    return `${domain}/mp3/search?keywords=${encodeURIComponent(search)}`
    // eslint-disable-next-line no-unreachable
    const response = await axios.get(`${domain}`)
    const cookies = response.headers['set-cookie']
    const { data } = await axios.get(`${domain}/mp3/search?keywords=${encodeURIComponent(search)}`, {
      headers: {
        'Cookie': cookies.join('; ')
      },
    })
    const root = parse(data)
    const $blocksMp3 = root.querySelectorAll('.whb_wrap .song-download')
    const sid = $blocksMp3?.[0]?.getAttribute('data-sid')

    if (sid) {
      return `${domain}/ajax/inc/${sid}`
    }
  } catch (error) {
    console.log('Error FmParser', error)
  }
}
