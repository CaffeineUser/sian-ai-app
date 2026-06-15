# 📋 Product Requirements Document (PRD)
# SianAI — Cultural-Commerce AI Platform for UMKM Ulos Batak

---

> **Version:** 2.0.0
> **Status:** Ready for Development
> **Author:** Product Team — SianAI
> **Tech Stack:** React.js · Node.js · PostgreSQL (Supabase) · OpenAI GPT-4o-mini · Google Cloud Vision
> **Tanggal Revisi:** Juni 2026
> **Target Rilis MVP:** Q3 2026

---

## Daftar Isi

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Product Goals](#3-product-goals)
4. [Target Users](#4-target-users)
5. [User Journey](#5-user-journey)
6. [MVP Scope](#6-mvp-scope)
7. [Functional Requirements](#7-functional-requirements)
8. [Front-End Requirements](#8-front-end-requirements)
9. [Back-End Requirements](#9-back-end-requirements)
10. [Database Design](#10-database-design)
11. [AI Requirements](#11-ai-requirements)
12. [Non-Functional Requirements](#12-non-functional-requirements)
13. [System Workflow](#13-system-workflow)
14. [Acceptance Criteria](#14-acceptance-criteria)
15. [Development Roadmap](#15-development-roadmap)

---

## 1. Executive Summary

### 1.1 Ringkasan Produk

**SianAI** adalah platform *Cultural-Commerce AI* yang dirancang khusus untuk merevolusi tata kelola keuangan pelaku UMKM Wastra — dengan fokus utama pada pedagang kain **Ulos Batak** di Sumatera Utara. Platform ini menggabungkan kecerdasan buatan dengan kearifan lokal budaya Batak untuk menghadirkan solusi manajemen keuangan yang benar-benar zero-friction bagi pedagang mikro.

Nama "Sian" berasal dari bahasa Batak Toba yang berarti *"dari"* — menyimbolkan produk yang lahir dari, untuk, dan bersama komunitas Batak Ulos.

### 1.2 Value Proposition

| Pilar | Proposisi Nilai | Differensiasi |
|-------|----------------|---------------|
| **Zero Friction Input** | Foto nota = pembukuan selesai dalam <8 detik | Tidak ada kompetitor lokal dengan OCR + AI entity extraction untuk UMKM mikro |
| **Cultural Intelligence** | Prediksi kas berbasis Kalender Adat Batak yang nyata | Satu-satunya platform yang mengintegrasikan musim adat sebagai variabel forecasting |
| **Prescriptive Action** | AI tidak hanya melapor, tapi merekomendasikan & mengeksekusi | Dari insight ke action dalam satu aplikasi |
| **Cultural AI Assistant** | Chatbot yang paham konteks Ulos dan adat Batak | Knowledge base adat Batak yang tervalidasi budayawan |

### 1.3 Masalah Utama yang Diselesaikan

1. **Kebocoran kas tidak terdeteksi** — 80% UMKM belum mencatat pengeluaran secara digital
2. **Blind spot musiman** — Pedagang tidak memiliki alat prediksi kas berbasis kalender adat
3. **Modal terbekukan di dead-stock** — Ulos premium tidak terjual mengakibatkan krisis likuiditas
4. **Beban operasional one-man show** — Pemilik merangkap penenun, CS, dan akuntan sekaligus

### 1.4 Solusi yang Ditawarkan

```
Masalah                          Solusi SianAI
─────────────────────────────────────────────────────────
Pencatatan manual melelahkan  →  OCR Scanner (Foto → Data)
Tidak tahu prediksi kas       →  Adat Seasonality Forecaster
Modal macet di dead-stock     →  Capital Optimization Assistant
Tidak bisa buat konten promo  →  AI Caption & Sales Assistant
Tidak paham konteks adat      →  RAG Chatbot Budaya Batak
```

---

## 2. Problem Statement

### 2.1 Latar Belakang Masalah

Industri kain Ulos Batak merupakan warisan budaya yang memiliki nilai ekonomi signifikan namun menghadapi tekanan modernisasi tanpa dukungan infrastruktur digital yang memadai. Berdasarkan data Kemenkop UKM 2024, **lebih dari 80% UMKM Indonesia belum terdigitalisasi** dalam aspek keuangan. Di kalangan pedagang Ulos, kondisi ini diperparah oleh:

- Siklus permintaan yang sangat fluktuatif mengikuti kalender adat Batak
- Tingginya biaya modal untuk kain premium (Ulos Ragidup bisa mencapai Rp 3–15 juta/lembar)
- Rata-rata usia pedagang senior yang tidak terbiasa dengan aplikasi keuangan konvensional

### 2.2 Pain Points Pengguna

| # | Pain Point | Frekuensi | Dampak Finansial |
|---|-----------|-----------|-----------------|
| 1 | Lupa mencatat transaksi kecil (pembelian benang, ongkos kirim) | Harian | Kebocoran Rp 200rb–500rb/bulan |
| 2 | Tidak tahu kapan harus stok bahan sebelum musim pesta | Bulanan | Kehilangan omset 30–60% di peak season |
| 3 | Modal Rp 5–20 juta terkunci di kain premium tidak terjual | 3–6 Bulanan | Krisis likuiditas operasional |
| 4 | Harus buat caption promosi sendiri yang sering salah konteks adat | Mingguan | Reputasi dan kepercayaan pembeli turun |
| 5 | Tidak bisa menjawab pertanyaan teknis pembeli soal Ulos | Harian | Kehilangan closing penjualan |

### 2.3 Dampak Masalah

```
[Dampak Jangka Pendek]
• Arus kas harian tidak terpantau → Keputusan bisnis berdasarkan perkiraan
• Pengeluaran tidak terdokumentasi → Tidak bisa mengajukan kredit UMKM

[Dampak Jangka Menengah]
• Dead-stock menumpuk → Capital stagnation selama 3–6 bulan
• Tidak ada prediksi → Kehabisan stok di peak season

[Dampak Jangka Panjang]
• Bisnis tidak berkembang secara sistematis
• Generasi muda tidak mau meneruskan usaha yang "ribet"
• Warisan budaya Ulos terancam karena bisnis tidak viable
```

### 2.4 Urgensi Penyelesaian

- **Musim Pesta Batak (Apr–Jul)** adalah periode emas yang jika terlewat tidak bisa digantikan
- Kompetitor e-commerce (Tokopedia, Shopee) mulai merambah pasar Ulos dengan seller onboarding yang lebih mudah
- Generasi muda pewaris usaha membutuhkan tools yang modern untuk mau meneruskan bisnis keluarga

---

## 3. Product Goals

### 3.1 Business Goals

| # | Goal | Target Terukur | Timeline |
|---|------|---------------|---------|
| BG-01 | Akuisisi pengguna di pasar utama | 500 MAU di Sumut | 6 bulan post-launch |
| BG-02 | Membuktikan product-market fit | Retention Rate Day-30 ≥ 40% | 3 bulan post-launch |
| BG-03 | Membangun moat data lokal | 10.000+ transaksi OCR tersimpan | 6 bulan post-launch |
| BG-04 | Monetisasi via subscription | Konversi 20% ke paid plan | 9 bulan post-launch |
| BG-05 | Kemitraan strategis | 2+ MoU dengan komunitas pedagang Ulos | 6 bulan post-launch |

### 3.2 User Goals

| # | Goal | Metrik Sukses |
|---|------|--------------|
| UG-01 | Mencatat semua transaksi tanpa usaha ekstra | ≥20 transaksi OCR/user/bulan |
| UG-02 | Mengetahui prediksi kas sebelum musim ramai | Early warning diterima ≥14 hari sebelum peak |
| UG-03 | Mencairkan modal yang terkunci di dead-stock | Dead-stock liquidation rate meningkat 25% |
| UG-04 | Mendapat konten promosi dalam hitungan detik | Caption dihasilkan <10 detik, adoption rate ≥60% |
| UG-05 | Menghemat waktu operasional minimal 2 jam/minggu | User self-reported time savings survey |

### 3.3 Product Goals

| # | Goal | Kriteria |
|---|------|---------|
| PG-01 | OCR Accuracy | ≥85% akurasi pada kondisi cahaya normal |
| PG-02 | Performance | API response ≤500ms, OCR ≤8 detik |
| PG-03 | Usability | Alur utama selesai dalam ≤3 tap/klik |
| PG-04 | Reliability | Uptime ≥99.5% |
| PG-05 | Cultural Accuracy | RAG chatbot akurasi konteks adat ≥90% |

### 3.4 Success Metrics (KPI)

#### Product KPIs

| KPI | Baseline | Target 3 Bulan | Target 6 Bulan |
|-----|----------|---------------|----------------|
| Monthly Active Users (MAU) | 0 | 100 | 500 |
| Daily Active Users (DAU) | 0 | 30 | 150 |
| Transaksi OCR per user/bulan | 0 | ≥20 | ≥50 |
| Retention Rate (Day-30) | 0% | ≥35% | ≥50% |
| OCR Accuracy Rate | — | ≥85% | ≥90% |
| NPS Score | — | ≥40 | ≥55 |

#### Business KPIs

| KPI | Target |
|-----|--------|
| Customer Acquisition Cost (CAC) | <Rp 50.000/user |
| Lifetime Value (LTV) to CAC Ratio | ≥3:1 |
| Dead-stock liquidation improvement | +25% bagi pengguna aktif |
| User-reported time savings | ≥2 jam/minggu |

---

## 4. Target Users

### 4.1 Primary Users

**Pedagang Ulos Aktif (Usia 30–55 tahun)**
- Mengelola toko fisik di pasar tradisional atau rumahan
- Melakukan transaksi campuran (tunai, transfer, QRIS)
- Membutuhkan tools pencatatan yang tidak memerlukan pelatihan panjang
- Dominan pengguna Android mid-range

### 4.2 Secondary Users

**Generasi Muda Pewaris Usaha (Usia 18–30 tahun)**
- Membantu orang tua mengelola akun media sosial toko
- Early adopter teknologi, terbiasa dengan aplikasi mobile
- Kebutuhan utama: tools konten digital yang cepat dan relevan budaya

**Penenun Ulos Semi-Independen**
- Menjual langsung ke konsumen, bukan hanya ke pedagang
- Mengelola inventaris produksi sendiri
- Membutuhkan tools inventory + pemasaran sekaligus

### 4.3 User Personas

#### Persona 1 — Ito Rina (Primary User — Pedagang Aktif)

| Atribut | Detail |
|---------|--------|
| **Usia & Lokasi** | 35 tahun, Pasar Sambu Medan |
| **Pekerjaan Harian** | Menenun, melayani pembeli via WA, mengurus pembukuan manual di buku tulis |
| **Perangkat** | Samsung Galaxy A-series (Android 12) |
| **Koneksi** | 4G Telkomsel, kadang terbatas saat di pasar |
| **Pain Points Utama** | Lupa mencatat pengeluaran kecil, tidak tahu kapan harus stok bahan, sering kehabisan kas di musim pesta |
| **Goals** | Tahu sisa uang kas harian tanpa repot hitung manual; dapat peringatan sebelum musim ramai |
| **Tech Savviness** | Bisa pakai WA & Instagram, tidak terbiasa dengan aplikasi keuangan |
| **Kutipan** | *"Saya mau yang mudah. Foto terus simpan, sudah."* |
| **Skenario Penggunaan** | Setelah transaksi, langsung foto nota; cek dashboard sebelum tidur; terima notifikasi early warning |

#### Persona 2 — Bapak Simbolon (Secondary User — Pedagang Grosir Senior)

| Atribut | Detail |
|---------|--------|
| **Usia & Lokasi** | 52 tahun, Pematang Siantar |
| **Pekerjaan Harian** | Mengelola 3 penenun lepas, fokus penjualan grosir ke hotel & event organizer |
| **Perangkat** | Oppo A-series, lebih sering pakai laptop anaknya |
| **Pain Points Utama** | Modal Rp 20+ juta terkunci di stok Ulos Ragidup premium, tidak bisa prediksi order |
| **Goals** | Memutar modal lebih cepat, menghindari dead-stock, dapat rekomendasi harga yang aman |
| **Tech Savviness** | Sangat rendah — butuh antarmuka yang sangat sederhana dan instruksi dalam Bahasa Indonesia |
| **Kutipan** | *"Kalau bisa tahu 2 bulan ke depan ramai atau sepi, saya bisa atur modal lebih baik."* |

#### Persona 3 — Silvia Hutasoit (Tertiary User — Generasi Muda)

| Atribut | Detail |
|---------|--------|
| **Usia & Lokasi** | 24 tahun, Medan |
| **Pekerjaan Harian** | Mengelola Instagram & TikTok toko ibunya, membantu penjualan online |
| **Perangkat** | iPhone 14 (iOS) & MacBook |
| **Pain Points Utama** | Kesulitan membuat caption yang akurat soal makna adat Ulos; sering ragu tentang kecocokan Ulos untuk upacara tertentu |
| **Goals** | Konten promosi cepat, akurat, dan relevan budaya dalam hitungan detik |
| **Tech Savviness** | Sangat tinggi — early adopter, paham tools digital |
| **Kutipan** | *"Kalau ada AI yang paham adat Batak dan bisa bikin caption, itu game changer."* |

### 4.4 Kebutuhan Utama Pengguna

| Kebutuhan | Prioritas | Solusi SianAI |
|-----------|-----------|---------------|
| Pencatatan tanpa mengetik | KRITIS | Smart OCR Scanner |
| Prediksi kas musiman | KRITIS | Adat Seasonality Forecaster |
| Manajemen inventaris sederhana | TINGGI | Inventory Dashboard |
| Rekomendasi likuidasi dead-stock | TINGGI | Capital Optimization Assistant |
| Pembuatan konten promosi cepat | SEDANG | AI Caption Generator |
| Jawaban otomatis pertanyaan adat | SEDANG | RAG Chatbot |
| Laporan keuangan exportable | RENDAH | Report Export (Phase 2) |

---

## 5. User Journey

### 5.1 Journey 1: Onboarding (First-Time User)

```
[TAHAP 1: DISCOVERY]
Pedagang mendengar SianAI dari komunitas pasar / media sosial
        ↓ Pain point: Tidak tahu apakah ini mudah digunakan
[TAHAP 2: REGISTRASI]
Download / buka PWA → Isi form registrasi sederhana (nama, no. HP, nama toko)
        ↓ Pain point: Form yang panjang dan rumit akan menggugurkan user
[TAHAP 3: ONBOARDING TOUR]
Guided tour 3 langkah: (1) Cara foto nota (2) Dashboard (3) Prediksi kas
        ↓ Pain point: Tidak paham fungsi fitur
[TAHAP 4: FIRST VALUE]
Langsung coba OCR → Lihat data terektrak → "Oh, semudah ini!"
        ↓ Solusi: Aha-moment dalam <5 menit pertama
[TAHAP 5: HABIT FORMATION]
Push notifikasi harian ringan → Early warning → Membangun kebiasaan cek app
```

**Pain points yang diselesaikan:**
- Form registrasi hanya 4 field wajib (nama, nomor HP, nama toko, password)
- Onboarding tour dengan demo interaktif, bukan teks panjang
- First OCR berhasil dalam waktu <2 menit dari registrasi

### 5.2 Journey 2: Pencatatan Transaksi Harian (Core Loop)

```
[TRIGGER]
Transaksi terjadi (beli bahan / terima pembayaran)
        ↓
[AKSI]
Buka SianAI → Tap tombol "📷 Foto Nota" (1 tap dari mana saja)
        ↓
[PROSES AI]
Foto diambil → Upload ke server → OCR Processing → Entity Extraction
        ↓ Waktu: ≤8 detik
[REVIEW]
Pratinjau data: Tanggal / Item / Nominal / Kategori → Edit jika salah
        ↓
[KONFIRMASI]
Tap "Simpan" → Data masuk ke database → Dashboard terupdate real-time
        ↓
[FEEDBACK]
Toast: "✅ Transaksi Rp 350.000 berhasil dicatat" → User kembali ke aktivitas
```

**Total waktu interaksi: <60 detik dari foto hingga data tersimpan**

### 5.3 Journey 3: Menerima Early Warning (Proactive AI)

```
[TRIGGER OTOMATIS — Sistem]
Cron job berjalan setiap hari pukul 08:00 WIB
        ↓
Sistem menghitung: Saldo saat ini vs Kebutuhan modal rata-rata
        ↓
Sistem memeriksa: Kalender Adat Batak — apakah peak season dalam 30 hari?
        ↓
IF (prediksi_saldo < 30% kebutuhan_modal) AND (peak_season_dalam_30_hari)
        ↓
[NOTIFIKASI PUSH]
"⚠️ Peringatan: 21 hari lagi memasuki Musim Puncak Pesta (Ulaon Unjuk).
 Saldo prediksi Anda mungkin tidak cukup untuk stok bahan."
        ↓
[USER ACTION]
User buka notifikasi → Masuk ke halaman Forecast → Lihat grafik + rekomendasi
        ↓
User buka halaman Dead-Stock → Eksekusi likuidasi → Modal cair
```

### 5.4 Journey 4: Likuidasi Dead-Stock

```
[DISCOVERY]
Notifikasi mingguan: "🔴 3 item Ulos sudah >90 hari tidak terjual.
 Modal tertahan: Rp 8.500.000"
        ↓
[ANALISIS]
User buka halaman Inventaris → Filter "Dead-Stock"
Sistem tampilkan: Item / Usia Stok / Modal Tertahan / Rekomendasi
        ↓
[REKOMENDASI AI]
"Ulos Sadum Besar (2 lembar) — Diskon aman: 18% (jual Rp 615.000/lembar)
 Bundling saran: Paket Ulos Pengantin (Sadum + Runjat) untuk musim pernikahan"
        ↓
[EKSEKUSI]
User tap "Generate Caption Promosi" → AI buat caption siap posting
User tap "Salin" → Paste ke WhatsApp/Instagram
```

### 5.5 Journey 5: Tanya Jawab Adat dengan AI (Sales Assistant)

```
[SKENARIO]
Pembeli tanya via WA: "Kak, untuk adat pernikahan Batak mana yang cocok,
Ulos Sadum atau Ragidup?"
        ↓
[AKSI PENJUAL]
Buka SianAI → Tap menu "AI Advisor" → Ketik atau paste pertanyaan
        ↓
[AI PROCESS]
Sistem query pgvector (RAG) → Retrieve chunks relevan dari knowledge base
→ LLM generate jawaban kontekstual
        ↓ Waktu: ≤5 detik
[RESPONS]
"Untuk prosesi Mangulosi dalam pernikahan adat Batak, Ulos Ragidup adalah
 pilihan utama karena maknanya sebagai 'penuh keberuntungan sejak lahir'.
 Ulos Sadum lebih cocok untuk hagabeon (kebahagiaan saat usia lanjut)..."
        ↓
[DISTRIBUSI]
User tap "Salin" → Kirim ke pembeli di WhatsApp
```

---

## 6. MVP Scope

### 6.1 Fitur yang Wajib Ada pada MVP (Phase 1)

| # | Fitur | Prioritas | Alasan Masuk MVP |
|---|-------|-----------|----------------|
| F-01 | Registrasi & Login (JWT Auth) | 🔴 High | Fondasi keamanan data |
| F-02 | Smart OCR Scanner (Foto Nota) | 🔴 High | Core value proposition #1 |
| F-03 | Manual Transaction Input | 🔴 High | Fallback jika OCR gagal |
| F-04 | Dashboard Keuangan (Income/Expense) | 🔴 High | Visibilitas data harian |
| F-05 | Adat Seasonality Cash-Flow Forecaster | 🔴 High | Core value proposition #2 |
| F-06 | Early Warning Notification | 🔴 High | Aksi proaktif berbasis prediksi |
| F-07 | Inventory Management (Basic CRUD) | 🟡 Medium | Basis untuk dead-stock detection |
| F-08 | Dead-Stock Detection & Alert | 🟡 Medium | Core value proposition #3 |

### 6.2 Fitur yang Tidak Termasuk MVP

| # | Fitur | Alasan Ditunda | Target Phase |
|---|-------|---------------|-------------|
| F-09 | RAG Chatbot Adat Batak | Butuh ingestion knowledge base ≥50 dokumen | Phase 2 |
| F-10 | AI Caption Generator | Bergantung pada RAG system | Phase 2 |
| F-11 | Dead-Stock Bundling Recommendation | Kompleksitas algoritma tinggi | Phase 2 |
| F-12 | Export Laporan PDF/Excel | Nice-to-have, tidak kritikal | Phase 2 |
| F-13 | Integrasi WhatsApp Business API | Butuh approval Meta API | Phase 3 |
| F-14 | PWA Offline Mode | Infrastruktur service worker kompleks | Phase 3 |
| F-15 | Laporan Pajak Otomatis | Regulasi perlu dicek dengan konsultan | Phase 3 |
| F-16 | Multi-user / Toko Management | Kompleksitas authorization tinggi | Phase 3 |

### 6.3 Prioritas Fitur

| Prioritas | Fitur |
|-----------|-------|
| 🔴 **High** | Auth, OCR Scanner, Transaction CRUD, Dashboard, Forecaster, Early Warning |
| 🟡 **Medium** | Inventory Management, Dead-Stock Detection, Manual Transaction Input |
| 🟢 **Low** | Profile Management, Notification Settings, Data Export |

---

## 7. Functional Requirements

### Feature 1 — Autentikasi & Manajemen Akun

**Tujuan Fitur:** Memberikan akses aman dan personal kepada setiap pedagang, memastikan data bisnis terisolasi per pengguna.

**User Stories:**

| ID | Sebagai... | Saya ingin... | Agar... |
|----|-----------|--------------|---------|
| US-001 | Pedagang baru | Mendaftar dengan nomor HP dan nama toko | Mulai menggunakan aplikasi tanpa perlu email |
| US-002 | Pedagang terdaftar | Login dengan nomor HP dan password | Mengakses data keuangan saya yang aman |
| US-003 | Pedagang aktif | Memperbarui profil toko saya | Informasi toko tetap akurat |
| US-004 | Pedagang yang lupa password | Reset password via OTP ke nomor HP | Tetap bisa mengakses akun |

**Acceptance Criteria:**

| # | Kriteria | Status |
|---|---------|--------|
| AC-001 | Registrasi selesai dalam ≤4 field wajib: nama, no. HP, nama toko, password | Must Pass |
| AC-002 | Password minimum 8 karakter, wajib mengandung angka | Must Pass |
| AC-003 | JWT token expire dalam 24 jam, refresh token expire dalam 7 hari | Must Pass |
| AC-004 | OTP reset password valid selama 5 menit, hanya boleh 3x percobaan | Must Pass |
| AC-005 | Data user yang sama tidak boleh terdaftar dua kali (berdasarkan nomor HP) | Must Pass |

**Business Rules:**
- Satu nomor HP = satu akun
- Password tidak boleh sama dengan nomor HP
- Akun yang tidak aktif 12 bulan akan mendapat notifikasi re-engagement

---

### Feature 2 — Smart OCR Scanner

**Tujuan Fitur:** Menghilangkan kebutuhan entri manual dengan mengkonversi foto nota/kwitansi menjadi data transaksi terstruktur secara otomatis.

**User Stories:**

| ID | Sebagai... | Saya ingin... | Agar... |
|----|-----------|--------------|---------|
| US-005 | Pedagang | Mengambil foto nota pembelian benang langsung dari kamera | Data pengeluaran tercatat tanpa mengetik |
| US-006 | Pedagang | Melihat pratinjau data yang diekstrak AI sebelum disimpan | Bisa mengoreksi jika ada kesalahan |
| US-007 | Pedagang | Upload foto bukti transfer bank | Pemasukan terupdate di dashboard |
| US-008 | Pedagang | Mengedit field hasil OCR yang salah | Data tetap akurat meski OCR kurang sempurna |

**Acceptance Criteria:**

| # | Kriteria | Status |
|---|---------|--------|
| AC-006 | Sistem membaca foto nota dengan akurasi ≥85% pada kondisi cahaya normal | Must Pass |
| AC-007 | Data yang diekstrak meliputi: tanggal, nama_barang, total_nominal, kategori | Must Pass |
| AC-008 | Proses OCR selesai dalam ≤8 detik pada koneksi 4G | Must Pass |
| AC-009 | Pengguna dapat mengedit semua field hasil ekstraksi sebelum konfirmasi | Must Pass |
| AC-010 | Gambar dikompresi ke maks. 1MB sebelum upload (hemat bandwidth) | Must Pass |
| AC-011 | File yang diperbolehkan: JPG, PNG, HEIC. Maksimum 5MB sebelum kompresi | Must Pass |
| AC-012 | Jika OCR confidence <70%, sistem meminta user untuk mengedit manual | Must Pass |

**Business Rules:**
- Foto nota disimpan di private Supabase Storage (tidak bisa diakses publik)
- Retensi foto nota: 90 hari, lalu otomatis dihapus (kecuali user opt-in simpan permanen)
- Satu proses OCR = satu transaksi; jika nota berisi beberapa item, di-split per item

**Dependency:** Feature ini bergantung pada Google Cloud Vision API dan OpenAI GPT-4o-mini

---

### Feature 3 — Manual Transaction Input

**Tujuan Fitur:** Memberikan alternatif pencatatan transaksi ketika foto tidak memungkinkan (transaksi lisan, kondisi gelap, dll).

**User Stories:**

| ID | Sebagai... | Saya ingin... | Agar... |
|----|-----------|--------------|---------|
| US-009 | Pedagang | Menginput transaksi secara manual | Tetap bisa mencatat meski tidak ada nota |
| US-010 | Pedagang | Memilih kategori transaksi dari dropdown | Tidak perlu mengetik kategori dari awal |
| US-011 | Pedagang | Melihat dan menghapus transaksi yang salah input | Data keuangan tetap bersih |

**Acceptance Criteria:**

| # | Kriteria | Status |
|---|---------|--------|
| AC-013 | Form input memiliki field: tipe (income/expense), nominal, kategori, tanggal, keterangan | Must Pass |
| AC-014 | Kategori tersedia: Benang, Kain Bahan, Logistik, Sewa Tempat, Penjualan, Lainnya | Must Pass |
| AC-015 | Validasi real-time: nominal hanya angka, tanggal tidak boleh masa depan | Must Pass |
| AC-016 | User bisa edit dan hapus transaksi dalam 24 jam setelah input | Must Pass |

---

### Feature 4 — Dashboard Keuangan

**Tujuan Fitur:** Memberikan visibilitas real-time kondisi keuangan bisnis dalam satu tampilan yang mudah dipahami tanpa pengetahuan akuntansi.

**User Stories:**

| ID | Sebagai... | Saya ingin... | Agar... |
|----|-----------|--------------|---------|
| US-012 | Pedagang | Melihat saldo kas hari ini di dashboard | Tahu kondisi finansial tanpa hitung manual |
| US-013 | Pedagang | Melihat ringkasan income vs expense bulan ini | Paham apakah bisnis sedang untung atau buntung |
| US-014 | Pedagang | Melihat grafik arus kas 30 hari terakhir | Memahami tren keuangan bisnis saya |
| US-015 | Pedagang | Melihat transaksi terbaru | Memastikan semua sudah tercatat |

**Acceptance Criteria:**

| # | Kriteria | Status |
|---|---------|--------|
| AC-017 | Dashboard menampilkan: Saldo kas, Total pemasukan bulan ini, Total pengeluaran bulan ini | Must Pass |
| AC-018 | Grafik arus kas interaktif (bar/line chart) dengan filter: 7 hari / 30 hari / 3 bulan | Must Pass |
| AC-019 | Daftar 5 transaksi terbaru tampil di dashboard | Must Pass |
| AC-020 | Data dashboard terupdate real-time setelah transaksi baru disimpan | Must Pass |
| AC-021 | Tampilkan badge "Musim Adat" saat ini (misal: "🎭 Musim Puncak Pesta") | Must Pass |

---

### Feature 5 — Adat Seasonality Cash-Flow Forecaster

**Tujuan Fitur:** Memprediksi arus kas 30 hari ke depan dengan mengintegrasikan data historis transaksi dan bobot kalender adat Batak, menghasilkan early warning sebelum krisis kas terjadi.

**User Stories:**

| ID | Sebagai... | Saya ingin... | Agar... |
|----|-----------|--------------|---------|
| US-016 | Pedagang | Melihat grafik prediksi kas 30 hari ke depan | Tahu kapan harus mulai stok bahan |
| US-017 | Pedagang | Menerima notifikasi early warning otomatis | Tidak kehabisan kas saat musim pesta tiba |
| US-018 | Pedagang | Melihat penjelasan alasan di balik prediksi | Memahami konteks budaya yang memengaruhi prediksi |
| US-019 | Pedagang | Melihat rekomendasi tindakan berdasarkan prediksi | Tidak bingung harus berbuat apa |

**Acceptance Criteria:**

| # | Kriteria | Status |
|---|---------|--------|
| AC-022 | Sistem memiliki data Kalender Adat Batak dengan bobot per bulan tersimpan di database | Must Pass |
| AC-023 | Formula prediksi: `predicted_balance = avg_daily_cashflow(30d) × adat_weight × trend_factor` | Must Pass |
| AC-024 | Grafik prediksi menampilkan rentang 30 hari ke depan dengan confidence interval | Must Pass |
| AC-025 | Early warning dipicu otomatis bila predicted_balance <30% dari rata-rata kebutuhan modal | Must Pass |
| AC-026 | Penjelasan prediksi dalam Bahasa Indonesia, maks. 3 kalimat, tidak menggunakan jargon | Must Pass |
| AC-027 | Forecaster membutuhkan minimal 7 hari data historis untuk menghasilkan prediksi | Must Pass |

**Business Rules:**
- Forecaster berjalan ulang setiap hari pukul 00:01 WIB via cron job
- Bobot adat Batak dapat diperbarui oleh admin tanpa deployment ulang (stored in DB)
- Prediksi disimpan per hari per user untuk audit trail

**Kalender Adat Batak (Bobot Pengali):**

| Bulan | Nama Musim | Bobot Permintaan | Keterangan |
|-------|-----------|-----------------|------------|
| Jan | Masa Tenang | 0.7 | Pasca perayaan Natal/Tahun Baru |
| Feb | Pra-Pesta | 0.8 | Persiapan awal musim pesta |
| Mar | Musim Pesta Awal | 1.2 | Pesta pernikahan mulai meningkat |
| Apr | Puncak Pesta I | 1.5 | Musim pernikahan adat tinggi |
| Mei | Musim Pesta Tinggi | 1.4 | Marhaban season |
| Jun | Puncak Pesta II (Sasi Baik) | 1.6 | Peak tertinggi — Ulaon Unjuk |
| Jul | Ulaon Unjuk Puncak | 1.5 | Pesta keluarga besar |
| Agt | Penurunan | 1.1 | Mulai menurun |
| Sep | Masa Sepi | 0.7 | Terendah sepanjang tahun |
| Okt | Pra-Natal | 0.9 | Persiapan Natal |
| Nov | Pesta Akhir Tahun | 1.2 | Pesta dan acara keluarga |
| Des | Natal & Tahun Baru | 1.3 | Permintaan Ulos Natal |

---

### Feature 6 — Inventory Management

**Tujuan Fitur:** Memberikan visibilitas stok kain Ulos yang dimiliki pedagang, termasuk jenis, jumlah, harga, dan status rotasinya.

**User Stories:**

| ID | Sebagai... | Saya ingin... | Agar... |
|----|-----------|--------------|---------|
| US-020 | Pedagang | Menambahkan item Ulos ke inventaris | Semua stok terdaftar dan terpantau |
| US-021 | Pedagang | Memperbarui jumlah stok setelah penjualan | Inventaris selalu akurat |
| US-022 | Pedagang | Melihat total nilai inventaris | Tahu berapa modal yang terikat di stok |
| US-023 | Pedagang | Mendapat alert item yang hampir habis | Tidak kehabisan stok di saat dibutuhkan |

**Acceptance Criteria:**

| # | Kriteria | Status |
|---|---------|--------|
| AC-028 | Form tambah item: nama, jenis Ulos, harga beli, harga jual, jumlah, foto | Must Pass |
| AC-029 | Sistem otomatis menandai `status: dead_stock` jika (hari_ini - tanggal_masuk) >90 hari | Must Pass |
| AC-030 | Dashboard inventaris tampilkan: total item, total nilai, jumlah dead-stock | Must Pass |
| AC-031 | Filter inventaris: semua / aktif / dead-stock / habis | Must Pass |

---

### Feature 7 — Dead-Stock Detection & Capital Optimization

**Tujuan Fitur:** Mendeteksi inventaris yang tidak bergerak lebih dari 90 hari, menghitung risiko finansial, dan merekomendasikan strategi likuiditas yang aman.

**User Stories:**

| ID | Sebagai... | Saya ingin... | Agar... |
|----|-----------|--------------|---------|
| US-024 | Pedagang | Melihat daftar stok yang sudah lama tidak terjual | Tahu modal mana yang sedang macet |
| US-025 | Pedagang | Mendapat rekomendasi batas diskon aman | Tidak salah diskon sampai rugi |
| US-026 | Pedagang | Mendapat laporan modal yang tertahan | Paham dampak finansial dari dead-stock |

**Acceptance Criteria:**

| # | Kriteria | Status |
|---|---------|--------|
| AC-032 | Sistem otomatis flag `dead_stock` jika (tanggal_hari_ini - tanggal_masuk) >90 hari AND quantity >0 | Must Pass |
| AC-033 | Kalkulasi: `locked_capital = harga_beli × jumlah_stok` | Must Pass |
| AC-034 | Kalkulasi diskon aman: `safe_discount_pct = ((harga_jual - min_margin) / harga_jual) × 100` (min_margin = 15%) | Must Pass |
| AC-035 | Push notification dikirim setiap Senin pukul 09:00 WIB untuk dead-stock baru | Must Pass |
| AC-036 | Halaman dead-stock tampilkan: item, usia stok, modal tertahan, % diskon aman | Must Pass |

**Business Rules:**
- Minimum margin yang diproteksi: 15% dari harga beli
- Dead-stock checker berjalan via cron job setiap hari pukul 01:00 WIB
- Notifikasi hanya dikirim jika ada dead-stock baru (tidak dikirim ulang untuk item yang sama)

---

## 8. Front-End Requirements

### 8.1 Halaman-Halaman Aplikasi

| # | Nama Halaman | Tujuan | Komponen UI | Layout | Navigasi | State | Validasi | Responsive | Loading | Empty | Error |
|---|-------------|--------|-------------|--------|----------|-------|---------|-----------|---------|-------|-------|
| P-01 | **Login** | Autentikasi pengguna | Form (nomor HP, password), Button login, Link "Lupa password", Link "Daftar" | Full-page centered card | → Dashboard (sukses), → OTP Reset (lupa password) | form state, loading state, error state | HP: 10-13 digit angka; password: min 8 char | Fullscreen mobile-first | Spinner pada button | — | Toast merah "Nomor HP atau password salah" |
| P-02 | **Registrasi** | Buat akun baru | Form 4 field, Progress indicator, Terms checkbox | Full-page stepper | → Dashboard (sukses), ← Login | form state, step state | HP unik, nama min 3 char, password konfirmasi harus sama | Fullscreen mobile-first | Spinner pada button | — | Inline field error, Toast "Nomor sudah terdaftar" |
| P-03 | **Dashboard** | Ringkasan keuangan harian | Kartu saldo, Kartu income/expense, Grafik arus kas, Daftar transaksi terbaru, Badge musim adat, FAB foto nota | Bottom navigation + Header | → OCR via FAB, → Halaman lain via nav | cashData, recentTx, forecastAlert | — | Responsive grid (1 col mobile, 2 col tablet) | Skeleton loading untuk setiap kartu | Empty state "Belum ada transaksi. Foto nota pertama Anda!" | Toast merah "Gagal memuat data. Coba lagi." |
| P-04 | **OCR Scanner** | Foto & proses nota | Kamera live / Upload picker, Preview gambar, Panel hasil ekstraksi (editable), Tombol Simpan / Ulangi | Full-screen bottom sheet | → Dashboard (simpan), ← (batal) | imageFile, ocrResult, isProcessing, editedFields | Semua field hasil OCR dapat diedit; nominal hanya angka | Mobile-only primary (tablet: modal) | Full-screen loading overlay "Memproses nota Anda..." | — | "OCR gagal. Silakan input manual." + redirect ke form manual |
| P-05 | **Tambah Transaksi Manual** | Input transaksi tanpa foto | Form: tipe, nominal, kategori, tanggal, keterangan | Modal bottom sheet | → Dashboard (simpan), ← (batal) | formState, isSubmitting | Nominal wajib diisi, tanggal tidak boleh future | Mobile-first | Spinner pada button Simpan | — | "Gagal menyimpan. Periksa koneksi internet." |
| P-06 | **Daftar Transaksi** | Lihat semua transaksi | Search bar, Filter (tipe/kategori/tanggal), List transaksi dengan swipe-to-delete | Single column list | → Detail Transaksi, ← Dashboard | filters, txList, pagination | — | Fullscreen list | Skeleton list item (3 item placeholder) | "Belum ada transaksi yang dicatat" + icon | "Gagal memuat transaksi" + tombol Refresh |
| P-07 | **Forecast & Early Warning** | Prediksi kas 30 hari | Banner musim adat, Grafik prediksi (line chart), Kartu early warning, Penjelasan AI | Single scroll page | ← Dashboard | forecastData, earlyWarning | — | Grafik responsif (full-width) | Skeleton grafik + kartu | "Data belum cukup untuk prediksi (min. 7 hari)" | "Prediksi gagal dimuat. Coba lagi." |
| P-08 | **Inventaris** | Kelola stok Ulos | Search + Filter bar, Grid/list item, FAB tambah item, Badge dead-stock | Grid 2 kolom (mobile) | → Detail Item, → Tambah Item via FAB | inventoryList, filters | — | Responsive grid | Skeleton grid item | "Stok inventaris kosong. Tambah item pertama!" | "Gagal memuat inventaris." |
| P-09 | **Tambah/Edit Item Inventaris** | CRUD item stok | Form: nama, jenis Ulos, harga beli, harga jual, qty, foto, deskripsi | Scroll form page | → Inventaris (simpan), ← (batal) | formState, isSubmitting, imageFile | Semua field wajib kecuali foto & deskripsi; harga jual harus ≥ harga beli | Mobile-first fullscreen | Spinner saat submit | — | Inline error per field |
| P-10 | **Dead-Stock** | Lihat & kelola stok macet | Summary card (total modal tertahan), List dead-stock items, Tombol per item: "Lihat Rekomendasi" | Single scroll page | ← Inventaris, → Rekomendasi Likuidasi | deadStockList, isLoading | — | Fullscreen list | Skeleton list | "Tidak ada dead-stock. Inventaris Anda sehat! 🎉" | "Gagal memuat data dead-stock." |
| P-11 | **Profil & Pengaturan** | Kelola akun & preferensi | Avatar, Nama toko, Info akun, Pengaturan notifikasi, Tombol Logout | Single scroll page | ← Navigasi bawah | userProfile, notifSettings | — | Mobile-first | Skeleton profil | — | "Gagal memuat profil." |

### 8.2 Komponen Global

| Komponen | Deskripsi | Digunakan di |
|----------|-----------|-------------|
| `<BottomNavBar>` | Navigasi 4 tab: Dashboard, Transaksi, Inventaris, Profil | Semua halaman utama |
| `<FABButton>` | Floating action button foto nota (primary action) | Dashboard, Transaksi |
| `<ToastNotification>` | Notifikasi sukses/error sementara (3 detik) | Seluruh aplikasi |
| `<SkeletonLoader>` | Placeholder saat data loading | Semua halaman dengan data |
| `<EmptyState>` | Tampilan saat data kosong, dengan CTA | Semua halaman list/grid |
| `<ErrorBanner>` | Banner merah saat error koneksi | Semua halaman |
| `<AdatSeasonBadge>` | Badge musim adat saat ini dengan warna dinamis | Dashboard, Forecast |
| `<ConfirmDialog>` | Dialog konfirmasi untuk aksi destruktif | Delete transaksi, Delete item |

---

## 9. Back-End Requirements

### 9.1 Auth Service

| # | Endpoint | Method | Request Payload | Response | Validasi | Auth | Error Handling |
|---|---------|--------|----------------|----------|---------|------|---------------|
| API-01 | `/api/v1/auth/register` | `POST` | `{ name, phone, store_name, password }` | `{ success, data: { user, token } }` | Phone unik, password min 8 char | Public | 400 Validation Error, 409 Phone Exists |
| API-02 | `/api/v1/auth/login` | `POST` | `{ phone, password }` | `{ success, data: { user, accessToken, refreshToken } }` | Phone format valid | Public | 401 Invalid Credentials, 429 Too Many Attempts |
| API-03 | `/api/v1/auth/logout` | `POST` | `{}` | `{ success }` | — | JWT Required | 401 Unauthorized |
| API-04 | `/api/v1/auth/me` | `GET` | — | `{ success, data: user }` | — | JWT Required | 401 Unauthorized |
| API-05 | `/api/v1/auth/profile` | `PUT` | `{ name?, store_name?, store_address?, avatar_url? }` | `{ success, data: user }` | Optional fields validated | JWT Required | 400 Validation Error |

### 9.2 Bookkeeping Service (OCR & Transactions)

| # | Endpoint | Method | Request Payload | Response | Validasi | Auth | Error Handling |
|---|---------|--------|----------------|----------|---------|------|---------------|
| API-06 | `/api/v1/bookkeeping/ocr` | `POST` | `multipart/form-data: { file, type: "income\|expense" }` | `{ success, data: { extracted: {...}, raw_text, image_url, confidence } }` | MIME: JPG/PNG/HEIC, max 5MB | JWT Required | 400 Invalid File, 422 OCR Failed, 503 AI Service Down |
| API-07 | `/api/v1/bookkeeping/transactions` | `POST` | `{ type, amount, category, description, transaction_date, receipt_url?, ocr_raw_text?, ocr_confidence? }` | `{ success, data: transaction }` | amount >0, type valid, date not future | JWT Required | 400 Validation Error |
| API-08 | `/api/v1/bookkeeping/transactions` | `GET` | `?type=&category=&start_date=&end_date=&page=&limit=` | `{ success, data: { transactions, pagination } }` | Query params validated | JWT Required | 400 Invalid Params |
| API-09 | `/api/v1/bookkeeping/transactions/:id` | `PUT` | `{ type?, amount?, category?, description?, transaction_date? }` | `{ success, data: transaction }` | Hanya field yang diubah | JWT Required, Owner | 403 Forbidden, 404 Not Found |
| API-10 | `/api/v1/bookkeeping/transactions/:id` | `DELETE` | — | `{ success }` | — | JWT Required, Owner | 403 Forbidden, 404 Not Found |
| API-11 | `/api/v1/bookkeeping/summary` | `GET` | `?period=monthly&month=&year=` | `{ success, data: { total_income, total_expense, net_balance, by_category } }` | Period valid | JWT Required | 400 Invalid Period |

### 9.3 Finance Service (Forecasting)

| # | Endpoint | Method | Request Payload | Response | Validasi | Auth | Error Handling |
|---|---------|--------|----------------|----------|---------|------|---------------|
| API-12 | `/api/v1/finance/forecast` | `GET` | — | `{ success, data: { current_balance, forecast_30_days: [...], adat_season: {...}, early_warning: {...} } }` | Min. 7 hari data historis | JWT Required | 422 Insufficient Data |
| API-13 | `/api/v1/finance/cashflow` | `GET` | `?days=30` | `{ success, data: { cashflow: [...] } }` | days: 7/30/90 | JWT Required | 400 Invalid Params |
| API-14 | `/api/v1/finance/dashboard` | `GET` | — | `{ success, data: { balance, income_mtd, expense_mtd, recent_transactions, adat_badge } }` | — | JWT Required | 500 Internal Error |
| API-15 | `/api/v1/finance/alerts` | `GET` | — | `{ success, data: alerts[] }` | — | JWT Required | 500 Internal Error |

### 9.4 Inventory Service

| # | Endpoint | Method | Request Payload | Response | Validasi | Auth | Error Handling |
|---|---------|--------|----------------|----------|---------|------|---------------|
| API-16 | `/api/v1/inventory/items` | `POST` | `{ name, ulos_type, cost_price, selling_price, quantity, unit?, image_url?, description? }` | `{ success, data: item }` | selling_price ≥ cost_price, qty ≥ 0 | JWT Required | 400 Validation Error |
| API-17 | `/api/v1/inventory/items` | `GET` | `?status=&search=&page=&limit=` | `{ success, data: { items, pagination, summary } }` | status: active/dead_stock/sold | JWT Required | 400 Invalid Params |
| API-18 | `/api/v1/inventory/items/:id` | `PUT` | `{ name?, cost_price?, selling_price?, quantity?, status?, image_url?, description? }` | `{ success, data: item }` | Validasi per field | JWT Required, Owner | 403, 404 |
| API-19 | `/api/v1/inventory/items/:id` | `DELETE` | — | `{ success }` | — | JWT Required, Owner | 403, 404 |
| API-20 | `/api/v1/inventory/dead-stock` | `GET` | — | `{ success, data: { items: [...], total_locked_capital } }` | — | JWT Required | 500 Internal Error |
| API-21 | `/api/v1/inventory/liquidation/:id` | `POST` | — | `{ success, data: { item, safe_discount_pct, safe_price, recommendation_text } }` | Item harus berstatus dead_stock | JWT Required, Owner | 404, 422 Not Dead Stock |

### 9.5 AI Advisor Service (Phase 2)

| # | Endpoint | Method | Request Payload | Response | Validasi | Auth | Error Handling |
|---|---------|--------|----------------|----------|---------|------|---------------|
| API-22 | `/api/v1/advisor/chat` | `POST` | `{ session_id?, message }` | `{ success, data: { session_id, response, context_chunks } }` | message max 500 char | JWT Required | 429 Rate Limit, 503 AI Down |
| API-23 | `/api/v1/advisor/chat/history` | `GET` | `?session_id=` | `{ success, data: { messages: [...] } }` | session_id valid | JWT Required, Owner | 404 Session Not Found |
| API-24 | `/api/v1/advisor/caption` | `POST` | `{ item_id, tone?: "formal\|casual", platform?: "wa\|ig" }` | `{ success, data: { caption, hashtags } }` | item_id valid & milik user | JWT Required | 404, 503 AI Down |
| API-25 | `/api/v1/advisor/recommendations` | `GET` | — | `{ success, data: { stock_recommendations, sales_tips } }` | — | JWT Required | 500 Internal Error |

---

## 10. Database Design

### 10.1 Entity Relationship Diagram

```
users ──────────────────── transactions
  │                            │
  │                      inventory_items
  │                            │
  │                      dead_stock_logs
  │
  ├─── cash_flow_forecasts
  │
  ├─── chat_sessions ──── chat_messages
  │
  └─── push_notification_tokens

adat_calendar (master data, tidak terikat ke user)
knowledge_embeddings (global, untuk RAG)
```

### 10.2 Tabel: `users`

| Field | Tipe Data | Constraint | Keterangan |
|-------|-----------|-----------|------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Identifier unik user |
| `name` | VARCHAR(100) | NOT NULL | Nama lengkap pedagang |
| `phone` | VARCHAR(20) | UNIQUE, NOT NULL | Nomor HP (digunakan sebagai username) |
| `password_hash` | TEXT | NOT NULL | bcrypt hash, cost factor 12 |
| `store_name` | VARCHAR(100) | NOT NULL | Nama toko |
| `store_address` | TEXT | NULLABLE | Alamat toko |
| `role` | VARCHAR(20) | DEFAULT 'seller' | Enum: seller / admin |
| `avatar_url` | TEXT | NULLABLE | URL foto profil di Supabase Storage |
| `fcm_token` | TEXT | NULLABLE | Firebase token untuk push notif |
| `is_active` | BOOLEAN | DEFAULT TRUE | Status akun aktif |
| `last_login_at` | TIMESTAMPTZ | NULLABLE | Timestamp login terakhir |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Waktu registrasi |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Waktu update terakhir |

### 10.3 Tabel: `transactions`

| Field | Tipe Data | Constraint | Keterangan |
|-------|-----------|-----------|------------|
| `id` | UUID | PRIMARY KEY | Identifier transaksi |
| `user_id` | UUID | FK → users(id) ON DELETE CASCADE | Pemilik transaksi |
| `type` | VARCHAR(20) | NOT NULL | Enum: income / expense |
| `category` | VARCHAR(50) | NULLABLE | benang / kain_bahan / logistik / sewa / penjualan / lainnya |
| `amount` | DECIMAL(15,2) | NOT NULL, CHECK >0 | Nominal transaksi dalam Rupiah |
| `description` | TEXT | NULLABLE | Deskripsi bebas |
| `transaction_date` | DATE | NOT NULL | Tanggal transaksi terjadi |
| `receipt_url` | TEXT | NULLABLE | URL foto nota di Supabase Storage |
| `ocr_raw_text` | TEXT | NULLABLE | Output mentah dari Google Vision |
| `ocr_confidence` | DECIMAL(5,4) | NULLABLE, CHECK 0–1 | Skor kepercayaan OCR (0.0000–1.0000) |
| `input_method` | VARCHAR(20) | DEFAULT 'manual' | Enum: ocr / manual |
| `is_verified` | BOOLEAN | DEFAULT FALSE | User sudah konfirmasi data OCR? |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Waktu input |

**Relasi:** `transactions.user_id` → `users.id`

### 10.4 Tabel: `inventory_items`

| Field | Tipe Data | Constraint | Keterangan |
|-------|-----------|-----------|------------|
| `id` | UUID | PRIMARY KEY | Identifier item |
| `user_id` | UUID | FK → users(id) ON DELETE CASCADE | Pemilik item |
| `name` | VARCHAR(200) | NOT NULL | Nama item (misal: "Ulos Ragidup Merah XL") |
| `ulos_type` | VARCHAR(100) | NULLABLE | Sadum / Ragidup / Sibolang / Runjat / Mangiring / dll |
| `cost_price` | DECIMAL(15,2) | NOT NULL | Harga beli/modal |
| `selling_price` | DECIMAL(15,2) | NOT NULL | Harga jual |
| `quantity` | INTEGER | DEFAULT 0, CHECK ≥0 | Jumlah stok |
| `unit` | VARCHAR(20) | DEFAULT 'lembar' | Satuan: lembar / pasang / set |
| `status` | VARCHAR(20) | DEFAULT 'active' | Enum: active / dead_stock / sold |
| `date_added` | DATE | DEFAULT CURRENT_DATE | Tanggal item masuk inventaris |
| `image_url` | TEXT | NULLABLE | URL foto item |
| `description` | TEXT | NULLABLE | Deskripsi motif, ukuran, kualitas |
| `dead_stock_flagged_at` | TIMESTAMPTZ | NULLABLE | Kapan sistem flagging dead-stock |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Waktu dibuat |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Waktu update terakhir |

**Index:** `(user_id, status)`, `(user_id, date_added)`

### 10.5 Tabel: `adat_calendar` (Master Data)

| Field | Tipe Data | Constraint | Keterangan |
|-------|-----------|-----------|------------|
| `id` | UUID | PRIMARY KEY | — |
| `month` | INTEGER | NOT NULL, CHECK 1–12 | Bulan (1=Januari) |
| `season_name` | VARCHAR(100) | NOT NULL | Nama musim adat |
| `demand_weight` | DECIMAL(4,2) | NOT NULL | Bobot pengali permintaan (0.50–2.00) |
| `description` | TEXT | NULLABLE | Penjelasan konteks adat |
| `key_events` | TEXT[] | NULLABLE | Array nama event adat (misal: ["Ulaon Unjuk", "Mangulosi"]) |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Terakhir diperbarui admin |

### 10.6 Tabel: `cash_flow_forecasts`

| Field | Tipe Data | Constraint | Keterangan |
|-------|-----------|-----------|------------|
| `id` | UUID | PRIMARY KEY | — |
| `user_id` | UUID | FK → users(id) ON DELETE CASCADE | Pemilik forecast |
| `forecast_date` | DATE | NOT NULL | Tanggal yang diprediksi |
| `predicted_balance` | DECIMAL(15,2) | NULLABLE | Saldo yang diprediksi |
| `adat_weight` | DECIMAL(4,2) | NULLABLE | Bobot adat yang diaplikasikan |
| `confidence` | DECIMAL(5,4) | NULLABLE | Skor kepercayaan prediksi |
| `early_warning` | BOOLEAN | DEFAULT FALSE | Apakah prediksi memicu early warning? |
| `warning_message` | TEXT | NULLABLE | Pesan peringatan dalam Bahasa Indonesia |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Waktu prediksi dibuat |

**Unique Constraint:** `(user_id, forecast_date)` — satu prediksi per user per hari

### 10.7 Tabel: `dead_stock_logs`

| Field | Tipe Data | Constraint | Keterangan |
|-------|-----------|-----------|------------|
| `id` | UUID | PRIMARY KEY | — |
| `item_id` | UUID | FK → inventory_items(id) ON DELETE CASCADE | Item yang di-flag |
| `user_id` | UUID | FK → users(id) | Pemilik item |
| `flagged_at` | TIMESTAMPTZ | DEFAULT NOW() | Waktu di-flag |
| `days_unsold` | INTEGER | NOT NULL | Berapa hari belum terjual |
| `locked_capital` | DECIMAL(15,2) | NOT NULL | Modal tertahan saat di-flag |
| `safe_discount_pct` | DECIMAL(5,2) | NULLABLE | Persen diskon aman yang direkomendasikan |
| `recommendation_sent` | BOOLEAN | DEFAULT FALSE | Sudah dikirim notifikasi? |

### 10.8 Tabel: `chat_sessions` & `chat_messages` (Phase 2)

**`chat_sessions`**

| Field | Tipe Data | Constraint | Keterangan |
|-------|-----------|-----------|------------|
| `id` | UUID | PRIMARY KEY | — |
| `user_id` | UUID | FK → users(id) ON DELETE CASCADE | Pemilik sesi |
| `title` | VARCHAR(200) | NULLABLE | Judul sesi (auto-generated dari pesan pertama) |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | — |

**`chat_messages`**

| Field | Tipe Data | Constraint | Keterangan |
|-------|-----------|-----------|------------|
| `id` | UUID | PRIMARY KEY | — |
| `session_id` | UUID | FK → chat_sessions(id) ON DELETE CASCADE | Sesi terkait |
| `role` | VARCHAR(20) | NOT NULL | Enum: user / assistant |
| `content` | TEXT | NOT NULL | Isi pesan |
| `metadata` | JSONB | NULLABLE | RAG context chunks, token usage |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | — |

### 10.9 Tabel: `knowledge_embeddings` (Phase 2 — RAG)

| Field | Tipe Data | Constraint | Keterangan |
|-------|-----------|-----------|------------|
| `id` | UUID | PRIMARY KEY | — |
| `content` | TEXT | NOT NULL | Teks dokumen adat |
| `embedding` | VECTOR(1536) | NOT NULL | OpenAI text-embedding-ada-002 |
| `source` | VARCHAR(200) | NULLABLE | Nama dokumen sumber |
| `category` | VARCHAR(50) | NULLABLE | ulos_type / ceremony / tradition / history |
| `metadata` | JSONB | NULLABLE | Informasi tambahan |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | — |

**Index:** `USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100)`

### 10.10 Relasi Antar Tabel (Summary)

| Tabel Induk | Tabel Anak | Tipe Relasi | Foreign Key |
|------------|-----------|------------|-------------|
| `users` | `transactions` | One-to-Many | `transactions.user_id` |
| `users` | `inventory_items` | One-to-Many | `inventory_items.user_id` |
| `users` | `cash_flow_forecasts` | One-to-Many | `cash_flow_forecasts.user_id` |
| `users` | `chat_sessions` | One-to-Many | `chat_sessions.user_id` |
| `chat_sessions` | `chat_messages` | One-to-Many | `chat_messages.session_id` |
| `inventory_items` | `dead_stock_logs` | One-to-Many | `dead_stock_logs.item_id` |

---

## 11. AI Requirements

### 11.1 AI Feature 1: Smart OCR + Entity Extraction

**Tujuan AI:** Mengkonversi foto nota/kwitansi menjadi data transaksi terstruktur secara otomatis, menghilangkan kebutuhan input manual.

| Aspek | Detail |
|-------|--------|
| **Input** | File gambar (JPG/PNG/HEIC, maks 5MB) |
| **Output** | `{ tanggal, nama_barang, total_nominal, kategori, confidence }` |
| **Model yang Digunakan** | Google Cloud Vision API (OCR text extraction) + OpenAI GPT-4o-mini (entity extraction & structuring) |
| **Dataset yang Diperlukan** | Tidak perlu training custom — menggunakan API pre-trained model |

**Workflow AI:**

```
[1. Pre-Processing]
Gambar diterima → Kompresi ke max 1MB → Validasi MIME type
        ↓
[2. OCR Extraction]
Google Cloud Vision API: detectText()
→ Menghasilkan raw_text dari gambar
→ Contoh output: "10 Juni 2025\nBenang Sutra 5 gulung\nRp 350.000"
        ↓
[3. Entity Extraction via LLM]
Prompt ke GPT-4o-mini:
  System: "Extract structured transaction data from this OCR text.
           Output JSON with fields: tanggal, nama_barang, total_nominal,
           kategori (expense/income), confidence (0-1)"
  User: {raw_text}
→ Output JSON terstruktur
        ↓
[4. Confidence Scoring]
IF confidence < 0.70 → Flag untuk review manual user
IF confidence ≥ 0.85 → Tampilkan pratinjau dengan data pre-filled
        ↓
[5. User Confirmation]
User review → Edit jika perlu → Simpan ke database
```

**Evaluasi Performa AI:**

| Metrik | Target | Cara Ukur |
|--------|--------|-----------|
| OCR Accuracy | ≥85% pada cahaya normal | Test dengan 100 foto nota sampel |
| Entity Extraction F1 Score | ≥80% | Bandingkan output vs ground truth manual |
| Processing Time | ≤8 detik (end-to-end) | Monitoring latency per request |
| Cost per OCR | <Rp 50 per foto | Pantau OpenAI + Google Vision billing |

---

### 11.2 AI Feature 2: Adat Seasonality Cash-Flow Forecaster

**Tujuan AI:** Memprediksi arus kas 30 hari ke depan dengan mengintegrasikan tren historis transaksi dan bobot kalender adat Batak.

| Aspek | Detail |
|-------|--------|
| **Input** | Histori transaksi 90 hari terakhir user + tabel `adat_calendar` |
| **Output** | Array 30 prediksi harian: `{ date, predicted_balance, confidence, early_warning }` |
| **Model** | Rule-based time series dengan weighted multiplier (tidak membutuhkan ML training) |
| **Dataset** | Data transaksi user (minimum 7 hari) + Kalender Adat Batak (seeded di database) |

**Workflow AI:**

```
[1. Data Collection]
Ambil semua transaksi user 90 hari terakhir dari PostgreSQL
        ↓
[2. Trend Calculation]
avg_daily_income = SUM(income, last_30_days) / 30
avg_daily_expense = SUM(expense, last_30_days) / 30
avg_daily_net = avg_daily_income - avg_daily_expense
        ↓
[3. Seasonal Weighting]
Untuk setiap hari ke depan (t+1 hingga t+30):
  adat_weight = adat_calendar[month_of_t+n].demand_weight
  trend_factor = calculate_trend(last_7_days) // -1 to +1
  predicted_net = avg_daily_net × adat_weight × (1 + trend_factor × 0.1)
        ↓
[4. Balance Projection]
predicted_balance[t+n] = current_balance + SUM(predicted_net, 1..n)
        ↓
[5. Early Warning Logic]
IF predicted_balance[t+14] < (avg_monthly_expense × 0.3):
  AND adat_calendar[t+14 to t+30].demand_weight > 1.2:
  THEN trigger early_warning = TRUE
        ↓
[6. Natural Language Explanation]
GPT-4o-mini generate: 3 kalimat penjelasan prediksi dalam Bahasa Indonesia
```

**Evaluasi Performa:**

| Metrik | Target |
|--------|--------|
| Forecast Accuracy (MAPE) | <25% deviasi dari aktual (diukur setelah 30 hari) |
| Early Warning Precision | ≥70% warning yang dikirim relevan (tidak false alarm) |
| Early Warning Recall | ≥80% krisis kas sesungguhnya terprediksi |

---

### 11.3 AI Feature 3: RAG Chatbot Adat Batak & Caption Generator (Phase 2)

**Tujuan AI:** Menghadirkan asisten penjualan berbasis AI yang memahami konteks budaya Batak secara akurat untuk menjawab pertanyaan pembeli dan menghasilkan konten promosi.

| Aspek | Detail |
|-------|--------|
| **Input** | Pertanyaan user dalam Bahasa Indonesia / Batak Toba |
| **Output** | Jawaban akurat berbasis knowledge base adat + Caption promosi siap posting |
| **Model** | OpenAI GPT-4o-mini + text-embedding-ada-002 (untuk vector search) |
| **Framework** | LangChain.js (RAG pipeline) + pgvector (vector similarity search) |
| **Dataset** | ≥50 dokumen adat Batak: buku adat Batak, manual jenis Ulos, katalog upacara, wawancara budayawan |

**Workflow RAG Chatbot:**

```
[1. Ingestion (Offline — Admin)]
Kumpulkan ≥50 dokumen adat Batak
→ Chunking: 500 token per chunk, 50 token overlap
→ Embedding: text-embedding-ada-002 → VECTOR(1536)
→ Simpan ke tabel knowledge_embeddings (pgvector)
        ↓
[2. Query Processing (Real-time)]
User kirim pertanyaan
→ Embed pertanyaan → VECTOR(1536)
→ pgvector cosine similarity search: TOP-K (k=5) chunks paling relevan
        ↓
[3. Context Assembly]
Susun prompt:
  System: "Kamu adalah asisten penjualan Ulos Batak yang paham adat.
           Jawab berdasarkan konteks berikut: {retrieved_chunks}
           Jika tidak ada di konteks, katakan 'Saya tidak yakin'."
  User: {pertanyaan}
        ↓
[4. LLM Generation]
GPT-4o-mini generate respons
→ Max 300 token output
→ Bahasa Indonesia (dapat di-toggle ke Batak Toba)
        ↓
[5. Response Delivery]
Kembalikan respons + referensi sumber dokumen
Simpan ke chat_messages (audit trail)
```

**Knowledge Base yang Dibutuhkan:**

| Kategori | Konten | Jumlah Dokumen Target |
|----------|--------|----------------------|
| Jenis Ulos | Sadum, Ragidup, Sibolang, Runjat, Mangiring, dll — makna & penggunaan | 15 dokumen |
| Upacara Adat | Ulaon Unjuk, Mangulosi, Manggabei, dll | 10 dokumen |
| Kalender Adat | Jadwal pesta & maknanya | 5 dokumen |
| Teknik Tenun | Motif, warna simbolik, proses pembuatan | 10 dokumen |
| Panduan Penjualan | FAQ pembeli, cara memilih Ulos yang tepat | 10 dokumen |

**Evaluasi Performa RAG:**

| Metrik | Target | Cara Ukur |
|--------|--------|-----------|
| Retrieval Relevance | ≥85% | Human evaluation pada 100 query sampel |
| Answer Accuracy | ≥90% | Validasi oleh budayawan Batak |
| Latency | ≤5 detik | Monitoring end-to-end response time |
| Hallucination Rate | <5% | Deteksi jawaban yang tidak ada di knowledge base |

---

## 12. Non-Functional Requirements

### 12.1 Security

| Aspek | Requirement | Implementasi |
|-------|------------|-------------|
| Data in Transit | Semua komunikasi terenkripsi | HTTPS/TLS 1.3 wajib; HTTP redirect ke HTTPS |
| Password Storage | Tidak boleh disimpan plain-text | bcrypt dengan cost factor 12 |
| Token Management | JWT tidak boleh disalahgunakan | Access token expire 24 jam; refresh token 7 hari; token di-blacklist saat logout |
| File Upload | Cegah file berbahaya | Validasi MIME type + magic bytes; max 5MB; rename file ke UUID |
| Rate Limiting | Cegah abuse & brute force | 100 req/menit per IP (global); 5 attempt/15 menit untuk login |
| SQL Injection | Cegah injeksi database | Prisma ORM dengan parameterized queries; tidak ada raw SQL dari user input |
| XSS Prevention | Cegah script injection | Input sanitization dengan DOMPurify; Content-Security-Policy header |
| Private Storage | Foto nota tidak bisa diakses publik | Supabase Storage: private bucket; akses via signed URL yang expire 1 jam |
| API Key Management | Kunci AI tidak terekspos | Semua API key hanya di server environment; tidak pernah di frontend |
| Data Privacy | GDPR-aligned | Retensi foto nota 90 hari; pengguna bisa hapus akun + semua data |

### 12.2 Scalability

| Aspek | Requirement | Implementasi |
|-------|------------|-------------|
| Horizontal Scaling | Dapat scale tanpa downtime | Containerisasi dengan Docker; stateless backend |
| Database Connection | Cegah connection pool exhaustion | PgBouncer connection pooling; max 20 connections per service |
| Image Processing | Cegah bottleneck saat banyak OCR request bersamaan | Bull.js queue untuk OCR jobs; worker terpisah dari main API |
| Caching | Kurangi beban database & AI API | Redis (Upstash) untuk: forecast data (cache 1 jam), dashboard aggregates (cache 5 menit) |
| CDN | Asset delivery cepat | Cloudflare CDN untuk static assets React.js |
| Database Index | Query performance | Index pada kolom yang sering di-query: `user_id`, `transaction_date`, `status` |

### 12.3 Availability

| Metrik | Target | Keterangan |
|--------|--------|------------|
| Uptime | ≥99.5% | Setara dengan max downtime ~43 jam/tahun |
| Planned Maintenance | Di luar jam 06:00–22:00 WIB | Maintenance window: 02:00–04:00 WIB |
| Graceful Degradation | Dashboard tetap berfungsi jika AI service down | Tampilkan data statis, sembunyikan fitur AI dengan pesan "Layanan AI sementara tidak tersedia" |
| Backup | Data tidak hilang saat failure | Supabase automated daily backup; point-in-time recovery |

### 12.4 Performance

| Metrik | Target | Cara Ukur |
|--------|--------|-----------|
| API Response Time (P95) | ≤500ms | APM monitoring (Sentry/Datadog) |
| OCR Processing Time | ≤8 detik end-to-end | Custom timer per request |
| Dashboard Load Time (FCP) | ≤2 detik pada 4G | Lighthouse audit |
| Chat Response Time | ≤5 detik | Monitoring AI service latency |
| Image Upload Time | ≤3 detik (1MB, 4G) | Client-side timer |
| Database Query Time | ≤100ms untuk 99% query | pg_stat_statements monitoring |

### 12.5 Maintainability

| Aspek | Requirement |
|-------|------------|
| Code Quality | TypeScript strict mode; ESLint + Prettier; min 70% test coverage pada critical paths |
| Documentation | Semua API endpoint terdokumentasi di Swagger/OpenAPI 3.0 |
| Logging | Winston logger; semua error level ERROR/CRITICAL dikirim ke Sentry |
| Environment Config | Semua konfigurasi via environment variables; tidak ada hardcoded values |
| Database Migrations | Prisma Migrate untuk semua perubahan schema; tidak ada manual SQL di produksi |
| Dependency Management | NPM audit mingguan; update dependency minor otomatis via Dependabot |

### 12.6 Reliability

| Aspek | Requirement |
|-------|------------|
| Error Recovery | Retry logic 3x dengan exponential backoff untuk external API calls (OpenAI, Google Vision) |
| Fallback | Jika OCR gagal → redirect ke form manual input dengan pesan jelas |
| Data Integrity | Database transactions untuk operasi multi-tabel; tidak ada partial write |
| Idempotency | POST endpoints untuk OCR dan simpan transaksi bersifat idempotent (tidak duplikat jika request diulang) |
| Health Check | Endpoint `/health` tersedia untuk monitoring uptime; cek koneksi DB dan external services |

---

## 13. System Workflow

### 13.1 Alur Sistem End-to-End

#### Workflow 1: OCR Transaction Flow

```
┌──────────────┐     HTTPS POST        ┌──────────────────────┐
│              │  ────────────────────▶ │                      │
│   User       │  /api/v1/bookkeeping/  │   API Gateway        │
│  (React.js)  │  ocr                  │   (Node.js/Express)  │
│              │                        │   - JWT Validation   │
└──────────────┘                        │   - Rate Limiting    │
        ▲                               │   - Input Validation │
        │                               └──────────┬───────────┘
        │                                          │
        │                                          ▼
        │                               ┌──────────────────────┐
        │                               │   Multer File Upload │
        │                               │   + Compression      │
        │                               │   (sharp.js)        │
        │                               └──────────┬───────────┘
        │                                          │
        │                                          ▼
        │                               ┌──────────────────────┐
        │                               │  Supabase Storage    │
        │                               │  (Private Bucket)    │
        │                               │  → image_url         │
        │                               └──────────┬───────────┘
        │                                          │
        │                                          ▼
        │                               ┌──────────────────────┐
        │                               │  Google Cloud Vision │
        │                               │  API                 │
        │                               │  → raw_text          │
        │                               └──────────┬───────────┘
        │                                          │
        │                                          ▼
        │                               ┌──────────────────────┐
        │                               │  OpenAI GPT-4o-mini  │
        │                               │  Entity Extraction   │
        │                               │  → structured JSON   │
        │                               └──────────┬───────────┘
        │                                          │
        │  Response: { extracted, confidence }      │
        └──────────────────────────────────────────┘
                    User reviews & confirms
                              │
                              ▼
                   ┌─────────────────────┐
                   │  POST /transactions  │
                   │  PostgreSQL INSERT   │
                   │  Dashboard re-fetch  │
                   └─────────────────────┘
```

#### Workflow 2: Cash-Flow Forecast Flow

```
┌─────────────────┐        ┌───────────────────────────────────────┐
│  Cron Job       │        │          Forecast Engine              │
│  (node-cron)    │        │                                       │
│  Daily 00:01    │──────▶│  1. Fetch transactions (90d) from DB  │
│  WIB            │        │  2. Calculate avg_daily_net            │
└─────────────────┘        │  3. Query adat_calendar for weights   │
                            │  4. Project 30-day balance             │
                            │  5. Apply trend_factor                 │
                            │  6. Check early_warning threshold      │
                            │  7. Generate NL explanation via GPT    │
                            └──────────────┬────────────────────────┘
                                           │
                                           ▼
                               ┌───────────────────────┐
                               │  PostgreSQL INSERT     │
                               │  cash_flow_forecasts   │
                               │  (one row per day)     │
                               └──────────┬────────────┘
                                          │
                            IF early_warning = TRUE
                                          │
                                          ▼
                               ┌───────────────────────┐
                               │  Push Notification    │
                               │  (FCM via Firebase)   │
                               │  → User's Phone       │
                               └───────────────────────┘
```

#### Workflow 3: RAG Chatbot Flow (Phase 2)

```
┌──────────┐   POST /advisor/chat    ┌──────────────────────────────┐
│  User    │ ───────────────────────▶│  API Gateway + Auth          │
└──────────┘                         └──────────────┬───────────────┘
                                                    │
                                                    ▼
                                     ┌──────────────────────────────┐
                                     │  Embedding Service           │
                                     │  OpenAI: text-embedding-002  │
                                     │  Query → VECTOR(1536)        │
                                     └──────────────┬───────────────┘
                                                    │
                                                    ▼
                                     ┌──────────────────────────────┐
                                     │  pgvector Similarity Search  │
                                     │  SELECT TOP-5 chunks         │
                                     │  WHERE cosine_sim > 0.75     │
                                     └──────────────┬───────────────┘
                                                    │
                                                    ▼
                                     ┌──────────────────────────────┐
                                     │  LangChain.js RAG Pipeline   │
                                     │  Prompt Assembly:            │
                                     │  [System] + [Context] +      │
                                     │  [Chat History] + [Query]    │
                                     └──────────────┬───────────────┘
                                                    │
                                                    ▼
                                     ┌──────────────────────────────┐
                                     │  OpenAI GPT-4o-mini          │
                                     │  Generate Response           │
                                     │  Max 300 tokens              │
                                     └──────────────┬───────────────┘
                                                    │
                                                    ▼
                                     ┌──────────────────────────────┐
                                     │  Save to chat_messages (DB)  │
                                     │  Return response to user     │
                                     └──────────────────────────────┘
```

#### Workflow 4: Dead-Stock Detection Flow

```
┌─────────────────┐
│  Cron Job       │
│  Daily 01:00    │
│  WIB            │
└────────┬────────┘
         │
         ▼
┌────────────────────────────────────────────────────────────┐
│  Dead-Stock Checker                                        │
│                                                            │
│  SELECT * FROM inventory_items                            │
│  WHERE (CURRENT_DATE - date_added) > 90                   │
│    AND quantity > 0                                        │
│    AND status != 'sold'                                    │
│    AND status != 'dead_stock'  -- belum pernah di-flag    │
│                                                            │
│  FOR EACH item:                                           │
│    UPDATE status = 'dead_stock'                           │
│    SET dead_stock_flagged_at = NOW()                      │
│    INSERT INTO dead_stock_logs (locked_capital, ...)      │
│    Calculate safe_discount_pct                            │
└─────────────────────────────┬──────────────────────────────┘
                              │
                 IF new dead_stock items found
                              │
                              ▼
                 ┌────────────────────────┐
                 │  Push Notification     │
                 │  (Senin 09:00 WIB)    │
                 │  "3 item Ulos belum   │
                 │   terjual >90 hari.   │
                 │   Modal tertahan:     │
                 │   Rp 8.500.000"       │
                 └────────────────────────┘
```

---

## 14. Acceptance Criteria

### 14.1 System-Level Acceptance Criteria

Produk dinyatakan siap rilis MVP jika **seluruh** kriteria berikut terpenuhi:

#### Authentication & Security

| # | Kriteria | Priority |
|---|---------|---------|
| SYS-01 | Registrasi dan login berfungsi dengan validasi yang benar | BLOCKER |
| SYS-02 | JWT authentication berjalan pada semua protected endpoints | BLOCKER |
| SYS-03 | Rate limiting aktif dan mengembalikan 429 jika exceeded | BLOCKER |
| SYS-04 | File upload menolak file selain JPG/PNG/HEIC | BLOCKER |
| SYS-05 | Password tersimpan dalam bentuk bcrypt hash, tidak plain-text | BLOCKER |

#### OCR & Transactions

| # | Kriteria | Priority |
|---|---------|---------|
| SYS-06 | OCR mengekstrak data dari foto nota dengan akurasi ≥85% pada sampel 20 foto test | BLOCKER |
| SYS-07 | OCR selesai dalam ≤8 detik pada koneksi 4G standar | BLOCKER |
| SYS-08 | Pengguna dapat mengedit semua field hasil OCR sebelum menyimpan | BLOCKER |
| SYS-09 | Transaksi CRUD (Create, Read, Update, Delete) berfungsi penuh | BLOCKER |
| SYS-10 | Dashboard terupdate real-time setelah transaksi baru disimpan (tanpa refresh manual) | HIGH |

#### Forecasting & Early Warning

| # | Kriteria | Priority |
|---|---------|---------|
| SYS-11 | Forecast 30 hari terbuat berdasarkan histori transaksi user | BLOCKER |
| SYS-12 | Kalender Adat Batak terseed di database dengan 12 baris data tervalidasi | BLOCKER |
| SYS-13 | Early warning terpicu otomatis saat kondisi threshold terpenuhi | BLOCKER |
| SYS-14 | Push notification berhasil dikirim ke device pengguna | HIGH |

#### Inventory & Dead-Stock

| # | Kriteria | Priority |
|---|---------|---------|
| SYS-15 | CRUD inventaris berfungsi penuh dengan validasi harga | HIGH |
| SYS-16 | Dead-stock detection berjalan otomatis via cron job | HIGH |
| SYS-17 | Kalkulasi safe_discount_pct akurat berdasarkan formula yang ditentukan | HIGH |

#### Performance & Non-Functional

| # | Kriteria | Priority |
|---|---------|---------|
| SYS-18 | API response time P95 ≤500ms pada beban normal | HIGH |
| SYS-19 | Dashboard Load Time ≤2 detik diukur via Lighthouse | HIGH |
| SYS-20 | Aplikasi berfungsi normal pada layar mobile 375px hingga desktop 1440px | HIGH |
| SYS-21 | Semua halaman memiliki loading state, empty state, dan error state | HIGH |
| SYS-22 | Endpoint `/health` merespons `200 OK` saat semua service berjalan | MEDIUM |

#### Quality & UX

| # | Kriteria | Priority |
|---|---------|---------|
| SYS-23 | Tidak ada critical bug (crash atau data corruption) pada 100 run test session | BLOCKER |
| SYS-24 | Alur utama (registrasi → foto nota → simpan) dapat diselesaikan dalam ≤5 menit oleh pengguna baru | HIGH |
| SYS-25 | Semua teks UI dalam Bahasa Indonesia yang benar | MEDIUM |
| SYS-26 | Antarmuka memenuhi WCAG AA untuk kontras warna | MEDIUM |

---

## 15. Development Roadmap

### 15.1 Phase 1 — MVP Foundation (Minggu 1–4)

| Minggu | Task | PIC | Priority | Deliverable |
|--------|------|-----|---------|------------|
| Week 1 | Setup project monorepo (Frontend + Backend) | Full-stack Dev | BLOCKER | Repo terstruktur, CI/CD pipeline aktif |
| Week 1 | Database schema + migrations (Prisma) | Backend Dev | BLOCKER | Schema terdeploy di Supabase |
| Week 1 | Authentication system (Register, Login, JWT) | Backend Dev | BLOCKER | Auth API berfungsi + unit tests |
| Week 1 | Design system + komponen dasar (React) | Frontend Dev | HIGH | Figma handoff → komponen siap pakai |
| Week 2 | Google Vision API integration | Backend Dev | BLOCKER | OCR endpoint berfungsi |
| Week 2 | OpenAI entity extraction integration | Backend/AI Dev | BLOCKER | OCR + entity extraction pipeline |
| Week 2 | OCR UI (kamera + upload + preview) | Frontend Dev | BLOCKER | Halaman OCR Scanner berfungsi |
| Week 3 | Transaction CRUD API | Backend Dev | BLOCKER | Semua endpoint transaksi berfungsi |
| Week 3 | Dashboard UI + Halaman Transaksi | Frontend Dev | BLOCKER | Dashboard lengkap dengan data nyata |
| Week 3 | Finance dashboard aggregation endpoint | Backend Dev | HIGH | Endpoint `/finance/dashboard` berfungsi |
| Week 4 | Adat Seasonality Forecaster (rule-based) | Backend/AI Dev | BLOCKER | Algoritma forecast + seeding kalender adat |
| Week 4 | Early warning notification system | Backend Dev | HIGH | Cron job + push notif via FCM |
| Week 4 | Forecast UI (grafik + early warning banner) | Frontend Dev | HIGH | Halaman Forecast berfungsi |
| Week 4 | QA Testing + Bug fixing (Phase 1) | QA Engineer | BLOCKER | Zero critical bugs |

### 15.2 Phase 2 — Intelligence Layer (Minggu 5–8)

| Minggu | Task | PIC | Priority | Deliverable |
|--------|------|-----|---------|------------|
| Week 5 | Inventory Management CRUD (API + UI) | Full-stack Dev | HIGH | CRUD inventaris berfungsi |
| Week 5 | Dead-stock detection algorithm + cron job | Backend Dev | HIGH | Auto-flagging dead-stock |
| Week 5 | Dead-stock UI + liquidation recommendation | Frontend Dev | HIGH | Halaman Dead-Stock berfungsi |
| Week 6 | Knowledge base ingestion (≥50 dokumen adat) | AI Dev | HIGH | pgvector terisi dengan embeddings |
| Week 6 | RAG pipeline dengan LangChain.js | AI/Backend Dev | HIGH | Chatbot endpoint berfungsi |
| Week 7 | Chatbot UI interface | Frontend Dev | HIGH | Chat interface responsif |
| Week 7 | AI Caption Generator API + UI | AI/Frontend Dev | MEDIUM | Caption generator berfungsi |
| Week 8 | Performance optimization (caching, indexing) | Backend Dev | HIGH | P95 API ≤500ms terpenuhi |
| Week 8 | Integration testing end-to-end | QA Engineer | HIGH | Test report lengkap |
| Week 8 | Security audit (penetration test dasar) | Security/Backend | HIGH | Audit report + remediation |

### 15.3 Phase 3 — Scale-Up & Growth (Minggu 9–12)

| Minggu | Task | PIC | Priority | Deliverable |
|--------|------|-----|---------|------------|
| Week 9 | PWA features + service worker (offline basic) | Frontend Dev | MEDIUM | App installable di Android |
| Week 9 | Export laporan PDF/Excel | Backend/Frontend | MEDIUM | Download laporan berfungsi |
| Week 10 | Analytics dashboard (user behavior) | Full-stack Dev | MEDIUM | Mixpanel/Posthog integration |
| Week 10 | A/B testing framework setup | Frontend Dev | LOW | Eksperimen onboarding flow |
| Week 11 | WhatsApp Business API integration | Backend Dev | LOW | Pesan otomatis via WA (MVP) |
| Week 11 | Multi-language support (Bahasa Batak Toba) | Frontend Dev | LOW | Toggle bahasa di chatbot |
| Week 12 | Production deployment & monitoring setup | DevOps/Backend | BLOCKER | App live di production |
| Week 12 | User acceptance testing dengan 10 pedagang nyata | QA + PM | BLOCKER | UAT report + feedback loop |

### 15.4 Feature Priority Matrix

| Fitur | Business Value | Effort | Phase | Priority Score |
|-------|---------------|--------|-------|---------------|
| Auth System | High | Low | 1 | P0 |
| Smart OCR Scanner | Very High | High | 1 | P0 |
| Dashboard Keuangan | Very High | Medium | 1 | P0 |
| Cash-Flow Forecaster | Very High | Medium | 1 | P0 |
| Early Warning System | High | Medium | 1 | P1 |
| Inventory Management | High | Medium | 2 | P1 |
| Dead-Stock Detection | High | Medium | 2 | P1 |
| RAG Chatbot | High | Very High | 2 | P1 |
| Caption Generator | Medium | High | 2 | P2 |
| Export Laporan | Medium | Low | 3 | P2 |
| PWA Offline | Medium | High | 3 | P2 |
| WhatsApp Integration | Low | Very High | 3 | P3 |
| Laporan Pajak | Low | Very High | 3 | P3 |

---

## Lampiran

### Lampiran A: Glossary

| Istilah | Definisi |
|---------|---------|
| **Ulos** | Kain tenun tradisional suku Batak Toba, digunakan dalam berbagai upacara adat |
| **Ulaon Unjuk** | Pesta adat Batak, biasanya pernikahan; musim permintaan Ulos tertinggi |
| **Mangulosi** | Prosesi adat pemberian Ulos oleh orang tua/mertua kepada anak/menantu |
| **Sasi Baik** | Bulan/periode yang dianggap baik untuk melangsungkan upacara adat |
| **Dead-Stock** | Inventaris yang tidak terjual lebih dari 90 hari sehingga modal tertahan |
| **OCR** | Optical Character Recognition — teknologi membaca teks dari gambar |
| **RAG** | Retrieval-Augmented Generation — teknik AI yang mengambil konteks relevan sebelum generate respons |
| **MVP** | Minimum Viable Product — versi produk dengan fitur paling esensial |
| **MAU** | Monthly Active Users — pengguna aktif dalam 30 hari terakhir |
| **NPS** | Net Promoter Score — metrik kepuasan dan loyalitas pengguna |

### Lampiran B: Risiko & Mitigasi

| Risiko | Dampak | Probabilitas | Strategi Mitigasi |
|--------|--------|-------------|------------------|
| Akurasi OCR rendah untuk tulisan tangan | Tinggi | Sedang | Pre-processing image enhancement + fallback ke manual input + panduan foto in-app |
| Biaya API OpenAI membengkak | Tinggi | Sedang | Aggressive caching di Redis; rate limiting 10 OCR/hari untuk free plan; batching request |
| Adopsi teknologi lambat oleh target user | Tinggi | Tinggi | Video tutorial Bahasa Batak; onboarding di pasar langsung; program referral komunitas |
| Data adat Batak tidak akurat | Sedang | Rendah | Validasi dengan min. 2 budayawan Batak; disclaimer di setiap respons AI; update mechanism |
| Foto nota terlalu gelap/blur | Sedang | Tinggi | Image quality check pre-upload; panduan foto dengan contoh visual; image enhancement |
| Kompetitor besar masuk segmen ini | Tinggi | Rendah | Bangun data moat lokal yang susah disaingi; komunitas pedagang sebagai defensible advantage |
| Downtime AI service (OpenAI/Google) | Sedang | Rendah | Retry logic + exponential backoff; fallback ke manual input; cache forecast terakhir |

### Lampiran C: Asumsi & Keterbatasan

**Asumsi:**
- Pengguna memiliki smartphone dengan kamera ≥8MP
- Koneksi internet minimal 3G untuk upload foto
- Pengguna bersedia memberikan izin kamera dan notifikasi
- UMKM target memiliki minimal 1 rekening bank atau dompet digital

**Keterbatasan Saat Ini:**
- Aplikasi tidak menghitung pajak secara otomatis (perlu konsultasi dengan DJP)
- Forecaster rule-based masih sederhana — tidak menggunakan ML model (akan di-upgrade Phase 3)
- Knowledge base adat Batak perlu validasi manual yang membutuhkan waktu dan biaya

---

*Dokumen ini adalah living document yang diperbarui seiring perkembangan produk dan feedback dari tim.*

*© 2026 SianAI Team. Confidential & Proprietary.*

*Versi: 2.0.0 | Terakhir diperbarui: Juni 2026 | Status: Ready for Development*
