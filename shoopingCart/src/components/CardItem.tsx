import type { CartItem } from '../types/cart'

interface Props{
    item:CartItem
    onIncrease:() => void
    onDecrease:() => void
    onRemove:() => void
}



function CardItemComponent({item, onIncrease, onDecrease, onRemove}:Props) {
  return (
    <div>
        <span>{item.product.name}</span>
        <span>{item.product.price} ₺</span>
        <button onClick={onDecrease}>-</button>
        <span>{item.quantity}</span>
        <button onClick={onIncrease}>+</button>
        <span>{item.product.price * item.quantity} ₺</span>
        <button onClick={onRemove}>Kaldır</button>
    </div>
  )
}

export default CardItemComponent