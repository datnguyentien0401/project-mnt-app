import { Space, Typography } from 'antd'
import React from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Legend,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { ProjectStatistic } from '@/types/common'
import { randomColor } from '@/utils/helper'

const { Title } = Typography

const barChartLegend = [
  {
    id: 'totalResolvedIssue',
    value: 'Resolved',
    color: 'green',
  },
  {
    id: 'totalInProgressIssue',
    value: 'In Progress',
    color: 'blue',
  },
  {
    id: 'totalOpenIssue',
    value: 'Open',
    color: 'red',
  },
]

const ProjectChart = ({
  chartData,
  lineChartType,
}: {
  chartData: ProjectStatistic[]
  lineChartType: string
}) => {
  const formattedChartData = []
  const formattedColumnChartData = []
  const months = Array.from(new Set(chartData.map((item) => item.month)))
  for (const month of months) {
    const projectStatistic = chartData
      .filter((item) => item.month == month)
      .reduce((res: any, item: any) => {
        res[item.projectId] = item
        return res
      }, {})
    formattedChartData.push({
      month: month,
      ...projectStatistic,
    })

    const projectStatisticColumnChart = chartData
      .filter((item) => item.month == month && item.forColumnChart)
      .reduce((res: any, item: any) => {
        res[item.projectId] = item
        return res
      }, {})
    formattedColumnChartData.push({
      month: month,
      ...projectStatisticColumnChart,
    })
  }

  const projectIds = Array.from(
    new Set(chartData.map((item) => item.projectId)),
  )

  const projectNameById = chartData.reduce((map, item) => {
    map.set(item.projectId, item.projectName)
    return map
  }, new Map<string, string>())

  return (
    <>
      {/*   project chart */}
      <Space className="w-full justify-center">
        <Title level={3}>Project chart</Title>
      </Space>
      <ResponsiveContainer width="100%" height={1000}>
        <LineChart
          data={formattedChartData}
          margin={{ top: 20, right: 20, left: 10, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" padding={{ left: 70 }} />
          <YAxis />
          <Tooltip />
          <Legend />
          {projectIds.map((projectId, index) => (
            <Line
              key={index}
              type="monotone"
              dataKey={`${projectId}.${lineChartType}`}
              name={projectNameById.get(projectId)}
              stroke={randomColor()}
            >
              <LabelList position="top" />
            </Line>
          ))}
        </LineChart>
      </ResponsiveContainer>
      {/*   issue chart */}
      <Space className="w-full justify-center">
        <Title level={3}>Issue chart</Title>
      </Space>
      <ResponsiveContainer width="100%" height={500}>
        <BarChart
          data={formattedColumnChartData}
          margin={{ top: 20, right: 20, left: 10, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend payload={barChartLegend} />
          {projectIds.map((projectId) =>
            barChartLegend.map((issueType) => (
              <Bar
                key={`${projectId}.${issueType.id}`}
                dataKey={`${projectId}.${issueType.id}`}
                name={`${projectNameById.get(projectId)} - ${issueType.value}`}
                stackId={projectId}
                fill={issueType.color}
                barSize={30}
              >
                <LabelList
                  position="inside"
                  dataKey={`${projectId}.${issueType.id}`}
                  formatter={(label: number) => {
                    return label ? label : null
                  }}
                  style={{ fill: '#fff', fontSize: 12 }}
                />
              </Bar>
            )),
          )}
        </BarChart>
      </ResponsiveContainer>
    </>
  )
}

export default ProjectChart
