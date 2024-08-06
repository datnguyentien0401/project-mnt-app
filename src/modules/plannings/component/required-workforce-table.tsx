import React, { useState } from 'react'
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Table,
} from 'antd'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'
import { Option } from '@/types/common'
import { getAllEpic } from '@/lib/api/project'

const numberInputColumn = ['priority', 'buffer', 'actualWorkforce']

const RequiredWorkforceTable = ({
  data = [],
  jiraProjectOptions = [],
  setRequiredWorkforceData,
  handleChangeProject,
  setFetching,
}: {
  data: any[]
  jiraProjectOptions: Option[]
  setRequiredWorkforceData: (data: any[]) => void
  handleChangeProject: (value: any[]) => void
  setFetching: (value: boolean) => void
}) => {
  const columns: any[] = [
    {
      title: 'Customer Schedule',
      key: 'schedule',
      dataIndex: 'schedule',
      sorter: (a: any, b: any) =>
        new Date(a.schedule).getTime() - new Date(b.schedule).getTime(),
      render: (text: any, record: any) => {
        return record.disable ? (
          {
            children: <div className={'w-full justify-center'}>TOTAL</div>,
            props: {
              colSpan: 8,
            },
          }
        ) : (
          <DatePicker
            value={text ? dayjs(text) : null}
            onChange={(value) => onChange('schedule', record.id, value)}
          />
        )
      },
    },
    {
      title: 'TQA or date',
      key: 'tqa',
      dataIndex: 'tqa',
      sorter: (a: any, b: any) =>
        new Date(a.TQA).getTime() - new Date(b.TQA).getTime(),
      render: (text: any, record: any) => {
        return record.disable ? (
          {
            props: {
              colSpan: 0,
            },
          }
        ) : (
          <DatePicker
            value={text ? dayjs(text) : null}
            onChange={(value) => onChange('tqa', record.id, value)}
          />
        )
      },
    },
    {
      title: 'RR date',
      key: 'dueDate',
      dataIndex: 'dueDate',
      sorter: (a: any, b: any) =>
        new Date(a.rrDate).getTime() - new Date(b.rrDate).getTime(),
      render: (text: string, record: any) => {
        return record.disable ? (
          {
            props: {
              colSpan: 0,
            },
          }
        ) : (
          <DatePicker
            value={text ? dayjs(text) : null}
            onChange={(value) => onChange('dueDate', record.id, value)}
          />
        )
      },
    },
    {
      title: 'Start date',
      key: 'startDate',
      dataIndex: 'startDate',
      sorter: (a: any, b: any) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
      render: (text: any, record: any) => {
        return record.disable ? (
          {
            props: {
              colSpan: 0,
            },
          }
        ) : (
          <DatePicker
            value={text ? dayjs(text) : null}
            onChange={(value) => onChange('startDate', record.id, value)}
          />
        )
      },
    },
    {
      title: 'Priority',
      key: 'priority',
      dataIndex: 'priority',
      sorter: (a: any, b: any) => {
        if (a.disable || b.disable) return 0
        return (a.priority ?? 0) - (b.priority ?? 0)
      },
      render: (text: any, record: any) => {
        return record.disable ? (
          {
            props: {
              colSpan: 0,
            },
          }
        ) : (
          <InputNumber
            value={text}
            min={0}
            onChange={(event) => onChange('priority', record.id, event ?? 0)}
          />
        )
      },
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      sorter: (a: any, b: any) => a.status?.localeCompare(b.status) ?? 0,
      render: (text: string, record: any) => {
        return record.disable
          ? {
              props: {
                colSpan: 0,
              },
            }
          : text
      },
    },
    {
      title: 'NSS',
      key: 'nss',
      dataIndex: 'nss',
      sorter: (a: any, b: any) => a.nss?.localeCompare(b.nss) ?? 0,
      render: (text: string, record: any) => {
        return record.disable ? (
          {
            props: {
              colSpan: 0,
            },
          }
        ) : (
          <>
            <Input
              value={text}
              style={{
                width: '200px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              onChange={(event) =>
                onChange('nss', record.id, event.target.value || '')
              }
            />
            {text && (
              <>
                <br />
                <a
                  href={text}
                  style={{
                    fontSize: 12,
                    width: '200px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: 'inline-block',
                  }}
                >
                  {text}
                </a>
              </>
            )}
          </>
        )
      },
    },
    {
      title: 'Project',
      key: 'project',
      dataIndex: 'project',
      sorter: (a: any, b: any) => a.project?.localeCompare(b.project) ?? 0,
      render: (text: string, record: any) => {
        return record.disable
          ? {
              props: {
                colSpan: 0,
              },
            }
          : text
      },
    },
    {
      title: 'Remaining time',
      key: 'remainingTime',
      dataIndex: 'remainingTime',
      sorter: (a: any, b: any) => {
        if (a.disable || b.disable) return 0
        return (a.remainingTime ?? 0) - (b.remainingTime ?? 0)
      },
      render: (text: number, record: any) =>
        record.disable ? (
          text ? (
            text.toFixed(2)
          ) : (
            ''
          )
        ) : (
          <InputNumber
            value={text}
            min={0}
            onChange={(event) =>
              onChange('remainingTime', record.id, event ?? 0)
            }
          />
        ),
    },
    {
      title: 'Buffer (%)',
      key: 'buffer',
      dataIndex: 'buffer',
      sorter: (a: any, b: any) => {
        if (a.disable || b.disable) return 0
        return (a.buffer ?? 0) - (b.buffer ?? 0)
      },
      render: (text: number, record: any) => {
        return record.disable ? (
          text
        ) : (
          <InputNumber
            value={text}
            min={0}
            onChange={(event) => onChange('buffer', record.id, event ?? 0)}
          />
        )
      },
    },
    {
      title: 'Required workforce',
      key: 'requiredWorkforce',
      dataIndex: 'requiredWorkforce',
      sorter: (a: any, b: any) => {
        if (a.disable || b.disable) return 0
        return (a.requiredWorkforce ?? 0) - (b.requiredWorkforce ?? 0)
      },
      render: (text: number) => (text ? text.toFixed(2) : ''),
    },
    {
      title: 'Actual workforce',
      key: 'actualWorkforce',
      dataIndex: 'actualWorkforce',
      sorter: (a: any, b: any) => {
        if (a.disable || b.disable) return 0
        return (a.actualWorkforce ?? 0) - (b.actualWorkforce ?? 0)
      },
      render: (text: number, record: any) => {
        return record.disable ? (
          text
        ) : (
          <InputNumber
            value={text}
            min={0}
            onChange={(event) =>
              onChange('actualWorkforce', record.id, event ?? 0)
            }
          />
        )
      },
    },
    {
      title: 'Lack of workforce',
      key: 'lackWorkforce',
      dataIndex: 'lackWorkforce',
      sorter: (a: any, b: any) => {
        if (a.disable || b.disable) return 0
        return (a.lackWorkforce ?? 0) - (b.lackWorkforce ?? 0)
      },
      render: (text: number) => (text ? text.toFixed(2) : ''),
    },
    {
      title: '-',
      width: 40,
      render: (text: string, record: any) =>
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
  const [form] = Form.useForm()

  function onChange(columnKey: string, rowId: string, value: any) {
    const updatedDataSource = data.map((item) => {
      if (item.id !== rowId) {
        return item
      }
      item[columnKey] = value

      const requiredWorkforce = (item.remainingTime * (100 + item.buffer)) / 100
      const lackWorkforce = item.actualWorkforce - requiredWorkforce
      item.requiredWorkforce = requiredWorkforce
      item.lackWorkforce = lackWorkforce
      return item
    })
    setRequiredWorkforceData(updatedDataSource)
  }

  const onAddRow = (values: Record<string, any>) => {
    if (values.projects && values.projects.length > 0) {
      handleChangeProject(values.projects)
      form.resetFields()
      return
    }
    const newRow = columns.reduce((row: any, column: any) => {
      if (numberInputColumn.includes(column.key)) {
        row[column.key] = 0
      } else if ('startDate' === column.key) {
        row[column.key] = dayjs()
      }
      return row
    }, {})
    newRow.id = uuidv4()
    setRequiredWorkforceData([newRow, ...data])
  }

  function onRemoveRow(rowId: string) {
    setRequiredWorkforceData(data.filter((row) => row.id !== rowId))
  }

  const [projectOptions, setProjectOptions] = useState<any[]>([])
  const handleChangeJiraProject = async (jiraProjects: any[]) => {
    if (jiraProjects.length > 0) {
      setFetching(true)
      const epics = (await getAllEpic(jiraProjects)) || []
      const options = epics.map((epic: any) => ({
        value: epic.projectId,
        label: epic.projectName,
      }))
      setProjectOptions(options)
      setFetching(false)
    } else {
      setProjectOptions([])
    }
  }

  return (
    <Table
      bordered
      pagination={false}
      columns={columns}
      dataSource={data}
      title={() => (
        <Form form={form} autoComplete="off" onFinish={onAddRow}>
          <Row gutter={[12, 12]}>
            <Col span={5}>
              <Select
                options={jiraProjectOptions}
                mode="multiple"
                popupClassName="capitalize"
                placeholder="Jira Project"
                filterOption={(input: string, option: any) =>
                  option.label.toLowerCase().includes(input.toLowerCase())
                }
                onChange={handleChangeJiraProject}
                allowClear={true}
                className={'w-full'}
              />
            </Col>
            <Col span={18}>
              <Form.Item name="projects">
                <Select
                  options={projectOptions}
                  mode="multiple"
                  popupClassName="capitalize"
                  placeholder="Project"
                  filterOption={(input: string, option: any) =>
                    option.label.toLowerCase().includes(input.toLowerCase())
                  }
                  allowClear={true}
                />
              </Form.Item>
            </Col>
            <Col span={1}>
              <Button
                htmlType="submit"
                type="primary"
                icon={<PlusOutlined />}
              />
            </Col>
          </Row>
        </Form>
      )}
      scroll={{ x: 'max-content' }}
    ></Table>
  )
}

export default RequiredWorkforceTable
