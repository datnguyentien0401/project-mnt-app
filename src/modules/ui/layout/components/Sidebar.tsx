import React, { memo } from 'react'
import { useRouter } from 'next/router'
import { Layout, Menu } from 'antd'
import Icon from '@ant-design/icons'
import useSidebarMenu from '@/hooks/useSidebarMenu'
import useSidebarCollapse from '@/hooks/useSidebarCollapse'
import { type AppMenu } from '@/types/common'
import type { MenuProps } from 'antd'

type MenuItem = Required<MenuProps>['items'][number]

const mapLinkToMenuItem = (link: AppMenu): MenuItem => ({
  key: link.href || link.label,
  icon: link.icon ? (
    <Icon className="[&_span]:text-base" component={link.icon} />
  ) : undefined,
  label: link.label,
  children: link.children?.map(mapLinkToMenuItem) || undefined,
})

const { Sider } = Layout
const DEFAULT_ROUTE = '/projects'

function LayoutSidebar() {
  const { menus, activeMenu } = useSidebarMenu()
  const { isCollapsed, toggleSidebar } = useSidebarCollapse()
  const router = useRouter()
  const items = menus.map(mapLinkToMenuItem)

  const openKeys: string[] = []
  menus.forEach((menu) => {
    // Level 1
    if (menu.children) {
      let isChildActive = false
      // Level 2
      for (let i = 0; i < menu.children.length; i += 1) {
        const cur = menu.children[i]
        if (cur.children) {
          // Level 3
          isChildActive = cur.children.some((c) => {
            if (!c.href) return false
            return router.pathname.startsWith(c.href)
          })
          if (isChildActive) {
            openKeys.push(cur.label, menu.label)
            break
          }
        }

        if (cur.href && router.pathname.startsWith(cur.href)) {
          openKeys.push(menu.label)
        }
      }
    }
  })

  return (
    <Sider
      collapsible
      collapsed={isCollapsed}
      onCollapse={toggleSidebar}
      width={320}
      theme="light"
      className="overflow-auto h-screen fixed left-0 top-0 bottom-0 bg-gray-50 border-0 border-r-2 border-solid border-r-gray-200"
    >
      <Menu
        theme="light"
        mode="inline"
        selectedKeys={[activeMenu?.href || DEFAULT_ROUTE]}
        defaultSelectedKeys={[DEFAULT_ROUTE]}
        defaultOpenKeys={openKeys}
        items={items}
        className="[&_.ant-menu-submenu-arrow]:mt-px border-0 bg-gray-50"
        onClick={async ({ key }) => await router.push(key)}
      />
    </Sider>
  )
}

export default memo(LayoutSidebar)
