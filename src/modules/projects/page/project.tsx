'use client'
import React, { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { Card, Form, Select, Spin } from 'antd'
import ProjectTable from '@/modules/projects/component/project-table'
import ProjectSearchForm from '@/modules/projects/component/project-search-form'
import { ProjectSearchType, type ProjectStatistic } from '@/types/common'
import ProjectChart from '@/modules/projects/component/project-chart'
import MainLayout from '@/modules/ui/layout/main-layout'
import { getAllEpic, getAllJiraProject, searchProject } from '@/lib/api/project'
import IssueChart from '@/modules/projects/component/issue-chart'

const timeSpentChartTypes = ['totalTimeSpentMD', 'totalTimeSpentMM']

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
      type: 'totalTimeSpentMM',
    }
  }, [])

  const fetchJiraProjects = () => {
    setIsFetching(true)
    getAllJiraProject().then((data: any) =>
      setJiraProjectOptions(
        data.map((project: any) => ({
          value: project.id,
          label: project.name,
        })),
      ),
    )
    setIsFetching(false)
  }

  useEffect(() => {
    fetchJiraProjects()
  }, [])

  const fetchProjectStatistic = async (
    pickProjectIds: string[],
    type: ProjectSearchType,
    fromDate: any,
    toDate: any,
  ) => {
    let data: { totalData: []; listData: [] } = { totalData: [], listData: [] }

    const projectIds =
      pickProjectIds && pickProjectIds.length
        ? pickProjectIds
        : projectOptions.map((opt) => opt.value)

    if (projectIds.length == 0) {
      return
    }
    data = await searchProject(
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
      values.projectId,
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
      const epics = (await getAllEpic(jiraProjects, true, true)) || []
      setProjectOptions(
        epics.map((epic: any) => ({
          value: epic.projectId,
          label: epic.projectName,
        })),
      )
      setIsFetching(false)
    }
  }

  const [form] = Form.useForm()

  return (
    <>
      <MainLayout headerName="Project">
        <Spin spinning={isFetching}>
          <Form form={form} layout="vertical" autoComplete="off">
            <Card className="max-w-full mb-6">
              <Form.Item name="jiraProjectId">
                <Select
                  options={jiraProjectOptions}
                  mode="multiple"
                  popupClassName="capitalize"
                  placeholder="Jira Project"
                  filterOption={(input, option) =>
                    option.label.toLowerCase().includes(input.toLowerCase())
                  }
                  className="w-full"
                  onChange={(value) => handleChangeJiraProject(value)}
                />
              </Form.Item>
            </Card>
          </Form>
          {projectOptions.length > 0 && (
            <>
              <ProjectSearchForm
                initialValues={initialValues}
                onSubmit={onSearch}
                projectOptions={projectOptions}
                form={form}
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
