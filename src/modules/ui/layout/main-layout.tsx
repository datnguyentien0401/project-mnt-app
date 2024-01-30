import { Layout, Space, Typography } from 'antd'
import clsx from 'clsx'
import { useSession } from 'next-auth/react'
import useSidebarCollapse from '@/hooks/useSidebarCollapse'
import Sidebar from '@/modules/ui/layout/components/Sidebar'
import Loading from './components/loading'
import type { FC, ReactNode } from 'react'

const { Content, Footer } = Layout
const { Title } = Typography

interface Props {
  children: ReactNode
  headerName?: string
}

const MainLayout: FC<Props> = ({ children, headerName }) => {
  const { isCollapsed } = useSidebarCollapse()
  const { status } = useSession()

  if (status === 'loading') {
    return <Loading className="h-screen" />
  }

  return (
    <Layout>
      <Layout hasSider className="min-h-screen">
        <Sidebar />
        <Layout
          className={clsx(
            'relative transition-all',
            isCollapsed ? 'ml-[80px]' : 'ml-[320px]',
          )}
          style={{ minHeight: 'calc(100vh - 200px)' }}
        >
          <Content className="p-10 bg-white">
            {headerName && (
              <Space className="flex items-start justify-between w-full mb-6">
                <Title level={2} className="m-0">
                  {headerName}
                </Title>
              </Space>
            )}
            {children}
          </Content>
          <Footer className="bg-white pb-3 flex flex-col justify-center items-center">
            Project Management
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default MainLayout
