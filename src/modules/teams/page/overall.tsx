import React, { useState } from 'react'
import { Col, Row, Spin } from 'antd'
import MainLayout from '@/modules/ui/layout/main-layout'
import OverallTeamTable from '@/modules/teams/component/overall-team-table'
import AvgTeamTable from '@/modules/teams/component/avg-team-table'
import AvgTeamChart from '@/modules/teams/component/avg-team-chart'
import OverallTeamChart from '@/modules/teams/component/overall-team-chart'
import TeamForm from '@/modules/teams/component/team-search-form'
import { getOverall } from '@/lib/api/team'
import { Term } from '@/types/common'
import { getTimerangeByYearAndTerm } from '@/utils/helper'

const OverallTeam = () => {
  const [isFetching, setIsFetching] = useState(false)
  const [data, setData] = useState<any[]>([])
  const [monthsOfTerm, setMonthsOfTerm] = useState<number>(12)

  const totalResolveIssueAllTeam = data.reduce(
    (totalResolveIssueAllTeam, item) => {
      totalResolveIssueAllTeam += item.totalResolvedIssue
      return totalResolveIssueAllTeam
    },
    0,
  )

  const totalAvgResolveIssueAllTeam = data.reduce(
    (totalResolveIssueAllTeam, item) => {
      totalResolveIssueAllTeam += item.avgResolvedIssue
      return totalResolveIssueAllTeam
    },
    0,
  )

  const totalAvgStoryPointAllTeam = data.reduce(
    (totalResolveIssueAllTeam, item) => {
      totalResolveIssueAllTeam += item.avgStoryPoint
      return totalResolveIssueAllTeam
    },
    0,
  )

  const totalAvgTimeSpentAllTeam = data.reduce(
    (totalResolveIssueAllTeam, item) => {
      totalResolveIssueAllTeam += item.avgTimeSpent
      return totalResolveIssueAllTeam
    },
    0,
  )

  const avgTableData = [
    ...data,
    {
      team: 'Total',
      avgResolvedIssue: totalAvgResolveIssueAllTeam,
      avgStoryPoint: totalAvgStoryPointAllTeam,
      avgTimeSpent: totalAvgTimeSpentAllTeam,
    },
    {
      team: 'Avg',
      totalResolvedIssue: totalResolveIssueAllTeam / monthsOfTerm,
      avgResolvedIssue: totalAvgResolveIssueAllTeam / monthsOfTerm,
      avgStoryPoint: totalAvgStoryPointAllTeam / monthsOfTerm,
      avgTimeSpent: totalAvgTimeSpentAllTeam / monthsOfTerm,
    },
  ]

  const resolvedIssueData = data.map((item) => {
    return {
      ...item,
      resolvedIssuePercentage:
        (100 * item.totalResolvedIssue) / totalResolveIssueAllTeam,
    }
  })

  const resolvedIssueTableData = [
    ...resolvedIssueData,
    {
      team: 'Total',
      totalResolvedIssue: totalResolveIssueAllTeam,
    },
    {
      team: 'Avg',
      totalResolvedIssue: totalResolveIssueAllTeam / monthsOfTerm,
    },
  ]

  async function onSearch(year: string, term: Term) {
    const timeRange = getTimerangeByYearAndTerm(year, term)
    setIsFetching(true)
    const data = (await getOverall(timeRange.fromDate, timeRange.toDate)) || []
    setData(data)
    setIsFetching(false)
    if (term == Term.FULL) {
      setMonthsOfTerm(12)
    } else {
      setMonthsOfTerm(6)
    }
  }

  return (
    <>
      <MainLayout headerName="Team Overall">
        <Spin spinning={isFetching}>
          <TeamForm onSubmit={(year, term) => onSearch(year, term)} />
          {data.length > 0 && (
            <>
              <Row gutter={[12, 12]} className={'w-full'}>
                <Col span={12}>
                  <OverallTeamChart data={resolvedIssueData} />
                </Col>
                <Col span={12}>
                  <AvgTeamChart data={data} />
                </Col>
              </Row>
              <Row gutter={[6, 6]} className={'w-full pt-5'}>
                <Col span={12}>
                  <OverallTeamTable dataSource={resolvedIssueTableData} />
                </Col>
                <Col span={12}>
                  <AvgTeamTable dataSource={avgTableData} />
                </Col>
              </Row>
            </>
          )}
        </Spin>
      </MainLayout>
    </>
  )
}

export default OverallTeam
