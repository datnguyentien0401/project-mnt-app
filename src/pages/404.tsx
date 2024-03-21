import { Button, Result } from 'antd'
import Link from 'next/link'

const Custom404Page = () => (
  <Result
    status="404"
    title="404"
    className="m-auto mt-24"
    subTitle="Sorry, the page you visited does not exist."
    extra={
      <Link href="/">
        <Button type="primary">Back Home</Button>
      </Link>
    }
  />
)

export default Custom404Page
