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
} from 'recharts'
import { randomColor, stringToColor } from '@/utils/helper'

const { Title } = Typography
const StoryPointTimeSpentChart = ({
  title,
  data,
  members,
}: {
  title: string
  data: any[]
  members: any[]
}) => {
  const memberNameById = members.reduce((map, item) => {
    map.set(item.jiraMemberId, item.name)
    return map
  }, new Map<string, string>())

  return (
    <>
      <Space className="w-full justify-center">
        <Title level={5}>{title}</Title>
      </Space>
      <Space className="w-full justify-center">
        <LineChart
          width={500}
          height={500}
          data={data}
          margin={{ top: 20, right: 20, left: 10, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" padding={{ left: 70 }} />
          <YAxis />
          <Tooltip />
          <Legend />
          {members.map((member, index) => (
            <Line
              key={index}
              type="monotone"
              dataKey={`${member.jiraMemberId}`}
              name={memberNameById.get(member.jiraMemberId)}
              stroke={stringToColor(member.jiraMemberId)}
            >
              <LabelList position="top" />
            </Line>
          ))}
        </LineChart>
      </Space>
    </>
  )
}

export default StoryPointTimeSpentChart
