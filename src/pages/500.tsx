import { Button, Result } from 'antd'
import Link from 'next/link'

const ServerError = () => (
  <Result
    status="500"
    title="500"
    className="m-auto mt-24"
    subTitle="Sorry, something went wrong."
    extra={
      <Link href="/">
        <Button type="primary">Back Home</Button>
      </Link>
    }
  />
)

export default ServerError
