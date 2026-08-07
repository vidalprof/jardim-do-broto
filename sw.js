/* Service worker — REDE PRIMEIRO no HTML (nunca prende versão velha);
   CACHE PRIMEIRO em imagens/áudio (rápido em PC fraco), atualizando em 2º plano. */
var PREFIXO="jardim-broto-";
/* ⚠️ SUBIR ESTE NUMERO SEMPRE QUE MUDAR IMAGEM OU AUDIO (ago/2026).
   O HTML e "rede primeiro", entao a tela nova chega sozinha. Mas imagem e som
   sao "cache primeiro": um arquivo com o MESMO nome e conteudo novo (uma voz
   regravada, por exemplo) continua saindo do cache VELHO para sempre. Ou seja,
   a crianca ve a tela nova e ouve a voz antiga — exatamente o defeito que a
   gente esta tentando matar. Trocar o numero apaga o cache anterior. */
var CACHE=PREFIXO+"v5";
var ATIVOS=["./","./index.html","./manifest.json",
 "./img/jd_fundo.jpg","./img/jd_broto_feliz.png","./img/jd_broto_fala.png","./img/jd_broto_pisca.png",
 "./img/jd_broto_pensa.png","./img/jd_broto_festa.png","./img/med_jardim.png",
 "./img/jd_g0.png","./img/jd_g1.png","./img/jd_g2.png","./img/jd_g3.png","./img/jd_g4.png",
 "./img/jd_sol.png","./img/jd_agua.png","./img/jd_terra.png","./img/jd_ar.png",
 "./img/jd_refri.png","./img/jd_celular.png","./img/jd_meia.png","./img/jd_partes.png",
 "./audio/jd_abertura.mp3","./audio/jd_p1_intro.mp3","./audio/jd_p1_prever.mp3","./audio/jd_p1_faca.mp3"];
self.addEventListener("install",function(e){self.skipWaiting();e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(ATIVOS).catch(function(){});}));});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.map(function(k){if(k!==CACHE&&k.indexOf(PREFIXO)===0)return caches.delete(k);}));}));self.clients.claim();});
function guardar(req,resp){try{if(resp&&resp.status===200&&resp.type==="basic"){var cp=resp.clone();caches.open(CACHE).then(function(c){c.put(req,cp);});}}catch(x){}return resp;}
self.addEventListener("fetch",function(e){
  if(e.request.method!=="GET")return;
  var req=e.request,aceita=req.headers.get("accept")||"";
  var ehPagina=(req.mode==="navigate")||aceita.indexOf("text/html")>=0;
  if(ehPagina){e.respondWith(fetch(req).then(function(r){return guardar(req,r);}).catch(function(){return caches.match(req).then(function(c){return c||caches.match("./index.html");});}));}
  else{e.respondWith(caches.match(req).then(function(c){var rede=fetch(req).then(function(r){return guardar(req,r);}).catch(function(){return c;});return c||rede;}));}
});
