import { Card, Col, DatePicker, Form, Row } from 'antd'
import React, { useMemo } from 'react'
import dayjs, { Dayjs } from 'dayjs'

const PlanningSearchForm = ({
  fromDate,
  toDate,
  setFromDate,
  setToDate,
}: {
  fromDate: any
  toDate: any
  setFromDate: (fromDate: Dayjs) => void
  setToDate: (fromDate: Dayjs) => void
}) => {
  const [form] = Form.useForm()
  const initialValues = useMemo(() => {
    return {
      fromDate: fromDate ? dayjs(fromDate) : dayjs(),
      toDate: toDate ? dayjs(toDate) : dayjs().add(1, 'month').endOf('month'),
    }
  }, [fromDate, toDate])

  return (
    <Card className="max-w-full mb-6">
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        initialValues={initialValues}
      >
        <Row gutter={[24, 8]}>
          <Col span={8} xl={6}>
            <Form.Item name="fromDate" label="From">
              <DatePicker
                className="w-full"
                allowClear={false}
                value={fromDate}
                onChange={(value) => {
                  if (value) {
                    setFromDate(value)
                    form.setFieldValue(
                      'toDate',
                      value.add(1, 'month').endOf('month'),
                    )
                  }
                }}
              />
            </Form.Item>
          </Col>
          <Col span={8} xl={6}>
            <Form.Item name="toDate" label="To">
              <DatePicker
                className="w-full"
                allowClear={false}
                onChange={(value) => {
                  if (value) {
                    if (
                      value.isAfter(
                        form
                          .getFieldValue('fromDate')
                          .add(12, 'month')
                          .endOf('month'),
                      )
                    ) {
                      form.setFieldValue('toDate', '')
                      alert('Date range is invalid!')
                    } else {
                      setToDate(value)
                    }
                  }
                }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  )
}

export default PlanningSearchForm
