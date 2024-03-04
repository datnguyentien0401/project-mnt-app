import axios, { HttpStatusCode } from 'axios'
import dayjs, { Dayjs } from 'dayjs'
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
  if (response.status !== HttpStatusCode.Ok) {
    console.error('Error fetching data:', response)
    return []
  }
  return response.data
}

export const createTeam = async (body: TeamRequest) => {
  const response = await axios.post(
    `${baseUrl}${teamPath}`,
    JSON.stringify(body),
    headers,
  )
  if (response.status !== HttpStatusCode.Created) {
    console.error('Error save data:', response)
    return null
  }
  return response.data
}

export const deleteTeam = async (id: number) => {
  const response = await axios.delete(`${baseUrl}${teamPath}/${id}`)
  if (response.status !== HttpStatusCode.Ok) {
    console.error('Error delete data:', response)
  }
}

export const getOverall = async (fromDate: Date, toDate: Date) => {
  const response = await axios.get(`${baseUrl}${teamPath}/overall`, {
    params: {
      fromDate: dayjs(fromDate).format('YYYYMMDD'),
      toDate: dayjs(toDate).format('YYYYMMDD'),
    },
  })
  if (response.status !== HttpStatusCode.Ok) {
    console.error('Error fetching data:', response)
    return []
  }
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
