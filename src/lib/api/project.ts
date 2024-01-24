import axios, { HttpStatusCode } from "axios"
import AppConfig from "@/config"

const baseUrl = AppConfig.API_URL

export const getAllEpic = async (groupEpic: boolean = true) => {
  const response = await axios.get(`${baseUrl}/api/v1/projects/epic`,
    {
      params: {
        groupEpic: groupEpic
      }
    })
  if (response.status != HttpStatusCode.Ok) {
    console.error("Error fetching data:", response)
    return []
  }
  return response.data
}

export const searchProject = async (projectIds: string[], fromDate: string, toDate: string) => {
  const projectIdsStr = projectIds ? projectIds.join(",") : ""
  const response = await axios.get(`${baseUrl}/api/v1/projects/search`, {
    params: {
      fromDate: fromDate,
      toDate: toDate,
      projectIds: projectIdsStr
    }
  })
  if (response.status != HttpStatusCode.Ok) {
    console.error("Error fetching data:", response)
    return []
  }
  return response.data
}

export const getProjectRemaining = async (projectIds?: string[]) => {
  const projectIdsStr = projectIds ? projectIds.join(",") : ""
  const response = await axios.get(`${baseUrl}/api/v1/projects/remaining`,
    {
      params: {
        projectIds: projectIdsStr
      }
    })
  if (response.status != HttpStatusCode.Ok) {
    console.error("Error fetching data:", response)
    return []
  }
  return response.data
}
