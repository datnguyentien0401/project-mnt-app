import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import {
  Button,
  Card,
  Col,
  Input,
  Row,
  Space,
  Spin,
  notification,
  Select,
} from 'antd'
import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
} from '@ant-design/icons'
import { v4 as uuidv4 } from 'uuid'
import MainLayout from '@/modules/ui/layout/main-layout'
import AnnualLeaveTable from '@/modules/plannings/component/annual-leave-table'
import TotalWorkforceTable from '@/modules/plannings/component/total-workforce-table'
import AvailableWorkingTable from '@/modules/plannings/component/available-working-table'
import PlanningSearchForm from '@/modules/plannings/component/planning-search-form'
import RequiredWorkforceTable from '@/modules/plannings/component/required-workforce-table'
import {
  createPlanning,
  deletePlanning,
  getAllPlanning,
  updatePlanning,
} from '@/lib/api/planning'
import { ProjectRemaining } from '@/types/common'
import { getAllEpic, getProjectRemaining } from '@/lib/api/project'

const columnForTotalRequiredWorkforce = [
  'remainingTime',
  'requiredWorkforce',
  'actualWorkforce',
  'lackWorkforce',
]

const Planning = () => {
  const [tableList, setTableList] = useState<any[]>([])
  const [showInput, setShowInput] = useState(false)
  const [tableName, setTableName] = useState<string>('')
  const [isFetching, setIsFetching] = useState(false)
  const [editNameKey, setEditNameKey] = useState('')
  const [projectOptions, setProjectOptions] = useState<any[]>([])

  useEffect(() => {
    fetchProjectOptions()
    fetchData()
  }, [])

  const fetchProjectOptions = () => {
    setIsFetching(true)
    getAllEpic([], false).then((epics) =>
      setProjectOptions(
        epics.map((epic: any) => ({
          value: epic.projectId,
          label: epic.projectName,
        })),
      ),
    )
    setIsFetching(false)
  }

  const fetchData = () => {
    setIsFetching(true)
    getAllPlanning().then((tables) =>
      setTableList(
        tables.map((table: any) => ({
          ...table,
          key: table.tableKey,
          projectOptions: projectOptions,
        })),
      ),
    )
    setIsFetching(false)
  }

  async function onSave(tableKey: string) {
    const saveTable = tableList
      .filter((table) => table.key === tableKey)
      .reduce((table) => {
        return {
          id: table.id,
          key: table.key,
          name: table.name,
          fromDate: dayjs(table.fromDate).format('MMMM-YY-DD'),
          toDate: dayjs(table.toDate).format('MMMM-YY-DD'),
          availableWorkingData: table.availableWorkingData,
          requiredWorkforceData: table.requiredWorkforceData,
          totalWorkforceData: table.totalWorkforceData,
          annualLeaveData: table.annualLeaveData,
        }
      })
    if (saveTable.id) {
      await updatePlanning(saveTable.id, saveTable)
    } else {
      await createPlanning(saveTable)
    }
    setEditNameKey('')

    notification.open({
      message: 'Planning',
      description: 'Save table successfully',
    })
  }

  const onRemoveTable = async (tableKey: number) => {
    const removedTable = tableList.find((table) => table.key === tableKey)
    if (removedTable.id) {
      await deletePlanning(removedTable.id)
    }
    setTableList(tableList.filter((table) => table.key !== tableKey))
    notification.open({
      message: 'Planning',
      description: 'Remove table successfully',
    })
  }

  const onAddTable = () => {
    if (showInput) {
      setTableList((prevData) => [
        {
          key: uuidv4(),
          name: tableName,
          projectOptions: projectOptions,
          availableWorkingData: [
            {
              id: uuidv4(),
              team: 'Workforce(MD)',
              disable: true,
            },
            {
              id: uuidv4(),
              team: 'Workforce(MM)',
              disable: true,
            },
          ],
          annualLeaveData: [
            {
              id: uuidv4(),
              team: 'Total AL (MD)',
              disable: true,
            },
            {
              id: uuidv4(),
              team: 'Total AL (MM)',
              disable: true,
            },
          ],
          totalWorkforceData: [
            {
              id: uuidv4(),
            },
          ],
        },
        ...prevData,
      ])
    }
    setShowInput(!showInput)
  }

  const onCloneTable = (table: any, tableName: string) => {
    setTableList((prevData) => [
      {
        ...table,
        key: uuidv4(),
        name: tableName,
        id: undefined,
      },
      ...prevData,
    ])
  }

  async function fetchRequiredWorkforceData(projects: string[]) {
    if (projects.length <= 0) {
      return [
        {
          id: uuidv4(),
          disable: true,
        },
      ]
    }
    setIsFetching(true)
    const projectRemainingList: ProjectRemaining[] =
      await getProjectRemaining(projects)
    setIsFetching(false)

    if (projectRemainingList.length > 0) {
      let totalET = 0
      const requiredWorkforceData = projectRemainingList.map((item) => {
        totalET += item.timeEstimateMM
        const curDate = dayjs()
        return {
          id: uuidv4(),
          schedule: curDate,
          startDate: curDate,
          tqa: curDate,
          dueDate: item.dueDate,
          status: item.status,
          project: item.epicName,
          remainingTime: item.timeEstimateMM,
          buffer: 0,
          requiredWorkforce: item.timeEstimateMM,
        }
      })
      return [
        ...requiredWorkforceData,
        {
          id: uuidv4(),
          disable: true,
          remainingTime: totalET,
          requiredWorkforce: totalET,
        },
      ]
    } else {
      return [
        {
          id: uuidv4(),
          disable: true,
        },
      ]
    }
  }

  function updateTables(updatedTable: any) {
    setTableList(
      tableList.map((table) => {
        if (table.key === updatedTable.key) {
          return updatedTable
        }
        return table
      }),
    )
  }

  function onSetAvailableWorkingData(table: any, data: any[], columns: any[]) {
    const totals = columns
      .filter((column) => !['team', 'action'].includes(column.key))
      .map((column) => {
        let total = 0
        data.forEach((item) => {
          total += item.disable ? 0 : item[column.key] || 0
        })
        return {
          key: column.key,
          value: total,
        }
      })

    const totalWorkforceMDs = totals.map((item) => {
      return { [item.key]: item.value }
    })

    const totalWorkforceMMs = totals.map((item) => {
      return { [item.key]: item.value / 20 }
    })

    const updatedAvailableWorkingData = data.map((item) => {
      if (item.disable) {
        if (item.team === 'Total AL (MM)') {
          return {
            ...item,
            ...totalWorkforceMMs.reduce(
              (acc, curr) => ({ ...acc, ...curr }),
              {},
            ),
          }
        }
        return {
          ...item,
          ...totalWorkforceMDs.reduce((acc, curr) => ({ ...acc, ...curr }), {}),
        }
      }
      return item
    })

    const totalMM = totals.reduce((total, item) => {
      if (item.key.startsWith('total')) {
        return total + item.value / 20
      }
      return total
    }, 0)
    const totalAL =
      table.annualLeaveData?.find((item: any) => item.team === 'Total AL (MM)')
        .al || 0
    const updatedTotalWorkforceData = [
      {
        md: (totalMM * 20).toFixed(1),
        mm: totalMM.toFixed(1),
        excludeAL: (totalMM - totalAL).toFixed(1),
      },
    ]

    updateTables({
      ...table,
      availableWorkingData: updatedAvailableWorkingData,
      totalWorkforceData: updatedTotalWorkforceData,
    })
  }

  function onSetAnnualLeaveData(table: any, data: any[]) {
    let total = 0
    data.forEach((item) => {
      total += item.disable ? 0 : item.al
    })

    const updatedAnnualLeaveData = data.map((item) => {
      if (item.disable) {
        if (item.team === 'Total AL (MM)') {
          return {
            ...item,
            al: (total / 20).toFixed(1),
          }
        }
        return {
          ...item,
          al: total.toFixed(2),
        }
      }
      return item
    })

    const updatedTotalWorkforceData = [
      {
        ...table.totalWorkforceData[0],
        excludeAL: ((table.totalWorkforceData[0].mm || 0) - total / 20).toFixed(
          1,
        ),
      },
    ]

    updateTables({
      ...table,
      annualLeaveData: updatedAnnualLeaveData,
      totalWorkforceData: updatedTotalWorkforceData,
    })
  }

  function onSetRequiredWorkforceData(table: any, data: any[]) {
    const totalMap = columnForTotalRequiredWorkforce.reduce((map, column) => {
      let total = 0
      data.forEach((item) => {
        total += item.disable ? 0 : item[column] || 0
      })
      return { ...map, [column]: total }
    }, {})

    const updatedData = data.map((item) => {
      if (item.disable) {
        return {
          ...item,
          ...totalMap,
        }
      }
      return item
    })

    updateTables({
      ...table,
      requiredWorkforceData: updatedData,
    })
  }

  async function handleChangeProject(updatedTable: any, projects: string[]) {
    updateTables({
      ...updatedTable,
      requiredWorkforceData: await fetchRequiredWorkforceData(projects),
    })
  }

  return (
    <>
      <MainLayout headerName="Planning">
        <Spin spinning={isFetching}>
          <Space className="w-full" style={{ marginBottom: '20px' }}>
            {showInput && (
              <Input
                type="text"
                placeholder="Enter table name"
                onChange={(event) => setTableName(event.target.value)}
              />
            )}
            <Button
              onClick={onAddTable}
              type="primary"
              icon={<PlusOutlined />}
              className="align-left"
            >
              Add table
            </Button>
          </Space>
          {tableList.map((table) => (
            // eslint-disable-next-line react/jsx-key
            <Card
              style={{ marginBottom: '20px' }}
              title={
                <Space
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Space className="justify-start">
                    {editNameKey != table.key && table.name}
                    {editNameKey === table.key && (
                      <Input
                        defaultValue={table.name}
                        onChange={(event) =>
                          updateTables({ ...table, name: event.target.value })
                        }
                        placeholder="Enter table name"
                      />
                    )}
                    <Button
                      onClick={() => setEditNameKey(table.key)}
                      type="default"
                      icon={<EditOutlined />}
                    />
                  </Space>
                  <Space className="justify-end">
                    <Button
                      onClick={() =>
                        onCloneTable(table, `[Clone] ${table.name}`)
                      }
                      type="default"
                      icon={<CopyOutlined />}
                      className="align-left"
                    />
                    <Button
                      onClick={() => {
                        onSave(table.key)
                      }}
                      type="primary"
                      icon={<SaveOutlined />}
                      className="align-left"
                    />
                    <Button
                      onClick={() => onRemoveTable(table.key)}
                      icon={<DeleteOutlined />}
                      className="align-left"
                    />
                  </Space>
                </Space>
              }
            >
              <PlanningSearchForm
                fromDate={table.fromDate}
                toDate={table.toDate}
                setFromDate={(fromDate) => {
                  updateTables({ ...table, fromDate: fromDate })
                }}
                setToDate={(toDate) => {
                  updateTables({ ...table, toDate: toDate })
                }}
              />

              <AvailableWorkingTable
                data={table.availableWorkingData}
                fromDate={table.fromDate ? dayjs(table.fromDate) : dayjs()}
                toDate={
                  table.toDate
                    ? dayjs(table.toDate)
                    : dayjs().add(1, 'month').endOf('month')
                }
                setAvailableWorkingData={(data, columns) => {
                  onSetAvailableWorkingData(table, data, columns)
                }}
              />

              <Row gutter={[16, 16]} className="my-6">
                <Col span={12}>
                  <AnnualLeaveTable
                    data={table.annualLeaveData}
                    setAnnualLeaveData={(data) => {
                      onSetAnnualLeaveData(table, data)
                    }}
                  />
                </Col>
                <Col span={12}>
                  <TotalWorkforceTable dataSource={table.totalWorkforceData} />
                </Col>
                <Col span={24}>
                  <Select
                    options={table.projectOptions}
                    mode="multiple"
                    popupClassName="capitalize"
                    placeholder="Project"
                    filterOption={(input, option: any) =>
                      option.label.toLowerCase().includes(input.toLowerCase())
                    }
                    style={{ width: 300, marginBottom: 10 }}
                    onChange={(value) => handleChangeProject(table, value)}
                  />
                  <RequiredWorkforceTable
                    data={table.requiredWorkforceData}
                    setRequiredWorkforceData={(data) => {
                      onSetRequiredWorkforceData(table, data)
                    }}
                  />
                </Col>
              </Row>
            </Card>
          ))}
        </Spin>
      </MainLayout>
    </>
  )
}

export default Planning
