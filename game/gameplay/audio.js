/* Gameplay Audio (Stage 4.1.11) — HANYA presentation suara: AudioContext lazy, beep/noise sintetis, dan objek SFX (file di assets/sfx/<kategori>/ + fallback beep).
   Isi blok di bawah dipindahkan APA ADANYA dari gameplay.html (frekuensi, gain, durasi, path file, urutan fallback tidak diubah).
   Gameplay tetap yang menentukan KAPAN suara dimainkan; state mute/musik/persistence tetap di gameplay.html (modul hanya diberi setMuted).
   Tanpa timer gameplay; semua kegagalan audio ditelan di dalam helper (try/catch) sehingga game tidak berhenti.
   Classic script. Namespace: UT.GameplayAudio.
   API:  ensure()        — buat/resume AudioContext (dipanggil setelah interaksi user, seperti sebelumnya)
         play(name)      — mainkan SFX bernama (mis. 'pop','roll','chest'); nama tak dikenal diabaikan
         setMuted(bool)  — samakan status mute (dari tombol suara di gameplay)
         sfx             — objek SFX yang sama (sfx.pop() dst) untuk call site existing */
(function (win) {
  'use strict';
  var UT = win.UT = win.UT || {};
  if (UT.GameplayAudio) return;

  let actx=null,muted=false;
  function ensureAudio(){
    try{
      if(!actx) actx=new (window.AudioContext||window.webkitAudioContext)();
      if(actx&&actx.state==='suspended') actx.resume();
    }catch(e){}
  }
  function beep(f,d,type,vol,when,to){
    if(muted||!actx) return;
    try{
      const t=actx.currentTime+(when||0),o=actx.createOscillator(),g=actx.createGain();
      o.type=type||'square'; o.frequency.setValueAtTime(f,t);
      if(to) o.frequency.exponentialRampToValueAtTime(to,t+d);
      g.gain.setValueAtTime(vol||0.05,t); g.gain.exponentialRampToValueAtTime(0.0001,t+d);
      o.connect(g); g.connect(actx.destination); o.start(t); o.stop(t+d+0.03);
    }catch(e){}
  }
  function noise(d,vol,when,freq){
    if(muted||!actx) return;
    try{
      const n=Math.floor(actx.sampleRate*d),buf=actx.createBuffer(1,n,actx.sampleRate),ch=buf.getChannelData(0);
      for(let i=0;i<n;i++) ch[i]=(Math.random()*2-1)*(1-i/n);
      const src=actx.createBufferSource(),f=actx.createBiquadFilter(),g=actx.createGain();
      src.buffer=buf; f.type='highpass'; f.frequency.value=freq||3000; g.gain.value=vol||0.08;
      src.connect(f); f.connect(g); g.connect(actx.destination); src.start(actx.currentTime+(when||0));
    }catch(e){}
  }
  /* ============================ LOKASI FILE SFX ============================
     Satu tabel path. Struktur folder: assets/sfx/<kategori>/<nama>.<ext>
       ui/ dice/ board/ reward/ powerup/ mob/ dragon/   (daftar lengkap: assets/sfx/README.md)
     Mengganti/menambah file cukup ubah baris di sini; fungsi sfx di bawah hanya memakai kuncinya. */
  const SFX_DIR='assets/sfx/';
  const FILE={
    /* dice */   roll:'dice/dice-roll.mp3',
    /* board */  hop:'board/pawn-hop.mp3', ladder:'board/ladder-up.mp3', snakeBite:'board/snake-bite.mp3', block100:'board/block-100.mp3',
    /* reward */ chestOpen:'reward/chest-open.ogg', chestClose:'reward/chest-close.ogg', powerReward:'reward/power-reward.mp3',
    /* mob */    punch:'mob/mob-punch.mp3', playerHurt:'mob/player-hurt.mp3', creeperFuse:'mob/creeper-fuse.ogg', skeletonShoot:'mob/skeleton-shoot.ogg', endermanTp:'mob/enderman-teleport.ogg',
    /* dragon */ dragonIdle:'dragon/dragon-idle.ogg', dragonHurt:'dragon/dragon-hurt.ogg', dragonDeath:'dragon/dragon-death.ogg',
               earthquake:'dragon/earthquake.mp3', tower:'dragon/tower-rise.mp3', crystalAppear:'dragon/crystal-appear.mp3', crystalBreak:'dragon/crystal-break.mp3'
  };
  const FILE_AWAKENING='dragon/dragon-awakening.mp3'; /* PLACEHOLDER: file belum ada -> fallback sintetis (retak + gema). Taruh file bernama ini untuk menggantinya. */
  /* Warm-up: file SFX dimuat lebih awal (tanpa diputar, tanpa butuh gesture) agar pemutaran pertama tidak menunggu fetch/decode. */
  var warm=[];
  function preload(){ if(warm.length) return; Object.keys(FILE).forEach(function(k){ try{ var a=new Audio(); a.preload='auto'; a.src=SFX_DIR+FILE[k]; warm.push(a); }catch(e){} }); }
  /* Putar file SFX. fb = fallback sintetis bila file gagal/diblok. Mengembalikan elemen Audio (bisa di-fade/stop) atau null. Hormati tombol mute. */
  function fileSfx(key,vol,fb){ if(muted) return null; try{ const a=new Audio(SFX_DIR+(FILE[key]||key)); a.volume=vol; a.play().catch(fb||function(){}); return a; }catch(e){ if(fb) fb(); return null; } }
  function fadeOut(a,ms){ if(!a) return; try{ const v0=a.volume,t0=Date.now(),id=setInterval(function(){ const k=Math.min(1,(Date.now()-t0)/ms); a.volume=v0*(1-k); if(k>=1){ clearInterval(id); a.pause(); } },50); }catch(e){} }
  const ladderBeeps=()=>[392,494,587,784].forEach((f,i)=>beep(f,0.14,'square',0.05,i*0.11));

  const sfx={
    /* ---------- DADU ---------- */
    roll(){ return fileSfx('roll',0.8,function(){ for(let i=0;i<7;i++) beep(180+Math.random()*320,0.05,'square',0.035,i*0.13); }); },
    rollStop(a){ fadeOut(a,250); },

    /* ---------- PAPAN: gerak & kejadian di tile ---------- */
    hop(){ fileSfx('hop',0.5,function(){ beep(480+Math.random()*120,0.08,'square',0.04); }); },
    naiktangga(){ fileSfx('ladder',0.7,ladderBeeps); },
    ladder(){ ladderBeeps(); },
    caplokular(){ fileSfx('snakeBite',0.8,function(){ beep(200,0.12,'square',0.09,0,60); }); },
    hundred(){ fileSfx('block100',0.7,function(){ beep(523,0.2,'square',0.05); }); },
    hiss(){ noise(0.55,0.09,0,4500); },
    chomp(){ beep(200,0.12,'square',0.09,0,60); beep(90,0.25,'sawtooth',0.08,0.02); noise(0.12,0.07,0,1500); },
    gulp(){ beep(220,0.18,'sine',0.1,0,90); beep(200,0.18,'sine',0.1,0.24,80); },
    pop(){ beep(300,0.12,'triangle',0.08,0,900); },
    bounce(){ beep(330,0.2,'triangle',0.07,0,140); },

    /* ---------- HADIAH & PETI ---------- */
    chest(){ fileSfx('chestOpen',0.7,function(){ beep(300,0.12,'triangle',0.08,0,900); }); },
    chestClose(){ fileSfx('chestClose',0.6,function(){ beep(200,0.1,'square',0.05); }); },
    rewardpower(){ fileSfx('powerReward',0.6,function(){ beep(523,0.12,'square',0.05,0,784); }); },
    win(){ [523,659,784,1047,784,1047].forEach((f,i)=>beep(f,0.2,'square',0.05,i*0.14)); },

    /* ---------- MOB DI BOARD ---------- */
    hit(){ fileSfx('punch',0.7,function(){ beep(330,0.2,'triangle',0.07,0,140); }); },
    playerHurt(){ return fileSfx('playerHurt',0.9,function(){ beep(330,0.2,'triangle',0.07,0,140); }); },
    creeper(){ fileSfx('creeperFuse',0.7,function(){ beep(200,0.12,'square',0.09,0,60); }); },
    skeltonSh(){ fileSfx('skeletonShoot',0.7,function(){ beep(400,0.1,'square',0.05); }); },
    enderman(){ fileSfx('endermanTp',0.7,function(){ beep(700,0.2,'square',0.05,0,1000); }); },

    /* ---------- DRAGON ---------- */
    dragonIdle(){ fileSfx('dragonIdle',0.5); },
    dragonHurt(){ fileSfx('dragonHurt',0.8,function(){ beep(523,0.2,'square',0.05); }); },
    dragonDeath(){ fileSfx('dragonDeath',0.9,function(){ beep(1047,0.4,'square',0.08); }); },
    dragonSpawn(){ return fileSfx('dragonIdle',0.8); },
    /* Dragon Awakening: file placeholder (lihat FILE_AWAKENING); fallback sintetis = retak + gema. Tidak dipakai lagi oleh gameplay (diganti quakeStart). */
    dragonAwakening(){ let done=false;const fb=()=>{ if(done) return; done=true; noise(0.18,0.1,0,900); noise(0.14,0.08,0.22,1400); beep(70,0.9,'sawtooth',0.06,0.05,38); [0.35,0.75,1.2].forEach((w,i)=>{ noise(0.1,0.05/(i+1),w,1100); beep(110-i*20,0.5,'sine',0.05/(i+1),w,50); }); }; if(muted) return; try{ const a=new Audio(SFX_DIR+FILE_AWAKENING); a.volume=0.9; a.addEventListener('error',fb); a.play().catch(fb); }catch(e){ fb(); } },
    quakeStart(){ return fileSfx('earthquake',0.9,function(){ noise(0.6,0.1,0,900); }); },
    quakeStop(a){ fadeOut(a,700); },
    towerRise(){ return fileSfx('tower',0.8); },
    towerStop(a){ fadeOut(a,600); },
    crystalAppear(){ return fileSfx('crystalAppear',0.7,function(){ beep(900,0.4,'sine',0.05,0,1400); }); },
    crystalBreak(){ fileSfx('crystalBreak',0.9,function(){ noise(0.25,0.1,0,2500); beep(900,0.22,'triangle',0.06,0,200); beep(1400,0.12,'square',0.03,0.04,500); }); },

    /* ---------- READY SCREEN (acak urutan giliran) — sintetis ---------- */
    shuffleTick(){ beep(700+Math.random()*700,0.03,'square',0.03); },
    revealTick(){ beep(660,0.07,'square',0.05); },
    revealFirst(){ beep(660,0.07,'square',0.05); beep(990,0.14,'square',0.05,0.08); }
  };

  /* Gerbang urutan: SFX baru boleh bunyi setelah gameplay menandai audio siap (setelah percobaan BGM pada gesture pertama). */
  var ready=false;
  Object.keys(sfx).forEach(function(k){ var f=sfx[k]; sfx[k]=function(){ if(!ready) return; return f.apply(this,arguments); }; });
  try{ preload(); }catch(e){}
  UT.GameplayAudio = {
    ensure: ensureAudio,
    preload: preload,
    play: function (name) { try { if (typeof sfx[name] === 'function') sfx[name](); } catch (e) {} },
    setMuted: function (v) { muted = !!v; },
    setReady: function (v) { ready = !!v; },
    sfx: sfx
  };
})(window);
