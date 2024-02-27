import { MusicItem } from '~/types'
import http, { AxiosResponse } from 'axios'

const axios = http.create({
  baseURL: import.meta.env.APP_API_URL
})

export const useApi = () => {

  const getMusic = async () : Promise<AxiosResponse<[MusicItem]>> => {
    return await axios.get('/music')
  }

  return {
    getMusic,
    axios
  }
}
