# TAHAP 1 — WIREFRAME: Noktah Landing Page

Status: **DISETUJUI** (2 Okt 2026)
Repo: `maryamstore6/noktah-landing` · Branch kerja: `cinematic-upgrade`
Live: https://loan.noktahgroup.my/ (belum tersentuh)

Tujuan tahap ini: memetakan struktur yang ada, menemukan masalah urutan, dan
menetapkan urutan baru. **Tidak ada file situs yang diubah di tahap ini.**

---

## 1. Struktur saat ini (17 blok)

| # | Blok | Isi |
|---|------|-----|
| 1 | Meta Pixel | script + noscript |
| 2 | Preloader | loader-mark + track + pct |
| 3 | Film texture | grain + vignette + progress bar |
| 4 | Sticky header | logo + "Semak Percuma" |
| 5 | HERO | brand → badge → H1 → sub → CTA WA → cta-note → 4 trust \| hero image |
| 6 | Marquee | 5 item berulang ×2 |
| 7 | PAIN | H2 + sub + 3 kartu + kicker |
| 8 | BEZANYA | H2 + sub + 4 baris list |
| 9 | PERKHIDMATAN | H2 + sub + 3 kartu + blok Terma Pinjaman |
| 10 | KELAYAKAN | H2 + 3 tick + kotak warn |
| 11 | LANGKAH | H2 + sub + 3 step + CTA tengah |
| 12 | TESTIMONI | H2 + sub + 3 kartu |
| 13 | FAQ | H2 + sub + 4 accordion |
| 14 | CTA AKHIR | H2 + p + CTA + jam operasi |
| 15 | Footer | logo + disclaimer + alamat + link |
| 16 | Sticky WA | tombol bulat |
| 17 | Cookie note | notis + tombol "Faham" |

---

## 2. Masalah urutan yang ditemukan

1. **Harga muncul sebelum nilai dijelaskan.** Pembaca tiba di blok Terma
   Pinjaman (sehingga RM400,000 · kadar 4–18% · tempoh 10 tahun) sebelum tahu
   produknya apa. Tidak ada section "apa yang anda dapat" sebelum angka.
2. **Terma Pinjaman terkubur.** Ini blok kepatuhan terpenting — dan yang paling
   diperhatikan peninjau iklan Meta — tapi menempel di bawah 3 kartu tanpa
   judul sendiri.
3. **BEZANYA dan KELAYAKAN terpisah.** Keduanya soal proses/kelayakan, tapi
   dipisah oleh PERKHIDMATAN.
4. **Social proof di bawah lipatan.** Testimoni di posisi 12 dari 17.
5. **Tidak ada satu pun angka bergerak.** Halaman punya angka kuat
   (RM400,000 / 4–18% / 10 tahun / 100 hari) tapi semuanya statis.

---

## 3. Urutan baru yang disetujui (16 blok)

```
 1  Meta Pixel
 2  Preloader
 3  Film texture + progress
 4  Sticky header
 5  HERO                  TETAP
 6  Marquee               TETAP
 7  PAIN                  TETAP
 8  BEZANYA               PINDAH naik, digabung dgn Kelayakan
 9  KELAYAKAN             digabung jadi satu blok dua kolom
10  PERKHIDMATAN          naik: nilai dijelaskan sebelum angka
11  TERMA PINJAMAN        DIPISAH jadi section sendiri, judul sendiri
12  ANGKA BERGERAK        BARU: counter 4 metrik
13  TESTIMONI             naik, + 1 kartu hasil
14  LANGKAH               turun setelah bukti sosial
15  FAQ
16  CTA AKHIR + Footer + Sticky WA + Cookie note
```

Perubahan bersih: **+1 section baru, 4 section berpindah, 1 section dipecah,
0 konten dibuang.**

---

## 4. Yang tidak boleh disentuh di tahap mana pun

Halaman ini live dan sedang menjalankan iklan Meta.

- Meta Pixel `1632732818271693` + noscript fallback
- 5 link WhatsApp (`wa.me/601113293498`) + event `Lead` `trackWA()`
- Seluruh copy, harga, terma, disclaimer, testimoni, FAQ
- `canonical`, og/twitter tags, `google-site-verification`
- `CNAME` (loan.noktahgroup.my), favicon, `robots.txt`, `sitemap.xml`
- JSON-LD `FinancialService` + `FAQPage`

---

## 5. Kriteria selesai

- [ ] 16 blok sesuai urutan di atas
- [ ] Counter 4 metrik beranimasi saat masuk viewport
- [ ] Semua blok kepatuhan utuh kata-per-kata
- [ ] 5 link WhatsApp + 5 event `Lead` utuh
- [ ] Pixel terverifikasi masih menembak `PageView`
- [ ] 0 error JS di console
- [ ] Reveal 100% saat scroll cepat / klik anchor
- [ ] Tetap terbaca & bisa di-scroll tanpa JS
