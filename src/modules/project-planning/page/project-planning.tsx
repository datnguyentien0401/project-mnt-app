import React, { useEffect, useState } from 'react'
import {
  Card,
  Col,
  DatePicker,
  Image,
  InputNumber,
  Row,
  Select,
  Spin,
  Table,
} from 'antd'
import { v4 as uuidv4 } from 'uuid'
import dayjs, { Dayjs } from 'dayjs'
import MainLayout from '@/modules/ui/layout/main-layout'
import {
  getAllEpic,
  getAllJiraProject,
  getProjectRemaining,
} from '@/lib/api/project'
import { ProjectRemaining } from '@/types/common'

const ProjectPlanning = () => {
  const [dataSource, setDataSource] = useState<any[]>([])
  const [warning, setWarning] = useState(false)
  const [projectOptions, setProjectOptions] = useState<any[]>([])
  const [jiraProjectOptions, setJiraProjectOptions] = useState<any[]>([])
  const [isFetching, setIsFetching] = useState(false)

  const fetchJiraProjects = () => {
    setIsFetching(true)
    getAllJiraProject().then((data: any) =>
      setJiraProjectOptions(
        data.map((epic: any) => ({
          value: epic.id,
          label: epic.name,
        })),
      ),
    )
    setIsFetching(false)
  }

  useEffect(() => {
    fetchJiraProjects()
  }, [])

  const handleChangeJiraProject = async (jiraProjects: any[]) => {
    setProjectOptions([])
    if (jiraProjects.length > 0) {
      setIsFetching(true)
      const epics = (await getAllEpic(jiraProjects)) || []
      setProjectOptions(
        epics.map((epic: any) => ({
          value: epic.projectId,
          label: epic.projectName,
        })),
      )
      setIsFetching(false)
    }
  }

  const onChangeProject = async (projectId: string) => {
    setIsFetching(true)
    const projectRemaining: ProjectRemaining[] = await getProjectRemaining([
      projectId,
    ])
    if (projectRemaining) {
      setDataSource([
        ...projectRemaining.map((item) => ({
          id: uuidv4(),
          epicName: item.epicName,
          remainingTimeExpect: item.timeEstimateMM,
          dueDateExpect: item.dueDate,
          headCountExpect: item.headCount,
          remainingTimeET: item.timeEstimateMM,
          headCountET: item.headCount,
        })),
      ])
    } else {
      setDataSource([
        {
          id: uuidv4(),
        },
      ])
    }
    setIsFetching(false)
    setWarning(false)
  }

  function countWorkingDays(startDate: Date, endDate: Date): number {
    let count = 0
    const currentDate = new Date(startDate)

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay()

      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        count++
      }

      currentDate.setDate(currentDate.getDate() + 1)
    }

    return count
  }

  function calculateStartOrDueDate(
    date: Date,
    countWorkingDays: number,
    type: 'start' | 'due',
  ): string {
    let count = 0
    const currentDate = new Date(date)
    const typeAdap = type === 'start' ? -1 : 1

    while (count < countWorkingDays) {
      currentDate.setDate(currentDate.getDate() + typeAdap)

      const dayOfWeek = currentDate.getDay()
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        count++
      }
    }

    return dayjs(currentDate).format('YYYY-MM-DD')
  }

  function handleStartDateExpect(item: any, value: any) {
    item.startDateExpect = value

    let isWarning = false
    if (!value && item.dueDateET && item.remainingTimeET && item.headCountET) {
      const end = new Date(item.dueDateExpect ?? item.dueDateET)
      const countDate =
        item.headCountExpect > 0
          ? item.remainingTimeET / (item.headCountExpect / 20)
          : 0
      item.startDateET = calculateStartOrDueDate(end, countDate, 'start')
    } else {
      item.startDateET = value ? dayjs(value).format('YYYY-MM-DD') : ''
      if (item.dueDateExpect && item.headCountExpect > 0) {
        const countDate = calculateStartOrDueDate(
          new Date(item.dueDateExpect),
          item.remainingTimeET / (item.headCountExpect / 20),
          'start',
        )
        isWarning = item.startDateET !== countDate
      }
      if (item.headCountExpect <= 0) {
        const countWorkingday = countWorkingDays(
          new Date(value),
          new Date(item.dueDateExpect),
        )
        item.headCountET = 0
        if (value && countWorkingday) {
          item.headCountET = item.remainingTimeET / (countWorkingday / 20)
        }
      }
      if (!item.dueDateExpect) {
        item.dueDateET = ''
        if (value && item.headCountExpect > 0) {
          calculateStartOrDueDate(
            new Date(value),
            (item.remainingTimeET / item.headCountExpect) * 20,
            'due',
          )
        }
      }
    }
    setWarning(isWarning)
    return item
  }

  function handleDueDateExpect(item: any, value: any) {
    item.dueDateExpect = value

    let isWarning = false
    if (
      !value &&
      item.startDateET &&
      item.remainingTimeET &&
      item.headCountET
    ) {
      const start = new Date(item.startDateExpect ?? item.startDateET)
      const countDate =
        item.headCountExpect > 0
          ? item.remainingTimeET / (item.headCountExpect / 20)
          : 0
      item.dueDateET = calculateStartOrDueDate(start, countDate, 'due')
    } else {
      item.dueDateET = value ? dayjs(value).format('YYYY-MM-DD') : ''
      if (item.startDateExpect && item.headCountExpect > 0) {
        isWarning =
          item.dueDateET !==
          calculateStartOrDueDate(
            new Date(item.startDateExpect),
            item.remainingTimeET / (item.headCountExpect / 20),
            'due',
          )
      }
      if (item.headCountExpect <= 0) {
        const countWorkingday = countWorkingDays(
          new Date(item.startDateExpect),
          new Date(value),
        )
        item.headCountET = 0
        if (value && countWorkingday > 0) {
          item.headCountET = item.remainingTimeET / (countWorkingday / 20)
        }
      }
      if (!item.startDateExpect) {
        item.startDateET = ''
        if (value && item.headCountExpect > 0) {
          item.startDateET = calculateStartOrDueDate(
            new Date(value),
            (item.remainingTimeET / item.headCountExpect) * 20,
            'start',
          )
        }
      }
    }
    setWarning(isWarning)
    return item
  }

  function handleHeadCountExpect(item: any, value: any) {
    item.headCountExpect = value

    let isWarning = false
    if (!value && item.startDateET && item.remainingTimeET && item.dueDateET) {
      const countDate = countWorkingDays(
        new Date(item.startDateExpect ?? item.startDateET),
        new Date(item.dueDateExpect ?? item.dueDateET),
      )
      item.headCountET =
        countDate > 0 ? item.remainingTimeET / (countDate / 20) : 0
    } else {
      item.headCountET = value
      if (item.startDateExpect && item.dueDateExpect) {
        const countDate = countWorkingDays(
          new Date(item.startDateExpect ?? item.startDateET),
          new Date(item.dueDateExpect ?? item.dueDateET),
        )
        isWarning =
          value !== (countDate ? item.remainingTimeET / (countDate / 20) : 0)
      }
      if (!item.dueDateExpect) {
        item.dueDateET =
          value > 0
            ? calculateStartOrDueDate(
                new Date(item.startDateExpect ?? item.startDateET),
                (item.remainingTimeET / value) * 20,
                'due',
              )
            : ''
      }
      if (!item.startDateExpect) {
        item.startDateET =
          value > 0
            ? calculateStartOrDueDate(
                new Date(item.dueDateExpect ?? item.dueDateET),
                (item.remainingTimeET / value) * 20,
                'start',
              )
            : ''
      }
    }
    setWarning(isWarning)
    return item
  }

  function onChange(columnKey: string, rowId: string, value: any) {
    const updatedDataSource = dataSource.map((item) => {
      if (item.id !== rowId) {
        return item
      }
      if (columnKey === 'startDateExpect') {
        item = handleStartDateExpect(item, value)
      }
      if (columnKey === 'dueDateExpect') {
        item = handleDueDateExpect(item, value)
      }
      if (columnKey === 'headCountExpect') {
        item = handleHeadCountExpect(item, value)
      }
      if (columnKey === 'remainingTimeExpect') {
        item.remainingTimeET = value
        item.remainingTimeExpect = value
        if (
          item.startDateET &&
          item.dueDateET &&
          item.headCountET &&
          item.startDateExpect &&
          item.dueDateExpect &&
          item.headCountExpect
        ) {
          setWarning(
            item.dueDateET !=
              calculateStartOrDueDate(
                new Date(item.startDateET),
                item.remainingTimeExpect / (item.headCountET / 20),
                'due',
              ),
          )
        }
        if (!item.startDateExpect) {
          handleStartDateExpect(item, null)
        }
        if (!item.dueDateExpect) {
          handleDueDateExpect(item, null)
        }
        if (item.headCountExpect <= 0) {
          handleHeadCountExpect(item, 0)
        }
      }
      return item
    })
    setDataSource(updatedDataSource)
  }

  return (
    <>
      <MainLayout headerName="Project Planning">
        <Spin spinning={isFetching}>
          <Card className="max-w-full mb-6">
            <Select
              options={jiraProjectOptions}
              mode="multiple"
              popupClassName="capitalize"
              placeholder="Jira Project"
              filterOption={(input, option) =>
                option.label.toLowerCase().includes(input.toLowerCase())
              }
              className={'w-full'}
              onChange={(value) => handleChangeJiraProject(value)}
            />
          </Card>
          {projectOptions.length > 0 && (
            <>
              <Card className="max-w-full mb-6">
                <Select
                  options={projectOptions}
                  popupClassName="capitalize"
                  placeholder="Project"
                  showSearch={true}
                  className={'w-full'}
                  onChange={(value) => onChangeProject(value)}
                  filterOption={(input, option) =>
                    option.label.toLowerCase().includes(input.toLowerCase())
                  }
                />
              </Card>
              <Table
                dataSource={dataSource}
                bordered
                pagination={false}
                footer={() =>
                  warning ? (
                    <span style={{ color: 'red' }}>
                      Warning to change remaining time since others are fixed
                    </span>
                  ) : (
                    ''
                  )
                }
              >
                <Table.ColumnGroup>
                  <Table.Column
                    title="Epic"
                    dataIndex="epicName"
                    key="epicName"
                  ></Table.Column>
                </Table.ColumnGroup>
                <Table.ColumnGroup title="Expectation">
                  <Table.Column
                    title="Remaining Time"
                    dataIndex="remainingTimeExpect"
                    key="remainingTimeExpect"
                    render={(text: any, record: any) => {
                      return (
                        <InputNumber
                          value={text}
                          min={0}
                          onChange={(event) =>
                            onChange(
                              'remainingTimeExpect',
                              record.id,
                              event ?? 0,
                            )
                          }
                        />
                      )
                    }}
                  />
                  <Table.Column
                    title="Start Date"
                    dataIndex="startDateExpect"
                    key="startDateExpect"
                    render={(startDate: any, record: any) => {
                      return (
                        <DatePicker
                          value={
                            startDate == null ? startDate : dayjs(startDate)
                          }
                          onChange={(value) =>
                            onChange('startDateExpect', record.id, value)
                          }
                        />
                      )
                    }}
                  />
                  <Table.Column
                    title="Due Date"
                    dataIndex="dueDateExpect"
                    key="dueDateExpect"
                    render={(dueDate: any, record: any) => {
                      return (
                        <DatePicker
                          value={dueDate == null ? dueDate : dayjs(dueDate)}
                          onChange={(value) =>
                            onChange('dueDateExpect', record.id, value)
                          }
                        />
                      )
                    }}
                  />
                  <Table.Column
                    title="Head Count"
                    dataIndex="headCountExpect"
                    key="headCountExpect"
                    render={(text: any, record: any) => {
                      return (
                        <InputNumber
                          value={text}
                          min={0}
                          onChange={(event) =>
                            onChange('headCountExpect', record.id, event ?? 0)
                          }
                        />
                      )
                    }}
                  />
                </Table.ColumnGroup>
                <Table.ColumnGroup title="Estimation">
                  <Table.Column
                    title="Remaining Time"
                    dataIndex="remainingTimeET"
                    key="remainingTimeET"
                    render={(text: number) => text?.toFixed(1)}
                  />
                  <Table.Column
                    title="Start Date"
                    dataIndex="startDateET"
                    key="startDateET"
                  />
                  <Table.Column
                    title="Due Date"
                    dataIndex="dueDateET"
                    key="dueDateET"
                  />
                  <Table.Column
                    title="Head Count"
                    dataIndex="headCountET"
                    key="headCountET"
                    render={(text: number) => text?.toFixed(1)}
                  />
                </Table.ColumnGroup>
              </Table>
            </>
          )}
          <Card className="max-w-full mb-6" style={{ marginTop: '20px' }}>
            <Image
              src="/logic-matrix.png"
              style={{ width: '100%', height: 'auto' }}
              alt="Logix of matrix"
            />
          </Card>
        </Spin>
      </MainLayout>
    </>
  )
}

export default ProjectPlanning
