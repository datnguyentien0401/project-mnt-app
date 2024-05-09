import { useMemo } from 'react'
import { useRouter } from 'next/router'
import { allMenus, getMenus } from '@/utils/menu'
import { type AppMenu } from '@/types/common'

const useSidebarMenu = () => {
  const router = useRouter()

  const userMenus: AppMenu[] = useMemo(() => getMenus(), [])

  const activeMenu = useMemo(() => {
    let flatMenus = allMenus.flatMap((item) => item.children || item)

    flatMenus = flatMenus.flatMap((item) => item.children || item)

    const activeMenu = flatMenus.find((item) => {
      return router.route?.startsWith(item.href ?? '')
    })

    return activeMenu || undefined
  }, [router.route])

  return {
    menus: userMenus,
    activeMenu,
  }
}

export default useSidebarMenu
