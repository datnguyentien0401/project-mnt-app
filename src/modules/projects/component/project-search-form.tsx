import { Button, DatePicker, Select, Form, Row, Col, Card } from 'antd'
import { type FC } from 'react'
import { SearchOutlined } from '@ant-design/icons'
import SearchProjectInput from '@/modules/projects/component/search-project-input'

interface Props {
  initialValues: Record<string, any>
  // projectOptions: any[]
  onSubmit: (values: Record<string, any>) => void
  callback: Function
}

const ProjectForm: FC<Props> = ({
  initialValues,
  // projectOptions,
  onSubmit,
  callback,
}) => {
  const [form] = Form.useForm()

  return (
    <Card className="max-w-full mb-6">
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        initialValues={initialValues}
        onFinish={onSubmit}
      >
        <Row gutter={[24, 8]}>
          <Col style={{ width: '25%' }} flex="none">
            <Form.Item name="projectId" label="Project">
              {/* <Select */}
              {/*   options={projectOptions} */}
              {/*   mode="multiple" */}
              {/*   popupClassName="capitalize" */}
              {/*   placeholder="Project" */}
              {/* /> */}
              <SearchProjectInput placeholder="Project" mode={'multiple'} />
            </Form.Item>
          </Col>
          <Col style={{ width: '25%' }} flex="none">
            <Form.Item name="type" label="Project chart type">
              <Select
                options={[
                  {
                    value: 'totalTimeSpentMD',
                    label: 'Time Spent MD',
                  },
                  {
                    value: 'totalTimeSpentMM',
                    label: 'Time Spent MM',
                  },
                  {
                    value: 'totalResolvedIssue',
                    label: 'Resolved Issue',
                  },
                  {
                    value: 'totalStoryPoint',
                    label: 'Story Point',
                  },
                ]}
                onChange={(val) => callback(val)}
                defaultValue=""
                popupClassName="capitalize"
              />
            </Form.Item>
          </Col>
          <Col span={8} xl={6}>
            <Form.Item name="fromDate" label="From">
              <DatePicker
                picker="month"
                className="w-full"
                allowClear={false}
              />
            </Form.Item>
          </Col>
          <Col style={{ width: '25%' }} flex="none">
            <Form.Item name="toDate" label="To">
              <DatePicker
                picker="month"
                className="w-full"
                allowClear={false}
              />
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

export default ProjectForm
