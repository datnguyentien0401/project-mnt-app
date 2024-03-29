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

export const getAllMembersByTeamId = async (teamId: number) => {
  const response = await axios.get(`${baseUrl}${teamPath}/team/${teamId}`)
  return response.data
}

export const getAllMembers = async () => {
  const response = await axios.get(`${baseUrl}${teamPath}`)
  return response.data
}

export const createMember = async (body: MemberRequest) => {
  const response = await axios.post(
    `${baseUrl}${teamPath}`,
    JSON.stringify(body),
    headers,
  )
  return response.data
}

export const deleteMember = async (id: number) => {
  await axios.delete(`${baseUrl}${teamPath}/${id}`)
}
