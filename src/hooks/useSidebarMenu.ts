import { useMemo } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { allMenus, getMenus } from '@/utils/menu'
import { type AppMenu } from '@/types/common'

const useSidebarMenu = () => {
  const router = useRouter()
  const { data: session } = useSession()

  const userMenus: AppMenu[] = useMemo(() => getMenus(), [])

  const activeMenu = useMemo(() => {
    let flatMenus = allMenus.flatMap((item) => item.children || item)

    flatMenus = flatMenus.flatMap((item) => item.children || item)

    const activeMenu = flatMenus.find((item) => {
      const url = new URL(item.href ?? '', window.location.origin)
      return router.route?.startsWith(url.pathname)
    })

    return activeMenu || undefined
  }, [router.route])

  return {
    menus: userMenus,
    activeMenu,
  }
}

export default useSidebarMenu
