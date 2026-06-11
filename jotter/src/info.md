# Proje 5 — Not Defteri

> Odak: `useEffect`, `localStorage`, lazy initialization

---

## Öğrenilen Kavramlar

- `useEffect` — yan etkiler, dependency array
- `localStorage` — kalıcı veri saklama
- `useState` lazy initialization
- `JSON.stringify` / `JSON.parse`
- `new Date().toLocaleDateString()`

---

## Dosya Yapısı

```
src/
├── App.tsx
├── main.tsx
└── components/
    ├── NoteInput.tsx
    ├── NoteList.tsx
    └── NoteItem.tsx
```

---

## `App.tsx`

```tsx
import { useState, useEffect } from "react";
import NoteInput from "./components/NoteInput";
import NoteList from "./components/NoteList";

interface Note {
  id: number;
  text: string;
  date: string;
}

function App() {
  const [notes, setNotes] = useState<Note[]>(() => {
    const kayitli = localStorage.getItem("notlar");
    return kayitli ? JSON.parse(kayitli) : [];
  });

  useEffect(() => {
    localStorage.setItem("notlar", JSON.stringify(notes));
  }, [notes]);

  function addNote(text: string) {
    const yeniNot: Note = {
      id: Date.now(),
      text: text,
      date: new Date().toLocaleDateString("tr-TR"),
    };
    setNotes([...notes, yeniNot]);
  }

  function deleteNote(id: number) {
    setNotes(notes.filter((note) => note.id !== id));
  }

  return (
    <div>
      <h1>Not Defteri</h1>
      <NoteInput onAdd={addNote} />
      <NoteList notes={notes} onDelete={deleteNote} />
    </div>
  );
}

export default App;
```

**Açıklamalar:**

**Lazy initialization:**

```tsx
const [notes, setNotes] = useState<Note[]>(() => {
  const kayitli = localStorage.getItem("notlar");
  return kayitli ? JSON.parse(kayitli) : [];
});
```

- `useState([])` yazarsak sayfa her render'da boş dizi hesaplanır, localStorage'a bakılmaz
- Fonksiyon geçince `useState` onu sadece ilk açılışta bir kez çalıştırır — "lazy initialization"
- `localStorage.getItem('notlar')` → kayıtlı veri var mı bak
- Varsa `JSON.parse` ile string'i diziye çevir, yoksa boş dizi ile başla

**`useEffect`:**

```tsx
useEffect(() => {
  localStorage.setItem("notlar", JSON.stringify(notes));
}, [notes]);
```

- `notes` her değiştiğinde çalışır — not eklenince, silinince
- `JSON.stringify` → diziyi string'e çevirir, localStorage sadece string saklar
- `[]` yazsaydık sadece ilk açılışta çalışırdı, notlar kaydedilmezdi

**`addNote`:**

- `new Date().toLocaleDateString('tr-TR')` → "10.06.2026" formatında tarih üretir
- `'tr-TR'` locale parametresi — İngilizce için `'en-US'` yazılır

---

## `components/NoteInput.tsx`

```tsx
import { useState } from "react";

interface Props {
  onAdd: (text: string) => void;
}

function NoteInput({ onAdd }: Props) {
  const [text, setText] = useState("");

  function handleSubmit() {
    if (text.trim() === "") return;
    onAdd(text);
    setText("");
  }

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Notunu yaz..."
        rows={4}
      />
      <br />
      <button onClick={handleSubmit}>Kaydet</button>
    </div>
  );
}

export default NoteInput;
```

**Açıklamalar:**

- `textarea` → `input` yerine çok satırlı metin girişi için kullanıldı
- `rows={4}` → başlangıçta 4 satır yüksekliğinde görünür
- Controlled input mantığı aynı — `value` + `onChange`

---

## `components/NoteList.tsx`

```tsx
import NoteItem from "./NoteItem";

interface Note {
  id: number;
  text: string;
  date: string;
}

interface Props {
  notes: Note[];
  onDelete: (id: number) => void;
}

function NoteList({ notes, onDelete }: Props) {
  return (
    <div>
      {notes.length === 0 && <p>Henüz not yok.</p>}
      {notes.map((note) => (
        <NoteItem key={note.id} note={note} onDelete={onDelete} />
      ))}
    </div>
  );
}

export default NoteList;
```

**Açıklamalar:**

- `notes.length === 0 && <p>Henüz not yok.</p>` → liste boşsa mesaj göster, dolunca otomatik kaybolur

---

## `components/NoteItem.tsx`

```tsx
interface Note {
  id: number;
  text: string;
  date: string;
}

interface Props {
  note: Note;
  onDelete: (id: number) => void;
}

function NoteItem({ note, onDelete }: Props) {
  return (
    <div>
      <p>{note.text}</p>
      <small>{note.date}</small>
      <br />
      <button onClick={() => onDelete(note.id)}>Sil</button>
    </div>
  );
}

export default NoteItem;
```

**Açıklamalar:**

- `<small>` → HTML etiketi, metni daha küçük gösterir, tarihi ana metinden ayırt etmek için kullanıldı

---

## `useEffect` + `localStorage` Akışı

```
Sayfa ilk açılır
      ↓
useState lazy init çalışır
      ↓
localStorage'da veri var mı?
  Evet → JSON.parse → notes state'e yükle
  Hayır → boş dizi ile başla
      ↓
Kullanıcı not ekler/siler
      ↓
notes state değişir
      ↓
useEffect tetiklenir
      ↓
localStorage.setItem → veri kaydedilir
      ↓
Sayfa kapatılıp açılsa bile veriler duruyor
```

---

## `useEffect` Dependency Array Özeti

```tsx
useEffect(() => { ... }, [])        // Sadece ilk açılışta bir kez
useEffect(() => { ... }, [notes])   // notes her değişince
useEffect(() => { ... })            // Her render'da (genelde kullanılmaz)
```

---

## `localStorage` API Özeti

```tsx
// Kaydet (sadece string saklar)
localStorage.setItem("anahtar", "değer");

// Oku
localStorage.getItem("anahtar"); // yoksa null döner

// Sil
localStorage.removeItem("anahtar");

// Dizi/nesne kaydetmek için
localStorage.setItem("notlar", JSON.stringify(notlar)); // dizi → string
const notlar = JSON.parse(localStorage.getItem("notlar")); // string → dizi
```

---

## Todo vs Not Defteri Farkı

|                       | Todo                         | Not Defteri                             |
| --------------------- | ---------------------------- | --------------------------------------- |
| `useState` başlangıcı | `[]`                         | Lazy init — localStorage'dan oku        |
| Veri kalıcı mı?       | Hayır, sayfa kapanınca gider | Evet, localStorage'da saklanır          |
| `useEffect`           | Yok                          | `notes` değişince localStorage güncelle |
| Input tipi            | `input`                      | `textarea`                              |
| Ekstra alan           | Yok                          | `date` — oluşturulma tarihi             |
