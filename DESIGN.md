# Design Direction: Siloam Medical Leaflet Portal & Flipbook

<!-- impeccable:design-schema 1 -->

## Dial
ENERGY 1 / RHYTHM 2 / MOTION 2

## Brand & Visual Philosophy
- **Domain**: Portal Edukasi Pasien Digital & Repositori Leaflet RS Siloam (MRCCC).
- **Tone**: Medis, tenang, terpercaya, presisi, mudah dipahami pasien awam dan lansia.
- **Atmosphere**: Bersih, fungsional tanpa ornamen berlebih (no unnecessary gradient glow, no tech-slop).

## Color Palette
- **Brand Navy**: `#0A3366` (Header, navigasi institusi, badge penting)
- **Medical Blue**: `#0056B3` (Tombol aksi utama, tautan aktif)
- **Clinical Surface**: `#F8FAFC` (Latar belakang utama repositori)
- **Card Surface**: `#FFFFFF` (Permukaan kartu file dan lembar buku)
- **Border & Divider**: `#E2E8F0` (Garis pemisah struktural)
- **Text Main**: `#0F172A` (Judul dan teks instruksi)
- **Text Muted**: `#475569` (Metadata, tanggal perbaruan, ukuran file)
- **Status Green**: `#15803D` (Label dokumen terverifikasi medis)
- **Warning Amber**: `#B45309` (Peringatan dosis dan keamanan)

## Typography
- **Primary Body & Headings**: `'Zalando Sans', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **Scale**:
  - Display Title: `28px / 1.2` (Desktop), `22px / 1.3` (Mobile)
  - Section Header: `18px / 1.4`
  - Body Text: `14px / 1.5`
  - Metadata / Small: `12px / 1.4`

## Component Guidelines
1. **Drive File Card**:
   - Menyerupai Google Drive / cloud storage clean: ikon file / thumbnail cover, nama dokumen, kategori poli/spesialis, tag format (Leaflet 6-Panel), tombol aksi "Buka Leaflet (Flipbook)" dan "Unduh".
   - Rasio elevasi halus: border `1px solid #E2E8F0`, shadow ringan saat hover (`0 4px 12px rgba(15, 23, 42, 0.06)`).
2. **Interactive 3D Flipbook Stage**:
   - Backdrop semi-transparan redup (`rgba(11, 19, 32, 0.88)`) agar fokus pembaca tertuju 100% pada lembar edukasi.
   - Efek 3D Book: lembaran memiliki `perspective(1800px)`, `transform-style: preserve-3d`, bayangan lipatan kertas di bagian punggung (spine shadow), dan animasi pembalikan halaman alami (`cubic-bezier(0.645, 0.045, 0.355, 1)`).
   - Mode Tampilan Ganda & Tunggal:
     - Desktop/Tablet: Double-page spread (buku terbuka dua sisi).
     - Mobile: Single-page focus dengan gestur swipe & tombol pagination besar (minimum 48px).
   - Kontrol Pembaca: Tombol Previous, Next, Zoom In/Out, Reset Zoom, Fullscreen, dan Tutup (Esc).

## Motion Principles
- Transisi buka dokumen: `300ms ease-out`
- Flip lembaran kertas: `600ms cubic-bezier(0.25, 1, 0.5, 1)` dengan simulasi pencahayaan gradien bayangan saat membalik.
- Tanpa animasi looping tanpa henti (strictly no infinite pulsing dots).
