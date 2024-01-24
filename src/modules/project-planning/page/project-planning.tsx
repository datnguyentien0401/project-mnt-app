import React, { useEffect, useState } from "react"
import { DatePicker, Form, InputNumber, Select, Space, Spin, Table } from "antd"
import MainLayout from "@/modules/ui/layout/main-layout"
import { v4 as uuidv4 } from "uuid"
import { getAllEpic, getProjectRemaining } from "@/lib/api/project"
import { ProjectRemaining } from "@/types/common"

const ProjectPlanning = () => {
  const [dataSource, setDataSource] = useState<any[]>([])
  const [warning, setWarning] = useState(false)
  const [projectOptions, setProjectOptions] = useState<any[]>([])
  const [isFetching, setIsFetching] = useState(false)

  useEffect(() => {
    fetchProjectOptions()
  }, [])

  const fetchProjectOptions = async () => {
    setIsFetching(true)
    const data = await getAllEpic(false)
    setProjectOptions(data.map((epic: any) => ({
      value: epic.projectId,
      label: epic.projectName
    })))
    setIsFetching(false)
  }

  const onChangeProject = async (projectId: string) => {
    setIsFetching(true)
    const projectRemaining: ProjectRemaining[] = await getProjectRemaining([projectId])
    if (projectRemaining) {
      setDataSource([{
        id: uuidv4(),
        remainingTimeExpect: projectRemaining[0].timeEstimateMM,
        dueDateExpect: projectRemaining[0].dueDate,
        headCountExpect: projectRemaining[0].headCount,
        remainingTimeET: projectRemaining[0].timeEstimateMM,
        headCountET: projectRemaining[0].headCount
      }])
    } else {
      setDataSource([{
        id: uuidv4()
      }])
    }
    setIsFetching(false)
  }

  function countWorkingDays(startDate: Date, endDate: Date): number {
    let count = 0
    let currentDate = new Date(startDate)

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay()

      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        count++
      }

      currentDate.setDate(currentDate.getDate() + 1)
    }

    return count
  }

  function calculateStartOrDueDate(date: Date, countWorkingDays: number, type: "start" | "due"): string {
    let count = 0
    let currentDate = new Date(date)
    const typeAdap = type === "start" ? -1 : 1

    while (count < countWorkingDays) {
      const dayOfWeek = currentDate.getDay()

      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        count++
      }

      currentDate.setDate(currentDate.getDate() + typeAdap)
    }

    return currentDate.toLocaleDateString()
  }

  function onChange(columnKey: string, rowId: string, value: any) {
    let isWarning = false
    const updatedDataSource = dataSource.map(item => {
      if (item.id !== rowId) {
        return item
      }
      if (columnKey === "startDateExpect") {
        item.startDateET = value ? new Date(value).toLocaleDateString() : ""
        item.startDateExpect = value
        if (item.dueDateExpect && item.headCountExpect) {
          isWarning = item.startDateET !== calculateStartOrDueDate(new Date(item.dueDateExpect),
            item.remainingTimeET / (item.headCountExpect / 20), "start")
        }
        if (!item.headCountExpect) {
          const countWorkingday = countWorkingDays(new Date(value), new Date(item.dueDateExpect))
          item.headCountET = value && countWorkingday ? item.remainingTimeET / (countWorkingday / 20) : 0
        }
        if (!item.dueDateExpect) {
          item.dueDateET = value && item.headCountExpect
            ? calculateStartOrDueDate(
              new Date(value),
              (item.remainingTimeET / item.headCountExpect) * 20,
              "due")
            : ""
        }
      }
      if (columnKey === "dueDateExpect") {
        item.dueDateET = value ? new Date(value).toLocaleDateString() : ""
        item.dueDateExpect = value
        if (item.startDateExpect && item.headCountExpect) {
          isWarning = item.dueDateET !== calculateStartOrDueDate(new Date(item.startDateExpect),
            item.remainingTimeET / (item.headCountExpect / 20), "due")
        }
        if (!item.headCountExpect) {
          const countWorkingday = countWorkingDays(new Date(item.startDateExpect), new Date(value))
          item.headCountET = value && countWorkingday ? item.remainingTimeET / (countWorkingday / 20) : 0
        }
        if (!item.startDateET) {
          item.startDateET = value && item.headCountExpect
            ? calculateStartOrDueDate(
              new Date(value),
              (item.remainingTimeET / item.headCountExpect) * 20,
              "start")
            : ""
        }
      }
      if (columnKey === "headCountExpect") {
        item.headCountET = value
        item.headCountExpect = value
        if (item.startDateET && item.dueDateExpect) {
          isWarning = value !== item.remainingTimeET / (countWorkingDays(new Date(item.startDateExpect), new Date(item.startDateExpect)) / 20)
        }
        if (!item.dueDateExpect) {
          item.dueDateET = value
            ? calculateStartOrDueDate(
              new Date(item.startDateExpect),
              (item.remainingTimeET / value) * 20,
              "due")
            : ""
        }
        if (!item.startDateExpect) {
          item.startDateET = value
            ? calculateStartOrDueDate(new Date(item.dueDateExpect),
              (item.remainingTimeET / value) * 20,
              "start")
            : ""
        }
      }
      if (columnKey === "remainingTimeExpect") {
        item.remainingTimeET = value
        item.remainingTimeExpect = value
      }
      return item
    })
    setWarning(isWarning)
    setDataSource(updatedDataSource)
  }

  return (
    <>
      <MainLayout headerName="Project Planning">
        <Spin spinning={isFetching}>
          <Space style={{ marginBottom: "10px" }}>
            <Select
              options={projectOptions}
              popupClassName="capitalize"
              placeholder="Project"
              style={{ width: "200px" }}
              onChange={value => onChangeProject(value)}
            />
          </Space>
          <Table dataSource={dataSource} bordered pagination={false}
                 footer={() => warning ? (
                   <span style={{ color: "red" }}>Warning to change remaining time since others are fixed</span>
                 ) : ""}>
            <Table.ColumnGroup title="Expectation">
              <Table.Column
                title="Remaining Time" dataIndex="remainingTimeExpect" key="remainingTimeExpect"
                render={(text: any, record: any) => {
                  return <InputNumber value={text} min={0}
                                      onChange={event => onChange("remainingTimeExpect", record.id, event ?? 0)} />
                }}
              />
              <Table.Column
                title="Start Date" dataIndex="startDateExpect" key="startDateExpect"
                render={(text: any, record: any) => {
                  return <DatePicker value={text}
                                     onChange={value => onChange("startDateExpect", record.id, value)} />
                }}
              />
              <Table.Column
                title="Due Date" dataIndex="dueDateExpect" key="dueDateExpect"
                render={(text: any, record: any) => {
                  return <DatePicker value={text}
                                     onChange={value => onChange("dueDateExpect", record.id, value)} />
                }}
              />
              <Table.Column
                title="Head Count" dataIndex="headCountExpect" key="headCountExpect"
                render={(text: any, record: any) => {
                  return <InputNumber
                    value={text} min={0}
                    onChange={event => onChange("headCountExpect", record.id, event ?? 0)} />
                }}
              />
            </Table.ColumnGroup>
            <Table.ColumnGroup title="Estimation">
              <Table.Column title="Remaining Time" dataIndex="remainingTimeET" key="remainingTimeET" />
              <Table.Column title="Start Date" dataIndex="startDateET" key="startDateET" />
              <Table.Column title="Due Date" dataIndex="dueDateET" key="dueDateET" />
              <Table.Column title="Head Count" dataIndex="headCountET" key="headCountET" />
            </Table.ColumnGroup>
          </Table>
        </Spin>
      </MainLayout>
    </>
  )
}

export default ProjectPlanning
