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
        value: item.accountId,
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
  placeholder?: string
  style?: React.CSSProperties
  defaultOptions?: SelectProps['options']
}> = ({ disabled, value, onChange, placeholder, style, defaultOptions }) => {
  const [data, setData] = useState<SelectProps['options']>(defaultOptions)

  const handleSearch = (newValue: string) => {
    fetch(newValue, setData)
  }

  const handleChange = (newValue: string) => {
    if (onChange) {
      onChange(newValue)
    }
  }

  useEffect(() => {
    currentValue = ''
    searchUsers('', setData)
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
      notFoundContent={null}
      options={(data || []).map((d) => ({
        value: d.value,
        label: d.text,
      }))}
    />
  )
}

export default SearchUserInput
