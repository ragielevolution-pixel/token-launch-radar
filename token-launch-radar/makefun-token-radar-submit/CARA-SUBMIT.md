# Cara submit — token-radar-01 (Bahasa Indonesia)

Repo ini adalah entry Token Launch Radar untuk bounty make.fun
token-radar-01 ($1.325, deadline 14 Des 2026 10:00 UTC).
Isinya: `main.ts` yang meranking 178 protokol DefiLlama tanpa token,
dashboard statis di `dashboard/`, `board.json`, `dossier.json`,
dan 3 screenshot di `screenshots/`.

Nama repo yang disarankan: `token-launch-radar`
(Nama bebas, yang penting repo-nya publik dan baru dibuat setelah
14 Nov 2026 10:00 UTC.)

## 1. Buat repo GitHub baru

1. Buka github.com/new, isi Repository name: `token-launch-radar`,
   pilih Public, jangan centang "Add a README" (README sudah ada di paket ini).
2. Create repository.
3. Upload semua file di paket ini ke repo itu (tombol "uploading an existing
   file" di halaman repo, atau `git push` dari komputer).
4. Catat:
   - `repo_url`: misalnya `https://github.com/<username-kamu>/token-launch-radar`
   - `commit_sha`: SHA commit yang 40 karakter (di halaman commit, tombol
     "Copy full SHA" / ikon copy di sebelah SHA pendek).

## 2. Isi About repo (di halaman repo > About > gear)

- Description: `Token Launch Radar. Built by an AI agent for make.fun's
  “Build the best token launch radar” bounty, $1,325 in USDC.`
- Website: `https://make.fun/bounty/token-radar-01`
- Topics: `makefun`, `ai-agents`, `bounties`, `trading`

## 3. Screenshot dari browser (wajib sebelum submit)

Screenshot di `screenshots/` saat ini masih render PIL, bukan tangkapan
browser. Buka `dashboard/index.html` di Chrome/Firefox, lalu ambil ulang:
`1-board.png` (board), `2-detail.png` (detail satu protokol),
`3-filtered.png` (tampilan terfilter). Ganti ketiga file itu di repo.

## 4. Bundle transkrip — baca dulu

Submit butuh `bundle` (.tar.gz) dari kit make.fun
(`node cli/makefun.mjs bundle`). Sesi Muse yang membangun draft ini
tidak tercatat oleh kit, jadi bundle-nya harus di-hand-over.
Untuk bounty ini `handed_over_places: none`: entry yang di-hand-over
hanya diranking, tapi tidak dapat tempat berbayar.
Supaya bisa dapat hadiah, entry harus dibangun ulang di harness yang
sesinya tercatat (Claude Code, Codex, atau Superbot).
Jangan pernah membuat transkrip palsu atau menulis ulang sesi dari ingatan.

## 5. Submit di make.fun

1. Login make.fun, buka https://make.fun/bounty/token-radar-01
2. Isi form submit: `repo_url`, `commit_sha`, upload `bundle`, judul.
3. Tanda tangan pesan entry (`make.fun entry v1` ...) dengan wallet
   Phantom yang sudah terhubung ke akun. Ini harus dilakukan sendiri
   di browser, tidak bisa diwakilkan.
4. Kirim. Cek status entry di halaman bounty / leaderboard.
   Hasil dijadwalkan 28 Des 2026. Kalau menang, klaim USDC di Solana
   ke wallet yang menandatangani entry.
