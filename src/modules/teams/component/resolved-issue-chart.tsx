import { Space, Typography } from 'antd'
import React from 'react'
import {
  CartesianGrid,
  LabelList,
  Legend,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from 'recharts'

const { Title } = Typography

const barChartLegend = [
  {
    id: 'Jan',
    value: 'Jan',
    color: '#83ca9d',
  },
  {
    id: 'Feb',
    value: 'Feb',
    color: '#8884d8',
  },
  {
    id: 'Mar',
    value: 'Mar',
    color: '#ffc658',
  },
]
const ResolvedIssueChart = ({
  title,
  data,
  members,
}: {
  title: string
  data: any[]
  members: any[]
}) => {
  return (
    <>
      <Space className="w-full justify-center">
        <Title level={5}>{title}</Title>
      </Space>
      <Space className="w-full justify-center">
        <BarChart
          width={500}
          height={500}
          data={data}
          margin={{ top: 20, right: 20, left: 10, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend payload={barChartLegend} />
          {barChartLegend.map((month) => (
            <Bar
              key={`${month.id}`}
              dataKey={`${month.id}`}
              name={`${month.value}`}
              stackId={'name'}
              fill={month.color}
              barSize={30}
            >
              <LabelList
                position="inside"
                dataKey={`${month.id}`}
                formatter={(label: number) => {
                  return label ? label : null
                }}
                style={{ fill: '#fff', fontSize: 12 }}
              />
            </Bar>
          ))}
        </BarChart>
      </Space>
    </>
  )
}

export default ResolvedIssueChart
