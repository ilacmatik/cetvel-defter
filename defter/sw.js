// Defter çevrimdışı önbellek
const CACHE='defter-2026-11-01-1';
const CORE=['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/maskable-512.png'];
const LIBS=["https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js", "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"];
self.addEventListener('install',e=>{e.waitUntil((async()=>{const c=await caches.open(CACHE);await c.addAll(CORE);
  for(const u of LIBS){try{const r=await fetch(u,{mode:'cors'});if(r.ok)await c.put(u,r)}catch(err){}}
  self.skipWaiting()})())});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{for(const k of await caches.keys())if(k!==CACHE&&k.startsWith('defter-'))await caches.delete(k);await self.clients.claim()})())});
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(req.mode==='navigate'){ // önce ağ, yoksa önbellek
    e.respondWith((async()=>{try{const r=await fetch(req);const c=await caches.open(CACHE);c.put('./index.html',r.clone());return r}catch(err){return (await caches.match('./index.html'))||Response.error()}})());return}
  e.respondWith((async()=>{const hit=await caches.match(req);
    const net=fetch(req).then(async r=>{if(r&&(r.ok||r.type==='opaque')&&(url.origin===location.origin||/cdnjs|fonts\.(googleapis|gstatic)/.test(url.host))){const c=await caches.open(CACHE);c.put(req,r.clone())}return r}).catch(()=>null);
    return hit||(await net)||Response.error()})());
});
