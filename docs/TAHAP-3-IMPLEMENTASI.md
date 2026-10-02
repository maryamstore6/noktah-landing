# TAHAP 3 — IMPLEMENTASI

Status: **SELESAI** (2 Okt 2026)
Commit: `e79589f` di branch `cinematic-upgrade`
Live `main`: **tidak tersentuh** — `9f91a55`

## Yang dibangun

### Motion brand — "Noktah bukan noktah"
"Noktah" = titik akhir. Janji halaman ini: penolakan bank itu titik, bukan akhir.
- **Logo intro** — satu titik emas muncul → memanjang jadi garis → wordmark muncul.
  Menggantikan counter %. Plafon keras 2.6s.
- **Hero dot field** — 34 titik melayang, hanya beranimasi saat hero terlihat
  (IntersectionObserver + `document.hidden`).
- **Divider section** — titik berjalan di sepanjang garis mengikuti scroll.
- **Progress** — titik bergerak menggantikan bar.

Semua transform/opacity saja (GPU-composited). Tanpa WebGL/canvas.

### Aksesibilitas
| Perbaikan | Sebelum | Sesudah |
|---|---|---|
| Kontras CTA | 1.98:1 (gagal AA) | **5.23:1** |
| Skip-link | tidak ada | ada |
| `:focus-visible` | tidak ada | ada |
| `<main>` / `<nav>` | 0 | ada |
| Landmark "banner" | 2 (`<header>` hero) | 1 |
| Disclaimer footer | 4.25:1 | **5.62:1** |

### Copy
Struktur ayat Melayu + istilah Inggeris yang dipakai orang Malaysia.
H1 **sengaja tidak diubah** — message match dengan creative iklan.

### Performa
- `logo.png` 426KB dihapus (tidak direferensikan apa pun)
- Preload gambar hero (LCP)
- `theme-color`
- Inline style: 17 → 2 (dua sprite SVG, memang perlu)

## Bug yang ditemukan lewat tes dan diperbaiki

1. **"0RM" bukan "RM0"** — suffix counter salah posisi.
2. **Tanpa JS metrik tampil "0K", "0–0%", "0"** — angka nol, bukan angka asli.
   Sekarang nilai final ada di markup, counter beranimasi naik ke arahnya.
3. **Jalur reduced-motion tidak menambahkan `is-gone`** — hanya CSS media query
   yang menyembunyikan loader. Kalau query gagal match, overlay z-9999 menutup
   seluruh halaman. Sekarang JS menyembunyikannya eksplisit.
4. **Logo hero terlewat** — CSS hanya menargetkan header & footer, jadi logo hero
   tetap kotak putih + merah. Terverifikasi **0 pixel merah** setelah perbaikan.

## Verifikasi (semua dijalankan, bukan asumsi)

| Skenario | Hasil |
|---|---|
| Normal (JS aktif) | 49/49 reveal, 0 error JS |
| Tanpa JS | 49/49 terlihat, metrik benar |
| JS diblokir (CSP) | 49/49 terlihat, metrik benar |
| Reduced motion | 49/49 terlihat, dot dimatikan |
| GSAP/Lenis gagal load | 49/49 setelah scroll, counter & dot tetap jalan |
| Fast-scroll & klik anchor | 0 elemen tersangkut |
| Mobile 390px | 1 kolom, tanpa overflow |
| Kontras | semua pasangan PASS |
| Logo | 0 pixel merah di seluruh halaman |

## Belum dilakukan
- Belum merge ke `main` / deploy — menunggu persetujuan.
- Item Webby yang butuh bahan dari user: video/foto asli, testimoni bernama,
  kredibilitas regulatori. Kalkulator kelayakan dibatalkan atas permintaan.
