import { Table } from 'antd'
import { useMemo } from 'react'
import { ProjectStatistic } from '@/types/common'
import type { ColumnsType } from 'antd/lib/table'

const ProjectTable = ({ tableData }: { tableData: ProjectStatistic[] }) => {
  const columns = useMemo<ColumnsType<any>>(() => {
    return [
      {
        title: 'Project',
        dataIndex: 'project',
        id: 'project',
        fixed: 'left',
      },
      ...tableData.map((col) => {
        return {
          title: col.month,
          dataIndex: col.month,
          id: col.month,
        }
      }),
    ]
  }, [tableData])

  const dataTable = [
    {
      title: 'Time spent',
      id: 'totalTimeSpentMM',
      ...tableData.reduce(
        (acc, obj) => ({
          project: 'Time spent',
          ...acc,
          [obj.month]: obj.totalTimeSpentMM,
        }),
        {},
      ),
    },
    {
      title: 'Resolved issue',
      id: 'totalResolvedIssue',
      ...tableData.reduce(
        (acc, obj) => ({
          project: 'Resolved issue',
          ...acc,
          [obj.month]: obj.totalResolvedIssue,
        }),
        {},
      ),
    },
    {
      title: 'Head count',
      id: 'totalHeadCount',
      ...tableData.reduce(
        (acc, obj) => ({
          project: 'Head count',
          ...acc,
          [obj.month]: obj.totalHeadCount,
        }),
        {},
      ),
    },
    {
      title: 'Story point',
      id: 'totalStoryPoint',
      ...tableData.reduce(
        (acc, obj) => ({
          project: 'Story point',
          ...acc,
          [obj.month]: obj.totalStoryPoint,
        }),
        {},
      ),
    },
  ]

  return (
    <Table
      bordered
      dataSource={dataTable}
      columns={columns}
      pagination={false}
      scroll={{
        x: 'max-content',
      }}
    />
  )
}
export default ProjectTable
