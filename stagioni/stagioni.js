/* ==========================================================================
  PartyBox - Effetti stagionali
  Livello decorativo indipendente: non tocca hub né minigiochi.
  Nessun file esterno: grafica in CSS/JS, suoni sintetizzati con Web Audio.

  INTEGRAZIONE (in ogni pagina):
    <link rel="stylesheet" href="/stagioni/stagioni.css">
    <script src="/stagioni/stagioni.js" defer></script>
    <body data-seasonal-page="home">      home | indovina-chi | jeopardy | ...

  ANTEPRIMA (qualsiasi giorno dell'anno):
    URL:      ?stagione=natale            (prima variante a caso)
              ?stagione=natale&variante=luci
              ?stagione=off               (spegne e cancella l'anteprima)
    Console:  PartyBoxStagioni.anteprima('halloween', 'notte')
              PartyBoxStagioni.reset()
              PartyBoxStagioni.lista()
    L'anteprima resta attiva per la scheda (sessionStorage) mentre navighi.

  COME AGGIUNGERE UNA FESTIVITA: vedi la sezione "FESTIVITA" qui sotto
  (basta aggiungere un oggetto all'array, oppure chiamare
  PartyBoxStagioni.registra({...}) da un altro script).
   ========================================================================== */
(function(){
  'use strict';
  if(window.PartyBoxStagioni){ return; }

  /* ------------------------------------------------------------------------
    PAGINE: intensità per ogni valore di data-seasonal-page
      densita  1 = pieno, 0.4 = discreto (moltiplica il numero di particelle)
      deco     decorazioni grandi (luci, ragnatele, luna...) sì/no
      suoni    effetto sonoro iniziale sì/no
      volume   moltiplicatore del volume (0..1)
     ------------------------------------------------------------------------ */
  var PAGINE = {
    'home':         {densita:1,   deco:true,  suoni:true, volume:1},
    'indovina-chi': {densita:.55, deco:true,  suoni:true, volume:.7},
    'jeopardy':     {densita:.4,  deco:false, suoni:true, volume:.6},
    'default':      {densita:.6,  deco:false, suoni:true, volume:.7}
  };

  /* ------------------------------------------------------------------------
     FESTIVITA
       id        nome breve (usato in ?stagione=)
       finestra  ['MM-GG','MM-GG'] inclusi (può scavalcare l'anno: ['12-28','01-02'])
       attiva    (facoltativo) function(data){ return true/false } per feste mobili
                 come la Pasqua: se presente sostituisce 'finestra'
       varianti  2-3 look diversi: {id, particelle:[...], deco:[...], suono:[...]}
         particella: {glifi:[...], colori:[...], moto:'cade'|'sale'|'lampeggia',
                      n:numero base, dim:[min,max] px, dur:[min,max] s, op:[min,max]}
         deco:   'luci' | 'web' | 'ragni' | 'nebbia' | 'luna' (vedi DECO più sotto)
         suono:  nomi presi da SUONI più sotto
     ------------------------------------------------------------------------ */
  var FESTIVITA = [
    {
      id:'halloween', nome:'Halloween', finestra:['10-25', '10-31'],
      varianti:[
        {id:'zucche',
          particelle:[{glifi:['🎃', '🦇', '🎃', '🍂'], colori:['#ff9a2e'], moto:'cade', n:16, dim:[22, 40], dur:[16, 28], op:[.55, .85]}],
          deco:['nebbia'], nebbia:['rgba(255,120,20,.55)', 'rgba(130,40,160,.4)'], suono:['vento', 'campana']},
        {id:'notte',
          particelle:[{glifi:['👻', '✦', '👻'], colori:['#e9defa', '#b69cff'], moto:'sale', n:14, dim:[22, 44], dur:[18, 30], op:[.35, .7]},
                      {glifi:['✦', '✧'], colori:['#fff2c4'], moto:'lampeggia', n:14, dim:[8, 16], dur:[3, 7], op:[.4, .9]}],
          deco:['luna', 'nebbia'], nebbia:['rgba(120,60,200,.55)', 'rgba(30,10,80,.6)'], suono:['vento', 'theremin']},
        {id:'ragnatele',
          particelle:[{glifi:['🦇', '🦇', '🕷'], colori:['#2b2233'], moto:'cade', n:10, dim:[20, 34], dur:[18, 30], op:[.5, .8]}],
          deco:['web', 'ragni'], suono:['cigolio', 'campana']}
      ]
    },
    {
      id:'natale', nome:'Natale', finestra:['12-01', '12-31'],
      varianti:[
        {id:'neve',
          particelle:[{glifi:['❄', '❅', '❆', '•'], colori:['#ffffff', '#d6ecff'], moto:'cade', n:34, dim:[10, 30], dur:[12, 24], op:[.45, .9]}],
          deco:[], suono:['vento', 'slitta']},
        {id:'luci',
          particelle:[{glifi:['❄', '•'], colori:['#ffffff'], moto:'cade', n:16, dim:[10, 22], dur:[14, 26], op:[.4, .8]}],
          deco:['luci'], suono:['slitta', 'campanellini']},
        {id:'stelle',
          particelle:[{glifi:['★', '✦', '✧'], colori:['#ffd700', '#fff2c4'], moto:'lampeggia', n:26, dim:[10, 26], dur:[2.5, 6], op:[.5, 1]},
                      {glifi:['●'], colori:['#e5383b', '#2da94e'], moto:'cade', n:12, dim:[8, 12], dur:[14, 24], op:[.6, .9]}],
          deco:[], suono:['campanellini']}
      ]
    },
    {
      id:'sanvalentino', nome:'San Valentino', finestra:['02-12', '02-14'],
      varianti:[
        {id:'cuori',
          particelle:[{glifi:['♥', '❤', '♥'], colori:['#ff4d7d', '#ff8fb1', '#ffffff'], moto:'sale', n:26, dim:[14, 38], dur:[12, 22], op:[.5, .9]}],
          deco:[], suono:['carillon']},
        {id:'petali',
          particelle:[{glifi:['❀', '✿', '❁'], colori:['#ffb3c7', '#ff8fb1', '#ffd6e2'], moto:'cade', n:28, dim:[14, 30], dur:[12, 22], op:[.5, .9]}],
          deco:[], suono:['vento', 'carillon']},
        {id:'scintille',
          particelle:[{glifi:['♥', '✦', '✧'], colori:['#ff4d7d', '#ffd700', '#ffffff'], moto:'lampeggia', n:30, dim:[10, 26], dur:[2.5, 6], op:[.5, 1]}],
          deco:['nebbia'], nebbia:['rgba(255,60,120,.5)', 'rgba(150,20,90,.45)'], suono:['scintille', 'carillon']}
      ]
    }
    /* ESEMPIO per aggiungerne una (copia e modifica):
    ,{
      id:'capodanno', nome:'Capodanno', finestra:['12-31', '01-01'],
      varianti:[
        {id:'brindisi', particelle:[{glifi:['✦', '•'], colori:['#ffd700', '#fff'], moto:'cade', n:30, dim:[8, 20], dur:[8, 16], op:[.6, 1]}],
          deco:[], suono:['scintille']}
      ]
    } */
  ];

  /* ------------------------------------------------------------------------
     DECO: decorazioni grandi (funzioni che costruiscono elementi nel livello).
     Per una nuova decorazione aggiungi qui la funzione e il CSS in stagioni.css.
     ------------------------------------------------------------------------ */
  var DECO = {
    luci:function(layer){
      var d = box('pbs-deco pbs-luci'), cols = ['#ff4d4d', '#ffd700', '#4ade80', '#5cc8ff', '#ff7eb6'];
      var n = window.innerWidth < 640 ? 9 : 18;
      for(var i = 0; i < n; i++){
        var l = document.createElement('i');
        l.style.setProperty('--c', cols[i % cols.length]);
        l.style.setProperty('--w', (-(i * .37)).toFixed(2) + 's');
        d.appendChild(l);
      }
      layer.appendChild(d);
    },
    web:function(layer){ layer.appendChild(box('pbs-deco pbs-web sx')); layer.appendChild(box('pbs-deco pbs-web dx')); },
    ragni:function(layer){
      var n = window.innerWidth < 640 ? 2 : 3;
      for(var i = 0; i < n; i++){
        var r = box('pbs-deco pbs-ragno');
        r.style.setProperty('--x', (18 + i * 28 + rnd(-4, 8)).toFixed(0) + '%');
        r.style.setProperty('--h', rnd(70, 190).toFixed(0) + 'px');
        r.style.setProperty('--w', (-rnd(0, 4)).toFixed(1) + 's');
        layer.appendChild(r);
      }
    },
    nebbia:function(layer, v){
      var d = box('pbs-deco pbs-nebbia'), c = v.nebbia || ['rgba(255,255,255,.4)', 'rgba(180,180,255,.3)'];
      d.style.setProperty('--c1', c[0]);
      d.style.setProperty('--c2', c[1]);
      layer.appendChild(d);
    },
    luna:function(layer){ layer.appendChild(box('pbs-deco pbs-luna')); }
  };

  /* ------------------------------------------------------------------------
     SUONI: sintetizzati con Web Audio (oscillatori + rumore). Ogni funzione
     riceve (ctx, uscita, t0) e programma i suoi suoni a partire da t0.
     Niente risate umane, niente file: solo vento, campane, carillon...
     ------------------------------------------------------------------------ */
  var rumoreBuf = null;
  function rumore(ctx){
    if(rumoreBuf){ return rumoreBuf; }
    var len = ctx.sampleRate * 3, b = ctx.createBuffer(1, len, ctx.sampleRate), d = b.getChannelData(0);
    for(var i = 0; i < len; i++){ d[i] = Math.random() * 2 - 1; }
    rumoreBuf = b;
    return b;
  }
  function inviluppo(g, t, att, dur, v){
    g.gain.setValueAtTime(.0001, t);
    g.gain.exponentialRampToValueAtTime(v, t + att);
    g.gain.exponentialRampToValueAtTime(.0001, t + dur);
  }
  function nota(ctx, out, t, f, dur, v, tipo){
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.type = tipo || 'sine';
    o.frequency.setValueAtTime(f, t);
    inviluppo(g, t, .008, dur, v);
    o.connect(g); g.connect(out);
    o.start(t); o.stop(t + dur + .05);
  }
  var SUONI = {
    vento:function(ctx, out, t){
      var s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
      s.buffer = rumore(ctx);
      f.type = 'bandpass'; f.Q.value = 1.4;
      f.frequency.setValueAtTime(260, t);
      f.frequency.linearRampToValueAtTime(900, t + 1.4);
      f.frequency.linearRampToValueAtTime(350, t + 2.8);
      inviluppo(g, t, 1.2, 2.9, .5);
      s.connect(f); f.connect(g); g.connect(out);
      s.start(t); s.stop(t + 3);
    },
    campana:function(ctx, out, t){
      [[1, .5], [2.76, .28], [5.4, .14]].forEach(function(p){ nota(ctx, out, t + .5, 196 * p[0], 2.6 / p[0] + .6, p[1] * .6); });
    },
    theremin:function(ctx, out, t){
      var o = ctx.createOscillator(), l = ctx.createOscillator(), lg = ctx.createGain(), g = ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(720, t + .3);
      o.frequency.exponentialRampToValueAtTime(330, t + 2.2);
      l.frequency.value = 6; lg.gain.value = 14;
      l.connect(lg); lg.connect(o.frequency);
      inviluppo(g, t + .3, .6, 2.2, .28);
      o.connect(g); g.connect(out);
      o.start(t + .3); l.start(t + .3); o.stop(t + 2.6); l.stop(t + 2.6);
    },
    cigolio:function(ctx, out, t){
      var o = ctx.createOscillator(), f = ctx.createBiquadFilter(), g = ctx.createGain();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(85, t);
      o.frequency.linearRampToValueAtTime(150, t + .7);
      o.frequency.linearRampToValueAtTime(70, t + 1.5);
      f.type = 'lowpass'; f.frequency.value = 520;
      inviluppo(g, t, .25, 1.6, .22);
      o.connect(f); f.connect(g); g.connect(out);
      o.start(t); o.stop(t + 1.7);
    },
    slitta:function(ctx, out, t){
      for(var i = 0; i < 14; i++){
        var tt = t + i * .06 + Math.random() * .03;
        nota(ctx, out, tt, 2400 + Math.random() * 2600, .22, .16, 'triangle');
        nota(ctx, out, tt, 4600 + Math.random() * 2000, .14, .08, 'sine');
      }
    },
    campanellini:function(ctx, out, t){
      [1568, 1976, 2349, 1976, 2637].forEach(function(f, i){ nota(ctx, out, t + .5 + i * .16, f, .9, .24); nota(ctx, out, t + .5 + i * .16, f * 2, .5, .06); });
    },
    carillon:function(ctx, out, t){
      [1047, 1319, 1568, 1319, 1175, 1568, 1319, 1047].forEach(function(f, i){ nota(ctx, out, t + .3 + i * .22, f, .8, .26); nota(ctx, out, t + .3 + i * .22, f * 2, .35, .05); });
    },
    scintille:function(ctx, out, t){
      for(var i = 0; i < 9; i++){ nota(ctx, out, t + i * .11 + Math.random() * .06, 1800 + Math.random() * 2400, .35, .14, 'sine'); }
    }
  };

  /* ------------------------------------------------------------------------
     Utilità
     ------------------------------------------------------------------------ */
  function rnd(a, b){ return a + Math.random() * (b - a); }
  function pick(a){ return a[Math.floor(Math.random() * a.length)]; }
  function box(cls){ var d = document.createElement('div'); d.className = cls; return d; }
  function ss(k, v){ try{ if(v === undefined){ return sessionStorage.getItem(k); } if(v === null){ sessionStorage.removeItem(k); } else { sessionStorage.setItem(k, v); } }catch(e){} return null; }
  function ls(k, v){ try{ if(v === undefined){ return localStorage.getItem(k); } localStorage.setItem(k, v); }catch(e){} return null; }
  function chiave(mmgg){ var p = mmgg.split('-'); return Number(p[0]) * 100 + Number(p[1]); }
  function festaPerData(data){
    var k = (data.getMonth() + 1) * 100 + data.getDate();
    for(var i = 0; i < FESTIVITA.length; i++){
      var f = FESTIVITA[i], ok;
      if(typeof f.attiva === 'function'){ ok = !!f.attiva(data); }
      else {
        var a = chiave(f.finestra[0]), b = chiave(f.finestra[1]);
        ok = a <= b ? (k >= a && k <= b) : (k >= a || k <= b);
      }
      if(ok){ return f; }
    }
    return null;
  }
  function trovaFesta(id){
    id = String(id || '').toLowerCase();
    for(var i = 0; i < FESTIVITA.length; i++){ if(FESTIVITA[i].id === id){ return FESTIVITA[i]; } }
    return null;
  }
  function trovaVariante(f, vid){
    for(var i = 0; i < f.varianti.length; i++){ if(f.varianti[i].id === vid){ return f.varianti[i]; } }
    return null;
  }

  /* Variante: ss (sessione) > casuale diversa dall'ultima vista (ls) */
  function scegliVariante(f, forzata){
    if(forzata){ var v = trovaVariante(f, forzata); if(v){ return v; } }
    var salvata = trovaVariante(f, ss('pbs-var-' + f.id));
    if(salvata){ return salvata; }
    var ultima = ls('pbs-ultima-' + f.id);
    var scelte = f.varianti.filter(function(x){ return x.id !== ultima; });
    var nuova = pick(scelte.length ? scelte : f.varianti);
    ss('pbs-var-' + f.id, nuova.id);
    ls('pbs-ultima-' + f.id, nuova.id);
    return nuova;
  }

  /* ------------------------------------------------------------------------
     Rendering
     ------------------------------------------------------------------------ */
  var layer = null, attuale = null, sonoAscolto = null;
  var reduce = false;
  try{ reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(e){}

  function configPagina(){
    var p = document.body && document.body.getAttribute('data-seasonal-page');
    return PAGINE[p] || PAGINE['default'];
  }
  function pulisci(){
    if(layer && layer.parentNode){ layer.parentNode.removeChild(layer); }
    layer = null; attuale = null;
    togliAscolto();
  }
  function costruisci(f, v){
    var cfg = configPagina();
    layer = document.createElement('div');
    layer.id = 'pbs-layer';
    layer.setAttribute('aria-hidden', 'true');
    layer.className = 'pbs-' + f.id + ' pbs-v-' + v.id + (cfg.deco ? '' : ' pbs-lite');
    layer.appendChild(box('pbs-tinta'));
    if(cfg.deco){ (v.deco || []).forEach(function(nome){ if(DECO[nome]){ DECO[nome](layer, v); } }); }
    else if((v.deco || []).indexOf('nebbia') >= 0){ DECO.nebbia(layer, v); }
    var scala = Math.min(1, window.innerWidth / 1100 + .3) * cfg.densita;
    (reduce ? [] : (v.particelle || [])).forEach(function(p){
      var n = Math.max(2, Math.round(p.n * scala));
      for(var i = 0; i < n; i++){
        var e = document.createElement('span');
        e.className = 'pbs-p ' + p.moto;
        e.textContent = pick(p.glifi);
        e.style.setProperty('--x', rnd(-2, 98).toFixed(1) + '%');
        e.style.setProperty('--y', rnd(2, 96).toFixed(1) + '%');
        e.style.setProperty('--s', rnd(p.dim[0], p.dim[1]).toFixed(0) + 'px');
        e.style.setProperty('--c', pick(p.colori));
        e.style.setProperty('--o', rnd(p.op[0], p.op[1]).toFixed(2));
        e.style.setProperty('--d', rnd(p.dur[0], p.dur[1]).toFixed(1) + 's');
        e.style.setProperty('--w', (-rnd(0, p.dur[1])).toFixed(1) + 's');
        e.style.setProperty('--dx', rnd(-90, 90).toFixed(0) + 'px');
        e.style.setProperty('--r', rnd(-300, 300).toFixed(0) + 'deg');
        layer.appendChild(e);
      }
    });
    document.body.appendChild(layer);
    attuale = {festa:f, variante:v};
    document.documentElement.setAttribute('data-stagione', f.id);
    document.documentElement.setAttribute('data-stagione-variante', v.id);
    preparaSuono(f, v, cfg);
  }

  /* ------------------------------------------------------------------------
     Audio: una sola volta per sessione, alla prima interazione dell'utente
     ------------------------------------------------------------------------ */
  var gestori = [];
  function togliAscolto(){
    gestori.forEach(function(g){ document.removeEventListener(g[0], g[1], true); });
    gestori = [];
  }
  function preparaSuono(f, v, cfg){
    togliAscolto();
    if(!cfg.suoni || !(v.suono || []).length || ss('pbs-audio-' + f.id) === '1'){ return; }
    var Ctx = window.AudioContext || window.webkitAudioContext;
    if(!Ctx){ return; }
    var fatto = false;
    function parti(){
      if(fatto){ return; }
      fatto = true;
      togliAscolto();
      ss('pbs-audio-' + f.id, '1');
      try{
        var ctx = new Ctx(), master = ctx.createGain();
        master.gain.value = .15 * (cfg.volume == null ? 1 : cfg.volume);
        master.connect(ctx.destination);
        if(ctx.state === 'suspended'){ ctx.resume(); }
        var t = ctx.currentTime + .05;
        v.suono.forEach(function(nome, i){ if(SUONI[nome]){ SUONI[nome](ctx, master, t + i * .35); } });
        sonoAscolto = ctx;
        setTimeout(function(){ try{ ctx.close(); }catch(e){} if(sonoAscolto === ctx){ sonoAscolto = null; } }, 7000);
      }catch(e){}
    }
    ['pointerdown', 'keydown', 'touchend'].forEach(function(ev){ document.addEventListener(ev, parti, true); gestori.push([ev, parti]); });
  }

  /* ------------------------------------------------------------------------
     Avvio / anteprima
     ------------------------------------------------------------------------ */
  function applica(festa, varianteId){
    pulisci();
    if(!festa){ document.documentElement.removeAttribute('data-stagione'); document.documentElement.removeAttribute('data-stagione-variante'); return null; }
    var v = scegliVariante(festa, varianteId);
    costruisci(festa, v);
    return {festa:festa.id, variante:v.id};
  }
  function anteprimaSalvata(){
    var f = ss('pbs-anteprima');
    return f ? {id:f.split('/')[0], variante:f.split('/')[1] || ''} : null;
  }
  function avvia(){
    var q = null;
    try{ q = new URLSearchParams(location.search); }catch(e){}
    var qs = q && q.get('stagione');
    if(qs){
      if(qs === 'off'){ ss('pbs-anteprima', null); }
      else if(trovaFesta(qs)){ ss('pbs-anteprima', trovaFesta(qs).id + '/' + (q.get('variante') || '')); }
    }
    var a = anteprimaSalvata();
    if(a && trovaFesta(a.id)){ applica(trovaFesta(a.id), a.variante); return; }
    ss('pbs-anteprima', null);
    applica(festaPerData(new Date()));
  }

  window.PartyBoxStagioni = {
    anteprima:function(id, variante){
      var f = trovaFesta(id);
      if(!f){ console.warn('[Stagioni] Festività sconosciuta. Disponibili:', FESTIVITA.map(function(x){ return x.id; }).join(', ')); return null; }
      if(variante && !trovaVariante(f, variante)){ console.warn('[Stagioni] Varianti di ' + f.id + ':', f.varianti.map(function(x){ return x.id; }).join(', ')); variante = ''; }
      ss('pbs-anteprima', f.id + '/' + (variante || ''));
      ss('pbs-audio-' + f.id, null);
      if(variante){ ss('pbs-var-' + f.id, variante); }
      return applica(f, variante);
    },
    reset:function(){ ss('pbs-anteprima', null); return applica(festaPerData(new Date())); },
    info:function(){ return attuale ? {festa:attuale.festa.id, variante:attuale.variante.id} : null; },
    lista:function(){
      var righe = FESTIVITA.map(function(f){ return {id:f.id, nome:f.nome, finestra:f.attiva ? '(funzione)' : f.finestra.join(' → '), varianti:f.varianti.map(function(v){ return v.id; }).join(', ')}; });
      if(console.table){ console.table(righe); }
      return righe;
    },
    registra:function(festa){
      if(!festa || !festa.id || !festa.varianti || !festa.varianti.length || (!festa.finestra && !festa.attiva)){ console.warn('[Stagioni] Definizione non valida.'); return false; }
      FESTIVITA = FESTIVITA.filter(function(f){ return f.id !== festa.id; });
      FESTIVITA.push(festa);
      return true;
    },
    registraSuono:function(nome, fn){ if(typeof fn === 'function'){ SUONI[nome] = fn; } },
    registraDeco:function(nome, fn){ if(typeof fn === 'function'){ DECO[nome] = fn; } }
  };

  if(document.body){ avvia(); }
  else { document.addEventListener('DOMContentLoaded', avvia); }
})();
