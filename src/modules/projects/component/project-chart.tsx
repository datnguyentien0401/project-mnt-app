import { Space, Typography } from 'antd'
import React from 'react'
import {
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
import { stringToColor } from '@/utils/helper'
import CusTooltip from '@/modules/common/custom-tooltip'

const { Title } = Typography

const ProjectChart = ({
  data,
  lineChartType,
}: {
  data: ProjectStatistic[]
  lineChartType: string
}) => {
  const formattedChartData: any[] = []
  const months = Array.from(new Set(data.map((item) => item.month)))
  for (const month of months) {
    const projectStatistic = data
      .filter((item) => item.month == month)
      .reduce((res: any, item: any) => {
        res[item.projectId] = item
        return res
      }, {})
    formattedChartData.push({
      month: month,
      ...projectStatistic,
    })
  }

  const projectIds = Array.from(new Set(data.map((item) => item.projectId)))

  const projectNameById = data.reduce((map, item) => {
    map.set(item.projectId, item.projectName)
    return map
  }, new Map<string, string>())

  let tooltipValue = ''
  const mouseEnterHandler = (e: any) => {
    tooltipValue = e.value
  }
  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: any
    payload?: any
  }) => {
    return <CusTooltip payload={payload} value={tooltipValue} />
  }

  return (
    <>
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
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {projectIds.map((projectId, _) => (
            <Line
              key={`${projectId}.${lineChartType}`}
              type="monotone"
              dataKey={`${projectId}.${lineChartType}`}
              name={projectNameById.get(projectId)}
              stroke={stringToColor(projectId)}
              legendType={'plainline'}
              activeDot={{
                onMouseOver: (_, e) => mouseEnterHandler(e),
                onMouseLeave: () => mouseEnterHandler(''),
              }}
            >
              <LabelList position="top" />
            </Line>
          ))}
        </LineChart>
      </ResponsiveContainer>
    </>
  )
}

export default ProjectChart
