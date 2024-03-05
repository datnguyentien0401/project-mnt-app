import { Card, Col, Row, Space, Typography } from 'antd'
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
} from 'recharts'
import { ProjectStatistic } from '@/types/common'
import { randomColor } from '@/utils/helper'

const { Title } = Typography

const barChartLegend = [
  {
    id: 'totalResolvedIssue',
    value: 'Resolved',
    color: '#83ca9d',
  },
  {
    id: 'totalInProgressIssue',
    value: 'In Progress',
    color: '#8884d8',
  },
  {
    id: 'totalOpenIssue',
    value: 'Open',
    color: '#ffc658',
  },
]

const ProjectLineChart = ({
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
    <Row gutter={[16, 16]} className="my-6">
      <Col span={12}>
        <Space className="w-full justify-center">
          <Title level={3}>Project chart</Title>
        </Space>
        <LineChart
          width={700}
          height={1000}
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
      </Col>
      <Col span={12}>
        <Space className="w-full justify-center">
          <Title level={3}>Issue chart</Title>
        </Space>
        <BarChart
          width={700}
          height={1000}
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
      </Col>
    </Row>
  )
}

export default ProjectLineChart
