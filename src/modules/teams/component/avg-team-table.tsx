import React from 'react'
import { Table } from 'antd'
const AvgTeamTable = ({ dataSource }: { dataSource: any[] }) => {
  return (
    <Table dataSource={dataSource} bordered={true} pagination={false}>
      <Table.Column
        title="Resolved Issues"
        dataIndex="avgResolvedIssue"
        key="avgResolvedIssue"
      />
      <Table.Column
        title="Story Point"
        dataIndex="avgStoryPoint"
        key="avgStoryPoint"
      />
      <Table.Column
        title="Time spent"
        dataIndex="avgTimeSpent"
        key="avgTimeSpent"
      />
    </Table>
  )
}

export default AvgTeamTable
