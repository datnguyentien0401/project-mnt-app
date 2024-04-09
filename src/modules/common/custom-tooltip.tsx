const CusTooltip = ({
  payload,
  value,
}: {
  payload: any
  value: string | number
}) => {
  const tooltipItems = payload.filter((item: any) => item.value === value)
  if (!tooltipItems.length) {
    return ''
  }
  return (
    <div
      style={{
        background: 'white',
        border: '1px solid gray',
        padding: 10,
      }}
    >
      {tooltipItems.map((item: any) => (
        <>
          <div>
            {item.name}: {item.value}
          </div>
        </>
      ))}
    </div>
  )
}

export default CusTooltip
