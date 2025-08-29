import axios from 'axios'

import { parse } from 'node-html-parser'
// import { HttpsProxyAgent } from 'https-proxy-agent'
const domain = 'https://ru.sefon.pro'

export const sefonParser = async (search) => {
  try {
    return `${domain}/search/?q=${encodeURIComponent(search)}`

    // eslint-disable-next-line no-unreachable
    const { data } = await axios.get(`${domain}/search/?q=${encodeURIComponent(search)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:52.0) Gecko/20100101 Firefox/52.0'
      }
    })
    const root = parse(data)

    const $blocksMp3 = root.querySelectorAll('.b_list_mp3s .mp3')

    const href = $blocksMp3?.[0]?.querySelector('.download a')?.getAttribute('href')

    if (href) {
      const detailUrl = `${domain}${href}`

      const { data } = await axios.get(detailUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:52.0) Gecko/20100101 Firefox/52.0'
        }
      })
      const root = parse(data)
      const hrefAttribute = root.querySelector('.b_song_info .main .b_btn.download')?.getAttribute('href')
      const keysAttribute = root.querySelector('.b_song_info .main .b_btn.download')?.getAttribute('data-key')

      const url = decodeHref(hrefAttribute, keysAttribute)
      if (url) {
        return `${domain}${url}`
      }
    }
  } catch (error) {
    console.log('Error SefonParser', error)
  }
}

function decodeHref (hrefAttribute, keysAttribute) {
  let url = hrefAttribute.substring(0, 1) === '#' ? hrefAttribute.substring(1) : hrefAttribute
  const keysArray = keysAttribute.split('').reverse()

  keysArray.forEach(function (key) {
    url = url.split(key).reverse().join(key)
  })

  if (url) {
    return atob(url)
  }
}
