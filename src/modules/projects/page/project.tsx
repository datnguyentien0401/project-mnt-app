'use client'
import React, { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { Card, Select, Spin } from 'antd'
import ProjectTable from '@/modules/projects/component/project-table'
import ProjectSearchForm from '@/modules/projects/component/project-search-form'
import { ProjectSearchType, type ProjectStatistic } from '@/types/common'
import ProjectChart from '@/modules/projects/component/project-chart'
import MainLayout from '@/modules/ui/layout/main-layout'
import { getAllEpic, getAllJiraProject, searchProject } from '@/lib/api/project'
import IssueChart from '@/modules/projects/component/issue-chart'

const ProjectList = () => {
  const [tableData, setTableData] = useState<ProjectStatistic[]>([])
  const [chartData, setChartData] = useState<ProjectStatistic[]>([])
  const [lineChartType, setLineChartType] = useState('totalResolvedIssue')
  const [projectOptions, setProjectOptions] = useState<any[]>([])
  const [jiraProjectOptions, setJiraProjectOptions] = useState<any[]>([])
  const [isFetching, setIsFetching] = useState(false)

  const initialValues = useMemo(() => {
    return {
      toDate: dayjs().subtract(0, 'month'),
      fromDate: dayjs().subtract(2, 'month'),
      type: 'totalResolvedIssue',
    }
  }, [])

  const fetchJiraProjects = () => {
    setIsFetching(true)
    getAllJiraProject().then((data: any) =>
      setJiraProjectOptions(
        data.map((epic: any) => ({
          value: epic.id,
          label: epic.name,
        })),
      ),
    )
    setIsFetching(false)
  }

  useEffect(() => {
    fetchJiraProjects()
  }, [])

  const fetchProjectStatistic = async (
    projectIds: string[],
    type: ProjectSearchType,
    fromDate: any,
    toDate: any,
  ) => {
    if (projectIds.length == 0) {
      return
    }
    const data = await searchProject(
      projectIds,
      type,
      fromDate.format('YYYYMMDD'),
      toDate.format('YYYYMMDD'),
    )
    setTableData(data.totalData)
    setChartData(data.listData)
  }

  const onSearch = async (values: Record<string, any>) => {
    setIsFetching(true)
    const chartType = values.type
    let searchType: ProjectSearchType
    switch (chartType) {
      case 'totalTimeSpentMD':
        searchType = ProjectSearchType.TIME_SPENT_MD
        break
      case 'totalTimeSpentMM':
        searchType = ProjectSearchType.TIME_SPENT_MM
        break
      case 'totalStoryPoint':
        searchType = ProjectSearchType.STORY_POINT
        break
      case 'totalResolvedIssue':
        searchType = ProjectSearchType.RESOLVED_ISSUE
        break
      default:
        searchType = ProjectSearchType.RESOLVED_ISSUE
    }

    await fetchProjectStatistic(
      values.projectId || projectOptions.map((opt) => opt.value),
      searchType,
      values.fromDate,
      values.toDate,
    )
    setLineChartType(chartType)
    setIsFetching(false)
  }

  const handleChangeJiraProject = async (jiraProjects: any[]) => {
    setProjectOptions([])
    setChartData([])
    setTableData([])
    if (jiraProjects.length > 0) {
      setIsFetching(true)
      const epics = (await getAllEpic(jiraProjects)) || []
      setProjectOptions(
        epics.map((epic: any) => ({
          value: epic.projectId,
          label: epic.projectName,
        })),
      )
      setIsFetching(false)
    }
  }

  return (
    <>
      <MainLayout headerName="Project">
        <Spin spinning={isFetching}>
          <Card className="max-w-full mb-6">
            <Select
              options={jiraProjectOptions}
              mode="multiple"
              popupClassName="capitalize"
              placeholder="Jira Project"
              filterOption={(input, option) =>
                option.label.toLowerCase().includes(input.toLowerCase())
              }
              style={{ width: 300 }}
              onChange={(value) => handleChangeJiraProject(value)}
            />
          </Card>

          {projectOptions.length > 0 && (
            <>
              <ProjectSearchForm
                initialValues={initialValues}
                onSubmit={onSearch}
                projectOptions={projectOptions}
              />
              <ProjectChart data={chartData} lineChartType={lineChartType} />
              <IssueChart data={chartData} />
              <ProjectTable tableData={tableData} />
            </>
          )}
        </Spin>
      </MainLayout>
    </>
  )
}

export default ProjectList
