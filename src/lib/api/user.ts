import axios from 'axios'
import AppConfig from '@/config'

const baseUrl = AppConfig.API_URL
export const getUsers = async (username: string) => {
  return await axios.get(`${baseUrl}/api/v1/users/search`, {
    params: {
      username: username,
    },
  })
}
