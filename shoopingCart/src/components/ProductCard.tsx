import type { Product } from '../types/cart'

interface Props{
    product:Product
    onAdd:() => void
}

function ProductCard({product,onAdd}:Props) {
  return (
    <div>
        <h3>{product.name}</h3>
        <h3>{product.price} ₺</h3>
        <button onClick={onAdd}>Sepete Ekle</button>

    </div>
  )
}

export default ProductCard