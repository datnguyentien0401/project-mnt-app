import { Button, Col, Form, Input, Row, Select } from 'antd'
import React from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { MemberRequest } from '@/types/common'
import SearchUserInput from '@/modules/teams/component/search-user-input'
const MemberAddForm = ({
  teamOptions,
  onAddMember,
  form,
}: {
  teamOptions: any[]
  onAddMember: (values: MemberRequest) => void
  form: any
}) => {
  return (
    <Form form={form} autoComplete="off" onFinish={onAddMember}>
      <Row gutter={[6, 6]}>
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
            <SearchUserInput
              placeholder="Jira Member ID"
              onChange={(value) => {
                form.setFieldValue('jiraMemberId', value)
              }}
            />
          </Form.Item>
        </Col>
        <Col span={2}>
          <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
            Add
          </Button>
        </Col>
      </Row>
    </Form>
  )
}

export default MemberAddForm
