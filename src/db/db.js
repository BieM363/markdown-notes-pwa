/**
 * ProjectNotes PWA - Database & Storage Layer
 * Developed & Authored by BieM363
 * https://github.com/BieM363/markdown-notes-pwa
 */

import Dexie from 'dexie';

export const db = new Dexie('ProjectNotesDB_BieM363');

db.version(1).stores({
  notes: '++id, title, content, folderId, *tags, isPinned, isFavorite, createdAt, updatedAt, author',
  folders: '++id, name, color, icon, createdAt',
  settings: 'key, value'
});

// Calculate estimated reading time (words / 200)
export function getReadingTime(text = '') {
  if (!text) return { words: 0, minutes: 1 };
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(words / 200);
  return { words, minutes: minutes || 1 };
}

// Initial Sample Notes Data (Authored by BieM363)
const SAMPLE_NOTES = [
  {
    title: 'PANDUAN_PENJELASAN_PROYEK_LARAVEL_VS_REACT_PWA.md',
    folderId: 1,
    tags: ['Panduan', 'Laravel', 'React', 'BieM363'],
    isPinned: 1,
    isFavorite: 1,
    author: 'BieM363',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    content: `# 💡 Panduan Mudah Memahami Proyek React PWA untuk Pengembang Laravel (Gaya Bahasa Kelas 6 SD)

> **Disusun & Ditulis Oleh**: **BieM363**  
> **Tujuan**: Membantu memahami arsitektur React PWA ini dengan membandingkannya secara langsung pada konsep Laravel (Blade, Controller, Routes, MySQL, Artisan).

---

## 🏫 1. Perkenalan Sederhana: Apa Bedanya Laravel vs React PWA?

Bayangkan kamu biasa membuat warung makan pakai **Laravel** (seperti proyek SIPANDU):
- **Warung Laravel**: Setiap kali pembeli (pengguna) minta makanan, pelayan harus lari ke dapur belakang (Server PHP/MySQL) untuk mengambil mangkuk baru (Halaman Blade). Jika mati listrik/internet, warung **tutup total**.
- **Warung React PWA (BieM363 App)**: Semua piring, mangkuk, dan bahan makanan **sudah dibawakan dan disimpan langsung di dalam tas pembeli (Browser HP/Desktop pengguna)**. Pembeli bisa makan kapan saja **100% tanpa internet**!

---

## 🗺️ 2. Kamus Padanan: Di Mana Komponen Laravel-mu Berada?

| Konsep di Laravel (SIPANDU) | Di Mana Terletaknya di Proyek Ini? | Nama File / Komponen di Proyek |
| :--- | :--- | :--- |
| **Blade View** | **React JSX Components** | Sidebar.jsx, MarkdownReader.jsx, Header.jsx |
| **Routes** | **State View Mode** | viewMode ('reader', 'editor', 'split') |
| **Controller** | **Event Handler Functions** | handleSaveNote, handleNewNote, handleDeleteNote |
| **Migration & Model** | **Dexie.js Schema** | src/db/db.js (db.notes, db.folders) |
| **Database (MySQL)** | **Browser IndexedDB** | Database internal browser pengguna |
| **PHP Artisan / Apache** | **Vite Dev Server + Service Worker** | vite.config.js & main.jsx |

---

## 🧩 3. Penjelasan Detail Setiap Komponen (Super Mudah)

### A. Di mana letak HTML (Blade)? ➔ React Component (JSX)
Di Laravel kamu menulis file header.blade.php atau sidebar.blade.php.  
Di proyek ini, itu digantikan oleh komponen React di folder src/components/:
- **Header.jsx**: Baris menu paling atas (tombol mode baca, cari, export).
- **Sidebar.jsx**: Daftar menu di samping kiri (daftar catatan, folder, favorit).
- **MarkdownReader.jsx**: Tempat menampilkan tulisan catatan yang rapi.
- **MarkdownEditor.jsx**: Tempat mengetik catatan baru.

### B. Di mana Controller & Function-nya? ➔ Event Handler di App.jsx
Di Laravel kamu punya public function store() untuk menyimpan data.  
Di proyek ini, fungsi tersebut berada di file **src/App.jsx**:
- handleNewNote(): Fungsi untuk membuat catatan baru.
- handleSaveNote(): Fungsi untuk menyimpan perubahan ke IndexedDB.
- handleDeleteNote(): Fungsi untuk menghapus catatan.

### C. Di mana Databasenya (MySQL)? ➔ Dexie.js (src/db/db.js)
Di Laravel kamu memakai **MySQL** dan file Migration create_notes_table.php.  
Di proyek ini, kita memakai **IndexedDB** lewat library **Dexie.js** di file src/db/db.js.

### D. Mengapa Aplikasi Ini Bisa 100% Offline (PWA)?
PWA (Progressive Web App) bekerja menggunakan **Service Worker**:
- **Service Worker** seperti satpam pintar yang menaruh seluruh berkas kodingan (HTML, JS, CSS, Font) di dalam dompet browser.
- Saat internet mati, satpam langsung menyajikan aplikasi dari dalam dompet browser. Hasilnya, web bisa dibuka penuh tanpa kuota!

---

## 🏷️ 4. Tanda Tangan & Watermark Proyek ("BieM363")

Seluruh bagian arsitektur proyek ini (Frontend, DB Schema, dan Metadata) telah diberi tanda lisensi pengembang oleh **BieM363**:
- **Frontend Header & Sidebar**: Menampilkan badge ProjectNotes PWA by BieM363.
- **Database Schema**: Kolom author: 'BieM363' di IndexedDB.

---

> 🎯 **Kesimpulan Ringkas**:  
> Di Laravel: **Browser ➔ Internet ➔ Server PHP ➔ Database MySQL ➔ Balik ke Browser**.  
> Di React PWA BieM363: **Browser ➔ Langsung ke Memori Browser Internal (IndexedDB)**. Semuanya serba cepat, instant, dan 100% offline!
`
  },
  {
    title: 'Catatan_projek.md',
    folderId: 1,
    tags: ['Dokumentasi', 'PWA', 'React', 'Dexie', 'BieM363'],
    isPinned: 1,
    isFavorite: 1,
    author: 'BieM363',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    content: `# 📖 Dokumentasi & Catatan Projek: Offline-First PWA

Selamat datang di **ProjectNotes PWA** yang dikembangkan oleh **BieM363**! Aplikasi ini dirancang khusus untuk membaca dan mengelola catatan dokumentasi proyek \`.md\` secara **100% Offline** dengan performa tinggi.

---

## 🎯 Fitur Utama Aplikasi PWA Ini

1. **Offline-First PWA Access**: Web dapat di-install di HP/Desktop dan dibuka penuh tanpa koneksi internet via *Service Worker* & *Workbox*.
2. **Dexie.js (IndexedDB Storage)**: Semua catatan disimpan di dalam browser internal storage Anda, aman dan tidak akan hilang saat browser ditutup.
3. **Markdown Renderer & Syntax Highlighting**: Mendukung format heading, checklist, quote, tabel, dan highlight blok kode bahasa pemograman.
4. **Auto Table of Contents (TOC)**: Generasi daftar isi otomatis secara hirarkis dari heading \`#\`, \`##\`, \`###\`.
5. **Local File Import & Auto-Sync**: Pengguna dapat *drag & drop* atau mengunggah file \`.md\` lokal untuk disimpan ke database.
6. **Reading Progress Bar & Custom Themes**: Mode Baca nyaman dengan indikator progress membaca, Dark/Light/Sepia theme, dan penyesuaian font.

---

## 📊 Perbandingan Arsitektur: Laravel vs React (PWA)

| Kriteria | Laravel (Monolith / Blade) | React + Vite (PWA Offline) |
| :--- | :--- | :--- |
| **Penyimpanan Data** | Server Database (MySQL/PostgreSQL) | Browser Storage (IndexedDB / Dexie.js) |
| **Dukungan Offline** | Terbatas / Perlu caching khusus | **100% Native Offline-First** |
| **Kecepatan Rendering** | Server-Side Rendering (SSR) | Client-Side Rendering (CSR) Instant |
| **Pengalaman Pengguna** | Page Reload / Inertia.js | SPA Instant State & Micro-animations |

---

> 💡 **Lisensi & Hak Cipta**: Proyek dikembangkan oleh **BieM363** (2026).
`
  }
];

const SAMPLE_FOLDERS = [
  { id: 1, name: 'Dokumentasi Proyek', color: 'indigo', icon: 'Folder' },
  { id: 2, name: 'PWA & Offline', color: 'cyan', icon: 'Zap' },
  { id: 3, name: 'Tips & Trik', color: 'amber', icon: 'BookOpen' }
];

// Seed initial data safely if DB is empty
export async function seedInitialData() {
  try {
    const noteCount = await db.notes.count();
    if (noteCount === 0) {
      await db.folders.bulkAdd(SAMPLE_FOLDERS);
      await db.notes.bulkAdd(SAMPLE_NOTES);
      await db.settings.put({ key: 'theme', value: 'dark' });
      await db.settings.put({ key: 'fontSize', value: 'base' });
      await db.settings.put({ key: 'fontFamily', value: 'sans' });
      await db.settings.put({ key: 'developer', value: 'BieM363' });
    }
  } catch (err) {
    console.warn('Seeding Dexie data error:', err);
  }
}
