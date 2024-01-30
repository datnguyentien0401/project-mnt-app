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
  if (response.status != HttpStatusCode.Ok) {
    console.error('Error fetching data:', response)
    return []
  }
  return response.data
}

export const createPlanning = async (body: any) => {
  const response = await axios.post(
    `${baseUrl}${planningPath}`,
    JSON.stringify(body),
    headers,
  )
  if (response.status != HttpStatusCode.Created) {
    console.error('Error save data:', response)
    return null
  }
  return response.data
}

export const updatePlanning = async (id: number, body: any) => {
  const response = await axios.put(
    `${baseUrl}${planningPath}/${id}`,
    JSON.stringify(body),
    headers,
  )
  if (response.status != HttpStatusCode.Ok) {
    console.error('Error save data:', response)
    return null
  }
  return response.data
}

export const deletePlanning = async (id: number) => {
  const response = await axios.delete(`${baseUrl}${planningPath}/${id}`)
  if (response.status != HttpStatusCode.Ok) {
    console.error('Error delete data:', response)
  }
}
