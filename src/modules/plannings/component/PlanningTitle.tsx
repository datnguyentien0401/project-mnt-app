import { Button, Input, Space } from 'antd'
import React from 'react'
import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  SaveOutlined,
} from '@ant-design/icons'

const PlanningTitle = ({
  table,
  editNameKey,
  onChangeTableNameInput,
  onSaveTable,
  onRemoveTable,
  onCloneTable,
  onEditTableName,
}: {
  table: any
  editNameKey: string
  onChangeTableNameInput: (data: any[]) => void
  onSaveTable: (value: string) => void
  onRemoveTable: (key: string | number) => void
  onCloneTable: (table: any, key: string) => void
  onEditTableName: (key: string) => void
}) => {
  return (
    <Space
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Space className="justify-start">
        {editNameKey != table.key && <div> {table.name} </div>}
        {editNameKey === table.key && (
          <Input
            defaultValue={table.name}
            onChange={(event) =>
              onChangeTableNameInput({ ...table, name: event.target.value })
            }
            placeholder="Enter table name"
            style={{ width: 700 }}
            maxLength={100}
          />
        )}
        <Button
          onClick={() => onEditTableName(table.key)}
          type="default"
          icon={<EditOutlined />}
        />
      </Space>
      <Space className="justify-end">
        <Button
          onClick={() => onCloneTable(table, `[Clone] ${table.name}`)}
          type="default"
          icon={<CopyOutlined />}
          className="align-left"
        >
          Clone
        </Button>
        <Button
          onClick={() => {
            onSaveTable(table.key)
          }}
          type="primary"
          icon={<SaveOutlined />}
          className="align-left"
        >
          Save
        </Button>
        <Button
          onClick={() => onRemoveTable(table.key)}
          icon={<DeleteOutlined />}
          className="align-left"
        >
          Remove
        </Button>
      </Space>
    </Space>
  )
}

export default PlanningTitle
