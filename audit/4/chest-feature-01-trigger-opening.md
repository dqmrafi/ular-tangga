FEATURE: Chest Feature 1

Sumber verifikasi:
- Harness logika (Claude, Node + stub): 14/14 cek lolos. Mencakup lifecycle, reward 1x, guard double-trigger (token sama dan trigger bersamaan), landing berikutnya, reset game di tengah proses, tidak ada Power di giveChest, CHEST_SCALE = 1.8.
- Uji manual di game asli: dilakukan pemilik proyek, dikonfirmasi 2026-11-03 ("sudah aman"). Tidak ada hasil terpisah per test A-F. Claude tidak dapat menjalankan game 3D di lingkungannya (Three.js CDN diblokir), jadi status visual di bawah bersumber dari konfirmasi pemilik proyek.

Trigger:
PASS

Opening:
PASS

Gameplay Lock:
PASS

Double Trigger Guard:
PASS

Idle Animation:
PASS

Reduced Motion:
PASS

Chest Size 1.8:
PASS

Existing SFX:
PASS

Power Removed From Chest:
PASS

Power Gameplay Regression:
PASS (kode Power tidak diubah; dicek lewat diff)

Final Regression:
PASS

Catatan: reward Chest sementara = +5 skor (placeholder sampai Chest Feature 2, Reward Pool).

Commit:
6021164 (implementasi). Commit audit ini mengikuti.

Push:
SUCCESS (branch stage4-chest-feature-01-unverified, 6021164 terverifikasi)

LOCAL HEAD == REMOTE HEAD:
PASS (diverifikasi untuk 6021164; HEAD main setelah merge dilaporkan terpisah)

WORKTREE:
CLEAN
