# 🔗 MerakitZAM Short Link

MerakitZAM Short2 (Linkz) adalah URL Shortener versi kedua dari proyek [MerakitZAM Shortener].
Dibangun dengan HTML + CSS + JavaScript + Google Apps Script + Google Sheets sebagai backend database.

👉 Domain: https://linkz.merakitzam.my.id


---

✨ Fitur Utama

🔗 Short Link Generator → buat link pendek yang mudah diingat.

👁 Link Preview → sebelum redirect ke URL tujuan, user akan melihat halaman preview + countdown 3 detik.

📊 Click Analytics → jumlah klik tiap link tercatat otomatis di Google Sheets.

🛠 Admin Dashboard → CRUD sederhana:

Lihat daftar link yang tersimpan

Hapus link

Monitoring klik


🔑 Secret Key Authentication → akses dashboard admin hanya dengan secret key valid.



---

🛠️ Teknologi yang Dipakai

Frontend:

HTML, CSS, JavaScript (Vanilla)

SweetAlert2 (popup interaktif)


Backend:

Google Apps Script (API)

Google Sheets (sebagai database link + analytics)


Hosting:

GitHub Pages / Vercel

Custom Domain linkz.merakitzam.my.id




---

📂 Struktur Project

/ (root project)
├── index.html        # Halaman utama (input shortener)
├── preview.html      # Halaman preview + redirect countdown
├── admin.html        # Dashboard CRUD untuk admin
├── script.js         # Script frontend
├── style.css         # Styling utama
├── appscript.gs      # Backend (Google Apps Script)
├── README.md         # Dokumentasi project


---

⚡ Cara Setup

1. Clone Repository

git clone https://github.com/username/linkz-merakitzam.git
cd linkz-merakitzam


2. Siapkan Google Sheets

Buat file baru di Google Sheets

Buat kolom: shortCode | originalURL | clicks | createdAt



3. Deploy Google Apps Script

Buka Extensions → Apps Script dari Sheet

Paste kode appscript.gs

Deploy sebagai Web App → atur permission Anyone with link



4. Konfigurasi Frontend

Update API_URL di script.js sesuai URL Web App yang sudah di-deploy

Update SECRET_KEY di admin.html



5. Hosting

Deploy ke GitHub Pages / Vercel

Pasang custom domain linkz.merakitzam.my.id





---

🚀 Penggunaan

Buka https://linkz.merakitzam.my.id

Masukkan URL panjang → hasilkan short link otomatis

Bagikan short link tersebut

Saat dikunjungi → tampil halaman preview lalu auto-redirect ke tujuan



---

🔐 Admin Dashboard

Buka https://domainmu.com/path

Masukkan secret key

Bisa:

Lihat list semua short link

Delete link yang tidak dipakai

Lihat jumlah klik dari tiap link




---

📊 Analytics

Setiap kali link dikunjungi → clicks di Sheets akan bertambah 1.

Bisa dipakai buat tracking performa link.



---

👨‍💻 Author

Project ini dibuat oleh ZAM ZAM ✨
Sebagai bagian dari brand MerakitZAM.
