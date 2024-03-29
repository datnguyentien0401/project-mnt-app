import axios, { HttpStatusCode } from 'axios'
import AppConfig from '@/config'

const baseUrl = AppConfig.API_URL
const planningPath = '/api/v1/plannings'

const headers = {
  headers: {
    'Content-Type': 'application/json',
  },
}

export const getAllPlanning = async () => {
  const response = await axios.get(`${baseUrl}${planningPath}`)
  return response.data
}

export const createPlanning = async (body: any) => {
  const response = await axios.post(
    `${baseUrl}${planningPath}`,
    JSON.stringify(body),
    headers,
  )
  return response.data
}

export const updatePlanning = async (id: number, body: any) => {
  const response = await axios.put(
    `${baseUrl}${planningPath}/${id}`,
    JSON.stringify(body),
    headers,
  )
  return response.data
}

export const deletePlanning = async (id: number) => {
  await axios.delete(`${baseUrl}${planningPath}/${id}`)
}
