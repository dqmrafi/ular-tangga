/* Preloader bersama untuk splash.html & loading.html.
   UT_Preload.run(urls, onProgress, minMs) -> Promise. Progres nyata = aset selesai / total (kegagalan tidak memblokir); minMs opsional, default 0 (tidak ada loading palsu). */
window.UT_Preload = (function () {
  var IMG = /\.(png|jpe?g|webp|gif|svg)(\?|$)/i;
  function one(url) {
    return new Promise(function (res) {
      var done = function () { res(); };
      try {
        if (IMG.test(url)) {
          var im = new Image(); im.onload = im.onerror = done; im.src = url; return;
        }
        var ext = /^https?:\/\//i.test(url) && url.indexOf(location.origin) !== 0;
        fetch(url, ext ? { mode: 'no-cors' } : {}).then(function (r) { return ext ? null : r.arrayBuffer(); }).then(done, done);
      } catch (e) { done(); }
    });
  }
  function run(urls, onProgress, minMs) {
    var total = urls.length, n = 0, t0 = performance.now(), shown = 0, finished = false;
    minMs = minMs || 0; /* 0 = tanpa batas waktu minimum: progres murni = aset yang benar-benar selesai */
    return new Promise(function (resolve) {
      function paint(now) {
        var real = total ? n / total : 1;
        var timeCap = minMs > 0 ? Math.min(1, (now - t0) / minMs) : 1;
        var target = Math.min(real, timeCap);
        shown += (target - shown) * 0.25;
        if (target - shown < 0.002) shown = target;
        onProgress(Math.round(shown * 100));
        if (shown >= 1) { finished = true; resolve(); return; }
        requestAnimationFrame(paint);
      }
      urls.forEach(function (u) { one(u).then(function () { n++; }); });
      requestAnimationFrame(paint);
    });
  }
  return { run: run };
})();
