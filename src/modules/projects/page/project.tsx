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

  const fetchProjectStatistic = async (
    projectIds: string[],
    fromDate: any,
    toDate: any,
  ) => {
    if (projectIds.length == 0) {
      return
    }
    const data = await searchProject(
      projectIds,
      fromDate.format('YYYYMMDD'),
      toDate.format('YYYYMMDD'),
    )
    setTableData(data.totalData)
    setChartData(data.listData)
  }

  const onSearch = async (values: Record<string, any>) => {
    setIsFetching(true)
    await fetchProjectStatistic(
      values.projectId || projectOptions.map((opt) => opt.value),
      values.fromDate,
      values.toDate,
    )
    setIsFetching(false)
  }

  const handleChangeJiraProject = async (jiraProjects: any[]) => {
    setProjectOptions([])
    if (jiraProjects.length > 0) {
      setIsFetching(true)
      const epics = (await getAllEpic(jiraProjects)) || []
      setProjectOptions(
        epics.map((epic: any) => ({
          value: epic.projectId,
          label: epic.projectName,
        })),
      )
      await fetchProjectStatistic(
        epics.map((item: any) => item.projectId),
        initialValues.fromDate,
        initialValues.toDate,
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
