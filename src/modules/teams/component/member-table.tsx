import React, { useState } from 'react'
import {
  Button,
  Col,
  Form,
  Input,
  Pagination,
  Row,
  Select,
  Space,
  Table,
} from 'antd'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { MemberRequest } from '@/types/common'
const MemberTable = ({
  dataSource,
  teamOptions,
  onAddMember,
  onRemoveMember,
  form,
}: {
  dataSource: any[]
  teamOptions: any[]
  onAddMember: (values: MemberRequest) => void
  onRemoveMember: (id: number) => void
  form: any
}) => {
  const [currentPage, setCurrentPage] = useState(1)

  return (
    <>
      <Table
        dataSource={dataSource}
        bordered={true}
        pagination={false}
        title={() => (
          <Space>
            <Form form={form} autoComplete="off" onFinish={onAddMember}>
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
      <Space className={'w-full justify-end mt-4'}>
        <Pagination
          current={currentPage}
          pageSize={10}
          total={dataSource.length}
          onChange={(page) => setCurrentPage(page)}
        />
      </Space>
    </>
  )
}

export default MemberTable
