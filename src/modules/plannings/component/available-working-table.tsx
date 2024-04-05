import { Button, Input, InputNumber, Space, Table } from 'antd'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import React from 'react'
import { v4 as uuidv4 } from 'uuid'
import dayjs, { Dayjs } from 'dayjs'
import { countMonth } from '@/utils/helper'

interface WorkingWeek {
  key: string
  year: number
  week: string
}

const AvailableWorkingTable = ({
  data,
  fromDate,
  toDate,
  setAvailableWorkingData,
}: {
  data: any[]
  fromDate: Dayjs
  toDate: Dayjs
  setAvailableWorkingData: (data: any[], columns: any[]) => void
}) => {
  const columns: any[] = [
    {
      title: 'Team',
      key: 'team',
      dataIndex: 'team',
      fixed: 'left',
      render: (text: any, record: any) =>
        record.disable ? (
          text
        ) : (
          <Input
            placeholder="Member name"
            value={text}
            onChange={(event) =>
              onChange('team', record.id, event.target.value)
            }
          />
        ),
    },
    ...getWorkingMonth(fromDate, toDate),
    {
      title: '-',
      key: 'action',
      dataIndex: 'action',
      render: (text: any, record: any) =>
        record.disable ? (
          ''
        ) : (
          <Button
            icon={<DeleteOutlined />}
            onClick={() => onRemoveRow(record.id)}
          />
        ),
    },
  ]

  function getWorkingMonth(fromDate: any, toDate: any): any[] {
    const numOfMonths = countMonth(new Date(fromDate), new Date(toDate))

    let result: any[] = [
      ...getWorkingWeeksInMonth(fromDate, false).map((workingWeek) =>
        getWorkingWeekColumns(workingWeek),
      ),
      getTotalWeekColumn(fromDate),
    ]
    for (let i = 0; i < numOfMonths - 1; i++) {
      fromDate = fromDate.add(1, 'month')
      result = [
        ...result,
        ...getWorkingWeeksInMonth(fromDate, true).map((workingWeek) =>
          getWorkingWeekColumns(workingWeek),
        ),
        getTotalWeekColumn(fromDate),
      ]
    }
    return result
  }

  function getWorkingWeekColumns(workingWeek: WorkingWeek) {
    return {
      title: workingWeek.year + ' ' + workingWeek.week,
      key: workingWeek.key,
      dataIndex: workingWeek.key,
      render: (text: any, record: any) => {
        return record.disable ? (
          text
        ) : (
          <InputNumber
            value={text}
            defaultValue={0}
            min={0}
            onChange={(event) =>
              onChange(workingWeek.key, record.id, event ?? 0)
            }
          />
        )
      },
    }
  }

  function getTotalWeekColumn(fromDate: any) {
    return {
      title: `Total ${fromDate.format('YYYY/MM')}`,
      key: `total${fromDate.format('YYYYMM')}`,
      dataIndex: `total${fromDate.format('YYYYMM')}`,
    }
  }

  function getWorkingWeeksInMonth(
    dateInput: any,
    isStartMonth: boolean,
  ): WorkingWeek[] {
    const workingWeeks = []
    const monday = new Date(dateInput)
    const friday = new Date(monday)
    if (isStartMonth) {
      monday.setDate(1)
    } else {
      while (friday.getDay() !== 5) {
        friday.setDate(friday.getDate() + 1)
      }
      workingWeeks.push(getWorkingWeek(monday, friday))
      if (dayjs(friday).format('YYYYMM') > dayjs(monday).format('YYYYMM')) {
        return workingWeeks
      }
      monday.setDate(friday.getDate() + 3)
    }

    while (monday.getDay() !== 1) {
      monday.setDate(monday.getDate() + 1)
    }

    while (
      dayjs(monday).format('YYYYMM') <= dayjs(dateInput).format('YYYYMM')
    ) {
      friday.setDate(monday.getDate() + 4)
      workingWeeks.push(getWorkingWeek(monday, friday))
      monday.setDate(monday.getDate() + 7)
    }
    return workingWeeks
  }

  function getWorkingWeek(monday: Date, friday: Date): WorkingWeek {
    return {
      key:
        dayjs(monday.toLocaleDateString()).format('YYYYMMDD') +
        dayjs(friday.toLocaleDateString()).format('YYYYMMDD'),
      year: monday.getFullYear(),
      week:
        dayjs(monday.toLocaleDateString()).format('DD/MM') +
        '-' +
        dayjs(friday.toLocaleDateString()).format('DD/MM'),
    }
  }

  function onChange(columnKey: string, rowId: string, value: any) {
    const updatedDataSource = data.map((item) => {
      if (item.id !== rowId) {
        return item
      }
      item[columnKey] = value
      if (columnKey.startsWith('total') || columnKey.startsWith('team')) {
        return item
      }
      const month = columnKey.toString().substring(0, 6)
      item[`total${month}`] = Object.keys(item).reduce((sum, key) => {
        if (key.startsWith(month)) {
          return sum + item[key]
        }
        return sum
      }, 0)
      return item
    })
    setAvailableWorkingData(updatedDataSource, columns)
  }

  const onAddRow = () => {
    const newRow = columns.reduce((row: any, column: any) => {
      if (column.key.startsWith('team')) {
        return row
      }
      if (!column.key.startsWith('total')) {
        row[column.key] = 4.5
        return row
      }
      const month = column.key.toString().substring(5)
      row[column.key] = columns.reduce((sum, col) => {
        if (col.key.startsWith(month)) {
          return sum + 4.5
        }
        return sum
      }, 0)
      return row
    }, {})
    newRow.id = uuidv4()
    setAvailableWorkingData([newRow, ...data], columns)
  }

  function onRemoveRow(rowId: string) {
    setAvailableWorkingData(
      data.filter((row) => row.id !== rowId),
      columns,
    )
  }

  return (
    <Table
      bordered
      columns={columns}
      pagination={false}
      dataSource={data}
      title={() => (
        <Space className="w-full justify-end">
          <Button
            onClick={onAddRow}
            type="primary"
            icon={<PlusOutlined />}
            className="align-left"
          />
        </Space>
      )}
      scroll={{ x: 'max-content' }}
    ></Table>
  )
}

export default AvailableWorkingTable
