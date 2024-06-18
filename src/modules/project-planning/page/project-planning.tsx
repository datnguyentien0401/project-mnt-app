import React, { useEffect, useState } from 'react'
import { Card, DatePicker, Image, InputNumber, Select, Spin, Table } from 'antd'
import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'
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
        {
          id: uuidv4(),
          remainingTimeExpect: projectRemaining[0].timeEstimateMM,
          dueDateExpect: projectRemaining[0].dueDate,
          headCountExpect: projectRemaining[0].headCount,
          remainingTimeET: projectRemaining[0].timeEstimateMM,
          headCountET: projectRemaining[0].headCount,
        },
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
      console.log(3)
      item.startDateET = calculateStartOrDueDate(
        new Date(item.dueDateExpect),
        item.remainingTimeExpect / (item.headCountExpect / 20),
        'start',
      )
    } else {
      item.startDateET = value ? dayjs(value).format('YYYY-MM-DD') : ''
      if (item.dueDateExpect && item.headCountExpect) {
        isWarning =
          item.startDateET !==
          calculateStartOrDueDate(
            new Date(item.dueDateExpect),
            item.remainingTimeET / (item.headCountExpect / 20),
            'start',
          )
      }
      if (!item.headCountExpect) {
        const countWorkingday = countWorkingDays(
          new Date(value),
          new Date(item.dueDateExpect),
        )
        item.headCountET =
          value && countWorkingday
            ? item.remainingTimeET / (countWorkingday / 20)
            : 0
      }
      if (!item.dueDateExpect) {
        item.dueDateET =
          value && item.headCountExpect
            ? calculateStartOrDueDate(
                new Date(value),
                (item.remainingTimeET / item.headCountExpect) * 20,
                'due',
              )
            : ''
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
      item.dueDateET = calculateStartOrDueDate(
        new Date(item.startDateExpect),
        item.remainingTimeET / (item.headCountExpect / 20),
        'due',
      )
    } else {
      item.dueDateET = value ? dayjs(value).format('YYYY-MM-DD') : ''
      if (item.startDateExpect && item.headCountExpect) {
        isWarning =
          item.dueDateET !==
          calculateStartOrDueDate(
            new Date(item.startDateExpect),
            item.remainingTimeET / (item.headCountExpect / 20),
            'due',
          )
      }
      if (!item.headCountExpect) {
        const countWorkingday = countWorkingDays(
          new Date(item.startDateExpect),
          new Date(value),
        )
        item.headCountET =
          value && countWorkingday
            ? item.remainingTimeET / (countWorkingday / 20)
            : 0
      }
      if (!item.startDateET) {
        item.startDateET =
          value && item.headCountExpect
            ? calculateStartOrDueDate(
                new Date(value),
                (item.remainingTimeET / item.headCountExpect) * 20,
                'start',
              )
            : ''
      }
    }
    setWarning(isWarning)
    return item
  }

  function handleHeadCountExpect(item: any, value: any) {
    item.headCountExpect = value

    let isWarning = false
    if (!value && item.startDateET && item.remainingTimeET && item.dueDateET) {
      item.headCountET =
        item.remainingTimeET /
        (countWorkingDays(
          new Date(item.startDateExpect),
          new Date(item.dueDateExpect),
        ) /
          20)
    } else {
      item.headCountET = value
      if (item.startDateExpect && item.dueDateExpect) {
        isWarning =
          value !==
          item.remainingTimeET /
            (countWorkingDays(
              new Date(item.startDateExpect),
              new Date(item.dueDateExpect),
            ) /
              20)
      }
      if (!item.dueDateExpect) {
        item.dueDateET = value
          ? calculateStartOrDueDate(
              new Date(item.startDateExpect),
              (item.remainingTimeET / value) * 20,
              'due',
            )
          : ''
      }
      if (!item.startDateExpect) {
        item.startDateET = value
          ? calculateStartOrDueDate(
              new Date(item.dueDateExpect),
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
        if (!item.headCountExpect) {
          handleHeadCountExpect(item, null)
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
                    render={(text: any, record: any) => {
                      return (
                        <DatePicker
                          value={text}
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
                    render={(text: any, record: any) => {
                      return (
                        <DatePicker
                          value={text}
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
