import React, { useState } from 'react'
import { Button, Table } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { MemberRequest } from '@/types/common'
import MemberAddForm from '@/modules/teams/component/member-add-form'

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
  const [pageSize, setPageSize] = useState(25)

  function handlePaginationChange(page: number, size: number) {
    setCurrentPage(page)
    setPageSize(size)
  }

  return (
    <>
      <Table
        dataSource={dataSource}
        bordered={true}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          showSizeChanger: true,
          pageSizeOptions: [25, 35, 40, 50],
          onChange: handlePaginationChange,
        }}
        title={() => (
          <MemberAddForm
            teamOptions={teamOptions}
            onAddMember={onAddMember}
            form={form}
          />
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
    </>
  )
}

export default MemberTable
