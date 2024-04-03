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
  onSubmit: (year: string, term: Term, teamId: number) => void
}) => {
  const [form] = Form.useForm()
  function onSearch(values: Record<string, any>) {
    if (!values.year || !values.term) {
      return
    }
    onSubmit(values.year, values.term, values.team)
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
