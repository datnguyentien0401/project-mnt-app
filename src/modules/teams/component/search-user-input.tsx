import React, { useEffect, useState } from 'react'
import { Select } from 'antd'
import { getUsers } from '@/lib/api/user'
import type { SelectProps } from 'antd'

let timeout: ReturnType<typeof setTimeout> | null
let currentValue: string

const searchUsers = (value: string, callback: Function) => {
  getUsers(value).then((res: any) => {
    if (currentValue === value) {
      const result = res?.data || []
      const data = result.map((item: any) => ({
        value: item.jiraMemberId,
        text: item.displayName,
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
    searchUsers(value, (data: any) => {
      callback(data)
    })
  }
  timeout = setTimeout(search, 200)
}

const SearchUserInput: React.FC<{
  disabled?: boolean
  value?: string
  onChange?: (value: string) => void
  onSelect?: (lead: { id: number; fullName: string }) => void
  placeholder?: string
  style?: React.CSSProperties
  defaultOptions?: SelectProps['options']
}> = ({
  disabled,
  value,
  onChange,
  placeholder,
  style,
  onSelect,
  defaultOptions,
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
          id: lead.value as number,
          fullName: lead.text,
        })
      }
    }
  }

  useEffect(() => {
    currentValue = ''
    searchUsers('', setData)
  }, [])

  return (
    <Select
      className={'w-full'}
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
      notFoundContent={null}
      options={(data || []).map((d) => ({
        value: d.value,
        label: d.text,
      }))}
    />
  )
}

export default SearchUserInput
