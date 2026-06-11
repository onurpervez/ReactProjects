interface Props{
    total:number
    onClear:() => void
}

function CartSummary({total, onClear}:Props) {
  return (
    <div>
        <h3>Toplam: {total} ₺</h3>
        <button onClick={onClear}>Sepeti Temizle</button>

    </div>
  )
}

export default CartSummary