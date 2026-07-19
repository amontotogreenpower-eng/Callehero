const C='puno-callejero-v1';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png',
 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'];
self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(C).then(c=>c.addAll(ASSETS).catch(()=>c.addAll(ASSETS.slice(0,5)))));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys()
    .then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k))))
    .then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(
    caches.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request).then(res=>{
      if(res&&res.status===200||res.type==='opaque'){
        const cp=res.clone();caches.open(C).then(c=>c.put(e.request,cp));
      }
      return res;
    }).catch(()=>e.request.mode==='navigate'?caches.match('./index.html'):undefined))
  );
});