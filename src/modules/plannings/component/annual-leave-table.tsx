import React from "react"
import { Button, Input, InputNumber, Space, Table } from "antd"
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons"
import { v4 as uuidv4 } from "uuid"

const AnnualLeaveTable = ({
  data,
  setAnnualLeaveData
}: {
  data: any[],
  setAnnualLeaveData: (data: any[]) => void,
}) => {
  const columns: any[] = [
    {
      title: "Team",
      key: "team",
      dataIndex: "team",
      fixed: "left",
      render: (text: any, record: any) => (
        record.disable ? text : <Input placeholder="Member name" value={text}
                                       onChange={event => onChange("team", record.id, event.target.value)} />
      )
    },
    {
      title: "Annual leave",
      key: "al",
      dataIndex: "al",
      render: (text: any, record: any) => {
        return record.disable ? text : (
          <InputNumber value={text} defaultValue={0} min={0}
                       onChange={event => onChange("al", record.id, event ?? 0)} />
        )
      }
    },
    {
      title: "-",
      render: (text: any, record: any) => (
        record.disable ? "" : <Button icon={<DeleteOutlined />} onClick={() => onRemoveRow(record.id)} />
      )
    }
  ]

  function onChange(columnKey: string, rowId: string, value: any) {
    const updatedDataSource = data.map(item => {
      if (item.id !== rowId) {
        return item
      }
      item[columnKey] = value
      return item
    })
    setAnnualLeaveData(updatedDataSource)
  }

  const onAddRow = () => {
    const newRow = columns.reduce((row: any, column: any) => {
      if (column.key != "team") {
        row[column.key] = 0
      } else {
        row[column.key] = ""
      }
      return row
    }, {})
    newRow.id = uuidv4()
    const updatedData = [newRow, ...data]
    setAnnualLeaveData(updatedData)
  }

  function onRemoveRow(rowId: string) {
    const updatedData = data.filter(row => row.id !== rowId)
    setAnnualLeaveData(updatedData)
  }

  return (
    <Table
      bordered
      pagination={false}
      columns={columns}
      dataSource={data}
      title={() =>
        <Space className="w-full justify-end">
          <Button
            onClick={onAddRow}
            type="primary"
            icon={<PlusOutlined />}
            className="align-left"
          />
        </Space>}
      scroll={{ x: "max-content", y: 400 }}>
    </Table>
  )
}

export default AnnualLeaveTable
