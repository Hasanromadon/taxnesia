# 🧾 Taxnesia AI — Asisten Pajak Digital

**Taxnesia** adalah chatbot AI berbasis web yang membantu pengguna memahami perpajakan di Indonesia seperti PPN, PPh, faktur pajak, dan lainnya. Pengguna juga dapat mengunggah gambar dokumen pajak (seperti invoice atau bukti potong) untuk dianalisis oleh AI menggunakan teknologi Google Gemini.

---

## 🚀 Fitur Utama

- 💬 Chat interaktif seputar perpajakan
- 🖼️ Upload gambar untuk analisis dokumen pajak
- 🧠 Deteksi konteks dengan kata kunci pajak
- 📚 Jawaban mencakup referensi, contoh, dan regulasi
- 💾 Topik Populer
- 🎨 UI modern menggunakan Tailwind CSS dan Framer Motion

## 🖼️ Tampilan Antarmuka

Berikut adalah cuplikan tampilan aplikasi Taxnesia:

![Cuplikan Antarmuka](public/taxnesia-preview.png)

---

## ⚙️ Instalasi Lokal

### 1. Clone Repositori

```bash
git clone https://github.com/hasanromadon/taxnesia.git
cd taxnesia
```

### 2. Instal Dependensi

```bash
npm install
# atau
yarn install
```

### 3. Konfigurasi Environment

Buat file `.env.local` di root proyek dan isi dengan:

```env
GEMINI_API_KEY=your_google_gemini_api_key
```

> 🔐 Anda bisa mendapatkan API key dari [Google AI Studio](https://aistudio.google.com/app/apikey)

---

## 🧪 Menjalankan Proyek

```bash
npm run dev
# atau
yarn dev
```

Aplikasi akan tersedia di:

```
http://localhost:3000
```

---

## 📁 Struktur Proyek

```
taxnesia/
├── app/                    # Halaman & API routes
│   └── api/
│       └── gemini/         # Endpoint analisis AI
├── components/             # Komponen UI & chat
│   └── chat/
├── constants/              # Kata kunci, topik, instruksi
├── lib/                    # Fungsi pendukung
├── public/                 # Gambar statis
├── styles/                 # Tailwind CSS
├── .env.local              # File konfigurasi API
├── next.config.js          # Konfigurasi Next.js
└── README.md               # Dokumentasi
```

---

## 🧠 Teknologi yang Digunakan

- **Next.js 14** — framework React modern
- **Tailwind CSS** — utility-first styling
- **Framer Motion** — animasi halus
- **Google Gemini API** — model AI generatif multimodal
- **React Hook Form** — manajemen form
- **Lucide Icons** — ikon open-source

---

## 📝 Lisensi

Proyek ini dilisensikan dengan MIT License.  
© 2025 [Hasan Romadon](https://github.com/hasanromadon)

---

## 🤝 Kontribusi

Pull request sangat disambut!  
Silakan fork dan kirimkan perubahan Anda.

---

## 📬 Kontak

📧 Email: hsanromadon@gmail.com  
🌐 Website: [hasanrom.com](https://hasanrom.com)
