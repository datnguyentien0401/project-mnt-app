import { type ForwardRefExoticComponent } from 'react'

export interface MemberRequest {
  name: string
  teamId: number
  jiraMemberId: string
}

export interface TeamRequest {
  name: string
}

export enum Term {
  HALF_1 = 'half1st',
  HALF_2 = 'half2nd',
  FULL = 'fullYear',
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

export interface Option {
  label: string
  value: string | number
}

export enum ProjectSearchType {
  TIME_SPENT_MD = 'TIME_SPENT_MD',
  TIME_SPENT_MM = 'TIME_SPENT_MM',
  RESOLVED_ISSUE = 'RESOLVED_ISSUE',
  STORY_POINT = 'STORY_POINT',
}
