import React, { useState } from 'react'
import { Col, Row, Spin } from 'antd'
import MainLayout from '@/modules/ui/layout/main-layout'
import OverallTeamTable from '@/modules/teams/component/overall-team-table'
import AvgTeamTable from '@/modules/teams/component/avg-team-table'
import AvgTeamChart from '@/modules/teams/component/avg-team-chart'
import OverallTeamChart from '@/modules/teams/component/overall-team-chart'
import TeamForm from '@/modules/teams/component/team-search-form'
import { Term } from '@/types/common'
import { getOverall } from '@/lib/api/team'

const OverallTeam = () => {
  const [isFetching, setIsFetching] = useState(false)
  const [data, setData] = useState<any[]>([
    {
      team: 'A',
      totalResolvedIssue: 10,
      avgResolvedIssue: 9,
      avgTimeSpent: 20,
      avgStoryPoint: 10,
    },
    {
      team: 'B',
      totalResolvedIssue: 25,
      avgResolvedIssue: 7,
      avgTimeSpent: 22,
      avgStoryPoint: 12,
    },
    {
      team: 'C',
      totalResolvedIssue: 45,
      avgResolvedIssue: 8,
      avgTimeSpent: 23,
      avgStoryPoint: 11,
    },
    {
      team: 'D',
      totalResolvedIssue: 30,
      avgResolvedIssue: 9,
      avgTimeSpent: 25,
      avgStoryPoint: 13,
    },
  ])

  const totalResolveIssueAllTeam = data.reduce(
    (totalResolveIssueAllTeam, item) => {
      totalResolveIssueAllTeam += item.totalResolvedIssue
      return totalResolveIssueAllTeam
    },
    0,
  )

  const overTeamData = data.map((item) => {
    return {
      ...item,
      resolvedIssuePercentage:
        (100 * item.totalResolvedIssue) / totalResolveIssueAllTeam,
    }
  })

  async function onSearch(values: Record<string, any>) {
    const fromDate = new Date(values.year)
    const toDate = new Date(values.year)

    //month based index = 0
    if (values.term === Term.HALF_1) {
      fromDate.setMonth(0, 1)
      toDate.setMonth(5, 30)
    } else if (values.term === Term.HALF_2) {
      fromDate.setMonth(6, 1)
      toDate.setMonth(11, 31)
    } else if (values.term === Term.FULL) {
      fromDate.setMonth(0, 1)
      toDate.setMonth(11, 31)
    }
    setIsFetching(true)
    const data = await getOverall(fromDate, toDate)
    setIsFetching(false)
    setData(data)
  }

  return (
    <>
      <MainLayout headerName="Team management">
        <Spin spinning={isFetching}>
          <TeamForm onSubmit={(values) => onSearch(values)} />
          <Row gutter={[12, 12]} className={'w-full'}>
            <Col span={12}>
              <OverallTeamChart data={overTeamData} />
            </Col>
            <Col span={12}>
              <AvgTeamChart data={data} />
            </Col>
          </Row>
          <Row gutter={[6, 6]} className={'w-full pt-5'}>
            <Col span={12}>
              <OverallTeamTable dataSource={overTeamData} />
            </Col>
            <Col span={12}>
              <AvgTeamTable dataSource={data} />
            </Col>
          </Row>
        </Spin>
      </MainLayout>
    </>
  )
}

export default OverallTeam
