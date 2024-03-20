'use client'
import React, { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { Card, Select, Spin } from 'antd'
import ProjectTable from '@/modules/projects/component/project-table'
import ProjectSearchForm from '@/modules/projects/component/project-search-form'
import { type ProjectStatistic } from '@/types/common'
import ProjectChart from '@/modules/projects/component/project-chart'
import MainLayout from '@/modules/ui/layout/main-layout'
import { getAllEpic, getAllJiraProject, searchProject } from '@/lib/api/project'

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

  useEffect(() => {
    fetchJiraProjects()
  }, [])

  const fetchData = async () => {
    await fetchProjectStatistic(
      [],
      initialValues.fromDate,
      initialValues.toDate,
    )
  }

  const fetchJiraProjects = async () => {
    setIsFetching(true)
    const data = await getAllJiraProject()
    setJiraProjectOptions(
      data.map((epic: any) => ({
        value: epic.id,
        label: epic.name,
      })),
    )
    setIsFetching(false)
  }

  const fetchProjectOptions = async (jiraProject: string[]) => {
    setIsFetching(true)
    const data = await getAllEpic(jiraProject)
    setProjectOptions(
      data.map((epic: any) => ({
        value: epic.projectId,
        label: epic.projectName,
      })),
    )
    setIsFetching(false)
  }

  const fetchProjectStatistic = async (
    projectIds: string[],
    fromDate: any,
    toDate: any,
  ) => {
    setIsFetching(true)
    const data = await searchProject(
      projectIds,
      fromDate.format('YYYYMMDD'),
      toDate.format('YYYYMMDD'),
    )
    setTableData(data.totalData)
    setChartData(data.listData)
    setIsFetching(false)
  }

  const onSearch = async (values: Record<string, any>) => {
    await fetchProjectStatistic(
      values.projectId,
      values.fromDate,
      values.toDate,
    )
  }

  const handleChangeJiraProject = (jiraProjects: any[]) => {
    if (jiraProjects.length > 0) {
      getAllEpic(jiraProjects).then((res: any) => {
        const epics = res || []
        setProjectOptions(
          epics.map((epic: any) => ({
            value: epic.projectId,
            label: epic.projectName,
          })),
        )
        fetchProjectStatistic(
          epics.map((item: any) => item.projectId),
          initialValues.fromDate,
          initialValues.toDate,
        )
      })
    } else {
      setProjectOptions([])
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
                callback={setLineChartType}
                projectOptions={projectOptions}
              />

              <ProjectChart
                chartData={chartData}
                lineChartType={lineChartType}
              />

              <ProjectTable tableData={tableData} />
            </>
          )}
        </Spin>
      </MainLayout>
    </>
  )
}

export default ProjectList
