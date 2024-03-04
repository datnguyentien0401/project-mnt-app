import { Button, Card, Col, DatePicker, Form, Row, Select } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { Term } from '@/types/common'

const TeamForm = ({
  initialValues,
  teamOptions,
  onSubmit,
}: {
  initialValues?: Record<string, any>
  teamOptions?: any[]
  onSubmit: (fromDate: Date, toDate: Date, teamId: number) => void
}) => {
  const [form] = Form.useForm()
  function onSearch(values: Record<string, any>) {
    const fromDate = new Date(values.year)
    const toDate = new Date(values.year)

    //month based index = 0
    if (values.term === Term.HALF_1) {
      fromDate.setMonth(0, 1)
      toDate.setMonth(5, 30)
    } else if (values.term === Term.HALF_2) {
      fromDate.setMonth(6, 1)
      toDate.setMonth(11, 31)
    } else if (values.term === Term.FULL) {
      fromDate.setMonth(0, 1)
      toDate.setMonth(11, 31)
    }
    onSubmit(fromDate, toDate, values.team)
  }
  return (
    <Card className="max-w-full mb-6">
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        initialValues={initialValues}
        onFinish={onSearch}
      >
        <Row gutter={[24, 8]}>
          {teamOptions && (
            <Col style={{ width: '25%' }} flex="none">
              <Form.Item name="team" label="Team">
                <Select
                  options={teamOptions}
                  defaultValue=""
                  popupClassName="capitalize"
                />
              </Form.Item>
            </Col>
          )}

          <Col style={{ width: '25%' }} flex="none">
            <Form.Item name="term" label="Term">
              <Select
                options={[
                  {
                    label: '1st half',
                    value: Term.HALF_1,
                  },
                  {
                    label: '2nd half',
                    value: Term.HALF_2,
                  },
                  {
                    label: '1 year',
                    value: Term.FULL,
                  },
                ]}
                defaultValue=""
                popupClassName="capitalize"
              />
            </Form.Item>
          </Col>
          <Col style={{ width: '25%' }} flex="none">
            <Form.Item name="year" label="Year">
              <DatePicker picker="year" className="w-full" allowClear={false} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
              Search
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  )
}

export default TeamForm
