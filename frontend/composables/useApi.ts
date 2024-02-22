import http from 'axios'

const axios = http.create({
  baseURL: import.meta.env.APP_API_URL
})

export const useApi = async () => {
  const data = await axios.get('/music')
  console.log(data)
}
