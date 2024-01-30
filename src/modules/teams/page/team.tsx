import React, { useEffect, useState } from 'react'
import {
  Button,
  Col,
  Form,
  Input,
  notification,
  Row,
  Select,
  Space,
  Spin,
  Table,
} from 'antd'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import MainLayout from '@/modules/ui/layout/main-layout'
import { createTeam, deleteTeam, getAllTeams } from '@/lib/api/team'
import { createMember, deleteMember, getAllMembers } from '@/lib/api/member'
import { MemberRequest } from '@/types/common'

const TeamList = () => {
  const [isFetching, setIsFetching] = useState(false)
  const [teams, setTeams] = useState([])
  const [members, setMembers] = useState([])
  const [teamOptions, setTeamOptions] = useState([])
  const [form] = Form.useForm()
  const [memberForm] = Form.useForm()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsFetching(true)
    const teams = await getAllTeams()
    setTeams(teams)
    setTeamOptions(
      teams.map((epic: any) => ({
        value: epic.id,
        label: epic.name,
      })),
    )
    const members = await getAllMembers()
    setMembers(members)
    setIsFetching(false)
  }

  async function onRemoveTeam(id: number) {
    await deleteTeam(id)
    await fetchData()
    form.resetFields()
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

  async function onAddTeam(values: { name: string }) {
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
              <Table
                bordered
                pagination={false}
                dataSource={teams}
                title={() => (
                  <Space
                    style={{
                      display: 'flex',
                      justifyContent: 'start',
                      alignItems: 'center',
                    }}
                  >
                    <Form form={form} autoComplete="off" onFinish={onAddTeam}>
                      <Row gutter={[6, 6]}>
                        <Col span={20}>
                          <Form.Item
                            name="name"
                            rules={[
                              {
                                required: true,
                                message: 'Team is required',
                              },
                            ]}
                          >
                            <Input type="text" placeholder="Enter team" />
                          </Form.Item>
                        </Col>
                        <Col span={4}>
                          <Button
                            type="primary"
                            htmlType="submit"
                            icon={<PlusOutlined />}
                          >
                            Add
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </Space>
                )}
              >
                <Table.Column title="Id" dataIndex="id" key="id" />
                <Table.Column title="Team" dataIndex="name" key="name" />
                <Table.Column
                  title="-"
                  render={(text: any, record: any) => (
                    <Button
                      icon={<DeleteOutlined />}
                      onClick={() => onRemoveTeam(record.id)}
                    />
                  )}
                />
              </Table>
            </Col>
            <Col span={16}>
              <Table
                dataSource={members}
                bordered={true}
                title={() => (
                  <Space>
                    <Form
                      form={memberForm}
                      autoComplete="off"
                      onFinish={onAddMember}
                    >
                      <Row gutter={[6, 6]} className={'w-full'}>
                        <Col span={8}>
                          <Form.Item
                            name="name"
                            rules={[
                              {
                                required: true,
                                message: 'Team is required',
                              },
                            ]}
                          >
                            <Input type="text" placeholder="Member name" />
                          </Form.Item>
                        </Col>
                        <Col span={8}>
                          <Form.Item
                            name="teamId"
                            rules={[
                              {
                                required: true,
                                message: 'Team is required',
                              },
                            ]}
                          >
                            <Select
                              options={teamOptions}
                              popupClassName="capitalize"
                              placeholder="Team"
                              className={'w-full'}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={6}>
                          <Form.Item
                            name="jiraMemberId"
                            rules={[
                              {
                                required: true,
                                message: 'Jira ID is required',
                              },
                            ]}
                          >
                            <Input type="text" placeholder="Jira ID" />
                          </Form.Item>
                        </Col>
                        <Col span={2}>
                          <Button
                            type="primary"
                            htmlType="submit"
                            icon={<PlusOutlined />}
                          >
                            Add
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </Space>
                )}
              >
                <Table.Column
                  title="Team"
                  render={(text: string, record: any) => record.team.name}
                />
                <Table.Column
                  title="Jira ID"
                  dataIndex="jiraMemberId"
                  key="jiraMemberId"
                />
                <Table.Column title="Member" dataIndex="name" key="name" />
                <Table.Column
                  title="-"
                  render={(text: string, record: any) => (
                    <Button
                      icon={<DeleteOutlined />}
                      onClick={() => onRemoveMember(record.id)}
                    />
                  )}
                />
              </Table>
            </Col>
          </Row>
        </Spin>
      </MainLayout>
    </>
  )
}

export default TeamList
