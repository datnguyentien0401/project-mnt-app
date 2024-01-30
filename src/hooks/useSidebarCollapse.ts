import { createGlobalState } from 'react-use'

const sidebarCollapsed = createGlobalState(false)

const useSidebarCollapse = () => {
  const [isCollapsed, setCollapsed] = sidebarCollapsed()

  const toggleSidebar = () => {
    setCollapsed(!isCollapsed)
  }

  return {
    isCollapsed,
    toggleSidebar,
  }
}

export default useSidebarCollapse
