# Peta folder icon

Semua icon `.webp` dikelompokkan per fungsi. Path di HTML: `assets/Images/icon/<grup>/<nama>.webp`.

| Folder | Isi | Dipakai di |
|---|---|---|
| `currency/` | coin, coinadd, emerald, emeraldadd | bar mata uang semua halaman |
| `ui/` | back, gear, menu, refresh, copy, edit, lock, play, start | tombol umum (kembali, pengaturan, salin, edit, kunci, play, bintang) |
| `audio/` | sound, mute | pengaturan suara (belum dipasang) |
| `items/` | skin, dadu, power, efek, emote | tab kategori Shop & Inventory, Profil |
| `lobby/` | shop, inventory, invenotry, dailyreward, gift, misi, mail, hand, trophy, leader | menu Lobby, Leaderboard, Friendship, Profil |
| `mode/` | console, modekhsusus, tutorial, calndar, kontak, robot | halaman Pilih Mode, judul Profil |
| `profile/` | user, globe, camera, 360 | halaman Profil |

Catatan:
- Nama file `calndar`, `modekhsusus`, `invenotry` memang typo dari aslinya; tidak di-rename agar tidak memutus referensi.
- `lobby/invenotry.webp` = peti, `lobby/inventory.webp` = tas ransel.
- Path dinamis: `shop.html` & `inventory.html` (`catImg` -> `icon/items/`), `profile.html` (`RI('grup/nama')`).
