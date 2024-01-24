import { Spin } from 'antd'
import clsx from 'clsx'

interface Props {
  className?: string
}

const Loading = ({ className }: Props) => (
    <div
        className={clsx('flex items-center justify-center h-[240px]', className)}
    >
      <Spin />
    </div>
)

export default Loading
