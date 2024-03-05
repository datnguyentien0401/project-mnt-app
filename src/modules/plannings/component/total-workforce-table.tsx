import React from 'react'
import { Table } from 'antd'

const TotalWorkforceTable = ({ dataSource }: { dataSource: any[] }) => {
  const columns: any[] = [
    {
      title: 'Workforce (MD)',
      dataIndex: 'md',
      width: 80,
      render: (text: number) => text?.toFixed(1),
    },
    {
      title: 'Workforce (MM)',
      dataIndex: 'mm',
      width: 80,
      render: (text: number) => text?.toFixed(1),
    },
    {
      title: 'Exclude annual leave (MM)',
      dataIndex: 'excludeAL',
      width: 120,
      render: (text: number) => text?.toFixed(1),
    },
  ]

  return (
    <Table
      bordered
      pagination={false}
      columns={columns}
      dataSource={dataSource}
      scroll={{ x: 'max-content' }}
    ></Table>
  )
}

export default TotalWorkforceTable
