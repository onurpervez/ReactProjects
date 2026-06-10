# Proje 4 — GitHub Profil Arama

> Odak: `try/catch/finally`, hata yönetimi, union type, `??` operatörü

---

## Öğrenilen Kavramlar

- `try/catch/finally` detaylı kullanım
- `throw new Error(...)` ile özel hata fırlatma
- `err instanceof Error` ile tip kontrolü
- `string | null` union type
- `??` nullish coalescing operatörü
- HTTP status kodlarını ayrı ayrı yönetme

---

## Dosya Yapısı

```
src/
├── App.tsx
├── main.tsx
├── types/
│   └── github.ts
└── components/
    ├── SearchInput.tsx
    ├── ProfileCard.tsx
    └── ErrorMessage.tsx
```

---

## `types/github.ts`

```ts
export interface GithubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
}
```

**Açıklamalar:**

- `string | null` → "union type". "Bu alan ya string'dir ya da null'dur" demek
- GitHub'da bio yazmayan, isim girmeyen kullanıcılar var — onlar için `null` geliyor
- TypeScript bunu bilmezse `user.bio.toUpperCase()` gibi bir şey yazdığında hata vermez ama çalışma zamanında patlar
- API aslında çok daha fazla alan gönderiyor, sadece kullanacaklarımızı tanımladık

---

## `App.tsx`

```tsx
import { useState } from "react";
import type { GithubUser } from "./types/github";
import SearchInput from "./components/SearchInput";
import ProfileCard from "./components/ProfileCard";
import ErrorMessage from "./components/ErrorMessage";

function App() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState<GithubUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchUser() {
    if (username.trim() === "") return;

    setLoading(true);
    setError("");
    setUser(null);

    try {
      const response = await fetch(`https://api.github.com/users/${username}`);

      if (response.status === 404) {
        throw new Error("Kullanıcı bulunamadı");
      }

      if (response.status === 403) {
        throw new Error("API limiti aşıldı, biraz bekle");
      }

      if (!response.ok) {
        throw new Error(`Beklenmedik hata: ${response.status}`);
      }

      const data: GithubUser = await response.json();
      setUser(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Bilinmeyen bir hata oluştu");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>GitHub Profil Arama</h1>
      <SearchInput
        value={username}
        onChange={setUsername}
        onSearch={fetchUser}
      />
      {loading && <p>Yükleniyor...</p>}
      {error && <ErrorMessage message={error} />}
      {user && <ProfileCard user={user} />}
    </div>
  );
}

export default App;
```

**Açıklamalar:**

**State'ler:**

- `user` → başarılı sonucu tutar
- `loading` → istek sürerken "Yükleniyor..." göstermek için
- `error` → hata mesajını tutar
- Bu üçü birbirini dışlar — aynı anda ikisi dolu olmamalı, o yüzden her aramada hepsini sıfırlıyoruz

**`async function fetchUser`:**

- `async` → içinde beklemeli işlem var demek. `async/await` olmadan API cevabı beklenirken sayfa donar
- `username.trim() === ''` → boş input kontrolü. `return` yazınca fonksiyon burada durur, alta inmez
- `setLoading(true)`, `setError('')`, `setUser(null)` → istek atmadan önce temizlik, sırası önemli

---

## `try/catch/finally` — Detaylı Açıklama

```
try     → başarılı senaryo buraya
catch   → hata olursa buraya düşer
finally → hata olsa da olmasa da her zaman çalışır
```

### `try` bloğu

```tsx
const response = await fetch(`https://api.github.com/users/${username}`);
```

`await fetch(...)` → API'ya istek at, cevap gelene kadar bekle. Ağ bağlantısı yoksa veya URL yanlışsa direkt `catch`'e atlar.

```tsx
if (response.status === 404) {
  throw new Error("Kullanıcı bulunamadı");
}

if (response.status === 403) {
  throw new Error("API limiti aşıldı, biraz bekle");
}

if (!response.ok) {
  throw new Error(`Beklenmedik hata: ${response.status}`);
}
```

Her HTTP status koduna özel hata fırlatıyoruz:

- `404` → kullanıcı yok
- `403` → GitHub saatte 60 istek izin veriyor, aşılınca 403 geliyor
- Diğerleri → genel hata mesajı

`throw new Error(...)` → "buradan çık, catch'e git" demek. `throw` yazılınca `try` bloğu durur, direkt `catch`'e atlar, alt satırlara inmez.

### `catch` bloğu

```tsx
catch (err) {
  if (err instanceof Error) {
    setError(err.message)
  } else {
    setError('Bilinmeyen bir hata oluştu')
  }
}
```

- `err instanceof Error` → TypeScript'te `catch` bloğundaki `err` tipi `unknown`'dur. Direkt `err.message` yazamazsın, önce "bu gerçekten bir Error nesnesi mi?" diye kontrol etmen lazım
- `err.message` → `throw new Error('mesaj')` ile fırlattığımız mesajı alıyoruz. Dinamik hata mesajları böyle çalışıyor

**Hava durumu ile farkı:**

```tsx
// Hava durumu — sabit mesaj
catch (err) {
  setError('Şehir bulunamadı, tekrar dene')
}

// GitHub — dinamik mesaj
catch (err) {
  if (err instanceof Error) {
    setError(err.message) // throw'da ne yazdıysak o çıkıyor
  }
}
```

### `finally` bloğu

```tsx
finally {
  setLoading(false)
}
```

`finally` → `try` başarıyla bitsin, `catch`'e düşsün, fark etmez — **her zaman** çalışır.

Neden `try` ve `catch` içine ayrı ayrı yazmadık?

```tsx
// Bunu yapmak zorunda kalmıyoruz:
try {
  ...
  setLoading(false)  // başarılı olunca
} catch {
  setError(...)
  setLoading(false)  // hata olunca
}

// Bunun yerine:
} finally {
  setLoading(false)  // her zaman, tek satır
}
```

Ne kadar hata senaryosu olursa olsun `finally` hepsini kapsar.

---

## `components/SearchInput.tsx`

```tsx
import type { Dispatch, SetStateAction } from "react";

interface Props {
  value: string;
  onChange: Dispatch<SetStateAction<string>>;
  onSearch: () => void;
}

function SearchInput({ value, onChange, onSearch }: Props) {
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      onSearch();
    }
  }

  return (
    <div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="GitHub kullanıcı adı..."
      />
      <button onClick={onSearch}>Ara</button>
    </div>
  );
}

export default SearchInput;
```

---

## `components/ProfileCard.tsx`

```tsx
import type { GithubUser } from "../types/github";

interface Props {
  user: GithubUser;
}

function ProfileCard({ user }: Props) {
  return (
    <div>
      <img src={user.avatar_url} alt={user.login} width={100} />
      <h2>{user.name ?? user.login}</h2>
      <p>{user.bio ?? "Bio yok"}</p>
      <p>Repo: {user.public_repos}</p>
      <p>Takipçi: {user.followers}</p>
      <p>Takip: {user.following}</p>
      <a href={user.html_url} target="_blank" rel="noreferrer">
        GitHub'da Gör
      </a>
    </div>
  );
}

export default ProfileCard;
```

**Açıklamalar:**

- `user.name ?? user.login` → `??` nullish coalescing operatörü. Solundaki `null` veya `undefined` ise sağındakini kullan
- `user.bio ?? 'Bio yok'` → bio null ise "Bio yok" göster
- `||` ile farkı: `||` sıfır veya boş string'de de sağa geçer. `??` sadece `null` ve `undefined`'da geçer
- `target="_blank"` → linki yeni sekmede aç
- `rel="noreferrer"` → güvenlik için. `_blank` ile açılan sayfa açan sayfaya erişebilir, `noreferrer` bunu engeller

---

## `components/ErrorMessage.tsx`

```tsx
interface Props {
  message: string;
}

function ErrorMessage({ message }: Props) {
  return (
    <div>
      <p>⚠️ {message}</p>
    </div>
  );
}

export default ErrorMessage;
```

---

## Hata Senaryoları Tablosu

| Durum       | Ne Olur                        | Ekranda Ne Çıkar                 |
| ----------- | ------------------------------ | -------------------------------- |
| Boş input   | `return` ile durur             | Hiçbir şey                       |
| Ağ yok      | `fetch` patlar, catch'e düşer  | "Bilinmeyen bir hata oluştu"     |
| 404         | `throw new Error(...)` → catch | "Kullanıcı bulunamadı"           |
| 403         | `throw new Error(...)` → catch | "API limiti aşıldı, biraz bekle" |
| Başarılı    | `setUser(data)`                | ProfileCard görünür              |
| Her durumda | `finally` çalışır              | loading=false                    |

---

## Genel Akış

```
Kullanıcı adı yaz + Ara
        ↓
fetchUser çalışır
        ↓
loading=true, error='', user=null
        ↓
fetch isteği gider
        ↓
404? → throw → catch → setError('Kullanıcı bulunamadı')
403? → throw → catch → setError('API limiti aşıldı')
Başarılı? → setUser(data) → ProfileCard render olur
        ↓
finally → loading=false (her durumda)
```

---

## `try/catch/finally` Özet

| Blok      | Ne Zaman Çalışır    | Ne İçin Kullanılır                    |
| --------- | ------------------- | ------------------------------------- |
| `try`     | Her zaman başlar    | Başarılı senaryoyu yaz                |
| `throw`   | Manuel tetiklenir   | Belirli bir hatayı catch'e gönder     |
| `catch`   | Hata olunca         | Hatayı yakala, kullanıcıya göster     |
| `finally` | Her zaman, en sonda | Temizlik işleri (loading kapatma vb.) |
