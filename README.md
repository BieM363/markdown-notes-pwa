# 📖 ProjectNotes PWA - Offline-First Markdown Reader & Project Notes Manager

> Aplikasi Web Progressive (PWA) pembaca & pengelola catatan dokumentasi proyek (`.md`) yang **100% Offline-First** dengan penyimpanan IndexedDB (Dexie.js), rendering Markdown kaya, syntax highlighting, Table of Contents (TOC) interaktif, dan Reading Progress Bar.

---

## ✨ Fitur Utama

- ⚡ **100% Native Offline-First (PWA)**: Akses web tanpa koneksi internet via Service Worker & Workbox caching strategy. Dapat di-install langsung di HP (Android/iOS) dan Desktop.
- 💾 **IndexedDB Local Storage (Dexie.js)**: Menyimpan semua catatan, folder, dan preferensi tema secara permanen di browser internal pengguna tanpa ketergantungan backend server.
- 📝 **Markdown Renderer & Syntax Highlighting**: Mendukung format heading, checklist, quote, tabel, dan highlight sintaksis kode bahasa pemrograman (JS, JSX, Python, HTML, CSS, SQL, Bash) dengan tombol **Salin Kode (Copy)** instan.
- 📑 **Auto Table of Contents (TOC) Interaktif**: Generasi daftar isi otomatis dari tag heading (`#`, `##`, `###`) dengan kemampuan *smooth scroll* langsung ke bagian yang dituju saat diklik.
- 📂 **Local File Import (Drag & Drop)**: Unggah file `.md` atau `.txt` lokal secara batch/single dengan fitur drag & drop untuk disimpan langsung ke database.
- 🔍 **Pencarian Cepat (`Ctrl + K`)**: Modal pencarian kata kunci judul, tag, dan isi konten catatan secara real-time.
- 🎨 **Tema & Pengaturan Tampilan Baca**: Pilihan mode warna Dark, Light, dan Sepia, penyesuaian ukuran font (`sm`, `base`, `lg`, `xl`), mode font (Sans, Serif, Mono), serta **Mode Fullscreen (Zen Mode)**.
- 📊 **Reading Progress Bar**: Indikator progress membaca di bagian atas halaman saat scrolling dan estimasi waktu baca (`~mnt`).
- 📤 **Export Catatan**: Unduh file kembali sebagai `.md` atau export sebagai dokumen halaman mandiri `.html`.

---

## 🛠️ Tech Stack

- **Core**: React 18 (Vite)
- **Styling**: Tailwind CSS
- **Local Storage**: Dexie.js (IndexedDB wrapper)
- **Markdown Parsing**: `react-markdown`, `remark-gfm`, `rehype-highlight`, `highlight.js`
- **PWA & Offline**: `vite-plugin-pwa`, Workbox
- **Icons**: Lucide React Icons

---

## 🚀 Cara Menjalankan Projek Lokal

1. **Clone repository ini**:
   ```bash
   git clone https://github.com/BieM363/markdown-notes-pwa.git
   cd markdown-notes-pwa
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Jalankan Server Development**:
   ```bash
   npm run dev
   ```

4. **Build Bundle Produksi (Service Worker PWA)**:
   ```bash
   npm run build
   ```

---

## 📁 Struktur Direktori

```
markdown-notes-pwa/
├── index.html
├── package.json
├── vite.config.js
├── postcss.config.js
├── tailwind.config.js
├── public/
│   ├── favicon.svg
│   ├── pwa-192x192.svg
│   └── pwa-512x512.svg
└── src/
    ├── index.css
    ├── main.jsx
    ├── App.jsx
    ├── db/
    │   └── db.js
    └── components/
        ├── Header.jsx
        ├── Sidebar.jsx
        ├── MarkdownReader.jsx
        ├── MarkdownEditor.jsx
        ├── TableOfContents.jsx
        ├── SearchModal.jsx
        ├── ImportModal.jsx
        ├── ThemeSettingsModal.jsx
        ├── ErrorBoundary.jsx
        └── PWAInstallBanner.jsx
```

---

## 📝 Lisensi

MIT License © 2026 BieM363
