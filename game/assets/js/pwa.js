/* PWA: daftarkan service worker (scope /game/). Tidak mengubah gameplay; gagal daftar = game tetap jalan normal. */
(function () {
  'use strict';
  if (!('serviceWorker' in navigator)) return;
  var ok = location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  if (!ok) return;
  window.addEventListener('load', function () {
    try { navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).catch(function () {}); } catch (e) {}
  });
})();
