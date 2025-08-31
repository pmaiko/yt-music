import axios from 'axios'
import { parse } from 'node-html-parser'

const domain = 'https://mp3wr.com'

export const mp3wrParser = async (search: string) => {
  try {
    const slug = search
      .toLowerCase()
      .replace(/[\s-]+/g, '-')
      .replace(/^-|-$/g, '')

    const { data } = await axios.get(`${domain}/search/${encodeURIComponent(slug)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:52.0) Gecko/20100101 Firefox/52.0'
      }
    })

    const root = parse(data)
    const $block = root.querySelectorAll('.list-group-item[data-id]')
    return $block[0]?.getAttribute('data-id') || ''
  } catch (error) {
    console.log('Error Mp3wrParser', error)
  }
}