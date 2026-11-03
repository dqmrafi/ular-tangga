/* Preloader untuk splash.html (satu-satunya layar loading dengan bar; perpindahan halaman memakai layar dadu di play.html).
   Progres NYATA dihitung dari BYTE yang benar-benar terunduh (stream fetch), bukan dari jumlah file atau timer:
     UT_Preload.run(urls, onProgress, minMs, sizes) -> Promise     (sizes = {url: perkiraan byte}, opsional)
     UT_Preload.runAuto(extraUrls, onProgress)       -> Promise     (memuat assets/preload-manifest.json + extraUrls)
   Kegagalan/aset macet tidak memblokir (timeout 20 dtk per file). Bila semua sudah ada di cache, loading memang cepat: itu nyata.
   Daftar aset dibuat oleh tools/gen-preload-manifest.py (jalankan ulang setelah menambah musik/gambar/sfx). */
window.UT_Preload = (function () {
  var CONC = 6, DEF_SIZE = 30000, EXT_SIZE = 80000, TIMEOUT = 20000;
  function isExt(u) { return /^https?:\/\//i.test(u) && u.indexOf(location.origin) !== 0; }

  function run(urls, onProgress, minMs, sizes) {
    sizes = sizes || {}; minMs = minMs || 0;
    var list = [], seen = {};
    urls.forEach(function (u) { if (!seen[u]) { seen[u] = 1; list.push(u); } });
    var N = list.length, exp = [], got = [], doneN = 0, next = 0, t0 = performance.now(), shown = 0;
    list.forEach(function (u, i) { exp[i] = sizes[u] || (isExt(u) ? EXT_SIZE : DEF_SIZE); got[i] = 0; });

    function load(i) {
      return new Promise(function (res) {
        var fin = false, tm;
        function done() { if (fin) return; fin = true; clearTimeout(tm); got[i] = exp[i]; doneN++; res(); }
        tm = setTimeout(done, TIMEOUT);
        var u = list[i];
        try {
          fetch(u, isExt(u) ? { mode: 'no-cors' } : {}).then(function (r) {
            if (isExt(u) || !r.body || !r.body.getReader) return r.arrayBuffer();
            var cl = parseInt(r.headers.get('content-length'), 10);
            if (cl > 0) exp[i] = cl; /* ukuran asli dari server menggantikan perkiraan */
            var rd = r.body.getReader();
            return (function pump() {
              return rd.read().then(function (c) {
                if (c.done) return;
                got[i] = Math.min(exp[i], got[i] + c.value.length);
                return pump();
              });
            })();
          }).then(done, done);
        } catch (e) { done(); }
      });
    }
    function worker() {
      if (next >= N) return Promise.resolve();
      var i = next++;
      return load(i).then(worker);
    }
    return new Promise(function (resolve) {
      for (var w = 0; w < Math.min(CONC, N); w++) worker();
      function paint(now) {
        var a = 0, b = 0;
        for (var i = 0; i < N; i++) { a += got[i]; b += exp[i]; }
        var real = N ? (doneN >= N ? 1 : Math.min(0.99, a / b)) : 1;
        var target = minMs > 0 ? Math.min(real, (now - t0) / minMs) : real;
        shown += (target - shown) * 0.2;
        if (target - shown < 0.002) shown = target;
        onProgress(Math.round(shown * 100));
        if (shown >= 1 && doneN >= N) { resolve(); return; }
        requestAnimationFrame(paint);
      }
      requestAnimationFrame(paint);
    });
  }

  function runAuto(extra, onProgress) {
    var base = 'assets/preload-manifest.json';
    var tm = new Promise(function (r) { setTimeout(function () { r(null); }, 4000); });
    var man = fetch(base).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; });
    return Promise.race([man, tm]).then(function (m) {
      m = m || {};
      var urls = (extra || []).concat(Object.keys(m));
      return run(urls, onProgress, 0, m);
    });
  }
  return { run: run, runAuto: runAuto };
})();
