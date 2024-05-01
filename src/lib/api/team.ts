import axios from 'axios'
import dayjs from 'dayjs'
import AppConfig from '@/config'
import { TeamRequest } from '@/types/common'

const baseUrl = AppConfig.API_URL
const teamPath = '/api/v1/teams'

const headers = {
  headers: {
    'Content-Type': 'application/json',
  },
}

export const getAllTeams = async () => {
  const response = await axios.get(`${baseUrl}${teamPath}`)
  return response.data
}

export const createTeam = async (body: TeamRequest) => {
  const response = await axios.post(
    `${baseUrl}${teamPath}`,
    JSON.stringify(body),
    headers,
  )
  return response.data
}

export const deleteTeam = async (id: number) => {
  await axios.delete(`${baseUrl}${teamPath}/${id}`)
}

export const getOverall = async (fromDate: Date, toDate: Date) => {
  const response = await axios.get(`${baseUrl}${teamPath}/overall`, {
    params: {
      fromDate: dayjs(fromDate).format('YYYYMMDD'),
      toDate: dayjs(toDate).format('YYYYMMDD'),
    },
  })
  return response.data
}

export const getTeamView = async (
  teamId: number,
  fromDate: Date,
  toDate: Date,
) => {
  return await axios.get(`${baseUrl}/api/v1/teams/${teamId}/team-view`, {
    params: {
      fromDate: dayjs(fromDate).format('YYYYMMDD'),
      toDate: dayjs(toDate).format('YYYYMMDD'),
    },
  })
}
