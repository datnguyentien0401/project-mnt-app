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

  const columns: any[] = [
    {
      title: 'Team',
      render: (text: any, record: any) => record.team.name,
      sorter: (a: any, b: any) => a.team.name.localeCompare(b.team.name),
    },
    {
      title: 'Jira ID',
      dataIndex: 'jiraMemberId',
      key: 'jiraMemberId',
      sorter: (a: any, b: any) => a.jiraMemberId.localeCompare(b.jiraMemberId),
    },
    {
      title: 'Member',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
    },
    {
      title: '-',
      render: (text: string, record: any) => (
        <Button
          icon={<DeleteOutlined />}
          onClick={() => onRemoveMember(record.id)}
        />
      ),
    },
  ]

  return (
    <>
      <Table
        dataSource={dataSource}
        columns={columns}
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
      />
    </>
  )
}

export default MemberTable
