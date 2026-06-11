# Proje 6 — Alışveriş Sepeti

> Odak: `useReducer`, union type, `reduce`, zincirleme array metodları

---

## Öğrenilen Kavramlar

- `useReducer` — karmaşık state yönetimi
- `type` ile union type tanımlama
- `switch/case` ile aksiyon yönetimi
- `array.reduce()` — diziyi tek değere indirgemek
- Zincirleme array metodları — `.map().filter()`
- İç içe interface kullanımı

---

## Dosya Yapısı

```
src/
├── App.tsx
├── main.tsx
├── types/
│   └── cart.ts
├── data/
│   └── products.ts
└── components/
    ├── ProductCard.tsx
    ├── CartItem.tsx
    └── CartSummary.tsx
```

---

## `types/cart.ts`

```ts
export interface Product {
  id: number;
  name: string;
  price: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type CartAction =
  | { type: "EKLE"; product: Product }
  | { type: "CIKAR"; id: number }
  | { type: "ARTIR"; id: number }
  | { type: "AZALT"; id: number }
  | { type: "TEMIZLE" };
```

**Açıklamalar:**

- `CartItem` içinde `Product` var — iç içe interface. Sepetteki her eleman bir ürün ve o ürünün adedini tutuyor
- `type` ile union type tanımladık — `interface` yerine. Union type için `type` kullanılır
- Her `|` bir seçenek demek — CartAction ya EKLE'dir ya CIKAR'dır ya...
- Her aksiyonun farklı verisi var: `EKLE` → `product` gerekli, `CIKAR/ARTIR/AZALT` → sadece `id` yeterli, `TEMIZLE` → ek veri yok

---

## `data/products.ts`

```ts
import type { Product } from "../types/cart";

export const products: Product[] = [
  { id: 1, name: "Klavye", price: 750 },
  { id: 2, name: "Mouse", price: 450 },
  { id: 3, name: "Monitor", price: 4500 },
  { id: 4, name: "Kulaklık", price: 1200 },
  { id: 5, name: "Webcam", price: 800 },
];
```

---

## `App.tsx`

```tsx
import { useReducer } from "react";
import type { CartItem, CartAction, Product } from "./types/cart";
import { products } from "./data/products";
import ProductCard from "./components/ProductCard";
import CartItemComponent from "./components/CartItem";
import CartSummary from "./components/CartSummary";

function reducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case "EKLE": {
      const mevcut = state.find(
        (item) => item.product.id === action.product.id,
      );
      if (mevcut) {
        return state.map((item) =>
          item.product.id === action.product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...state, { product: action.product, quantity: 1 }];
    }

    case "CIKAR":
      return state.filter((item) => item.product.id !== action.id);

    case "ARTIR":
      return state.map((item) =>
        item.product.id === action.id
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      );

    case "AZALT":
      return state
        .map((item) =>
          item.product.id === action.id
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0);

    case "TEMIZLE":
      return [];

    default:
      return state;
  }
}

function App() {
  const [cart, dispatch] = useReducer(reducer, []);

  const total = cart.reduce(
    (toplam, item) => toplam + item.product.price * item.quantity,
    0,
  );

  return (
    <div>
      <h1>Mağaza</h1>
      <div>
        <h2>Ürünler</h2>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAdd={() => dispatch({ type: "EKLE", product })}
          />
        ))}
      </div>
      <div>
        <h2>Sepet</h2>
        {cart.length === 0 && <p>Sepet boş.</p>}
        {cart.map((item) => (
          <CartItemComponent
            key={item.product.id}
            item={item}
            onIncrease={() => dispatch({ type: "ARTIR", id: item.product.id })}
            onDecrease={() => dispatch({ type: "AZALT", id: item.product.id })}
            onRemove={() => dispatch({ type: "CIKAR", id: item.product.id })}
          />
        ))}
        {cart.length > 0 && (
          <CartSummary
            total={total}
            onClear={() => dispatch({ type: "TEMIZLE" })}
          />
        )}
      </div>
    </div>
  );
}

export default App;
```

**Açıklamalar:**

**`reducer` fonksiyonu:**

- İki parametre alır: mevcut `state` ve gelen `action`
- Her zaman yeni state döndürür, doğrudan state'i değiştirmez
- `switch` ile aksiyonun tipine bakıp ona göre davranır

**`EKLE` case'i — iki senaryo:**

- Ürün zaten sepetteyse: `find` ile bulur, `map` ile `quantity`'yi 1 artırır
- Ürün sepette yoksa: `[...state, { product, quantity: 1 }]` ile yeni eleman ekler

**`AZALT` case'i — zincirleme:**

```tsx
state.map(...).filter(item => item.quantity > 0)
```

Önce adedi azalt, sonra 0 olanı at. İki işlemi tek satırda zincirleme yaptık.

**`TEMIZLE` case'i:**
Boş dizi döndür — en basit case.

**`useReducer`:**

```tsx
const [cart, dispatch] = useReducer(reducer, []);
```

- `cart` → mevcut sepet
- `dispatch` → aksiyonu tetikleyen fonksiyon
- `reducer` → aksiyona göre state'i güncelleyen fonksiyon
- `[]` → başlangıç değeri

**`total` hesaplama:**

```tsx
const total = cart.reduce(
  (toplam, item) => toplam + item.product.price * item.quantity,
  0,
);
```

`reduce` diziyi tek değere indirger. `0`'dan başlar, her item için `toplam + fiyat * adet` ekler.

---

## `components/ProductCard.tsx`

```tsx
import type { Product } from "../types/cart";

interface Props {
  product: Product;
  onAdd: () => void;
}

function ProductCard({ product, onAdd }: Props) {
  return (
    <div>
      <h3>{product.name}</h3>
      <p>{product.price} ₺</p>
      <button onClick={onAdd}>Sepete Ekle</button>
    </div>
  );
}

export default ProductCard;
```

---

## `components/CartItem.tsx`

```tsx
import type { CartItem } from "../types/cart";

interface Props {
  item: CartItem;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

function CartItemComponent({ item, onIncrease, onDecrease, onRemove }: Props) {
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
  );
}

export default CartItemComponent;
```

**Açıklamalar:**

- `item.product.price * item.quantity` → satır toplamı, JSX içinde direkt hesaplama yapılabiliyor

---

## `components/CartSummary.tsx`

```tsx
interface Props {
  total: number;
  onClear: () => void;
}

function CartSummary({ total, onClear }: Props) {
  return (
    <div>
      <h3>Toplam: {total} ₺</h3>
      <button onClick={onClear}>Sepeti Temizle</button>
    </div>
  );
}

export default CartSummary;
```

---

## `dispatch` Kullanımı

```tsx
dispatch({ type: 'EKLE', product })       // ürün ekle
dispatch({ type: 'ARTIR', id: ... })      // adet artır
dispatch({ type: 'AZALT', id: ... })      // adet azalt
dispatch({ type: 'CIKAR', id: ... })      // ürünü kaldır
dispatch({ type: 'TEMIZLE' })             // sepeti temizle
```

---

## Genel Akış

```
Kullanıcı "Sepete Ekle" tıklar
        ↓
dispatch({ type: 'EKLE', product })
        ↓
reducer çalışır — EKLE case'i
        ↓
Ürün sepette var mı?
  Evet → quantity + 1
  Hayır → yeni item ekle
        ↓
Yeni cart state döner
        ↓
App yeniden render olur
        ↓
total yeniden hesaplanır
        ↓
Ekran güncellenir
```

---

## `useState` vs `useReducer`

|               | `useState`                   | `useReducer`                        |
| ------------- | ---------------------------- | ----------------------------------- |
| Ne zaman      | Basit, bağımsız değerler     | Birbiriyle ilişkili, karmaşık state |
| Kaç aksiyon   | 1-2                          | 3+                                  |
| Mantık nerede | Component içinde             | Reducer fonksiyonunda               |
| Örnek         | `loading`, `error`, `search` | Sepet, form, oyun state'i           |

---

## Array Metodları Özeti

| Metod    | Ne Yapar                  | Kullanıldığı Yer                 |
| -------- | ------------------------- | -------------------------------- |
| `map`    | Her elemana bak, dönüştür | Adet artır/azalt                 |
| `filter` | Koşulu sağlayanları tut   | Ürün kaldır, quantity 0 olanı at |
| `find`   | İlk eşleşeni döndür       | Ürün sepette var mı?             |
| `reduce` | Diziyi tek değere indir   | Toplam fiyat hesaplama           |
