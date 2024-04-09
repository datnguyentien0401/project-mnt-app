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
import { stringToColor } from '@/utils/helper'
import CustomTooltip from '@/modules/common/custom-tooltip'
import CusTooltip from '@/modules/common/custom-tooltip'

const { Title } = Typography
const StoryPointTimeSpentChart = ({
  title,
  data,
  members,
  yunit,
}: {
  title: string
  data: any[]
  members: any[]
  yunit?: string
}) => {
  const memberNameById = members.reduce((map, item) => {
    map.set(item.jiraMemberId, item.name)
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
        <Title level={5}>{title}</Title>
      </Space>
      <Space className="w-full justify-center">
        <LineChart
          width={500}
          height={500}
          data={data}
          margin={{ top: 28, right: 60, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            padding={{ left: 70 }}
            label={{ value: '(Month)', position: 'right', offset: 10 }}
          />
          <YAxis label={{ value: `(${yunit})`, position: 'top', offset: 15 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {members.map((member, index) => (
            <Line
              key={index}
              type="monotone"
              dataKey={`${member.jiraMemberId}`}
              name={memberNameById.get(member.jiraMemberId)}
              stroke={stringToColor(member.jiraMemberId)}
              activeDot={{
                onMouseOver: (_, e) => mouseEnterHandler(e),
                onMouseLeave: () => mouseEnterHandler(''),
              }}
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
