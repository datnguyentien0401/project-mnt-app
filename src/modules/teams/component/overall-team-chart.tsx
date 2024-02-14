import React from 'react'
import { Cell, Legend, Pie, PieChart } from 'recharts'
import { Space, Typography } from 'antd'
import { randomColor } from '@/utils/helper'
const { Title } = Typography
const OverallTeamChart = ({ data }: { data: any[] }) => {
  return (
    <>
      <Space className="w-full justify-center">
        <Title level={3}>Percentage of resolved issue</Title>
      </Space>
      <Space className="w-full justify-center">
        <PieChart width={500} height={500}>
          <Pie
            data={data}
            dataKey="resolvedIssuePercentage"
            nameKey="team"
            label={(value) => value.value.toFixed(1)}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={randomColor()} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </Space>
    </>
  )
}

export default OverallTeamChart
