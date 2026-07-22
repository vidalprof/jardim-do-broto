/* Service worker — REDE PRIMEIRO no HTML (nunca prende versão velha);
   CACHE PRIMEIRO nas imagens (rápido em PC fraco), atualizando em 2º plano. */
var CACHE="jardim-broto-v2";
var ATIVOS=["./","./index.html","./manifest.json",
 "./img/jd_fundo.jpg","./img/jd_broto_feliz.png","./img/jd_broto_festa.png",
 "./img/jd_g0.png","./img/jd_g1.png","./img/jd_g2.png","./img/jd_g3.png","./img/jd_g4.png",
 "./img/jd_sol.png","./img/jd_agua.png","./img/jd_terra.png","./img/jd_ar.png",
 "./img/jd_refri.png","./img/jd_celular.png","./img/jd_meia.png","./img/jd_partes.png"];
self.addEventListener("install",function(e){self.skipWaiting();e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(ATIVOS).catch(function(){});}));});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.map(function(k){if(k!==CACHE)return caches.delete(k);}));}));self.clients.claim();});
function guardar(req,resp){try{if(resp&&resp.status===200&&resp.type==="basic"){var cp=resp.clone();caches.open(CACHE).then(function(c){c.put(req,cp);});}}catch(x){}return resp;}
self.addEventListener("fetch",function(e){
  if(e.request.method!=="GET")return;
  var req=e.request,aceita=req.headers.get("accept")||"";
  var ehPagina=(req.mode==="navigate")||aceita.indexOf("text/html")>=0;
  if(ehPagina){e.respondWith(fetch(req).then(function(r){return guardar(req,r);}).catch(function(){return caches.match(req).then(function(c){return c||caches.match("./index.html");});}));}
  else{e.respondWith(caches.match(req).then(function(c){var rede=fetch(req).then(function(r){return guardar(req,r);}).catch(function(){return c;});return c||rede;}));}
});
