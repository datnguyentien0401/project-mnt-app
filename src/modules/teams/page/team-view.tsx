import React, { useEffect, useState } from 'react'
import { Col, Row, Spin, Table } from 'antd'
import MainLayout from '@/modules/ui/layout/main-layout'
import TeamForm from '@/modules/teams/component/team-search-form'
import { getAllTeams, getTeamView } from '@/lib/api/team'
import { getAllMembersByTeamId } from '@/lib/api/member'
import StoryPointTimeSpentChart from '@/modules/teams/component/story-point-time-spent-chart'
import ResolvedIssueChart from '@/modules/teams/component/resolved-issue-chart'
import { Term } from '@/types/common'
import { getTimerangeByYearAndTerm } from '@/utils/helper'

const initColumn: any[] = [
  {
    title: 'Month',
    key: 'month',
    dataIndex: 'month',
  },
]

let timeout: ReturnType<typeof setTimeout> | null

const TeamView = () => {
  const [isFetching, setIsFetching] = useState(false)
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [columns, setColumns] = useState<any[]>([])
  const [resolvedIssueChartData, setResolvedIssueChartData] = useState<any[]>(
    [],
  )
  const [resolvedIssueData, setResolvedIssueData] = useState<any[]>([])
  const [timeSpentData, setTimeSpentData] = useState<any[]>([])
  const [storyPointData, setStoryPointData] = useState<any[]>([])
  const [teamOptions, setTeamOptions] = useState([])
  const [term, setTerm] = useState<Term>(Term.FULL)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsFetching(true)
    const teams = (await getAllTeams()) || []
    setTeamOptions(
      teams.map((team: any) => ({
        value: team.id,
        label: team.name,
      })),
    )
    setIsFetching(false)
  }

  async function onSearch(year: string, term: Term, teamId: number) {
    // if (timeout) {
    //   clearTimeout(timeout)
    //   timeout = null
    // }
    if (!teamId) {
      return
    }
    setTerm(term)

    const timeRange = getTimerangeByYearAndTerm(year, term)

    setIsFetching(true)

    const membersInTeam: any[] = await getAllMembersByTeamId(teamId)

    setTeamMembers(membersInTeam)

    setColumns([
      ...initColumn,
      ...membersInTeam.map((item) => ({
        title: item.name,
        key: item.jiraMemberId,
        dataIndex: item.jiraMemberId,
      })),
    ])

    const res = await getTeamView(teamId, timeRange.fromDate, timeRange.toDate)
    const data = res?.data || []
    setResolvedIssueData(data.resolvedIssueData)
    setStoryPointData(data.storyPointData)
    setTimeSpentData(data.timeSpentData)
    setResolvedIssueChartData(data.resolvedIssueChartData)
    setIsFetching(false)
  }

  return (
    <>
      <MainLayout headerName="Team View">
        <Spin spinning={isFetching}>
          <TeamForm
            teamOptions={teamOptions}
            onSubmit={(year, term, teamId) => onSearch(year, term, teamId)}
          />
          {teamMembers.length > 0 && (
            <>
              <Row gutter={[6, 6]} className={'w-full'}>
                <Col span={8}>
                  <ResolvedIssueChart
                    title={'Resolved issue'}
                    data={resolvedIssueChartData}
                    term={term}
                  />
                </Col>
                <Col span={8}>
                  <StoryPointTimeSpentChart
                    title={'Time spent'}
                    data={timeSpentData}
                    members={teamMembers}
                  />
                </Col>
                <Col span={8}>
                  <StoryPointTimeSpentChart
                    title={'Story point'}
                    data={storyPointData}
                    members={teamMembers}
                  />
                </Col>
              </Row>
              <Row gutter={[6, 6]} className={'w-full pt-5'}>
                <Col span={8}>
                  <Table
                    columns={columns}
                    dataSource={resolvedIssueData}
                    bordered={true}
                    pagination={false}
                  />
                </Col>
                <Col span={8}>
                  <Table
                    columns={columns}
                    dataSource={timeSpentData}
                    bordered={true}
                    pagination={false}
                  />
                </Col>
                <Col span={8}>
                  <Table
                    columns={columns}
                    dataSource={storyPointData}
                    bordered={true}
                    pagination={false}
                  />
                </Col>
              </Row>
            </>
          )}
        </Spin>
      </MainLayout>
    </>
  )
}

export default TeamView
