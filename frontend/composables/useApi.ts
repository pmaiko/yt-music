import { MusicItem, PageInfo } from '~/types'
import http, { AxiosResponse } from 'axios'

const axios = http.create({
  baseURL: import.meta.env.APP_API_URL
})

export const useApi = () => {

  const getMusic = async (pageToken: string | null) : Promise<AxiosResponse<{
    items: Array<MusicItem>,
    pageInfo: PageInfo
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
