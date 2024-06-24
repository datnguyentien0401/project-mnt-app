import axios from 'axios'
import AppConfig from '@/config'
import { ProjectSearchType } from '@/types/common'

const baseUrl = AppConfig.API_URL

export const getAllEpic = async (
  jiraProject: string[] = [],
  groupEpic: boolean = true,
  resolvedEpic: boolean = false,
) => {
  const response = await axios.get(`${baseUrl}/api/v1/projects/epic`, {
    params: {
      jiraProjectIds: jiraProject ? jiraProject.join(',') : '',
      groupEpic: groupEpic,
      resolvedEpic: resolvedEpic,
    },
  })
  return response.data
}

export const searchProject = async (
  projectIds: string[],
  type: ProjectSearchType,
  fromDate: string,
  toDate: string,
) => {
  const epicIdsStr = projectIds ? projectIds.join(',') : ''
  const response = await axios.get(`${baseUrl}/api/v1/projects/epic/search`, {
    params: {
      fromDate: fromDate,
      type: type,
      toDate: toDate,
      epicIds: epicIdsStr,
    },
  })
  return response.data
}

export const searchJiraProject = async (
  projectIds: string[],
  type: ProjectSearchType,
  fromDate: string,
  toDate: string,
) => {
  const jiraProjectIds = projectIds ? projectIds.join(',') : ''
  const response = await axios.get(
    `${baseUrl}/api/v1/projects/jira-project/search`,
    {
      params: {
        jiraProjectIds: jiraProjectIds,
        fromDate: fromDate,
        toDate: toDate,
        type: type,
      },
    },
  )
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
