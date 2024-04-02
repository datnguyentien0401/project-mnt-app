import { Space, Typography } from 'antd'
import React, { useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Legend,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts'
import { ProjectStatistic } from '@/types/common'

const { Title } = Typography

const legend = [
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

const CustomTooltip = ({
  position,
  content,
  onMouseEnter,
  onMouseLeave,
}: {
  position: any
  content: any
  onMouseEnter: any
  onMouseLeave: any
}) => {
  const { x, y } = position || {}

  return (
    <div
      className="custom-tooltip"
      style={{ left: x + 5, top: y + 5 }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {content}
    </div>
  )
}

const Content = ({
  name,
  value,
}: {
  name: string
  value: { resolved: number; inProgress: number; open: number }
}) => {
  return (
    <div>
      <div>{name}</div>
      <div style={{ color: 'green' }}>Resolved: {value.resolved}</div>
      <div style={{ color: 'blue' }}>In Progress: {value.inProgress}</div>
      <div style={{ color: 'red' }}>Open: {value.open}</div>
    </div>
  )
}

const IssueChart = ({ data }: { data: ProjectStatistic[] }) => {
  const formattedColumnChartData: any[] = []
  const months = Array.from(new Set(data.map((item) => item.month)))
  for (const month of months) {
    const projectStatisticColumnChart = data
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

  const projectIds = Array.from(new Set(data.map((item) => item.projectId)))

  const projectNameById = data.reduce((map, item) => {
    map.set(item.projectId, item.projectName)
    return map
  }, new Map<string, string>())

  const [tooltip, setTooltip] = useState<any>({})
  let tooltipTimeout: any

  const showTooltip = (item: any, index: any, e: any) => {
    clearTimeout(tooltipTimeout)

    const dataByMonthActive =
      formattedColumnChartData.filter(
        (entry) => entry.month === item.month,
      )[0] || {}

    const activeProjectId =
      item.tooltipPayload[0].dataKey.toString().split('.')[0] || ''
    const projectActive: any = dataByMonthActive[activeProjectId]

    setTooltip({
      show: true,
      position: { x: e.clientX, y: e.clientY },
      content: (
        <Content
          name={projectActive.epicName || ''}
          value={{
            resolved: projectActive.totalResolvedIssue,
            open: projectActive.totalOpenIssue,
            inProgress: projectActive.totalInProgressIssue,
          }}
        />
      ),
    })
  }

  const hideTooltip = (e: any) => {
    tooltipTimeout = setTimeout(() => setTooltip({ show: false, ...e }), 200)
  }

  return (
    <>
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
          <Legend payload={legend} />
          {projectIds.map((projectId) =>
            legend.map((issueType) => (
              <Bar
                key={`${projectId}.${issueType.id}`}
                dataKey={`${projectId}.${issueType.id}`}
                name={`${projectNameById.get(projectId)} - ${issueType.value}`}
                stackId={projectId}
                fill={issueType.color}
                barSize={30}
                legendType={'rect'}
                onMouseEnter={showTooltip}
                onMouseLeave={hideTooltip}
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
      {tooltip.show && (
        <CustomTooltip
          onMouseEnter={() => {
            clearTimeout(tooltipTimeout)
          }}
          onMouseLeave={() => {
            setTooltip({ show: false })
            clearTimeout(tooltipTimeout)
          }}
          {...tooltip}
        />
      )}
    </>
  )
}

export default IssueChart
