import {
  LineChartOutlined,
  ProjectOutlined,
  SnippetsOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import { AppMenu } from '@/types/common'

export const allMenus: AppMenu[] = [
  {
    label: 'Project',
    icon: ProjectOutlined,
    href: '/projects',
  },
  {
    label: 'Planning',
    icon: LineChartOutlined,
    href: '/planning',
  },
  {
    label: 'Project planning',
    icon: SnippetsOutlined,
    href: '/project-planning',
  },
  {
    label: 'Team management',
    icon: TeamOutlined,
    href: '/teams',
  },
]

export const getMenus = () => {
  const urlSet = new Set<string>()
  const filterItem = (item: AppMenu) => {
    if (!item.href) return true
    if (urlSet.has(item.href)) return false
    urlSet.add(item.href)
    return true
  }
  // level 1
  return allMenus
    .filter((item) => filterItem(item))
    .map((item) => {
      // level 2
      if (item.children) {
        return {
          ...item,
          children: item.children
            .filter((child) => filterItem(child))
            .map((nestedItem) => {
              // level 3
              if (nestedItem.children) {
                return {
                  ...nestedItem,
                  children: nestedItem.children.filter((nestedChild) =>
                    filterItem(nestedChild),
                  ),
                }
              }
              return nestedItem
            }),
        }
      }

      return item
    })
}
