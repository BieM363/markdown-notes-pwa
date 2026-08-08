import Dexie from 'dexie';

export const db = new Dexie('ProjectNotesDB');

db.version(1).stores({
  notes: '++id, title, content, folderId, *tags, isPinned, isFavorite, createdAt, updatedAt',
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

// Initial Sample Notes Data
const SAMPLE_NOTES = [
  {
    title: 'Catatan_projek.md',
    folderId: 1,
    tags: ['Dokumentasi', 'PWA', 'React', 'Dexie'],
    isPinned: 1,
    isFavorite: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    content: `# 📖 Dokumentasi & Catatan Projek: Offline-First PWA

Selamat datang di **ProjectNotes PWA**! Aplikasi ini dirancang khusus untuk membaca dan mengelola catatan dokumentasi proyek \`.md\` secara **100% Offline** dengan performa tinggi.

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

Berikut adalah ringkasan perbandingan arsitektur untuk pengembangan aplikasi modern:

| Kriteria | Laravel (Monolith / Blade) | React + Vite (PWA Offline) |
| :--- | :--- | :--- |
| **Penyimpanan Data** | Server Database (MySQL/PostgreSQL) | Browser Storage (IndexedDB / Dexie.js) |
| **Dukungan Offline** | Terbatas / Perlu caching khusus | **100% Native Offline-First** |
| **Kecepatan Rendering** | Server-Side Rendering (SSR) | Client-Side Rendering (CSR) Instant |
| **Pengalaman Pengguna** | Page Reload / Inertia.js | SPA Instant State & Micro-animations |
| **Deploy Target** | VPS / Shared Hosting / Cloud Run | Vercel / Netlify / GitHub Pages |

---

## 💻 Contoh Kode Syntax Highlighting

### Initializing Dexie Database (JavaScript)
\`\`\`javascript
import Dexie from 'dexie';

export const db = new Dexie('ProjectNotesDB');

db.version(1).stores({
  notes: '++id, title, content, folderId, *tags, isPinned, isFavorite, createdAt, updatedAt',
  folders: '++id, name, color, icon, createdAt'
});

// Melakukan query catatan secara offline
export async function getPinnedNotes() {
  return await db.notes.where('isPinned').equals(1).toArray();
}
\`\`\`

### React Markdown Hook Usage
\`\`\`jsx
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

export function NoteViewer({ content }) {
  return (
    <article class="markdown-body">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
        {content}
      </ReactMarkdown>
    </article>
  );
}
\`\`\`

---

## 📝 Checklist Rencana Pengembangan

- [x] Merancang skema database IndexedDB dengan Dexie.js
- [x] Konfigurasi Vite PWA Service Worker & Workbox caching
- [x] Parsing Markdown dengan syntax highlighting & copy code button
- [x] Fitur Auto Table of Contents (TOC) & Search modal
- [x] Pengaturan tema Dark, Light, & Sepia mode

---

> 💡 **Tip Portofolio**: Aplikasi PWA ini membuktikan penguasaan teknik *progressive web app*, *service worker offline caching*, dan penyimpanan *IndexedDB* tanpa ketergantungan pada API backend external.
`
  },
  {
    title: 'PWA_Service_Worker_Guide.md',
    folderId: 2,
    tags: ['PWA', 'Workbox', 'Service Worker'],
    isPinned: 0,
    isFavorite: 1,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    content: `# 🚀 Panduan Service Worker & Offline Caching Strategy

Service Worker adalah script yang berjalan di background browser secara terpisah dari halaman web utama, memungkinkan fitur seperti offline access, push notifications, dan background sync.

## 🛠️ Strategi Caching Workbox

1. **Stale-While-Revalidate**: Menyajikan data dari cache terlebih dahulu untuk kecepatan instant, kemudian memperbarui cache di background jika online.
2. **Cache First**: Mengambil asset static (gambar, font, css bundle) langsung dari cache tanpa menyentuh jaringan.
3. **Network First**: Mencoba mengambil data terbaru dari jaringan terlebih dahulu, jika gagal (offline) maka menggunakan fallback cache.

## 📦 Web App Manifest

File \`manifest.webmanifest\` mendefinisikan bagaimana aplikasi PWA ditampilkan saat di-install di Desktop atau HP:

\`\`\`json
{
  "name": "ProjectNotes - Offline Markdown Reader",
  "short_name": "ProjectNotes",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#4f46e5"
}
\`\`\`
`
  },
  {
    title: 'React_Vite_Tailwind_Tips.md',
    folderId: 3,
    tags: ['React', 'Vite', 'Tailwind'],
    isPinned: 0,
    isFavorite: 0,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
    content: `# ⚡ Tips Optimasi Performa React + Vite + Tailwind

Beberapa praktik terbaik untuk memastikan aplikasi React berjalan sangat cepat dan responsif:

- **Component-Driven Development**: Pecah UI menjadi komponen independen yang reusable.
- **Tailwind CSS Utility Classes**: Gunakan sistem warna HSL dan konsisten pada dark mode.
- **Dexie Live Query**: Gunakan hook \`useLiveQuery\` dari Dexie untuk update UI otomatis saat IndexedDB berubah tanpa re-render manual.
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
    }
  } catch (err) {
    console.warn('Seeding Dexie data error:', err);
  }
}
