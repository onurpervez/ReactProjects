## Proje 1 — Todo Listesi

### Öğrenilen Kavramlar

- `useState`, props, component yapısı
- Event handling
- Koşullu stil

### Dosya Yapısı

```
src/
├── App.tsx
├── main.tsx
└── components/
    ├── TodoInput.tsx
    ├── TodoList.tsx
    └── TodoItem.tsx
```

---

### `App.tsx`

```tsx
import { useState } from "react";
import TodoInput from "./components/TodoInput";
import TodoList from "./components/TodoList";

interface Todo {
  id: number;
  text: string;
  tamamlandi: boolean;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);

  function addTodo(text: string) {
    const yeniTodo: Todo = {
      id: Date.now(),
      text: text,
      tamamlandi: false,
    };
    setTodos([...todos, yeniTodo]);
  }

  function toggleTodo(id: number) {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, tamamlandi: !todo.tamamlandi } : todo,
      ),
    );
  }

  function deleteTodo(id: number) {
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  return (
    <div>
      <h1>Todo Listesi</h1>
      <TodoInput onAdd={addTodo} />
      <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
    </div>
  );
}

export default App;
```

**Açıklamalar:**

- `useState<Todo[]>([])` → Todo dizisi tutan state, başlangıçta boş
- `Date.now()` → benzersiz id üretmek için anlık zaman damgası
- `[...todos, yeniTodo]` → mevcut diziyi kopyalayıp sonuna yeni eleman ekle. `todos.push()` kullanılmaz — React state'i doğrudan değiştirmeni istemez
- `todos.map(...)` → her todo'ya bak, id eşleşiyorsa `tamamlandi`'yi tersine çevir, eşleşmiyorsa olduğu gibi bırak
- `todos.filter(...)` → id'si eşleşmeyenleri tut, eşleşeni at (silme işlemi)

---

### `components/TodoInput.tsx`

```tsx
import { useState } from "react";

interface Props {
  onAdd: (text: string) => void;
}

function TodoInput({ onAdd }: Props) {
  const [text, setText] = useState("");

  function handleSubmit() {
    if (text.trim() === "") return;
    onAdd(text);
    setText("");
  }

  return (
    <div>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Yeni görev..."
      />
      <button onClick={handleSubmit}>Ekle</button>
    </div>
  );
}

export default TodoInput;
```

**Açıklamalar:**

- `(text: string) => void` → string alan, geriye bir şey döndürmeyen fonksiyon tipi
- `text.trim()` → baştaki/sondaki boşlukları siler, sadece boşluk girilmesini engeller
- `value={text}` + `onChange` → "controlled input". React input'u kontrol ediyor, ikisi birlikte çalışır
- `onAdd(text)` → App'teki `addTodo` fonksiyonunu çağırır
- `setText('')` → gönderdikten sonra input'u temizler

---

### `components/TodoList.tsx`

```tsx
import TodoItem from "./TodoItem";

interface Todo {
  id: number;
  text: string;
  tamamlandi: boolean;
}

interface Props {
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

function TodoList({ todos, onToggle, onDelete }: Props) {
  return (
    <ul>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

export default TodoList;
```

**Açıklamalar:**

- `key={todo.id}` → React'ın listedeki her elemanı tanıması için zorunlu, benzersiz olmalı. Olmadan uyarı verir, performans sorunları çıkar

---

### `components/TodoItem.tsx`

```tsx
interface Todo {
  id: number;
  text: string;
  tamamlandi: boolean;
}

interface Props {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

function TodoItem({ todo, onToggle, onDelete }: Props) {
  return (
    <li>
      <span
        onClick={() => onToggle(todo.id)}
        style={{
          textDecoration: todo.tamamlandi ? "line-through" : "none",
          cursor: "pointer",
        }}
      >
        {todo.text}
      </span>
      <button onClick={() => onDelete(todo.id)}>Sil</button>
    </li>
  );
}

export default TodoItem;
```

**Açıklamalar:**

- `onClick={() => onToggle(todo.id)}` → ok fonksiyonu ile "tıklayınca çalıştır" diyoruz. `onClick={onToggle(todo.id)}` yazılırsa sayfa açılır açılmaz çalışır
- `todo.tamamlandi ? 'line-through' : 'none'` → ternary operatör ile koşullu stil

---

### Genel Akış

```
App.tsx          → veriyi ve fonksiyonları tutar
  ├── TodoInput  → yeni todo ekler, App'e haber verir
  └── TodoList   → listeyi gösterir
        └── TodoItem → tek bir todo'yu gösterir, tıklamayı App'e iletir
```

---

---
