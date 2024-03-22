import React, { useEffect, useState } from 'react'
import { Col, Form, notification, Row, Spin } from 'antd'
import MainLayout from '@/modules/ui/layout/main-layout'
import { createTeam, deleteTeam, getAllTeams } from '@/lib/api/team'
import { createMember, deleteMember, getAllMembers } from '@/lib/api/member'
import { MemberRequest, TeamRequest } from '@/types/common'
import TeamTable from '@/modules/teams/component/team-table'
import MemberTable from '@/modules/teams/component/member-table'

const TeamList = () => {
  const [isFetching, setIsFetching] = useState(false)
  const [teams, setTeams] = useState([])
  const [members, setMembers] = useState([])
  const [teamOptions, setTeamOptions] = useState([])
  const [memberForm] = Form.useForm()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
    setIsFetching(true)
    getAllTeams().then((teams) => {
      setTeams(teams)
      setTeamOptions(
        teams.map((team: any) => ({
          value: team.id,
          label: team.name,
        })),
      )
    })

    getAllMembers().then((members) => setMembers(members))
    setIsFetching(false)
  }

  async function onRemoveTeam(id: number) {
    await deleteTeam(id)
    await fetchData()
    memberForm.resetFields()
    notification.open({
      message: 'Team',
      description: 'Remove team successfully',
    })
  }

  async function onRemoveMember(id: number) {
    await deleteMember(id)
    await fetchData()
    memberForm.resetFields()
    notification.open({
      message: 'Member',
      description: 'Remove member successfully',
    })
  }

  async function onAddTeam(values: TeamRequest) {
    await createTeam(values)
    await fetchData()
    notification.open({
      message: 'Member',
      description: 'Add team successfully',
    })
  }

  async function onAddMember(values: MemberRequest) {
    await createMember(values)
    await fetchData()
    notification.open({
      message: 'Member',
      description: 'Add member successfully',
    })
  }

  return (
    <>
      <MainLayout headerName="Team management">
        <Spin spinning={isFetching}>
          <Row gutter={[6, 6]} className={'w-full'}>
            <Col span={8}>
              <TeamTable
                dataSource={teams}
                onAddTeam={onAddTeam}
                onRemoveTeam={onRemoveTeam}
              />
            </Col>
            <Col span={16}>
              <MemberTable
                dataSource={members}
                teamOptions={teamOptions}
                onAddMember={onAddMember}
                onRemoveMember={onRemoveMember}
                form={memberForm}
              />
            </Col>
          </Row>
        </Spin>
      </MainLayout>
    </>
  )
}

export default TeamList
