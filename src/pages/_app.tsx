import 'antd/dist/reset.css'
// eslint-disable-next-line import/order
import '../styles/globals.css'

import { useState, useEffect } from 'react'
import { SessionProvider } from 'next-auth/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import NiceModal from '@ebay/nice-modal-react'
import { ConfigProvider } from 'antd'
import { StyleProvider } from '@ant-design/cssinjs'
import NProgress from 'nprogress'
import { useRouter } from 'next/router'
import enUS from 'antd/locale/en_US'
import dayjs from 'dayjs'

import weekday from 'dayjs/plugin/weekday'
import localeData from 'dayjs/plugin/localeData'

import type { AppProps } from 'next/app'

dayjs.extend(weekday)
dayjs.extend(localeData)

const antdThemeConfig = {
  token: {
    colorPrimary: '#07B53B',
  },
}

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter()
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            refetchOnWindowFocus: false,
          },
        },
      }),
  )

  useEffect(() => {
    const handleStart = () => NProgress.start()
    const handleComplete = () => NProgress.done()

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleComplete)
    }
  }, [router.asPath, router.events])

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider theme={antdThemeConfig} locale={enUS}>
          <StyleProvider hashPriority="high">
            <NiceModal.Provider>
              <Component {...pageProps} />
            </NiceModal.Provider>
          </StyleProvider>
        </ConfigProvider>
      </QueryClientProvider>
    </SessionProvider>
  )
}

export default MyApp
