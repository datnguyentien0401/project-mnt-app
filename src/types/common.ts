import { type ForwardRefExoticComponent } from 'react'

export interface MemberRequest {
  name: string
  teamId: number
  jiraMemberId: string
}

export interface ProjectRemaining {
  epicName: string
  expectedDate: string
  dueDate: string
  status: string
  timeEstimateMM: number
  headCount: number
}

export interface ProjectStatistic {
  projectName: string
  projectId: string
  totalTimeSpent: number
  totalTimeSpentMM: number
  totalTimeSpentMD: number
  totalResolvedIssue: number
  totalInProgressIssue: number
  totalOpenIssue: number
  totalHeadCount: number
  totalStoryPoint: number
  month: string
  forColumnChart: boolean
}

export interface AppMenu {
  label: string
  icon?: ForwardRefExoticComponent<any>
  href?: string
  children?: AppMenu[]
}
