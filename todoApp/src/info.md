## Proje 2 — Kullanıcı Listesi + Arama

### Öğrenilen Kavramlar

- `filter` ile arama
- Veriyi ayrı dosyaya taşıma (`data/`)
- `interface`'i export edip başka dosyalarda kullanma
- `import type`

### Dosya Yapısı

```
src/
├── App.tsx
├── main.tsx
├── data/
│   └── users.ts
└── components/
    ├── SearchInput.tsx
    └── UserCard.tsx
```

---

### `data/users.ts`

```ts
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export const users: User[] = [
  { id: 1, name: "Ahmet Yılmaz", email: "ahmet@mail.com", role: "Admin" },
  { id: 2, name: "Ayşe Kara", email: "ayse@mail.com", role: "Kullanıcı" },
  { id: 3, name: "Mehmet Demir", email: "mehmet@mail.com", role: "Editör" },
  { id: 4, name: "Zeynep Çelik", email: "zeynep@mail.com", role: "Kullanıcı" },
  { id: 5, name: "Can Öztürk", email: "can@mail.com", role: "Admin" },
  { id: 6, name: "Elif Şahin", email: "elif@mail.com", role: "Editör" },
];
```

**Açıklamalar:**

- `interface`'i burada tanımlayıp `export` ediyoruz — başka dosyalar import edip kullanabilir, her yerde tekrar yazmak gerekmez
- `const` çünkü bu dizi hiç değişmeyecek

---

### `App.tsx`

```tsx
import { useState } from "react";
import { users, User } from "./data/users";
import SearchInput from "./components/SearchInput";
import UserCard from "./components/UserCard";

function App() {
  const [search, setSearch] = useState("");

  const filteredUsers: User[] = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <h1>Kullanıcılar</h1>
      <SearchInput value={search} onChange={setSearch} />
      <div>
        {filteredUsers.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}

export default App;
```

**Açıklamalar:**

- `filteredUsers` bir state değil, normal değişken — `search` her değiştiğinde component yeniden render olduğu için otomatik yeniden hesaplanır
- `toLowerCase()` → büyük/küçük harf farkını ortadan kaldırır. "Ahmet" ve "ahmet" aynı sonucu verir
- `.includes(search.toLowerCase())` → kullanıcının yazdığı şeyi ismin içinde arar
- `setSearch`'ü direkt props olarak geçiyoruz, ayrı fonksiyon yazmaya gerek yok

---

### `components/SearchInput.tsx`

```tsx
import type { Dispatch, SetStateAction } from "react";

interface Props {
  value: string;
  onChange: Dispatch<SetStateAction<string>>;
}

function SearchInput({ value, onChange }: Props) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="İsme göre ara..."
    />
  );
}

export default SearchInput;
```

**Açıklamalar:**

- `import type` → proje `verbatimModuleSyntax: true` ayarıyla kurulmuş. Sadece tip olarak kullanılan importlar `import type` ile yazılmalı
- `Dispatch<SetStateAction<string>>` → `useState`'ten gelen setter fonksiyonunun tipi. "String tutan bir state'in set fonksiyonu" demek

---

### `components/UserCard.tsx`

```tsx
import type { User } from "../data/users";

interface Props {
  user: User;
}

function UserCard({ user }: Props) {
  return (
    <div>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <p>{user.role}</p>
    </div>
  );
}

export default UserCard;
```

**Açıklamalar:**

- `../` → bir üst klasöre çık. `UserCard` components/ içinde, data/ klasörüne ulaşmak için src/'ye çıkmak gerekiyor
- Sadece gösterme işi yapıyor, hiçbir mantık yok — component'lar tek bir iş yapmalı

---

### Genel Akış

```
App.tsx
  ├── users.ts'ten veriyi alır
  ├── search state'ini tutar
  ├── filter ile listeyi hesaplar
  ├── SearchInput → search'ü günceller
  └── UserCard → her kullanıcıyı gösterir
```

---

---
