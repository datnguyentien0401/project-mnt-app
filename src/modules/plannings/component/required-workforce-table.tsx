import React from "react"
import { Button, DatePicker, Input, InputNumber, Space, Table } from "antd"
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons"
import { v4 as uuidv4 } from "uuid"
import dayjs from "dayjs"

const numberInputColumn = [
  "priority",
  "buffer",
  "actualWorkforce"
]

const RequiredWorkforceTable = ({
  data,
  setRequiredWorkforceData
}: {
  data: any[],
  setRequiredWorkforceData: (data: any[]) => void
}) => {
  const columns: any[] = [
    {
      title: "Customer Schedule",
      key: "schedule",
      dataIndex: "schedule",
      sorter: (a: any, b: any) => new Date(a.schedule) > new Date(b.schedule),
      render: (text: any, record: any) => {
        return record.disable ? {
          children: <div className={"w-full justify-center"}>TOTAL</div>,
          props: {
            colSpan: 8
          }
        } : (
          <DatePicker value={dayjs(text)} onChange={value => onChange("schedule", record.id, value)} />
        )
      }
    },
    {
      title: "TQA or date",
      key: "tqa",
      dataIndex: "tqa",
      sorter: (a: any, b: any) => new Date(a.TQA) > new Date(b.TQA),
      render: (text: any, record: any) => {
        return record.disable ? {
          props: {
            colSpan: 0
          }
        } : (
          <DatePicker value={dayjs(text)} onChange={value => onChange("tqa", record.id, value)} />
        )
      }
    },
    {
      title: "RR date",
      key: "dueDate",
      dataIndex: "dueDate",
      sorter: (a: any, b: any) => new Date(a.rrDate) > new Date(b.rrDate),
      render: (text: string, record: any) => {
        return record.disable ? {
          props: {
            colSpan: 0
          }
        } : text
      }
    },
    {
      title: "Start date",
      key: "startDate",
      dataIndex: "startDate",
      sorter: (a: any, b: any) => new Date(a.startDate) > new Date(b.startDate),
      render: (text: any, record: any) => {
        return record.disable ? {
          props: {
            colSpan: 0
          }
        } : (
          <DatePicker value={dayjs(text)} onChange={value => onChange("startDate", record.id, value)} />
        )
      }
    },
    {
      title: "Priority",
      key: "priority",
      dataIndex: "priority",
      sorter: (a: any, b: any) => a.priority - b.priority,
      render: (text: any, record: any) => {
        return record.disable ? {
          props: {
            colSpan: 0
          }
        } : (
          <InputNumber value={text} min={0}
                       onChange={event => onChange("priority", record.id, event ?? 0)} />
        )
      }
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      sorter: (a: any, b: any) => a.status > b.status,
      render: (text: string, record: any) => {
        return record.disable ? {
          props: {
            colSpan: 0
          }
        } : text
      }
    },
    {
      title: "NSS",
      key: "nss",
      dataIndex: "nss",
      sorter: (a: any, b: any) => a.nss > b.nss,
      render: (text: string, record: any) => {
        return record.disable ? {
          props: {
            colSpan: 0
          }
        } : (
          <Input value={text} onChange={event => onChange("nss", record.id, event.target.value || "")} />
        )
      }
    },
    {
      title: "Project",
      key: "project",
      dataIndex: "project",
      sorter: (a: any, b: any) => a.project > b.project,
      render: (text: string, record: any) => {
        return record.disable ? {
          props: {
            colSpan: 0
          }
        } : text
      }
    },
    {
      title: "Remaining time",
      key: "remainingTime",
      dataIndex: "remainingTime",
      sorter: (a: any, b: any) => a.remainingTime - b.remainingTime,
      render: (text: number) => text?.toFixed(2)
    },
    {
      title: "Buffer (%)",
      key: "buffer",
      dataIndex: "buffer",
      sorter: (a: any, b: any) => a.buffer - b.buffer,
      render: (text: number, record: any) => {
        return record.disable ? text : (
          <InputNumber value={text} min={0}
                       onChange={event => onChange("buffer", record.id, event ?? 0)} />
        )
      }
    },
    {
      title: "Required workforce",
      key: "requiredWorkforce",
      dataIndex: "requiredWorkforce",
      sorter: (a: any, b: any) => a.requiredWorkforce - b.requiredWorkforce,
      render: (text: number) => text?.toFixed(2)
    },
    {
      title: "Actual workforce",
      key: "actualWorkforce",
      dataIndex: "actualWorkforce",
      sorter: (a: any, b: any) => a.actualWorkforce - b.actualWorkforce,
      render: (text: number, record: any) => {
        return record.disable ? text : (
          <InputNumber value={text} min={0}
                       onChange={event => onChange("actualWorkforce", record.id, event ?? 0)} />
        )
      }
    },
    {
      title: "Lack of workforce",
      key: "lackWorkforce",
      dataIndex: "lackWorkforce",
      sorter: (a: any, b: any) => a.lackWorkforce - b.lackWorkforce,
      render: (text: number) => text ? text.toFixed(2) : ""
    },
    {
      title: "-",
      width: 40,
      render: (text: string, record: any) => (
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

      const requiredWorkforce = item.remainingTime * (100 + item.buffer) / 100
      const lackWorkforce = item.actualWorkforce - item.requiredWorkforce
      item.requiredWorkforce = requiredWorkforce
      item.lackWorkforce = lackWorkforce
      return item
    })
    setRequiredWorkforceData(updatedDataSource)
  }

  const onAddRow = () => {
    const newRow = columns.reduce((row: any, column: any) => {
      if (numberInputColumn.includes(column.key)) {
        row[column.key] = 0
      } else {
        row[column.key] = ""
      }
      return row
    }, {})
    newRow.id = uuidv4()
    setRequiredWorkforceData([newRow, ...data])
  }

  function onRemoveRow(rowId: string) {
    setRequiredWorkforceData(data.filter(row => row.id !== rowId))
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
      scroll={{ x: "max-content" }}>
    </Table>
  )
}

export default RequiredWorkforceTable
