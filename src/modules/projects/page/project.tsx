'use client'
import { useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { Spin } from 'antd'
import ProjectTable from '@/modules/projects/component/project-table'
import ProjectSearchForm from '@/modules/projects/component/project-search-form'
import { type ProjectStatistic } from '@/types/common'
import ProjectLineChart from '@/modules/projects/component/project-chart'
import MainLayout from '@/modules/ui/layout/main-layout'
import { getAllEpic, searchProject } from '@/lib/api/project'

const ProjectList = () => {
  const [tableData, setTableData] = useState<ProjectStatistic[]>([])
  const [chartData, setChartData] = useState<ProjectStatistic[]>([])
  const [lineChartType, setLineChartType] = useState('totalResolvedIssue')
  const [projectOptions, setProjectOptions] = useState([])
  const [isFetching, setIsFetching] = useState(false)

  const initialValues = useMemo(() => {
    return {
      toDate: dayjs().subtract(0, 'month'),
      fromDate: dayjs().subtract(2, 'month'),
      type: 'totalResolvedIssue',
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    await fetchProjectStatistic(
      [],
      initialValues.fromDate,
      initialValues.toDate,
    )
    // await fetchProjectOptions()
  }

  // const fetchProjectOptions = async () => {
  //   setIsFetching(true)
  //   const data = await getAllEpic()
  //   setProjectOptions(
  //     data.map((epic: any) => ({
  //       value: epic.projectId,
  //       label: epic.projectName,
  //     })),
  //   )
  //   setIsFetching(false)
  // }

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

  return (
    <>
      <MainLayout headerName="Project">
        <Spin spinning={isFetching}>
          <ProjectSearchForm
            initialValues={initialValues}
            onSubmit={onSearch}
            callback={setLineChartType}
          />

          <ProjectLineChart
            chartData={chartData}
            lineChartType={lineChartType}
          />

          <ProjectTable tableData={tableData} />
        </Spin>
      </MainLayout>
    </>
  )
}

export default ProjectList
