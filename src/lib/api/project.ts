import axios, { HttpStatusCode } from 'axios'
import AppConfig from '@/config'

const baseUrl = AppConfig.API_URL

export const getAllEpic = async (
  jiraProject: string[] = [],
  groupEpic: boolean = true,
) => {
  const response = await axios.get(`${baseUrl}/api/v1/projects/epic`, {
    params: {
      jiraProjectIds: jiraProject ? jiraProject.join(',') : '',
      groupEpic: groupEpic,
    },
  })
  return response.data
}

export const searchProject = async (
  projectIds: string[],
  fromDate: string,
  toDate: string,
) => {
  const epicIdsStr = projectIds ? projectIds.join(',') : ''
  const response = await axios.get(`${baseUrl}/api/v1/projects/epic/search`, {
    params: {
      fromDate: fromDate,
      toDate: toDate,
      epicIds: epicIdsStr,
    },
  })
  return response.data
}

export const getProjectRemaining = async (projectIds?: string[]) => {
  const projectIdsStr = projectIds ? projectIds.join(',') : ''
  const response = await axios.get(`${baseUrl}/api/v1/projects/remaining`, {
    params: {
      projectIds: projectIdsStr,
    },
  })
  return response.data
}

export const getAllJiraProject = async () => {
  const response = await axios.get(`${baseUrl}/api/v1/projects/search`)
  return response.data
}
