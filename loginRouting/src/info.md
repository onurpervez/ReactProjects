# Proje 7 — Login Formu

> Odak: React Router, form validasyonu, korumalı route, `useNavigate`

---

## Öğrenilen Kavramlar

- React Router — `BrowserRouter`, `Routes`, `Route`
- Korumalı route — `Navigate` ile erişim kontrolü
- `useNavigate` — kod içinde sayfa yönlendirme
- `path="*"` — tanımlanmamış path'leri yakalamak
- Form validasyonu — boş alan, email formatı, şifre uzunluğu
- Tek `handleChange` ile tüm inputları yönetmek
- Computed property — `[e.target.name]`
- Fonksiyon dönüş tipi — `: boolean`

---

## Dosya Yapısı

```
src/
├── App.tsx
├── main.tsx
├── context/
│   └── AuthContext.tsx  (bir sonraki projede doldurulacak)
└── pages/
    ├── Login.tsx
    └── Dashboard.tsx
```

---

## Kurulum

```bash
npm install react-router-dom
```

---

## `App.tsx`

```tsx
import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<Login onLogin={() => setIsLoggedIn(true)} />}
        />
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <Dashboard onLogout={() => setIsLoggedIn(false)} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

**Açıklamalar:**

- `isLoggedIn` state'i → giriş durumunu tutar. `false` = giriş yapılmamış, `true` = giriş yapılmış
- `onLogin` props → başarılı girişte `setIsLoggedIn(true)` çalıştırır
- `onLogout` props → çıkışta `setIsLoggedIn(false)` çalıştırır

**Korumalı route:**

```tsx
element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
```

- `isLoggedIn` true → Dashboard göster
- `isLoggedIn` false → Login'e yönlendir
- `<Navigate to="/login" />` → render olunca direkt yönlendirir

**`path="*"`:**

- Tanımlanmamış her path buraya düşer
- `/xyz`, `/anasayfa` gibi olmayan adreslerde login'e yönlendirir

---

## `pages/Login.tsx`

```tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email: string;
  password: string;
}

interface Props {
  onLogin: () => void;
}

function Login({ onLogin }: Props) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    email: "",
    password: "",
  });

  function validate(): boolean {
    const yeniHatalar: FormErrors = { email: "", password: "" };
    let gecerli = true;

    if (formData.email.trim() === "") {
      yeniHatalar.email = "Email zorunludur";
      gecerli = false;
    } else if (!formData.email.includes("@")) {
      yeniHatalar.email = "Geçerli bir email girin";
      gecerli = false;
    }

    if (formData.password.trim() === "") {
      yeniHatalar.password = "Şifre zorunludur";
      gecerli = false;
    } else if (formData.password.length < 6) {
      yeniHatalar.password = "Şifre en az 6 karakter olmalı";
      gecerli = false;
    }

    setErrors(yeniHatalar);
    return gecerli;
  }

  function handleSubmit() {
    if (!validate()) return;
    onLogin();
    navigate("/dashboard");
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  return (
    <div>
      <h1>Giriş Yap</h1>
      <div>
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />
        {errors.email && <p>{errors.email}</p>}
      </div>
      <div>
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Şifre"
        />
        {errors.password && <p>{errors.password}</p>}
      </div>
      <button onClick={handleSubmit}>Giriş Yap</button>
    </div>
  );
}

export default Login;
```

**Açıklamalar:**

**Tek state ile tüm form:**

```tsx
const [formData, setFormData] = useState<FormData>({
  email: "",
  password: "",
});
```

Her input için ayrı state yerine tek nesne — form büyüdükçe çok daha temiz.

**Tek `handleChange` tüm inputlar için:**

```tsx
function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
  setFormData({ ...formData, [e.target.name]: e.target.value });
}
```

- `e.target.name` → hangi input değişti? Input'taki `name` attribute'unu okur
- `[e.target.name]` → computed property. `name="email"` olan input değişince `{ ...formData, email: 'yeni değer' }` oluşturur
- Input'a `name` attribute vermek zorunlu — `handleChange` bunu kullanıyor

**`validate(): boolean`:**

- `: boolean` → fonksiyon `true` veya `false` döndürür
- Başta `gecerli = true`, hata bulununca `false` yapılır
- `setErrors` en sonda bir kez çağrılır — her hata için ayrı çağırmak gereksiz render'a yol açar
- `true` dönerse form geçerli, `false` dönerse hata mesajları ekranda görünür

**`handleSubmit`:**

```tsx
function handleSubmit() {
  if (!validate()) return; // hata varsa dur
  onLogin(); // isLoggedIn = true
  navigate("/dashboard"); // yönlendir
}
```

**`useNavigate`:**

- React Router'ın hook'u
- `Link`'ten farkı: `Link` tıklanabilir element oluştururken `useNavigate` kod içinde istediğin zaman yönlendirme yapar

---

## `pages/Dashboard.tsx`

```tsx
import { useNavigate } from "react-router-dom";

interface Props {
  onLogout: () => void;
}

function Dashboard({ onLogout }: Props) {
  const navigate = useNavigate();

  function handleLogout() {
    onLogout();
    navigate("/login");
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Hoş geldin! Giriş başarılı.</p>
      <button onClick={handleLogout}>Çıkış Yap</button>
    </div>
  );
}

export default Dashboard;
```

**Açıklamalar:**

- `onLogout()` → önce state güncellenir (`isLoggedIn = false`)
- `navigate('/login')` → sonra yönlendirme olur
- Sıra önemli — önce state, sonra navigate

---

## Genel Akış

```
Kullanıcı /dashboard'a gider
        ↓
isLoggedIn false → <Navigate to="/login" />
        ↓
Login formu doldurulur
        ↓
handleSubmit → validate()
        ↓
Hata var mı?
  Evet → return, hataları göster
  Hayır → onLogin() → isLoggedIn = true
        ↓
navigate('/dashboard')
        ↓
isLoggedIn true → Dashboard render olur
        ↓
Çıkış Yap → onLogout() → isLoggedIn = false
        ↓
navigate('/login') → Login'e dön
```

---

## React Router Özeti

|                 | Ne Yapar                   |
| --------------- | -------------------------- |
| `BrowserRouter` | Router'ı saran kapsayıcı   |
| `Routes`        | Route'ları gruplar         |
| `Route`         | Path → component eşleşmesi |
| `Navigate`      | Render olunca yönlendirir  |
| `useNavigate`   | Kod içinde yönlendirme     |
| `Link`          | Tıklanabilir bağlantı      |
| `path="*"`      | Tanımlanmamış tüm path'ler |

---

## Form Validasyon Patternı

```tsx
function validate(): boolean {
  const hatalar = { email: "", password: "" };
  let gecerli = true;

  // her alan için kontrol
  if (kosul) {
    hatalar.email = "hata mesajı";
    gecerli = false;
  }

  setErrors(hatalar); // en sonda bir kez
  return gecerli; // true = geçerli, false = hatalı
}

function handleSubmit() {
  if (!validate()) return; // hatalıysa dur
  // devam et...
}
```

---

## Computed Property

```tsx
// [e.target.name] ile dinamik key
setFormData({ ...formData, [e.target.name]: e.target.value });

// Şuna eşdeğer (name="email" ise):
setFormData({ ...formData, email: e.target.value });

// Şuna eşdeğer (name="password" ise):
setFormData({ ...formData, password: e.target.value });
```

Tek fonksiyon ile tüm inputları yönetmek için kullanılır.
