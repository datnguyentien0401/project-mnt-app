import React from 'react'
import { Table } from 'antd'
const AvgTeamTable = ({ dataSource }: { dataSource: any[] }) => {
  return (
    <Table dataSource={dataSource} bordered={true} pagination={false}>
      <Table.Column title="Team" dataIndex="team" key="team" />
      <Table.Column
        title="Resolved Issues"
        dataIndex="avgResolvedIssue"
        key="avgResolvedIssue"
        render={(text: number) => text?.toFixed(1)}
      />
      <Table.Column
        title="Story Point"
        dataIndex="avgStoryPoint"
        key="avgStoryPoint"
        render={(text: number) => text?.toFixed(1)}
      />
      <Table.Column
        title="Time spent"
        dataIndex="avgTimeSpent"
        key="avgTimeSpent"
        render={(text: number) => text?.toFixed(1)}
      />
    </Table>
  )
}

export default AvgTeamTable
