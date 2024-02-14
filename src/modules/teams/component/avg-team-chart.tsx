import React from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Space, Typography } from 'antd'

const { Title, Text } = Typography
const AvgTeamChart = ({ data }: { data: any[] }) => {
  return (
    <>
      <Space className="w-full justify-center">
        <Title level={3}>Average productivity per month</Title>
      </Space>
      <Space className="w-full justify-center">
        <BarChart
          width={700}
          height={500}
          data={data}
          margin={{ top: 20, right: 20, left: 10, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="team" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            key={'avgResolvedIssue'}
            dataKey={'avgResolvedIssue'}
            name={'Resolved Issue'}
            fill={'red'}
            barSize={30}
          />
          <Bar
            key={'avgStoryPoint'}
            dataKey={'avgStoryPoint'}
            name={'Story Point'}
            fill={'green'}
            barSize={30}
          />
          <Bar
            key={'avgTimeSpent'}
            dataKey={'avgTimeSpent'}
            name={'Time Spent'}
            fill={'blue'}
            barSize={30}
          />
        </BarChart>
      </Space>
    </>
  )
}

export default AvgTeamChart
