/* Paksa landscape. Lapis 1: manifest PWA orientation=landscape (aplikasi terpasang). Lapis 2: screen.orientation.lock('landscape')
   (butuh layar penuh di browser biasa; dicoba saat dibuka dan saat pemain mengetuk tombol). Lapis 3: layar "Putar HP" menutupi game selama portrait
   di perangkat sentuh. Tidak menyentuh gameplay. index.html (halaman pasang aplikasi) tidak diblokir. */
(function () {
  'use strict';
  var path = location.pathname;
  var isIndex = /\/game\/?$/.test(path) || /\/index\.html$/.test(path);
  function tryLock() {
    try { var o = screen.orientation; if (o && o.lock) return o.lock('landscape').catch(function () {}); } catch (e) {}
    return Promise.resolve();
  }
  tryLock();
  if (isIndex) return;
  var coarse = window.matchMedia && matchMedia('(pointer:coarse)').matches;
  if (!coarse) return;
  var portrait = matchMedia('(orientation: portrait)');
  var box = null;
  function build() {
    if (box) return box;
    box = document.createElement('div');
    box.id = 'ut-rotate';
    box.setAttribute('role', 'alertdialog'); box.setAttribute('aria-label', 'Putar layar ke landscape');
    box.innerHTML = '<style>#ut-rotate{position:fixed;inset:0;z-index:2147483647;display:none;flex-direction:column;align-items:center;justify-content:center;gap:18px;padding:24px;text-align:center;background:linear-gradient(#2d8cf0,#1a62b8);color:#fff;font-family:system-ui,-apple-system,sans-serif;touch-action:none}'
      + '#ut-rotate.on{display:flex}#ut-rotate svg{width:96px;height:96px;animation:utrot 2.2s ease-in-out infinite}'
      + '#ut-rotate b{font-size:22px;text-shadow:0 2px 0 rgba(0,0,0,.25)}#ut-rotate span{font-size:15px;opacity:.9;max-width:280px;line-height:1.45}'
      + '#ut-rotate button{border:0;border-radius:14px;padding:13px 22px;font:inherit;font-weight:800;font-size:16px;color:#5a3500;background:linear-gradient(#ffd24d,#f4a81f);box-shadow:0 5px 0 #b9740c}'
      + '@keyframes utrot{0%,15%{transform:rotate(0)}55%,85%{transform:rotate(-90deg)}100%{transform:rotate(0)}}@media(prefers-reduced-motion:reduce){#ut-rotate svg{animation:none}}</style>'
      + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18.5h2"/></svg>'
      + '<b>Putar HP ke landscape</b><span>Game ini dimainkan dalam mode landscape (layar mendatar).</span>'
      + '<button type="button" id="ut-rotate-btn">Layar penuh landscape</button>';
    document.body.appendChild(box);
    box.querySelector('#ut-rotate-btn').addEventListener('click', function () {
      var de = document.documentElement, p = (de.requestFullscreen && de.requestFullscreen({ navigationUI: 'hide' })) || null;
      Promise.resolve(p).catch(function () {}).then(tryLock);
    });
    return box;
  }
  function sync() { if (!document.body) return; build().classList.toggle('on', portrait.matches); if (!portrait.matches) tryLock(); }
  if (portrait.addEventListener) portrait.addEventListener('change', sync); else portrait.addListener(sync);
  window.addEventListener('resize', sync); window.addEventListener('orientationchange', sync);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', sync); else sync();
})();
