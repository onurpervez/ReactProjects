## Proje 3 — Hava Durumu

### Öğrenilen Kavramlar

- `async/await` ile API isteği atmak
- `try/catch/finally` ile hata yönetimi
- `loading` ve `error` state'leri
- Dışarıdan gelen verinin tipini tanımlamak
- Koşullu render `&&`

### Dosya Yapısı

```
src/
├── App.tsx
├── main.tsx
├── types/
│   └── weather.ts
└── components/
    ├── SearchInput.tsx
    ├── WeatherCard.tsx
    └── ErrorMessage.tsx
```

---

### `types/weather.ts`

```ts
export interface Weather {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
  };
}
```

**Açıklamalar:**

- Önceki projelerde veriyi biz uydurmuştuk. Burada API'dan gelecek veriyi tanımlıyoruz
- `weather: { ... }[]` → köşeli parantez var çünkü bu alan dizi geliyor, biz sadece ilk elemanı kullanacağız (`weather[0]`)
- API aslında çok daha fazla alan gönderiyor, biz sadece kullanacaklarımızı tanımladık

---

### `App.tsx`

```tsx
import { useState } from "react";
import type { Weather } from "./types/weather";
import SearchInput from "./components/SearchInput";
import WeatherCard from "./components/WeatherCard";
import ErrorMessage from "./components/ErrorMessage";

const API_KEY = "buraya_kendi_key_ini_yaz";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchWeather() {
    if (city.trim() === "") return;

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=tr`,
      );

      if (!response.ok) {
        throw new Error("Şehir bulunamadı");
      }

      const data: Weather = await response.json();
      setWeather(data);
    } catch (err) {
      setError("Şehir bulunamadı, tekrar dene");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Hava Durumu</h1>
      <SearchInput value={city} onChange={setCity} onSearch={fetchWeather} />
      {loading && <p>Yükleniyor...</p>}
      {error && <ErrorMessage message={error} />}
      {weather && <WeatherCard weather={weather} />}
    </div>
  );
}

export default App;
```

**Açıklamalar:**

- `Weather | null` → "bu ya Weather nesnesidir ya da null'dur". Başlangıçta veri yok, o yüzden null
- `loading` ve `error` state'leri → API çeken her projede bu ikili hep olacak
- `async function` → içinde beklemeli işlem var demek
- `await fetch(...)` → cevap gelene kadar bekle, alt satıra geçme
- URL parametreleri: `q=${city}` şehir, `units=metric` Celsius, `lang=tr` Türkçe açıklama
- `response.ok` → istek başarılıysa true, 404 gibi hatalarda false
- `throw new Error(...)` → catch bloğuna atlar
- `await response.json()` → gelen cevabı JSON'dan JS nesnesine çevir
- `finally` → hata olsa da olmasa da her zaman çalışır, loading'i kapatmak için ideal
- `{loading && <p>...</p>}` → loading true ise göster, false ise hiçbir şey gösterme

---

### `components/SearchInput.tsx`

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
        placeholder="Şehir ara..."
      />
      <button onClick={onSearch}>Ara</button>
    </div>
  );
}

export default SearchInput;
```

**Açıklamalar:**

- `onSearch: () => void` → parametre almayan, geriye bir şey döndürmeyen fonksiyon
- `React.KeyboardEvent<HTMLInputElement>` → "bu event bir input'tan gelen klavye eventi"
- `e.key === 'Enter'` → Enter tuşuna basılınca arama yapar, butona tıklamak zorunda kalınmaz

---

### `components/WeatherCard.tsx`

```tsx
import type { Weather } from "../types/weather";

interface Props {
  weather: Weather;
}

function WeatherCard({ weather }: Props) {
  return (
    <div>
      <h2>{weather.name}</h2>
      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt={weather.weather[0].description}
      />
      <p>{weather.weather[0].description}</p>
      <p>Sıcaklık: {Math.round(weather.main.temp)}°C</p>
      <p>Hissedilen: {Math.round(weather.main.feels_like)}°C</p>
      <p>Nem: {weather.main.humidity}%</p>
      <p>Rüzgar: {weather.wind.speed} m/s</p>
    </div>
  );
}

export default WeatherCard;
```

**Açıklamalar:**

- `weather.weather[0]` → API'dan gelen weather dizisinin ilk elemanı
- `Math.round()` → API ondalıklı sayı gönderiyor (22.456 gibi), yuvarlamak için kullanılır
- `@2x.png` → yüksek çözünürlüklü ikon versiyonu

---

### `components/ErrorMessage.tsx`

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

**Açıklamalar:**

- En basit component — sadece gösterme işi yapıyor
- Ayrı component yapmanın sebebi: ileride stil eklemek istersen tek yerden değiştirirsin

---

### Genel Akış

```
Kullanıcı yazar + Enter/Ara
        ↓
fetchWeather çalışır
        ↓
loading = true, error = '', weather = null
        ↓
fetch ile API isteği gider
        ↓
Cevap gelir → data = Weather nesnesi
        ↓
setWeather(data) → WeatherCard render olur
        ↓
finally → loading = false
```

---

---

## Özet — Projeden Projeye Öğrenilenler

| Proje             | Yeni Kavramlar                                                                          |
| ----------------- | --------------------------------------------------------------------------------------- |
| Todo              | `useState`, props, `map`, `filter`, `spread operator`                                   |
| Kullanıcı Listesi | Ayrı data dosyası, `export interface`, `import type`, arama mantığı                     |
| Hava Durumu       | `async/await`, `fetch`, `try/catch/finally`, `loading/error` state, koşullu render `&&` |

---

## Sık Yapılan Hatalar

| Hata                    | Doğrusu                                                     |
| ----------------------- | ----------------------------------------------------------- |
| `onClick={fonksiyon()}` | `onClick={fonksiyon}` veya `onClick={() => fonksiyon(arg)}` |
| `todos.push(yeni)`      | `setTodos([...todos, yeni])`                                |
| `import { Dispatch }`   | `import type { Dispatch }` (verbatimModuleSyntax açıkken)   |
| key vermeden map        | Her map'te `key={benzersizId}` zorunlu                      |
