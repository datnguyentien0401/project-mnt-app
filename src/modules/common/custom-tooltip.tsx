const CusTooltip = ({
  item,
}: {
  item: { name: string; value: string | number }
}) => {
  return (
    <div
      style={{
        background: 'white',
        border: '1px solid gray',
        padding: 10,
      }}
    >
      {item.name}: {item.value}
    </div>
  )
}

export default CusTooltip
