import { Button, Result } from 'antd'
import Link from 'next/link'
import MainLayout from '@/modules/ui/layout/main-layout'

const ServerError = () => (
  <MainLayout>
    <Result
      status="500"
      title="500"
      className="m-auto mt-24"
      subTitle="Sorry, something went wrong."
      extra={
        <Link href="/">
          <Button type="primary">Back</Button>
        </Link>
      }
    />
  </MainLayout>
)

export default ServerError
