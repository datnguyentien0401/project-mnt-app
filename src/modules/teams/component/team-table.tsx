import React from 'react'
import { Button, Col, Form, Input, Row, Space, Table } from 'antd'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { TeamRequest } from '@/types/common'
const TeamTable = ({
  dataSource,
  onAddTeam,
  onRemoveTeam,
}: {
  dataSource: any[]
  onAddTeam: (values: TeamRequest) => void
  onRemoveTeam: (id: number) => void
}) => {
  const [form] = Form.useForm()

  return (
    <Table
      bordered
      pagination={false}
      dataSource={dataSource}
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
      <Table.Column
        title="Id"
        dataIndex="id"
        key="id"
        sorter={(a: any, b: any) => a.id - b.id}
      />
      <Table.Column
        title="Team"
        dataIndex="name"
        key="name"
        sorter={(a: any, b: any) => a.name.localeCompare(b.name)}
      />
      <Table.Column
        title="-"
        render={(text: any, record: any) => (
          <Button
            icon={<DeleteOutlined />}
            onClick={() => {
              onRemoveTeam(record.id)
              form.resetFields()
            }}
          />
        )}
      />
    </Table>
  )
}

export default TeamTable
