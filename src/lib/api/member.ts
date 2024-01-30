import axios, { HttpStatusCode } from 'axios'
import AppConfig from '@/config'
import { MemberRequest } from '@/types/common'

const baseUrl = AppConfig.API_URL
const teamPath = '/api/v1/members'

const headers = {
  headers: {
    'Content-Type': 'application/json',
  },
}

export const getAllMembers = async () => {
  const response = await axios.get(`${baseUrl}${teamPath}`)
  if (response.status != HttpStatusCode.Ok) {
    console.error('Error fetching data:', response)
    return []
  }
  return response.data
}

export const createMember = async (body: MemberRequest) => {
  const response = await axios.post(
    `${baseUrl}${teamPath}`,
    JSON.stringify(body),
    headers,
  )
  if (response.status != HttpStatusCode.Created) {
    console.error('Error save data:', response)
    return null
  }
  return response.data
}

export const deleteMember = async (id: number) => {
  const response = await axios.delete(`${baseUrl}${teamPath}/${id}`)
  if (response.status != HttpStatusCode.Ok) {
    console.error('Error delete data:', response)
  }
}
