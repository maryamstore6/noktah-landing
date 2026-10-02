# TAHAP 2 — ARAH DESAIN & ANIMASI BRAND

Status: **DISETUJUI** (2 Okt 2026)
Repo: `maryamstore6/noktah-landing` · Branch: `cinematic-upgrade`
Live: https://loan.noktahgroup.my/ (belum tersentuh)

Semua rekomendasi diterima. Tiga keputusan di bawah mengikat untuk Tahap 3.

---

## 1. Keputusan #1 — Logo

**Masalah yang ditemukan (terverifikasi baca pixel langsung):**

| | Warna |
|---|---|
| Logo Noktah (`logo-sm.png`) | hitam `#000000` + merah `#e50003`, alpha 46% transparan |
| Palet situs | navy `#1f1346` + gold `#ffcd35` |

Merah `#e50003` tidak ada di palet situs. Sekarang logo tampil dalam kotak putih
di header navy → 4 warna brand bertabrakan (hitam, merah, navy, gold).

**Keputusan: Opsi 1 — versi monokrom.**

- Header (di atas navy) → logo monokrom putih/gold, dirender sebagai SVG inline
- Favicon, `apple-touch-icon`, dokumen → logo asli tetap dipakai
- **Logo brand tidak diubah.** Hanya varian tampilan yang ditambah.

Alasan: mengubah logo = mengubah identitas brand, di luar lingkup pekerjaan ini.

---

## 2. Keputusan #2 — Hijau CTA

**Masalah:** putih di atas `#25D366` = **1.98:1**. WCAG AA butuh 4.5:1. Ini CTA
utama dan satu-satunya elemen yang gagal.

| Hijau | vs putih | Verdict |
|---|---|---|
| `#25D366` (sekarang) | 1.98 | FAIL |
| `#128C7E` | 4.14 | masih gagal |
| **`#0E7A6B`** | **5.23** | **PASS — DIPILIH** |
| `#0B6B4F` | 6.50 | PASS |
| `#075E54` (WhatsApp resmi) | 7.67 | PASS |

**Keputusan: `#0E7A6B`** (hover: lebih gelap). Lolos AA, masih dikenali sebagai
hijau WhatsApp.

Alternatif yang ditolak: teks navy di atas hijau WhatsApp (8.54 PASS) — tombolnya
jadi tidak lagi terbaca sebagai tombol WhatsApp.

---

## 3. Keputusan #3 — Intensitas Animasi

**Keputusan: Level B.**

| | Isi | Berat |
|---|---|---|
| A | Logo intro + titik progress | ~5KB |
| **B** | A + aliran titik hero + divider | **~12KB** |
| C | B + titik ikut kursor | ~20KB |

Level C ditolak: risiko norak + berat di mobile, dan user minta "tak perlu berat".

---

## 4. Konsep kreatif — "Noktah bukan noktah"

Asalnya dari brand sendiri:

- **"Noktah"** = *titik* dalam bahasa Melayu
- **Tagline** = "Loan Ditolak Bank **Bukan Pengakhiran**"
- "Noktah" juga bermakna *titik akhir / penghabisan*

→ **Sebuah titik yang muncul, lalu bergerak maju — tidak berhenti sebagai titik
akhir.** Persis pesan halaman: penolakan itu titik, bukan noktah.

**4 elemen (semua SVG + transform; tanpa WebGL, tanpa canvas berat):**

1. **Logo intro saat load** — satu titik emas muncul di tengah → memanjang jadi
   garis → mengungkap wordmark NOKTAH (~1.5s). Menggantikan preloader angka.
2. **Aliran titik di hero** — ~40 titik halus bergerak kiri→kanan di belakang
   teks. GPU-composited.
3. **Divider antar section** — garis dengan satu titik yang berjalan ikut scroll.
4. **Indikator progress** — titik bergerak, menggantikan progress bar.

---

## 5. Sistem motion (tanpa tambahan berat)

| Komponen | Sumber | Berat |
|---|---|---|
| Smooth scroll + ScrollTrigger | Lenis + GSAP (sudah ada) | 63KB gzip |
| Counter 4 metrik | GSAP, ~1KB | ~1KB |
| Titik + divider + logo intro | SVG + CSS transform | ~12KB |
| **Total tambahan** | | **~13KB gzip** |

Halaman tetap di bawah 80KB gzip.

---

## 6. Yang tidak berubah

- Tipografi: Oswald (heading) + DM Sans (body)
- Palet navy/gold sebagai warna utama
- Meta Pixel `1632732818271693` + noscript
- 5 link WhatsApp + event `Lead` `trackWA()`
- `CNAME`, favicon, `robots.txt`, `sitemap.xml`, JSON-LD
- Seluruh blok kepatuhan (Terma Pinjaman, disclaimer, jawaban FAQ)

---

## 7. Bahasa

User minta **campur Inggeris + Melayu**.

**Keputusan: copy website saja** (heading, badge, CTA, kartu). Cara balas dalam
chat kekal seperti biasa.

**Keputusan H1: KEKAL ASAL** — "Loan Ditolak Bank / Bukan Pengakhiran."
H1 kemungkinan cocok dengan creative iklan yang sedang jalan, dan Meta memberi
reward untuk message match. Mengubahnya berisiko menurunkan CTR.

### Gaya campur yang dipakai (dikoreksi)

Draft awal saya mengusulkan judul section jadi **Inggeris penuh** — itu keliru.
Audiens halaman ini penutur Melayu yang datang dari iklan Meta berbahasa Melayu;
judul Inggeris penuh akan menurunkan kefahaman dan kepercayaan.

Gaya yang benar (dan yang dipakai iklan Malaysia sungguh-sungguh): **struktur
ayat Melayu + istilah Inggeris yang memang dipakai orang Malaysia** —
loan, bank, apply, check, free, reply, eligible, clients, offer.

Contoh: "Kami Semak Dahulu" → **"Kami Check Dulu"** (bukan "We Check First").

**Blok kepatuhan tetap tepat dan tidak boleh dipermainkan** — Terma Pinjaman,
disclaimer, jawapan FAQ soal yuran/AKPK/kelulusan. Ayat hukum kena presisi.

---

## 8. Copy — keputusan final

**Prinsip:** struktur ayat Melayu + istilah Inggeris yang memang dipakai orang
Malaysia. Bukan ayat Inggeris. Audiens datang dari iklan Meta berbahasa Melayu.

**H1: KEKAL ASAL** — "Loan Ditolak Bank / Bukan Pengakhiran."

### Yang diubah

| Elemen | Baru |
|---|---|
| Badge | `🎁 FREE Consultation — Khas Untuk Yang Pernah Loan Ditolak Bank` |
| Sub | `FREE consultation — kami check semula kelayakan anda, cari punca penolakan, dan pilih bank yang paling sesuai. No upfront charge, no pressure.` |
| CTA | `WhatsApp Now — FREE` |
| cta-note | `Usually reply dalam beberapa minit (Isnin–Jumaat, 9am–5pm)` |
| Trust 1–4 | `Free consultation` · `No upfront charge` · `Pay only if approved` · `Honest feedback` |
| PAIN H2 | `Kenapa Bank Reject Loan Anda?` |
| PAIN kartu 2 | `Komitmen Terlalu Tinggi (DSR)` |
| BEZANYA H2 | `Kami Check Dulu — Bukan Apply Membabi Buta` |
| PERKHIDMATAN H2 | `Apa Yang Kami Offer` |
| KELAYAKAN H2 | `Siapa Boleh Apply?` |
| LANGKAH H2 | `Cara Ia Berfungsi — 3 Langkah Mudah` |
| TESTIMONI H2 | `Apa Kata Clients Kami?` |
| FAQ H2 | `FAQ — Soalan Lazim` |
| CTA akhir H2 | `Satu Rejection Bukan Penghujung. FREE Check Hari Ini.` |

### Yang tidak disentuh (ayat hukum kena presisi)

- Seluruh blok **Terma Pinjaman** (RM400,000 · 4–18% · 10 tahun · yuran selepas lulus)
- Seluruh **disclaimer** footer & kotak warn kelayakan
- **Jawapan FAQ** soal yuran, AKPK, jaminan lulus, dokumen
- Istilah teknikal: CCRIS/CTOS, SAA, AKPK, DSR
- Nama produk, harga, nombor WhatsApp, alamat

### Penyesuaian pada wireframe Tahap 1

Counter metrik diletak **sebelum** Terma Pinjaman, bukan selepas. Kalau selepas,
angkanya menduplikasi Terma persis. Susunan jadi: counter = ringkasan sekilas →
Terma = butiran sah. Jumlah section tetap 16.

---

## 9. Kriteria selesai

- [ ] Logo monokrom di header, logo asli tetap di favicon
- [ ] CTA hijau `#0E7A6B`, kontras ≥ 4.5:1 terverifikasi
- [ ] Animasi level B saja (tanpa elemen kursor)
- [ ] Tambahan berat ≤ 15KB gzip
- [ ] Counter 4 metrik beranimasi saat masuk viewport
- [ ] Blok kepatuhan utuh kata-per-kata
- [ ] 5 link WhatsApp + 5 event `Lead` utuh
- [ ] 0 error JS · reveal 100% saat scroll cepat · terbaca tanpa JS
