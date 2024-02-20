import axios from 'axios'

import { parse } from 'node-html-parser'
import { IP2Proxy } from 'ip2proxy-nodejs'
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

let ip2proxy = new IP2Proxy();

const domain = 'https://sefon.pro'
export const sefonParser = async (search) => {
  if (ip2proxy.open(resolve(__dirname, '../IP2LOCATION-LITE-DB1.BIN')) === 0) {
    console.log("GetModuleVersion: " + ip2proxy.getModuleVersion());
    console.log("GetPackageVersion: " + ip2proxy.getPackageVersion());
    console.log("GetDatabaseVersion: " + ip2proxy.getDatabaseVersion());
  }
  try {
    //
    const { data } = await axios.get(`${domain}/search/?q=${encodeURIComponent(search)}`)
    const root = parse(data)

    const $blocksMp3 = root.querySelectorAll('.b_list_mp3s .mp3')

    const href = $blocksMp3?.[0]?.querySelector('.download a')?.getAttribute('href')

    if (href) {
      const detailUrl = `${domain}${href}`

      const { data } = await axios.get(detailUrl)
      const root = parse(data)
      const hrefAttribute = root.querySelector('.b_song_info .main .b_btn.download')?.getAttribute('href')
      const keysAttribute = root.querySelector('.b_song_info .main .b_btn.download')?.getAttribute('data-key')

      const url = decodeHref(hrefAttribute, keysAttribute)
      if (url) {
        return `${domain}${url}`
      }
    }
  } catch (event) {
    console.log(event)
    // console.log('Error SefonParser')
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
