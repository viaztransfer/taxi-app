/*========================
  Service Worker (solo en prod)
=========================*/
(function registerSW() {
  if (!('serviceWorker' in navigator)) return;

  // Evita registrar en localhost/127.0.0.1
  const isLocal =
    location.hostname === 'localhost' ||
    location.hostname === '127.0.0.1' ||
    location.hostname.endsWith('.local');

  if (isLocal) return;

  // Elige UNO. Si tu app es “user-app”, usa esa ruta; si es una sola app, usa 'sw.js'.
  const candidates = [
    '/user-app/sw.js',
    '/provider-app/sw.js',
    '/sw.js'
  ];

  // Registra el primero que exista (silenciosamente)
  (async () => {
    for (const url of candidates) {
      try {
        const res = await fetch(url, { method: 'HEAD' });
        if (res.ok) {
          await navigator.serviceWorker.register(url);
          // console.log('[SW] registered:', url);
          break;
        }
      } catch (_) { /* ignore */ }
    }
  })();
})();


/*====================
  Ratio js
======================*/
window.addEventListener('load', () => {
  const bgImg = document.querySelectorAll('.bg-img');
  bgImg.forEach((bgImgEl) => {
    const parent = bgImgEl.parentNode;

    if (bgImgEl.classList.contains('bg-top')) parent.classList.add('b-top');
    else if (bgImgEl.classList.contains('bg-bottom')) parent.classList.add('b-bottom');
    else if (bgImgEl.classList.contains('bg-center')) parent.classList.add('b-center');
    else if (bgImgEl.classList.contains('bg-left')) parent.classList.add('b-left');
    else if (bgImgEl.classList.contains('bg-right')) parent.classList.add('b-right');

    if (bgImgEl.classList.contains('blur-up')) {
      parent.classList.add('blur-up', 'lazyload');
    }
    if (bgImgEl.classList.contains('bg_size_content')) {
      parent.classList.add('b_size_content');
    }

    parent.classList.add('bg-size');
    const bgSrc = bgImgEl.src;
    bgImgEl.style.display = 'none';
    parent.setAttribute(
      'style',
      `background-image:url(${bgSrc});background-size:cover;background-position:center;background-repeat:no-repeat;display:block;`
    );
  });
});
