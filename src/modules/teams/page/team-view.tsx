import React, { useEffect, useState } from 'react'
import { Col, Row, Spin, Table } from 'antd'
import MainLayout from '@/modules/ui/layout/main-layout'
import TeamForm from '@/modules/teams/component/team-search-form'
import { getAllTeams, getTeamView } from '@/lib/api/team'
import { getAllMembersByTeamId } from '@/lib/api/member'
import StoryPointTimeSpentChart from '@/modules/teams/component/story-point-time-spent-chart'
import ResolvedIssueChart from '@/modules/teams/component/resolved-issue-chart'

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

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
    setIsFetching(true)
    getAllTeams().then((teams) => {
      setTeamOptions(
        teams.map((team: any) => ({
          value: team.id,
          label: team.name,
        })),
      )
    })
    setIsFetching(false)
  }

  async function onSearch(fromDate: Date, toDate: Date, teamId: number) {
    // if (timeout) {
    //   clearTimeout(timeout)
    //   timeout = null
    // }
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

    getTeamView(teamId, fromDate, toDate).then((res: any) => {
      const result = res?.data || []
      setResolvedIssueData(result.resolvedIssueData)
      setStoryPointData(result.storyPointData)
      setTimeSpentData(result.timeSpentData)
      setResolvedIssueChartData(result.resolvedIssueChartData)
    })
    setIsFetching(false)
  }

  return (
    <>
      <MainLayout headerName="Team View">
        <Spin spinning={isFetching}>
          <TeamForm
            teamOptions={teamOptions}
            onSubmit={(fromDate, toDate, teamId) =>
              onSearch(fromDate, toDate, teamId)
            }
          />
          {teamMembers.length > 0 && (
            <>
              <Row gutter={[6, 6]} className={'w-full'}>
                <Col span={8}>
                  <ResolvedIssueChart
                    title={'Resolved issue'}
                    data={resolvedIssueChartData}
                    members={teamMembers}
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
