/* Reel Maker — turn a video, a link or a product into reels that are ready to post.
   Modelled on clip-makers like Opus Clip: one source in, a ranked set of short clips out,
   each with a score, captions and a hook you can swap. Sloosh makes new clips from a product.
   Everything here is sample data. */
(function () {
  'use strict';
  const A = 'assets/arata/';
  const esc = (v) => String(v == null ? '' : v).replace(/[&<>"]/g, (c) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' })[c]);
  const svgI = (d, s = 18) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const I = {
    reel:'<rect x="3" y="3" width="18" height="18" rx="5"/><path d="M3 8.5h18"/><path d="m8.5 3 2.5 5.5"/><path d="m14 3 2.5 5.5"/><path d="M10.5 12v5.2l4.3-2.6z"/>',
    link:'<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    up:'<path d="M12 19V5"/><path d="m5 12 7-7 7 7"/>', box:'<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5"/><path d="M12 13v8"/>',
    redo:'<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>', x:'<path d="M18 6 6 18M6 6l12 12"/>',
    play:'<polygon points="7 4 20 12 7 20 7 4" fill="currentColor"/>', pause:'<rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor"/><rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor"/>',
    spark:'<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/>', cal:'<path d="M8 2v4M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
    down:'<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>', ok:'<path d="M20 6 9 17l-5-5"/>', chev:'<path d="m9 18 6-6-6-6"/>'
  };

  /* ---------- a source and its clips ---------- */
  const W = (s) => s.split(' ');
  const SRC = { id:'launch', title:'MitoActive launch film', len:'4:12', when:'Uploaded today', img:A + '0338ea58397dfd01.webp' };
  const CLIPS = [
    { img:A+'WhatsAppImage2026-09-29at1.13.38PM.webp', s:92, d:'0:32', t:'The 24-hour result nobody believes', cap:W('Twenty four hours later my scalp felt different'), why:'Opens on a number and a claim in the first second.',
      sub:{ Hook:9.6, Flow:8.8, Value:9.1, Trend:8.4 }, hooks:['Twenty four hours. That’s all it took.', 'I didn’t believe the 24-hour claim either.', 'What your scalp does in a day.'], tr:[42, 74] },
    { img:A+'0338ea58397dfd01.webp', s:88, d:'0:27', t:'Why two bottles beat one', cap:W('One bottle treats the scalp the other treats the hair'), why:'Clear before-and-after logic, and the price lands at the end.',
      sub:{ Hook:8.6, Flow:9.0, Value:9.2, Trend:7.6 }, hooks:['Your shampoo is doing half the job.', 'Two bottles. One routine.', 'Why one bottle was never enough.'], tr:[96, 123] },
    { img:A+'013cebb255ef9f20.webp', s:85, d:'0:41', t:'The derma roller, explained in 40 seconds', cap:W('Roll it twice a week never on a wet scalp'), why:'A how-to with a rule people save and share.',
      sub:{ Hook:8.1, Flow:8.7, Value:9.4, Trend:7.9 }, hooks:['Never use a derma roller on a wet scalp.', 'Twice a week. Here’s why not more.', 'The one rule for derma rolling.'], tr:[131, 172] },
    { img:A+'0fda74d9269e294b.webp', s:81, d:'0:22', t:'What a trichologist checks first', cap:W('The first thing I look at is the parting line'), why:'An expert voice, short and specific.',
      sub:{ Hook:8.4, Flow:7.9, Value:8.3, Trend:7.2 }, hooks:['A trichologist looks here first.', 'Check your parting line tonight.', 'The first sign of thinning isn’t where you think.'], tr:[188, 210] },
    { img:A+'1ab2da3aaecb61e3.webp', s:77, d:'0:35', t:'474 reviews, read so you don’t have to', cap:W('Most people saw it in the third week not the first'), why:'Social proof with a realistic timeline.',
      sub:{ Hook:7.4, Flow:8.1, Value:8.0, Trend:7.0 }, hooks:['474 people tried it. Here’s week three.', 'It’s not week one. It’s week three.', 'What 474 reviews actually say.'], tr:[214, 249] },
    { img:A+'af66b8c0b816ba22.webp', s:73, d:'0:29', t:'The morning routine in one take', cap:W('Serum on dry scalp then breakfast that is it'), why:'Easy to copy, a little slow to start.',
      sub:{ Hook:6.8, Flow:8.4, Value:7.6, Trend:7.1 }, hooks:['My whole routine takes 40 seconds.', 'Serum, then breakfast. That’s it.', 'The laziest routine that works.'], tr:[0, 29] },
    { img:A+'cacf2208993c7254.webp', s:69, d:'0:38', t:'Mitochondria, in plain words', cap:W('Your hair follicles run on energy like everything else'), why:'Good science, but the hook is soft.',
      sub:{ Hook:6.2, Flow:7.6, Value:8.2, Trend:6.4 }, hooks:['Your hair runs out of energy.', 'Mitochondria, but make it hair.', 'Why tired follicles shed.'], tr:[30, 68] },
    { img:A+'f62d1a59cebcbe98.webp', s:64, d:'0:24', t:'Unboxing the starter box', cap:W('Everything you need for the first thirty days'), why:'Pretty, but nothing happens in the first three seconds.',
      sub:{ Hook:5.6, Flow:7.2, Value:7.0, Trend:6.8 }, hooks:['Thirty days, one box.', 'Everything in the MitoActive starter box.', 'Open this before you buy another serum.'], tr:[226, 250] }
  ];
  const WORKS = [
    { img:A+'Anti-Dandruff_Shampoo_Secondary_Card.webp', x:'57x', t:'3 things I wish I knew about rosemary oil' },
    { img:A+'Anti_Dandruff_Shampoo_Website_Secondaries_Card_1_e566ee89-b600-4888-a2ea-6735a4f3c2fa.webp', x:'53x', t:'Stop buying whatever is trending' },
    { img:A+'HairGrowthShampoo_SerumDuoAmazonSecondaryCard_1.webp', x:'21x', t:'Nobody warned me about thinning hair' },
    { img:A+'HairGrowthShampoo_SerumDuoAmazonSecondaryCard_2.webp', x:'16x', t:'Everyone gets rosemary oil wrong' }
  ];
  const PRODUCTS = [
    ['MitoActive serum', A + 'pack-arata-mitoactive-mitochondrial-hair-growth-serum-30-ml.webp'],
    ['Hair Growth Intensive Serum', A + 'pack-arata-intensive-hair-growth-serum-hair-fall-30ml.webp'],
    ['Anti-Hair Fall Shampoo', A + 'pack-arata-anti-hair-fall-shampoo-200ml.webp'],
    ['Anti-Dandruff Shampoo', A + 'pack-arata-anti-dandruff-shampoo-200ml.webp']
  ];
  let clips = CLIPS.map((c, i) => ({ ...c, id:'c' + i, hook:0, style:'bold', state:'' }));
  let src = 'video', sort = 'score';

  /* ---------- the page ---------- */
  const page = document.createElement('section');
  page.className = 'cx-page rm-page'; page.id = 'rm-page'; page.hidden = true; page.setAttribute('aria-labelledby', 'rm-title');
  document.body.appendChild(page);

  const tile = (c) => `
    <button class="rm-tile${c.fresh ? ' is-fresh' : ''}" data-rmclip="${c.id}" aria-label="${esc(c.t)}, score ${c.s}">
      <span class="rm-frame"><img src="${c.img}" alt="" loading="lazy">
        <i class="rm-score${c.s >= 85 ? ' is-hi' : c.s >= 70 ? ' is-mid' : ''}">${c.s}</i>
        <i class="rm-dur">${c.d}</i>
        <span class="rm-cap">${capHTML(c, 3, 1)}</span>
        ${c.state ? `<i class="rm-state">${esc(c.state)}</i>` : ''}
      </span>
      <span class="rm-t">${esc(c.t)}</span>
      <span class="rm-m">${c.sloosh ? 'Made with Sloosh' : 'From ' + esc(SRC.title)}</span>
    </button>`;
  const capHTML = (c, n, hi) => c.cap.slice(0, n).map((w, i) => `<span${i === hi ? ' class="on"' : ''}>${esc(w)}</span>`).join(' ');
  const sorted = () => clips.slice().sort((a, b) => sort === 'score' ? b.s - a.s : sort === 'short' ? (parseInt(a.d.slice(2)) - parseInt(b.d.slice(2))) : 0);

  const paint = () => {
    page.innerHTML = `<div class="cx-in rm-in">
      <header class="rm-top">
        <div><h1 id="rm-title">Reel Maker</h1><p>One video in, a week of reels out. Or start from a product and Sloosh shoots it.</p></div>
        <button class="rm-x" data-rmx aria-label="Close">${svgI(I.x, 18)}</button>
      </header>

      <div class="rm-in-box">
        <div class="rm-src" role="tablist">
          <button role="tab" data-rmsrc="video" aria-selected="${src === 'video'}">${svgI(I.up, 15)}Video or link</button>
          <button role="tab" data-rmsrc="product" aria-selected="${src === 'product'}">${svgI(I.box, 15)}A product</button>
          <button role="tab" data-rmsrc="remake" aria-selected="${src === 'remake'}">${svgI(I.redo, 15)}A reel that works</button>
        </div>
        ${src === 'video' ? `<form class="rm-field" data-rmgo>${svgI(I.link, 18)}<input placeholder="Paste a link or drop a video" aria-label="Video link"><button class="rm-go" type="submit">Get clips</button></form>`
        : src === 'product' ? `<div class="rm-prods">${PRODUCTS.map(([n, im], i) => `<button class="rm-prod" data-rmprod="${i}"><img src="${im}" alt=""><span>${esc(n)}</span></button>`).join('')}</div>`
        : `<div class="rm-works">${WORKS.map((w, i) => `<button class="rm-work" data-rmwork="${i}"><span class="rm-frame"><img src="${w.img}" alt=""><i class="rm-score is-hi">${w.x}</i></span><span class="rm-t">${esc(w.t)}</span></button>`).join('')}</div>`}
        <p class="rm-hint">${src === 'video' ? 'Podcasts, founder videos, shoots, live streams. Up to 2 hours.' : src === 'product' ? 'Sloosh shoots three reels around the product, in your brand’s look.' : 'Pick one that’s working in hair growth. We rebuild it for Arata, with your product and your claims.'}</p>
      </div>

      <section class="rm-proj" id="rm-proj">
        <div class="rm-ph">
          <img src="${SRC.img}" alt="">
          <span><b>${esc(SRC.title)}</b><em>${SRC.len} · ${SRC.when} · ${clips.length} clips</em></span>
          <div class="rm-sort" role="tablist">${[['score', 'Best first'], ['short', 'Shortest']].map(([k, l]) => `<button data-rmsort="${k}" aria-selected="${sort === k}">${l}</button>`).join('')}</div>
        </div>
        <div class="rm-grid" id="rm-grid">${sorted().map(tile).join('')}</div>
      </section>
    </div>
    <div class="rm-ed-scrim" id="rm-ed" hidden></div>`;
  };

  /* ---------- the editor: play the clip, swap the hook, post it ---------- */
  let ed = null, edT = 0, edW = 0, playing = true;
  const STYLES = [['bold', 'Bold'], ['clean', 'Clean'], ['karaoke', 'Karaoke']];
  const edHTML = (c) => `
    <div class="rm-ed" role="dialog" aria-modal="true" aria-label="${esc(c.t)}">
      <div class="rm-player">
        <div class="rm-frame is-big" data-style="${c.style}"><img src="${c.img}" alt="">
          <span class="rm-hookline">${esc(c.hooks[c.hook])}</span>
          <span class="rm-cap is-live" id="rm-live"></span>
          <button class="rm-pp" data-rmpp aria-label="Pause">${svgI(I.pause, 18)}</button>
          <i class="rm-bar"><i id="rm-bar"></i></i>
        </div>
      </div>
      <div class="rm-side">
        <header><span class="rm-score-big${c.s >= 85 ? ' is-hi' : c.s >= 70 ? ' is-mid' : ''}">${c.s}</span><span><b>${esc(c.t)}</b><em>${c.d} · ${c.sloosh ? 'Made with Sloosh' : esc(SRC.title)}</em></span><button class="rm-x" data-edx aria-label="Close">${svgI(I.x, 18)}</button></header>
        <p class="rm-why">${esc(c.why)}</p>
        <div class="rm-subs">${Object.entries(c.sub).map(([k, v]) => `<p><span>${k}</span><i><i style="--v:${v * 10}%"></i></i><b>${v.toFixed(1)}</b></p>`).join('')}</div>
        <p class="rm-k">Opening line</p>
        <div class="rm-hooks">${c.hooks.map((h, i) => `<button data-rmhook="${i}" aria-pressed="${i === c.hook}">${esc(h)}</button>`).join('')}</div>
        <p class="rm-k">Captions</p>
        <div class="rm-styles">${STYLES.map(([k, l]) => `<button data-rmstyle="${k}" aria-pressed="${c.style === k}">${l}</button>`).join('')}</div>
        <div class="rm-acts">
          <button class="rm-go" data-rmpost>${c.state === 'Posted' ? svgI(I.ok, 16) + 'Posted to Instagram' : 'Post to Instagram'}</button>
          <button class="rm-sec" data-rmsched>${svgI(I.cal, 16)}${c.state === 'Scheduled' ? 'Thu 7:30 PM' : 'Schedule'}</button>
          <button class="rm-sec rm-ic" data-rmdl aria-label="Download">${svgI(I.down, 16)}</button>
        </div>
        <button class="rm-more" data-rmmore>${svgI(I.spark, 15)}Make 3 more like this with Sloosh</button>
      </div>
    </div>`;
  const playLive = () => {
    clearInterval(edT); const c = ed; if (!c) return;
    const live = document.getElementById('rm-live'), bar = document.getElementById('rm-bar'); if (!live) return;
    const tick = () => {
      if (!playing) return;
      const g = Math.floor(edW / 3) * 3, words = c.cap.slice(g, g + 3);
      live.innerHTML = words.map((w, i) => `<span${g + i === edW ? ' class="on"' : ''}>${esc(w)}</span>`).join(' ');
      bar.style.width = ((edW + 1) / c.cap.length * 100) + '%';
      edW = (edW + 1) % c.cap.length;
    };
    tick(); edT = setInterval(tick, 380);
  };
  const openEd = (id) => {
    const c = clips.find(x => x.id === id); if (!c) return;
    ed = c; edW = 0; playing = true;
    const box = document.getElementById('rm-ed'); box.innerHTML = edHTML(c); box.hidden = false;
    box.animate([{ opacity:0 }, { opacity:1 }], { duration:220, easing:'ease' });
    box.querySelector('.rm-ed').animate([{ opacity:0, transform:'translateY(12px)' }, { opacity:1, transform:'none' }], { duration:420, easing:'cubic-bezier(.22,1,.36,1)' });
    playLive();
  };
  const repaintEd = () => { if (!ed) return; const box = document.getElementById('rm-ed'); box.innerHTML = edHTML(ed); playLive(); };
  const closeEd = () => { clearInterval(edT); ed = null; const box = document.getElementById('rm-ed'); if (box) box.hidden = true; repaintGrid(); };
  const repaintGrid = () => { const g = document.getElementById('rm-grid'); if (g) g.innerHTML = sorted().map(tile).join(''); };

  /* ---------- making clips: a short, honest progress, then tiles arrive one by one ---------- */
  const STEPS = { video:['Fetching the video', 'Transcribing', 'Finding the moments', 'Reframing to 9:16', 'Writing captions'],
                  product:['Reading the product', 'Writing three scripts', 'Shooting with Sloosh', 'Adding captions'],
                  remake:['Watching the reel', 'Taking it apart', 'Rewriting it for Arata', 'Shooting with Sloosh'] };
  const make = (kind, title, imgs) => {
    const proj = document.getElementById('rm-proj');
    proj.innerHTML = `<div class="rm-making"><p class="rm-k">${esc(title)}</p><ol>${STEPS[kind].map(s => `<li>${esc(s)}</li>`).join('')}</ol></div><div class="rm-grid" id="rm-grid"></div>`;
    const lis = [...proj.querySelectorAll('li')];
    lis.forEach((li, i) => setTimeout(() => { lis.forEach((x, j) => x.className = j < i ? 'done' : j === i ? 'now' : ''); }, i * 900));
    setTimeout(() => {
      lis.forEach(x => x.className = 'done');
      const made = imgs.map((im, i) => ({ ...CLIPS[i % CLIPS.length], id:'n' + Date.now() + i, img:im, s:[90, 84, 79][i] || 75, hook:0, style:'bold', state:'', sloosh:kind !== 'video', fresh:true }));
      clips = made.concat(clips);
      const g = document.getElementById('rm-grid');
      made.forEach((c, i) => setTimeout(() => { g.insertAdjacentHTML('beforeend', tile(c)); }, i * 260));
      setTimeout(() => { window.__toast && window.__toast(`${made.length} clips ready. Best one scores ${made[0].s}.`); }, made.length * 260 + 200);
    }, lis.length * 900 + 200);
  };

  /* ---------- open, close, events ---------- */
  const open = () => {
    paint(); page.hidden = false; page.scrollTop = 0;
    document.querySelectorAll('.rail-btn').forEach(b => b.classList.toggle('is-on', b.dataset.nav === 'reels'));
  };
  const close = () => { if (page.hidden) return; closeEd(); page.hidden = true; document.querySelector('[data-nav="reels"]')?.classList.remove('is-on'); document.querySelector('[data-nav="home"]')?.classList.add('is-on'); };
  const go = () => window.__pageLoad ? window.__pageLoad('reels', open) : open();
  window.__reels = { open:go, close, toggle:() => page.hidden ? go() : close(), isOpen:() => !page.hidden };

  page.addEventListener('click', (e) => {
    const t = e.target;
    if (t.closest('[data-rmx]')) return close();
    if (t.closest('[data-edx]') || t.id === 'rm-ed') return closeEd();
    const s = t.closest('[data-rmsrc]'); if (s) { src = s.dataset.rmsrc; paint(); return; }
    const so = t.closest('[data-rmsort]'); if (so) { sort = so.dataset.rmsort; page.querySelectorAll('[data-rmsort]').forEach(b => b.setAttribute('aria-selected', String(b === so))); return repaintGrid(); }
    const cl = t.closest('[data-rmclip]'); if (cl) return openEd(cl.dataset.rmclip);
    const pr = t.closest('[data-rmprod]'); if (pr) { const [n, im] = PRODUCTS[+pr.dataset.rmprod]; return make('product', 'Sloosh is shooting ' + n, [im, A + '0fda74d9269e294b.webp', A + '1ab2da3aaecb61e3.webp']); }
    const wk = t.closest('[data-rmwork]'); if (wk) { const w = WORKS[+wk.dataset.rmwork]; return make('remake', 'Remaking “' + w.t + '” for Arata', [A + 'WhatsAppImage2026-09-29at1.13.38PM_2.webp', A + '013cebb255ef9f20.webp', A + 'af66b8c0b816ba22.webp']); }
    if (ed) {
      const h = t.closest('[data-rmhook]'); if (h) { ed.hook = +h.dataset.rmhook; return repaintEd(); }
      const st = t.closest('[data-rmstyle]'); if (st) { ed.style = st.dataset.rmstyle; return repaintEd(); }
      if (t.closest('[data-rmpp]')) { playing = !playing; const b = t.closest('[data-rmpp]'); b.innerHTML = svgI(playing ? I.pause : I.play, 18); b.setAttribute('aria-label', playing ? 'Pause' : 'Play'); return; }
      if (t.closest('[data-rmpost]')) { if (ed.state === 'Posted') return; ed.state = 'Posted'; repaintEd(); return window.__toast && window.__toast('Posted to @arata.in as a reel'); }
      if (t.closest('[data-rmsched]')) { ed.state = 'Scheduled'; repaintEd(); return window.__toast && window.__toast('Scheduled for Thursday, 7:30 PM'); }
      if (t.closest('[data-rmdl]')) return window.__toast && window.__toast('Downloading the 1080×1920 file');
      if (t.closest('[data-rmmore]')) { const base = ed; closeEd(); return make('product', 'Sloosh is making 3 more like “' + base.t + '”', [base.img, A + 'cacf2208993c7254.webp', A + 'f62d1a59cebcbe98.webp']); }
    }
  });
  page.addEventListener('submit', (e) => {
    if (!e.target.matches('[data-rmgo]')) return; e.preventDefault();
    const v = e.target.querySelector('input').value.trim() || 'youtube.com/watch?v=arata-founder-qna';
    make('video', 'Clipping ' + v.replace(/^https?:\/\//, '').slice(0, 48), [A + '0fda74d9269e294b.webp', A + 'WhatsAppImage2026-09-29at1.13.38PM.webp', A + '013cebb255ef9f20.webp', A + '1ab2da3aaecb61e3.webp']);
  });
  document.addEventListener('keydown', (e) => { if (e.key !== 'Escape' || page.hidden) return; if (ed) closeEd(); else close(); });

  /* ---------- a card at the top of the feed ---------- */
  const feedCard = () => {
    const top = CLIPS.slice(0, 3);
    return `<article class="card rm-card in" aria-label="Reel Maker">
      <div class="card-head"><img class="avatar" src="${(window.BRAND && BRAND.agents.creative) || ''}" alt=""><span class="identity"><span class="agent-name">Reel Maker</span><span class="meta">· 2 min</span></span><span class="badge info">New</span></div>
      <div class="card-body is-top"><h2 class="card-title">8 reels from your MitoActive launch film</h2><p class="card-sub">The best one scores 92. It opens on the 24-hour result.</p></div>
      <div class="rm-strip">${top.map((c, i) => `<button class="rm-tile" data-feedclip="${i}"><span class="rm-frame"><img src="${c.img}" alt=""><i class="rm-score${c.s >= 85 ? ' is-hi' : ' is-mid'}">${c.s}</i><i class="rm-dur">${c.d}</i><span class="rm-cap">${capHTML(c, 3, 1)}</span></span></button>`).join('')}</div>
      <button class="cta" data-openreels>${svgI(I.reel, 18)}<span>Open in Reel Maker</span>${svgI(I.chev, 17)}</button>
    </article>`;
  };
  const mount = () => {
    const f = document.getElementById('feed'); if (!f || f.querySelector('.rm-card')) return;
    f.insertAdjacentHTML('afterbegin', feedCard());
  };
  document.addEventListener('click', (e) => {
    const o = e.target.closest('[data-openreels], .story[data-story="reels"]');
    const fc = e.target.closest('[data-feedclip]');
    if (fc) { e.preventDefault(); go(); setTimeout(() => openEd(clips[+fc.dataset.feedclip].id), 900); return; }
    if (o) { e.preventDefault(); e.stopPropagation(); go(); }
  }, true);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
  setTimeout(mount, 300);

  /* ---------- styles: built on the Feed's tokens ---------- */
  const css = `
  .rm-page{z-index:57}
  .rm-in{width:min(1040px,100%)!important}
  .rm-top{display:flex;align-items:flex-start;gap:16px}
  .rm-top > div{flex:1;min-width:0}
  .rm-top h1{margin:0;font-size:32px;line-height:40px;font-weight:500;letter-spacing:-.02em}
  .rm-top p{margin:8px 0 0;font-size:16px;line-height:24px;color:var(--fg-2);max-width:52ch}
  .rm-x{flex:0 0 auto;width:36px;height:36px;border:0;border-radius:999px;background:rgba(var(--ink),.08);color:var(--fg-2);display:grid;place-items:center;cursor:pointer;transition:background .15s,color .15s}
  .rm-x:hover{background:rgba(var(--ink),.14);color:var(--fg)}
  .rm-in-box{margin-top:28px;padding:16px;border-radius:24px;background:var(--s1);box-shadow:inset 0 0 0 1px var(--line-soft)}
  .rm-src{display:flex;gap:4px;margin-bottom:14px}
  .rm-src button,.rm-sort button,.rm-styles button{height:32px;white-space:nowrap;padding:0 12px;border:0;border-radius:999px;background:transparent;color:var(--fg-2);font:inherit;font-size:13.5px;display:inline-flex;align-items:center;gap:7px;cursor:pointer;transition:background .15s,color .15s}
  .rm-src button:hover,.rm-sort button:hover,.rm-styles button:hover{color:var(--fg)}
  .rm-src button[aria-selected="true"],.rm-sort button[aria-selected="true"],.rm-styles button[aria-pressed="true"]{background:rgba(var(--ink),.1);color:var(--fg)}
  .rm-field{display:flex;align-items:center;gap:10px;height:56px;padding:0 6px 0 18px;border-radius:999px;background:var(--bg);box-shadow:inset 0 0 0 1px var(--line);color:var(--fg-3)}
  .rm-field:focus-within{box-shadow:inset 0 0 0 1px var(--fg-3)}
  .rm-field input{flex:1;min-width:0;height:100%;border:0;background:transparent;color:var(--fg);font:inherit;font-size:15px;outline:none}
  .rm-field input::placeholder{color:var(--fg-3)}
  .rm-go{height:44px;padding:0 20px;border:0;border-radius:999px;background:var(--fg);color:var(--bg);font:inherit;font-size:14px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;transition:opacity .2s,transform .15s}
  .rm-go:hover{opacity:.88} .rm-go:active{transform:scale(.97)}
  .rm-sec{height:44px;padding:0 16px;border:0;border-radius:999px;background:rgba(var(--ink),.1);color:var(--fg);font:inherit;font-size:14px;font-weight:500;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;transition:background .15s}
  .rm-sec:hover{background:rgba(var(--ink),.16)}
  .rm-sec.rm-ic{width:44px;padding:0}
  .rm-hint{margin:12px 4px 0;font-size:13px;color:var(--fg-3)}
  .rm-prods{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
  .rm-prod{display:flex;align-items:center;gap:10px;padding:8px 12px 8px 8px;border:0;border-radius:16px;background:var(--bg);box-shadow:inset 0 0 0 1px var(--line-soft);color:var(--fg);font:inherit;font-size:13.5px;text-align:left;cursor:pointer;transition:box-shadow .2s}
  .rm-prod:hover{box-shadow:inset 0 0 0 1px var(--fg-3)}
  .rm-prod img{width:44px;height:55px;object-fit:cover;border-radius:10px;flex:0 0 auto}
  .rm-works{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
  .rm-work{border:0;padding:0;background:none;color:var(--fg);font:inherit;text-align:left;cursor:pointer;display:flex;flex-direction:column;gap:8px}

  .rm-proj{margin-top:36px}
  .rm-ph{display:flex;align-items:center;gap:12px;margin-bottom:16px}
  .rm-ph img{width:44px;height:44px;border-radius:12px;object-fit:cover}
  .rm-ph > span{flex:1;min-width:0;display:flex;flex-direction:column}
  .rm-ph b{font-size:16px;font-weight:500;color:var(--fg)}
  .rm-ph em{font-style:normal;font-size:13px;color:var(--fg-3)}
  .rm-sort{display:flex;gap:2px;padding:3px;border-radius:999px;background:rgba(var(--ink),.05)}
  .rm-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px 14px}
  .rm-tile{border:0;padding:0;background:none;color:var(--fg);font:inherit;text-align:left;cursor:pointer;display:flex;flex-direction:column;gap:8px;min-width:0}
  .rm-tile.is-fresh{animation:rmIn .6s cubic-bezier(.22,1,.36,1) both}
  @keyframes rmIn{from{opacity:0;transform:translateY(10px)}}
  .rm-frame{position:relative;display:block;aspect-ratio:9/16;border-radius:16px;overflow:hidden;background:var(--s2)}
  .rm-frame img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform .6s cubic-bezier(.22,1,.36,1)}
  .rm-tile:hover .rm-frame img,.rm-work:hover .rm-frame img{transform:scale(1.04)}
  .rm-frame::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.35) 0%,transparent 26%,transparent 52%,rgba(0,0,0,.7) 100%);pointer-events:none}
  .rm-score{position:absolute;left:8px;top:8px;z-index:1;min-width:30px;height:24px;padding:0 8px;border-radius:999px;display:inline-grid;place-items:center;font-style:normal;font-size:12.5px;font-weight:700;color:#fff;background:rgba(0,0,0,.45);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);font-variant-numeric:tabular-nums}
  .rm-score.is-hi{color:#0b2e16;background:#30d158}
  .rm-score.is-mid{color:#3a2400;background:#ffd60a}
  .rm-dur{position:absolute;right:8px;top:8px;z-index:1;font-style:normal;font-size:12px;font-weight:600;color:#fff;text-shadow:0 1px 4px rgba(0,0,0,.5);font-variant-numeric:tabular-nums}
  .rm-state{position:absolute;left:8px;bottom:8px;z-index:2;height:22px;padding:0 8px;border-radius:999px;background:#fff;color:#000;font-style:normal;font-size:11.5px;font-weight:600;display:inline-flex;align-items:center}
  .rm-cap{position:absolute;left:10px;right:10px;bottom:16%;z-index:1;text-align:center;font-size:14px;line-height:1.25;font-weight:800;color:#fff;text-transform:uppercase;letter-spacing:-.01em;text-shadow:0 2px 10px rgba(0,0,0,.45)}
  .rm-cap span{display:inline-block;padding:1px 4px;border-radius:5px}
  .rm-cap span.on{background:#fff;color:#000;text-shadow:none}
  .rm-t{font-size:14px;line-height:19px;color:var(--fg);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
  .rm-m{font-size:12.5px;color:var(--fg-3);margin-top:-4px}
  .rm-k{margin:22px 0 10px;font-size:12.5px;font-weight:600;color:var(--fg-3)}
  .rm-making{margin-bottom:20px}
  .rm-making .rm-k{margin-top:0;font-size:15px;font-weight:500;color:var(--fg)}
  .rm-making ol{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:8px}
  .rm-making li{height:32px;padding:0 12px;border-radius:999px;background:rgba(var(--ink),.05);color:var(--fg-3);font-size:13px;display:inline-flex;align-items:center;transition:background .3s,color .3s}
  .rm-making li.now{color:var(--fg);background:rgba(var(--ink),.1);background-image:linear-gradient(100deg,transparent 30%,rgba(var(--ink),.12) 50%,transparent 70%);background-size:250% 100%;animation:rmShim 1.4s linear infinite}
  .rm-making li.done{color:var(--t-green);background:var(--t-green-bg)}
  @keyframes rmShim{from{background-position:130% 0}to{background-position:-130% 0}}

  /* editor */
  .rm-ed-scrim{position:fixed;inset:0;left:60px;z-index:60;background:rgba(0,0,0,.6);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);display:grid;place-items:center;padding:24px}
  :root[data-theme="light"] .rm-ed-scrim{background:rgba(242,242,247,.7)}
  .rm-ed-scrim[hidden]{display:none}
  .rm-ed{display:flex;gap:28px;width:min(860px,100%);max-height:calc(100vh - 48px);padding:20px;border-radius:28px;background:var(--s1);box-shadow:0 0 0 1px var(--line),0 30px 80px rgba(0,0,0,calc(.6 * var(--sh)));overflow:auto}
  .rm-player{flex:0 0 300px}
  .rm-frame.is-big{border-radius:20px}
  .rm-frame.is-big img{animation:rmKB 12s ease-in-out infinite alternate}
  @keyframes rmKB{from{transform:scale(1.02)}to{transform:scale(1.14) translate(-2%,-2%)}}
  .rm-hookline{position:absolute;left:14px;right:14px;top:14%;z-index:1;text-align:center;font-size:17px;line-height:1.25;font-weight:700;color:#fff;text-shadow:0 2px 12px rgba(0,0,0,.5)}
  .rm-cap.is-live{font-size:20px;bottom:18%}
  .rm-frame[data-style="clean"] .rm-cap{text-transform:none;font-weight:600}
  .rm-frame[data-style="clean"] .rm-cap span.on{background:none;color:#fff;text-decoration:underline;text-underline-offset:4px}
  .rm-frame[data-style="karaoke"] .rm-cap span{color:rgba(255,255,255,.55)}
  .rm-frame[data-style="karaoke"] .rm-cap span.on{background:none;color:#ffd60a}
  .rm-pp{position:absolute;right:12px;bottom:22px;z-index:2;width:36px;height:36px;border:0;border-radius:999px;background:rgba(0,0,0,.45);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);color:#fff;display:grid;place-items:center;cursor:pointer}
  .rm-bar{position:absolute;left:12px;right:12px;bottom:10px;z-index:2;height:3px;border-radius:2px;background:rgba(255,255,255,.3);overflow:hidden}
  .rm-bar > i{display:block;height:100%;width:0;background:#fff;transition:width .38s linear}
  .rm-side{flex:1;min-width:0;display:flex;flex-direction:column}
  .rm-side header{display:flex;align-items:flex-start;gap:12px}
  .rm-side header > span:not(.rm-score-big){flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
  .rm-side header b{font-size:18px;line-height:24px;font-weight:500;color:var(--fg)}
  .rm-side header em{font-style:normal;font-size:13px;color:var(--fg-3)}
  .rm-score-big{flex:0 0 auto;width:52px;height:52px;border-radius:16px;display:grid;place-items:center;font-size:20px;font-weight:700;color:var(--fg);background:rgba(var(--ink),.08);font-variant-numeric:tabular-nums}
  .rm-score-big.is-hi{color:var(--t-green);background:var(--t-green-bg)}
  .rm-score-big.is-mid{color:var(--t-orange);background:var(--t-orange-bg)}
  .rm-why{margin:14px 0 0;font-size:14.5px;line-height:21px;color:var(--fg-2)}
  .rm-subs{display:grid;grid-template-columns:1fr 1fr;gap:10px 20px;margin-top:16px}
  .rm-subs p{margin:0;display:grid;grid-template-columns:52px 1fr 28px;align-items:center;gap:10px;font-size:13px;color:var(--fg-2)}
  .rm-subs p > i{height:4px;border-radius:2px;background:rgba(var(--ink),.1);overflow:hidden}
  .rm-subs p > i > i{display:block;height:100%;width:var(--v);background:var(--fg);border-radius:2px;animation:rmBar .8s cubic-bezier(.22,1,.36,1) both}
  @keyframes rmBar{from{width:0}}
  .rm-subs b{font-weight:600;color:var(--fg);text-align:right;font-variant-numeric:tabular-nums}
  .rm-hooks{display:flex;flex-direction:column;gap:6px}
  .rm-hooks button{padding:10px 12px;border:0;border-radius:12px;background:rgba(var(--ink),.05);color:var(--fg-1);font:inherit;font-size:14px;text-align:left;cursor:pointer;transition:background .15s,box-shadow .15s}
  .rm-hooks button:hover{background:rgba(var(--ink),.08)}
  .rm-hooks button[aria-pressed="true"]{background:rgba(var(--ink),.1);box-shadow:inset 0 0 0 1.5px var(--fg);color:var(--fg)}
  .rm-styles{display:flex;gap:4px}
  .rm-acts{display:flex;gap:8px;margin-top:auto;padding-top:22px}
  .rm-acts .rm-go{flex:1}
  .rm-more{margin-top:10px;height:40px;border:0;border-radius:999px;background:transparent;color:var(--fg-2);font:inherit;font-size:13.5px;display:inline-flex;align-items:center;justify-content:center;gap:7px;cursor:pointer;transition:background .15s,color .15s}
  .rm-more:hover{background:rgba(var(--ink),.07);color:var(--fg)}

  /* feed card */
  .rm-card .card-head .badge{margin-left:auto}
  .rm-strip{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:0 12px}
  .rm-strip .rm-cap{font-size:11.5px}
  .rm-card .cta{margin:12px 12px 14px;width:calc(100% - 24px)}

  @media (max-width:900px){ .rm-grid,.rm-works{grid-template-columns:repeat(3,1fr)} .rm-prods{grid-template-columns:repeat(2,1fr)} }
  @media (max-width:600px){
    .rm-grid,.rm-works{grid-template-columns:repeat(2,1fr)}
    .rm-ed{flex-direction:column} .rm-player{flex:0 0 auto;width:min(260px,100%);margin:0 auto}
    .rm-ed-scrim{left:52px;padding:10px;place-items:start center;overflow:auto} .rm-ed{max-height:none;padding:14px;gap:18px}
    .rm-src{overflow-x:auto;scrollbar-width:none} .rm-src button{flex:0 0 auto;white-space:nowrap} .rm-ph .rm-sort{display:none}
  }
  @media (prefers-reduced-motion:reduce){ .rm-frame.is-big img,.rm-tile.is-fresh,.rm-making li.now{animation:none} }
  `;
  const st = document.createElement('style'); st.id = 'reels-css'; st.textContent = css; document.head.appendChild(st);
})();
