import React, { useEffect, useState } from 'react'
import { Select } from 'antd'
import { getAllEpic } from '@/lib/api/project'
import type { SelectProps } from 'antd'

let timeout: ReturnType<typeof setTimeout> | null
let currentValue: string

const searchProjects = (value: string, callback: Function) => {
  getAllEpic(value, true).then((res: any) => {
    if (currentValue === value) {
      const result = res?.data || []
      const data = result.map((item: any) => ({
        value: item.projectId,
        text: item.projectName,
      }))
      callback(data)
    }
  })
}

const fetch = (value: string, callback: Function) => {
  if (timeout) {
    clearTimeout(timeout)
    timeout = null
  }
  currentValue = value

  const search = () => {
    searchProjects(value, (data: any) => {
      callback(data)
    })
  }
  timeout = setTimeout(search, 200)
}

const SearchProjectInput: React.FC<{
  disabled?: boolean
  value?: string
  onChange?: (value: string) => void
  onSelect?: (lead: { projectId: number; projectName: string }) => void
  placeholder?: string
  style?: React.CSSProperties
  defaultOptions?: SelectProps['options']
  mode?: 'multiple' | 'tags'
}> = ({
  disabled,
  value,
  onChange,
  placeholder,
  style,
  onSelect,
  defaultOptions,
  mode,
}) => {
  const [data, setData] = useState<SelectProps['options']>(defaultOptions)

  const handleSearch = (newValue: string) => {
    fetch(newValue, setData)
  }

  const handleChange = (newValue: string) => {
    if (onChange) {
      onChange(newValue)
    }

    if (onSelect) {
      const lead = data?.find((d) => d.value === newValue)
      if (lead) {
        onSelect({
          projectId: lead.value as number,
          projectName: lead.text,
        })
      }
    }
  }

  useEffect(() => {
    currentValue = ''
    searchProjects('', setData)
  }, [])

  return (
    <Select
      showSearch
      value={value}
      placeholder={placeholder}
      style={style}
      disabled={disabled}
      defaultActiveFirstOption={false}
      showArrow={false}
      filterOption={false}
      onSearch={handleSearch}
      onChange={handleChange}
      mode={mode}
      notFoundContent={null}
      options={(data || []).map((d) => ({
        value: d.value,
        label: d.text,
      }))}
    />
  )
}

export default SearchProjectInput
