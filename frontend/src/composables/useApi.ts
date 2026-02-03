import { MusicItem, PageInfo } from '~/types'
import http, { AxiosResponse } from 'axios'

console.log(import.meta.env)

const axios = http.create({
  baseURL: import.meta.env.VITE_API_URL
})

export const useApi = () => {

  const getMusic = async (pageToken: string | null) : Promise<AxiosResponse<{
    data: Array<MusicItem>,
    meta: PageInfo
  }>> => {
    return await axios.get('/music', {
      params: {
        pageToken
      }
    })
  }

  return {
    getMusic,
    axios
  }
}
