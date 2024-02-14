import React from 'react'
import { Table } from 'antd'
const OverallTeamTable = ({ dataSource }: { dataSource: any[] }) => {
  return (
    <Table dataSource={dataSource} bordered={true} pagination={false}>
      <Table.Column title="Team" dataIndex="team" key="team" />
      <Table.Column
        title="Number"
        dataIndex="totalResolvedIssue"
        key="totalResolvedIssue"
      />
      <Table.Column
        title="Percentage (%)"
        dataIndex="resolvedIssuePercentage"
        key="resolvedIssuePercentage"
        render={(text: number) => text.toFixed(1)}
      />
    </Table>
  )
}

export default OverallTeamTable
