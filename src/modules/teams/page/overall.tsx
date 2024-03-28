import React, { useState } from 'react'
import { Col, Row, Spin } from 'antd'
import MainLayout from '@/modules/ui/layout/main-layout'
import OverallTeamTable from '@/modules/teams/component/overall-team-table'
import AvgTeamTable from '@/modules/teams/component/avg-team-table'
import AvgTeamChart from '@/modules/teams/component/avg-team-chart'
import OverallTeamChart from '@/modules/teams/component/overall-team-chart'
import TeamForm from '@/modules/teams/component/team-search-form'
import { getOverall } from '@/lib/api/team'

const OverallTeam = () => {
  const [isFetching, setIsFetching] = useState(false)
  const [data, setData] = useState<any[]>([])

  const totalResolveIssueAllTeam = data.reduce(
    (totalResolveIssueAllTeam, item) => {
      totalResolveIssueAllTeam += item.totalResolvedIssue
      return totalResolveIssueAllTeam
    },
    0,
  )

  const resolvedIssueData = data.map((item) => {
    return {
      ...item,
      resolvedIssuePercentage:
        (100 * item.totalResolvedIssue) / totalResolveIssueAllTeam,
    }
  })

  async function onSearch(fromDate: Date, toDate: Date) {
    setIsFetching(true)
    const data = (await getOverall(fromDate, toDate)) || []
    setData(data)
    setIsFetching(false)
  }

  return (
    <>
      <MainLayout headerName="Team Overall">
        <Spin spinning={isFetching}>
          <TeamForm
            onSubmit={(fromDate, toDate) => onSearch(fromDate, toDate)}
          />
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
                  <OverallTeamTable dataSource={resolvedIssueData} />
                </Col>
                <Col span={12}>
                  <AvgTeamTable dataSource={data} />
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
