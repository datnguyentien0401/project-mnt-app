import { Table } from 'antd'
import { useMemo } from 'react'
import { ProjectStatistic } from '@/types/common'
import type { ColumnsType } from 'antd/lib/table'

const ProjectTable = ({ tableData }: { tableData: ProjectStatistic[] }) => {
  const columns = useMemo<ColumnsType<any>>(() => {
    return [
      {
        title: 'Project',
        dataIndex: 'key',
        id: 'key',
        fixed: 'left',
      },
      ...tableData.map((col) => {
        return {
          title: col.month,
          dataIndex: col.month,
          id: col.month,
        }
      }),
      {
        title: 'Total',
        dataIndex: 'total',
        id: 'total',
      },
    ]
  }, [tableData])

  const dataSource = [
    {
      title: 'Time spent',
      id: 'totalTimeSpentMM',
      ...tableData.reduce(
        (acc, obj) => ({
          key: 'Time spent',
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
          key: 'Resolved issue',
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
          key: 'Head count',
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
          key: 'Story point',
          ...acc,
          [obj.month]: obj.totalStoryPoint,
        }),
        {},
      ),
    },
  ]

  const dataSourceWithTotal = dataSource.map((item: any) => {
    let total = 0
    Object.keys(item).forEach((key) => {
      if (typeof item[key] === 'number') {
        total += item[key]
      }
    })
    return {
      ...item,
      total: total,
    }
  })

  return (
    <Table
      bordered
      dataSource={dataSourceWithTotal}
      columns={columns}
      pagination={false}
      scroll={{
        x: 'max-content',
      }}
    />
  )
}
export default ProjectTable
