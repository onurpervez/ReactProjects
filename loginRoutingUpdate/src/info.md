# Proje 8 — useContext & Auth Sistemi

> Odak: `useContext`, prop drilling'den kurtulma, context dosya yapısı, kalıcı oturum

---

## Öğrenilen Kavramlar

- `createContext` — context oluşturma
- `useContext` — context'ten veri alma
- `AuthProvider` — tüm uygulamayı saran kapsayıcı
- `children` props ve Fragment `<></>`
- Prop drilling problemi ve çözümü
- ESLint `react-refresh` kuralı — dosyaları doğru bölme
- `localStorage` ile kalıcı oturum

---

## Dosya Yapısı

```
src/
├── App.tsx
├── main.tsx
├── context/
│   ├── AuthContext.ts      → sadece createContext
│   ├── AuthProvider.tsx    → sadece Provider component
│   └── useAuth.ts          → sadece hook
├── components/
│   └── ProtectedRoute.tsx
└── pages/
    ├── Login.tsx
    └── Dashboard.tsx
```

---

## `context/AuthContext.ts`

```ts
import { createContext } from "react";

export interface AuthContextType {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
```

**Açıklamalar:**

- `createContext` → "bu veriyi isteyene ver" sistemi kurar
- `<AuthContextType | null>` → başlangıçta `null`. `AuthProvider` sarmalamadan önce context'e erişilirse `null` gelir
- `null` başlangıç değeri → `useAuth` içindeki kontrol bunu yakalar ve anlamlı hata fırlatır

---

## `context/AuthProvider.tsx`

```tsx
import { useState } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./AuthContext";

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  function login() {
    localStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true);
  }

  function logout() {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

**Açıklamalar:**

**Lazy initialization ile localStorage:**

```tsx
const [isLoggedIn, setIsLoggedIn] = useState(() => {
  return localStorage.getItem("isLoggedIn") === "true";
});
```

- `localStorage.getItem` string döndürür — `"true"` veya `null`
- `=== 'true'` ile boolean'a çeviriyoruz
- Sayfa yenilenince oturum kaybolmuyor

**`login` ve `logout`:**

- Her fonksiyon iki iş yapıyor: state güncelle + localStorage güncelle
- State → ekran yenilensin
- localStorage → sayfa yenilenince de kalıcı olsun

**`AuthContext.Provider`:**

```tsx
<AuthContext.Provider value={{ isLoggedIn, login, logout }}>
  {children}
</AuthContext.Provider>
```

- `value` içine ne koyarsan tüm alt component'lar ona erişebilir
- `{children}` → `AuthProvider` ile sarılan her şey buraya giriyor

---

## `context/useAuth.ts`

```ts
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth, AuthProvider içinde kullanılmalı");
  }
  return context;
}
```

**Açıklamalar:**

- `useContext(AuthContext)` → en yakın `AuthContext.Provider`'dan değeri alır
- `if (!context)` → `AuthProvider` dışında kullanılırsa `null` gelir, anlamlı hata fırlatır. Bu kontrol olmadan "cannot read properties of null" gibi anlaşılmaz hata alırsın
- `return context` → `{ isLoggedIn, login, logout }` nesnesini döndürür

Kullanımı:

```tsx
const { isLoggedIn, login, logout } = useAuth();
```

---

## `App.tsx`

```tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
```

**Açıklamalar:**

- `AuthProvider` en dışta — tüm uygulama context'e erişebilsin diye
- Props yok — önceki Login projesinde `onLogin`, `onLogout` props geçiyorduk, şimdi gerek yok
- Her component ihtiyacı olanı `useAuth()` ile direkt alıyor

---

## `components/ProtectedRoute.tsx`

```tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

function ProtectedRoute({ children }: Props) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" />;
}

export default ProtectedRoute;
```

**Açıklamalar:**

- `useAuth()` ile context'ten `isLoggedIn`'i direkt alıyor — props'a gerek yok
- `<>{children}</>` → Fragment. `children`'ı sarmak için div koymak istemiyoruz, Fragment DOM'a ekstra element eklemez
- `isLoggedIn` true → Dashboard render olur, false → Login'e yönlendirir

---

## `pages/Login.tsx`

```tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email: string;
  password: string;
}

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

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
    login();
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

**Önceki Login projesinden fark:**

```tsx
// Önceki — props ile
function Login({ onLogin }: Props) {
  onLogin();
}

// Şimdi — context ile
function Login() {
  const { login } = useAuth();
  login();
}
```

---

## `pages/Dashboard.tsx`

```tsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function Dashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  function handleLogout() {
    logout();
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

---

## Prop Drilling vs Context

```
// Prop drilling — önceki proje
App (isLoggedIn state burada)
  └── Login       (onLogin props alıyor)
  └── Dashboard   (onLogout props alıyor)
  └── ProtectedRoute (isLoggedIn props alıyor)

// Context — şu an
App (AuthProvider sarıyor)
  └── Login          (useAuth() ile direkt alıyor)
  └── Dashboard      (useAuth() ile direkt alıyor)
  └── ProtectedRoute (useAuth() ile direkt alıyor)
```

Gerçek uygulamada 5-10 seviye derinlik olunca context hayat kurtarıyor.

---

## Neden Üç Dosyaya Böldük?

| Dosya              | İçerik          | Neden Ayrı?                                          |
| ------------------ | --------------- | ---------------------------------------------------- |
| `AuthContext.ts`   | `createContext` | Sadece tip ve context nesnesi — component değil      |
| `AuthProvider.tsx` | Component       | ESLint: component dosyasında sadece component olmalı |
| `useAuth.ts`       | Hook            | ESLint: hook fonksiyonu component değil              |

ESLint'in `react-refresh/only-export-components` kuralı: bir `.tsx` dosyasında component dışı şeyler export edilirse Fast Refresh çalışmaz.

---

## Genel Context Akışı

```
AuthProvider → value={{ isLoggedIn, login, logout }} sağlar
        ↓
useAuth() → useContext ile bu değeri alır
        ↓
Login → login() çağırır → isLoggedIn = true → localStorage güncellenir
        ↓
ProtectedRoute → isLoggedIn true → Dashboard render olur
        ↓
Dashboard → logout() çağırır → isLoggedIn = false → localStorage temizlenir
        ↓
ProtectedRoute → isLoggedIn false → Login'e yönlendirir
```

---

## Tüm Projeler Özeti

| Proje                 | Öğrenilen                                                          |
| --------------------- | ------------------------------------------------------------------ |
| 1 — Todo              | `useState`, props, `map`, `filter`, event handling                 |
| 2 — Kullanıcı Listesi | Ayrı data dosyası, `import type`, arama mantığı                    |
| 3 — Hava Durumu       | `async/await`, `fetch`, `try/catch/finally`, `loading/error` state |
| 4 — GitHub Profil     | `throw new Error`, `err instanceof Error`, union type, `??`        |
| 5 — Not Defteri       | `useEffect`, `localStorage`, lazy initialization                   |
| 6 — Alışveriş Sepeti  | `useReducer`, `reduce`, zincirleme array metodları                 |
| 7 — Login Formu       | React Router, form validasyonu, korumalı route                     |
| 8 — Auth Sistemi      | `useContext`, prop drilling çözümü, context dosya yapısı           |
