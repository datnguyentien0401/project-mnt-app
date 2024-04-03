import { Space, Typography } from 'antd'
import React from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { randomColor } from '@/utils/helper'
import { Term } from '@/types/common'

const { Title } = Typography

const term1st = [
  {
    id: 'Jan',
    value: 'Jan',
    color: 'red',
  },
  {
    id: 'Feb',
    value: 'Feb',
    color: 'blue',
  },
  {
    id: 'Mar',
    value: 'Mar',
    color: 'green',
  },
  {
    id: 'Apr',
    value: 'Apr',
    color: 'violet',
  },
  {
    id: 'May',
    value: 'May',
    color: 'orange',
  },
  {
    id: 'Jun',
    value: 'Jun',
    color: 'pink',
  },
]

const term2nd = [
  {
    id: 'Jul',
    value: 'Jul',
    color: '#8A4A44',
  },
  {
    id: 'Aug',
    value: 'Aug',
    color: '#5D02AC',
  },
  {
    id: 'Sep',
    value: 'Sep',
    color: '#D28E00',
  },
  {
    id: 'Oct',
    value: 'Oct',
    color: '#B20038',
  },
  {
    id: 'Nov',
    value: 'Nov',
    color: '#9F05DD',
  },
  {
    id: 'Dec',
    value: 'Dec',
    color: '#26CDF5',
  },
]

const ResolvedIssueChart = ({
  title,
  data,
  term,
}: {
  title: string
  data: any[]
  term: Term
}) => {
  const barChartLegend =
    term == Term.HALF_1
      ? term1st
      : term === Term.HALF_2
        ? term2nd
        : [...term1st, ...term2nd]

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
          margin={{ top: 28, right: 20, left: 10, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis label={{ value: '(Issue)', position: 'top', offset: 15 }} />
          <Tooltip />
          <Legend />
          {barChartLegend.map((month) => (
            <Bar
              key={`${month.id}`}
              dataKey={`${month.id}`}
              name={`${month.value}`}
              stackId={'name'}
              fill={month.color || randomColor()}
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
