import { useReducer, useState } from 'react'
import type { CartAction, CartItem } from './types/cart';
import { products } from './data/product';
import ProductCard from './components/ProductCard';
import CardItemComponent from './components/CardItem';

function reducer(state: CartItem[], action : CartAction): CartItem[]{
  switch(action.type){
    case 'EKLE':{
      const mevcut =state.find(item=> item.product.id === action.product.id)
      if (mevcut){
        return state.map(item=>
          item.product.id === action.product.id
          ? {...item, quantity: item.quantity +1}
          : item
        )
      }
      return [...state, {product:action.product, quantity:1}]
    }
    case 'CIKAR':
      return state.filter(item=> item.product.id !== action.id)

    case 'ARTIR':
      return state.map(item =>
        item.product.id === action.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
    )

    case 'AZALT': 
    return state.map (item=>
      item.product.id === action.id
      ? {...item, quantity: item.quantity-1}
      : item
    ).filter(item => item.quantity > 0)

    case 'TEMIZLE':
      return  []
    
    default:
      return state
  }
}


function App() {
  const [cart, dispatch] = useReducer(reducer,[])

  const total = cart.reduce((toplam,item)=>
  toplam+item.product.price * item.quantity,0
  )



  return (
    <div>
      <h1>Magaza</h1>
      <div>
        <h2>Urunler</h2>
        {products.map(product=>(
          <ProductCard
          key={product.id}
          product={product}
          onAdd={() => dispatch({type: 'EKLE', product})}
          />
        ))}
      </div>
      <div>
        <h2>Sepet</h2>
        {cart.length === 0 && <p>Sepet Bos.</p>}
        {cart.map(item=>(
          <CardItemComponent
          key={item.product.id}
          item={item}
          onIncrease={() => dispatch({ type: 'ARTIR', id: item.product.id})}
          onDecrease={() => dispatch({ type: 'AZALT', id: item.product.id})}
          onRemove={() => dispatch({ type: 'CIKAR', id: item.product.id})}
          />
        ))}
      </div>




    </div>
  )
}

export default App
