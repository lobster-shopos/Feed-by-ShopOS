/* Reel Maker — Sloosh suggests reels, makes them from a link, a video, a product or a reel that works,
   and you review, plan and post. Modelled on clip-makers like Opus Clip: one source in, a ranked set
   of short clips out, each with a score, captions and an opening line you can swap.
   Everything here is sample data. Test links: anything with "private" fails, "long" goes over the limit. */
(function () {
  'use strict';
  const A = 'assets/arata/';
  const esc = (v) => String(v == null ? '' : v).replace(/[&<>"]/g, (c) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' })[c]);
  const svgI = (d, s = 18) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const toast = (m, act) => window.__toast && window.__toast(m, act);
  const I = {
    reel:'<rect x="3" y="3" width="18" height="18" rx="5"/><path d="M3 8.5h18"/><path d="m8.5 3 2.5 5.5"/><path d="m14 3 2.5 5.5"/><path d="M10.5 12v5.2l4.3-2.6z"/>',
    link:'<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    up:'<path d="M12 19V5"/><path d="m5 12 7-7 7 7"/>', box:'<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5"/><path d="M12 13v8"/>',
    redo:'<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>', x:'<path d="M18 6 6 18M6 6l12 12"/>',
    play:'<polygon points="7 4 20 12 7 20 7 4" fill="currentColor"/>', pause:'<rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor"/><rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor"/>',
    spark:'<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/>', cal:'<path d="M8 2v4M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
    down:'<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>', ok:'<path d="M20 6 9 17l-5-5"/>', chev:'<path d="m9 18 6-6-6-6"/>', back:'<path d="m15 18-6-6 6-6"/>',
    search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>', alert:'<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>', film:'<rect x="2" y="3" width="20" height="18" rx="3"/><path d="M7 3v18M17 3v18M2 9h5M2 15h5M17 9h5M17 15h5"/>'
  };
  const W = (s) => s.split(' ');

  /* ---------- sample clips ---------- */
  const CLIPS = [
    { img:A+'WhatsAppImage2026-09-29at1.13.38PM.webp', s:92, d:'0:32', t:'The 24-hour result nobody believes', cap:W('Twenty four hours later my scalp felt different'), why:'Opens on a number and a claim in the first second.',
      sub:{ Hook:9.6, Flow:8.8, Value:9.1, Trend:8.4 }, hooks:['Twenty four hours. That’s all it took.', 'I didn’t believe the 24-hour claim either.', 'What your scalp does in a day.'] },
    { img:A+'0338ea58397dfd01.webp', s:88, d:'0:27', t:'Why two bottles beat one', cap:W('One bottle treats the scalp the other treats the hair'), why:'Clear before-and-after logic, and the price lands at the end.',
      sub:{ Hook:8.6, Flow:9.0, Value:9.2, Trend:7.6 }, hooks:['Your shampoo is doing half the job.', 'Two bottles. One routine.', 'Why one bottle was never enough.'] },
    { img:A+'013cebb255ef9f20.webp', s:85, d:'0:41', t:'The derma roller, explained in 40 seconds', cap:W('Roll it twice a week never on a wet scalp'), why:'A how-to with a rule people save and share.',
      sub:{ Hook:8.1, Flow:8.7, Value:9.4, Trend:7.9 }, hooks:['Never use a derma roller on a wet scalp.', 'Twice a week. Here’s why not more.', 'The one rule for derma rolling.'] },
    { img:A+'0fda74d9269e294b.webp', s:81, d:'0:22', t:'What a trichologist checks first', cap:W('The first thing I look at is the parting line'), why:'An expert voice, short and specific.',
      sub:{ Hook:8.4, Flow:7.9, Value:8.3, Trend:7.2 }, hooks:['A trichologist looks here first.', 'Check your parting line tonight.', 'The first sign of thinning isn’t where you think.'] },
    { img:A+'1ab2da3aaecb61e3.webp', s:77, d:'0:35', t:'474 reviews, read so you don’t have to', cap:W('Most people saw it in the third week not the first'), why:'Social proof with a realistic timeline.',
      sub:{ Hook:7.4, Flow:8.1, Value:8.0, Trend:7.0 }, hooks:['474 people tried it. Here’s week three.', 'It’s not week one. It’s week three.', 'What 474 reviews actually say.'] },
    { img:A+'af66b8c0b816ba22.webp', s:73, d:'0:29', t:'The morning routine in one take', cap:W('Serum on dry scalp then breakfast that is it'), why:'Easy to copy, a little slow to start.',
      sub:{ Hook:6.8, Flow:8.4, Value:7.6, Trend:7.1 }, hooks:['My whole routine takes 40 seconds.', 'Serum, then breakfast. That’s it.', 'The laziest routine that works.'] },
    { img:A+'cacf2208993c7254.webp', s:69, d:'0:38', t:'Mitochondria, in plain words', cap:W('Your hair follicles run on energy like everything else'), why:'Good science, but the opening is soft. Try a sharper first line.',
      sub:{ Hook:6.2, Flow:7.6, Value:8.2, Trend:6.4 }, hooks:['Your hair runs out of energy.', 'Mitochondria, but make it hair.', 'Why tired follicles shed.'] },
    { img:A+'f62d1a59cebcbe98.webp', s:64, d:'0:24', t:'Unboxing the starter box', cap:W('Everything you need for the first thirty days'), why:'Pretty, but nothing happens in the first three seconds.',
      sub:{ Hook:5.6, Flow:7.2, Value:7.0, Trend:6.8 }, hooks:['Thirty days, one box.', 'Everything in the MitoActive starter box.', 'Open this before you buy another serum.'] }
  ];
  /* what Sloosh made on its own, and why */
  const SUGGEST = [
    { img:A+'HairGrowthIntensiveSerum30ml_DermaRoller.webp', s:90, d:'0:24', t:'Rosemary oil vs a serum, honestly', cap:W('Rosemary oil smells nice a serum does the work'), why:'Answers the question people are searching for, in the first line.',
      sub:{ Hook:9.2, Flow:8.6, Value:8.9, Trend:9.6 }, hooks:['Rosemary oil isn’t the answer. Here’s what is.', 'I tried rosemary oil for 60 days.', 'Rosemary oil vs a real serum.'], reason:'Rosemary oil searches are up 3x this week' },
    { img:A+'WhatsAppImage2026-09-29at1.13.38PM_2.webp', s:87, d:'0:29', t:'24 hours later, part two', cap:W('You asked what happens after a week here it is'), why:'A follow-up to your best reel, while people still remember it.',
      sub:{ Hook:8.8, Flow:8.4, Value:8.6, Trend:8.0 }, hooks:['You asked for part two.', 'One week after the 24-hour reel.', 'What happened after day one.'], reason:'Your 24-hour reel got 3.1x your usual saves' },
    { img:A+'Mito_AHFShampoo4x5_1.webp', s:82, d:'0:31', t:'No fear, just the plan', cap:W('No scare tactics just three steps that work'), why:'A calm answer to the fear-led ads running in your category.',
      sub:{ Hook:8.0, Flow:8.5, Value:8.4, Trend:7.7 }, hooks:['Hair fall isn’t an emergency. Here’s the plan.', 'Three steps. No scare tactics.', 'Calm down. Then do this.'], reason:'A rival’s fear-led ad has run for 193 days' },
    { img:A+'Mito_SuperShampoo4x5.webp', s:76, d:'0:19', t:'A gift that isn’t another candle', cap:W('This Diwali give something they will actually use'), why:'Timely, but gifting reels need the price on screen sooner.',
      sub:{ Hook:7.6, Flow:7.8, Value:7.2, Trend:8.1 }, hooks:['Not another candle this Diwali.', 'The gift they’ll use every day.', 'Diwali gifting, sorted in 19 seconds.'], reason:'Diwali gifting searches start this week' }
  ];
  const WORKS = [
    { img:A+'Anti-Dandruff_Shampoo_Secondary_Card.webp', x:'57x', t:'3 things I wish I knew about rosemary oil' },
    { img:A+'Anti_Dandruff_Shampoo_Website_Secondaries_Card_1_e566ee89-b600-4888-a2ea-6735a4f3c2fa.webp', x:'53x', t:'Stop buying whatever is trending' },
    { img:A+'HairGrowthShampoo_SerumDuoAmazonSecondaryCard_1.webp', x:'21x', t:'Nobody warned me about thinning hair' },
    { img:A+'HairGrowthShampoo_SerumDuoAmazonSecondaryCard_2.webp', x:'16x', t:'Everyone gets rosemary oil wrong' }
  ];
  /* the store's catalogue, as Shopify would hand it over */
  const P = (n, img, p, x = {}) => ({ n, img: img ? A + img : '', p, ...x });
  const PRODUCTS = [
    P('MitoActive Hair Growth Serum, 30 ml', 'pack-arata-mitoactive-mitochondrial-hair-growth-serum-30-ml.webp', '₹1,299', { best:1 }),
    P('Hair Growth Intensive Serum, 30 ml', 'pack-arata-intensive-hair-growth-serum-hair-fall-30ml.webp', '₹642', { best:1 }),
    P('Anti-Hair Fall Intensive Shampoo, 200 ml', 'pack-arata-anti-hair-fall-shampoo-200ml.webp', '₹399', { best:1 }),
    P('Anti-Dandruff Shampoo, 200 ml', 'pack-arata-anti-dandruff-shampoo-200ml.webp', '₹399'),
    P('Anti-Dandruff Conditioner, 200 ml', 'Anti_Dandruff_Conditioner_200ml_1.webp', '₹399'),
    P('Hair Growth Serum + Derma Roller', 'HairGrowthIntensiveSerum30ml_DermaRoller.webp', '₹999'),
    P('Hair Growth System Combo', 'HairGrowthSystemCombo.webp', '₹1,449'),
    P('MitoActive, pack of 2', 'Mitoactive_pack_of_2_web.webp', '₹2,398'),
    P('MitoActive, pack of 3', 'Mitoactive_pack_of_3_web.webp', '₹3,297', { oos:1 }),
    P('Damage Defence Shampoo + Scalp Massager', 'DamageDefenceSuperShampoo200ml_ScalpMassager_f179c632-ed79-447f-9c5a-5c9177a81c73.webp', '₹649'),
    P('Anti-Dandruff Shampoo + Conditioner', 'Arata_Anti-Dandruff_Shampoo_Conditioner_Combo_1.webp', '₹749'),
    P('Anti-Dandruff Shampoo + Serum', 'Arata_Anti-Dandruff_Shampoo_Serum_Combo_1.webp', '₹849'),
    P('Anti-Grey Hair Serum, pack of 2', 'Anti_Grey_-_Pack_of_2.webp', '₹1,099'),
    P('Super Shampoo + Super Conditioner, 50 ml', 'Supershampoo50ml_Superconditioner50ml_e7e33d15-a798-45e7-b5e5-6fba73c79568.webp', '₹349'),
    P('Sleek Hair Styling Stick, 15 ml', 'Sleek_Hair_Styling_Stick_15_ml_1.webp', '₹349'),
    P('Strong Hold Styling Gel, 50 ml', 'StrongHoldStylingGel_50ml_956caac2-b40c-47d2-b467-8c928591acd6.webp', '₹299'),
    P('Texturising Styling Spray, 50 ml', 'TexturisingStylingSpray50ml_e42d2273-32ea-439f-a4c5-931445f8a549.webp', '₹449'),
    P('Smoothening + Odour-Control Body Wash', 'Smoothening_Odour-ControlBodyWashDuo.webp', '₹599'),
    P('Sunscreen, pack of 3', 'SunscreenPackof3_1.webp', '₹897'),
    P('Exfoliating Loofah', 'Loofah_Primary_Card_1.webp', '₹199'),
    P('Hair Growth Shampoo, 250 ml', '', '₹449', { nophoto:1 }),
    P('Arata Gift Card', '', '₹500', { nophoto:1 })
  ];
  const SLOTS = [
    { k:'tonight', l:'Tonight, 7:30 PM', s:'Tonight 7:30', n:'Your best hour' },
    { k:'tom', l:'Tomorrow, 9:00 AM', s:'Tue 9:00' },
    { k:'thu', l:'Thursday, 7:30 PM', s:'Thu 7:30' },
    { k:'sat', l:'Saturday, 11:00 AM', s:'Sat 11:00' }
  ];
  const slot = (k) => SLOTS.find(x => x.k === k);

  /* ---------- state ---------- */
  let uid = 0;
  const mk = (c, x = {}) => ({ ...c, id:'c' + (++uid), hook:0, style:'bold', state:'', when:'', ...x });
  const LAUNCH_URL = 'youtube.com/watch?v=mitoactive-launch';
  let projects = [{ id:'p0', kind:'video', title:'MitoActive launch film', url:LAUNCH_URL, meta:'4:12 · Uploaded today', img:A + '0338ea58397dfd01.webp', status:'done', clips:[] }];
  projects[0].clips = CLIPS.map(c => mk(c, { from:'MitoActive launch film' }));
  projects[0].clips[2].state = 'scheduled'; projects[0].clips[2].when = 'thu';
  projects[0].clips[4].state = 'posted'; projects[0].clips[4].when = 'Yesterday, 7:30 PM';
  let suggest = SUGGEST.map(c => mk(c, { sloosh:true, from:'Made by Sloosh' }));
  let credits = 12; const COST = 3;
  let view = 'foryou', src = 'link', sort = 'score';
  let picked = null, pq = '', pAct = -1;
  let linkErr = '', linkDup = null, linkVal = '';

  const allClips = () => suggest.concat(...projects.map(p => p.clips || []));
  const running = () => projects.filter(p => p.status === 'running');
  const doneCount = () => projects.reduce((n, p) => n + (p.status === 'done' ? p.clips.length : 0), 0);
  const plannedCount = () => allClips().filter(c => c.state).length;
  const findClip = (id) => allClips().find(c => c.id === id);
  const listOf = (c) => suggest.includes(c) ? suggest : (projects.find(p => p.clips.includes(c)) || {}).clips;
  const secs = (d) => { const [m, s] = d.split(':').map(Number); return m * 60 + s; };
  const sorted = (arr) => arr.slice().sort((a, b) => sort === 'short' ? secs(a.d) - secs(b.d) : b.s - a.s);
  const tone = (s) => s >= 85 ? ' is-hi' : s >= 70 ? ' is-mid' : '';

  /* ---------- the page ---------- */
  const page = document.createElement('section');
  page.className = 'cx-page rm-page'; page.id = 'rm-page'; page.hidden = true; page.setAttribute('aria-labelledby', 'rm-title');
  document.body.appendChild(page);

  const capHTML = (c, n, hi) => c.cap.slice(0, n).map((w, i) => `<span${i === hi ? ' class="on"' : ''}>${esc(w)}</span>`).join(' ');
  const stateTag = (c) => c.state === 'posted' ? `<i class="rm-state">${svgI(I.ok, 12)}Posted</i>` : c.state === 'scheduled' ? `<i class="rm-state">${svgI(I.cal, 12)}${esc(slot(c.when).s)}</i>` : '';
  const tile = (c) => `
    <button class="rm-tile${c.fresh ? ' is-fresh' : ''}" data-rmclip="${c.id}" aria-label="${esc(c.t)}, score ${c.s}">
      <span class="rm-frame"><img src="${c.img}" alt="" loading="lazy">
        <i class="rm-score${tone(c.s)}">${c.s}</i><i class="rm-dur">${c.d}</i>
        <span class="rm-cap">${capHTML(c, 3, 1)}</span>${stateTag(c)}
      </span>
      <span class="rm-t">${esc(c.t)}</span>
      <span class="rm-m">${esc(c.reason || c.from)}</span>
    </button>`;

  /* the make box: three ways in */
  const creditLine = () => credits >= COST ? `Uses ${COST} of your ${credits} Sloosh reels left this month.` : 'You’ve used this month’s Sloosh reels. Clipping your own videos is still free.';
  const boxHTML = () => {
    if (src === 'link') return `
      <form class="rm-field${linkErr ? ' is-err' : ''}" data-rmgo novalidate>${svgI(I.link, 18)}
        <input id="rm-url" placeholder="Paste a link, or drop a video" aria-label="Video link" aria-invalid="${!!linkErr}" aria-describedby="rm-urlmsg" value="${esc(linkVal)}" autocomplete="off" spellcheck="false">
        <button type="button" class="rm-icb" data-rmup data-tip="Upload a video" aria-label="Upload a video">${svgI(I.up, 17)}</button>
        <button class="rm-go" type="submit">Get clips</button></form>
      <input type="file" id="rm-file" accept="video/*" hidden>
      <p class="rm-hint${linkErr ? ' is-err' : ''}" id="rm-urlmsg" role="${linkErr ? 'alert' : ''}">${linkErr ? svgI(I.alert, 14) + esc(linkErr) + (linkDup ? ` <button class="rm-link" data-rmopen="${linkDup}">Open it</button>` : '') : 'YouTube, Instagram, Drive, Vimeo, Loom or a file. Up to 2 hours. Clipping your own video is free.'}</p>`;
    if (src === 'product') {
      if (picked) {
        const p = picked, ok = credits >= COST;
        return `<div class="rm-picked"><img src="${p.img}" alt=""><span><b>${esc(p.n)}</b><em>${p.p}${p.oos ? ' · <span class="rm-warn">Out of stock</span>' : ''}</em></span>
          <button class="rm-sec" data-rmchange>Change</button><button class="rm-go" data-rmshoot ${ok ? '' : 'disabled'}>Shoot 3 reels</button></div>
        <p class="rm-hint${p.oos ? ' is-warn' : ''}">${p.oos ? svgI(I.alert, 14) + 'It’s out of stock, so reels will point to a sold-out page until it’s back. ' : ''}${creditLine()}</p>`;
      }
      return `<div class="rm-combo">
          <div class="rm-field">${svgI(I.search, 18)}<input id="rm-pq" role="combobox" aria-autocomplete="list" aria-controls="rm-plist" aria-expanded="false" placeholder="Search ${PRODUCTS.length} products" aria-label="Search products" value="${esc(pq)}" autocomplete="off"></div>
          <ul class="rm-plist" id="rm-plist" role="listbox" aria-label="Products" hidden></ul>
        </div>
        <p class="rm-hint">Pick one product. Sloosh shoots three reels around it, in Arata’s look.</p>`;
    }
    const ok = credits >= COST;
    return `<div class="rm-works">${WORKS.map((w, i) => `<button class="rm-work" data-rmwork="${i}" ${ok ? '' : 'disabled'}><span class="rm-frame"><img src="${w.img}" alt=""><i class="rm-score is-hi" data-tip="Views compared with the account’s usual">${w.x}</i></span><span class="rm-t">${esc(w.t)}</span></button>`).join('')}</div>
      <p class="rm-hint">Reels working in hair care this week. Pick one and Sloosh rebuilds it for Arata, using only claims you can back. ${creditLine()}</p>`;
  };

  /* below the box: suggestions, your clips, what's planned */
  const projHTML = (p) => {
    if (p.status === 'running') return `
      <section class="rm-proj" data-proj="${p.id}">
        <div class="rm-ph"><span class="rm-pi">${svgI(p.kind === 'video' ? I.film : I.spark, 18)}</span><span><b>${esc(p.title)}</b><em>${esc(p.meta)}</em></span><button class="rm-sec rm-sm" data-rmstop="${p.id}">Stop</button></div>
        <ol class="rm-steps">${p.steps.map((s, i) => `<li class="${i < p.at ? 'done' : i === p.at ? 'now' : ''}">${esc(s)}</li>`).join('')}</ol>
        <div class="rm-grid">${p.steps.length ? Array.from({ length:p.n }, () => '<span class="rm-ghost"></span>').join('') : ''}</div>
      </section>`;
    if (p.status === 'failed') return `
      <section class="rm-proj" data-proj="${p.id}">
        <div class="rm-fail">${svgI(I.alert, 18)}<span><b>${esc(p.title)}</b><em>${esc(p.err)}</em></span>
          <button class="rm-sec rm-sm" data-rmup>Upload instead</button><button class="rm-sec rm-sm" data-rmretry="${p.id}">Try again</button><button class="rm-icb" data-rmdrop="${p.id}" aria-label="Remove" data-tip="Remove">${svgI(I.x, 16)}</button></div>
      </section>`;
    return `
      <section class="rm-proj" data-proj="${p.id}">
        <div class="rm-ph"><img src="${p.img}" alt=""><span><b>${esc(p.title)}</b><em>${esc(p.meta)} · ${p.clips.length} clips</em></span></div>
        ${p.note ? `<p class="rm-note">${svgI(I.alert, 14)}${esc(p.note)}</p>` : ''}
        ${p.clips.length ? `<div class="rm-grid">${sorted(p.clips).map(tile).join('')}</div>` : '<p class="rm-empty">Every clip from this one is skipped.</p>'}
      </section>`;
  };
  const plannedRow = (c) => `<button class="rm-row" data-rmclip="${c.id}"><img src="${c.img}" alt=""><span><b>${esc(c.t)}</b><em>${c.state === 'posted' ? 'Posted ' + esc(c.when.toLowerCase().startsWith('just') ? 'just now' : c.when) : esc(slot(c.when).l)} · ${c.d} · @arata.in</em></span>${svgI(I.chev, 16)}</button>`;
  const viewHTML = () => {
    const inbox = suggest.filter(c => !c.state);
    if (view === 'foryou') return inbox.length
      ? `<p class="rm-lede">Made overnight from what’s moving in hair care. Post it, plan it, or skip it.</p><div class="rm-grid">${sorted(inbox).map(tile).join('')}</div>`
      : '<p class="rm-empty">You’re through today’s picks. Sloosh makes new ones at 6 AM.</p>';
    if (view === 'clips') return projects.length
      ? `<div class="rm-vbar"><span></span><div class="rm-sort" role="tablist" aria-label="Sort clips">${[['score', 'Best first'], ['short', 'Shortest']].map(([k, l]) => `<button data-rmsort="${k}" aria-selected="${sort === k}">${l}</button>`).join('')}</div></div>${projects.map(projHTML).join('')}`
      : '<p class="rm-empty">No clips yet. Paste a link above to make some.</p>';
    const all = allClips(), up = all.filter(c => c.state === 'scheduled').sort((a, b) => SLOTS.indexOf(slot(a.when)) - SLOTS.indexOf(slot(b.when))), done = all.filter(c => c.state === 'posted');
    if (!up.length && !done.length) return '<p class="rm-empty">Nothing planned. Open a clip and schedule it.</p>';
    return `${up.length ? `<p class="rm-k">Going out</p><div class="rm-rows">${up.map(plannedRow).join('')}</div>` : ''}${done.length ? `<p class="rm-k">Posted</p><div class="rm-rows">${done.map(plannedRow).join('')}</div>` : ''}`;
  };
  const tabsHTML = () => [['foryou', 'For you', suggest.filter(c => !c.state).length], ['clips', 'Your clips', doneCount() + running().length], ['planned', 'Planned', plannedCount()]]
    .map(([k, l, n]) => `<button role="tab" data-rmview="${k}" aria-selected="${view === k}">${l}${n ? `<i>${n}</i>` : ''}</button>`).join('');

  const paint = () => {
    page.innerHTML = `<div class="cx-in rm-in">
      <header class="rm-top">
        <div><h1 id="rm-title">Reel Maker</h1><p>Sloosh finds what to post and makes it. You pick what goes out.</p></div>
        <button class="rm-x" data-rmx aria-label="Close Reel Maker">${svgI(I.x, 18)}</button>
      </header>
      <div class="rm-in-box">
        <div class="rm-src" role="tablist" aria-label="Make reels from">
          <button role="tab" data-rmsrc="link" aria-selected="${src === 'link'}">${svgI(I.link, 15)}A link or video</button>
          <button role="tab" data-rmsrc="product" aria-selected="${src === 'product'}">${svgI(I.box, 15)}A product</button>
          <button role="tab" data-rmsrc="remake" aria-selected="${src === 'remake'}">${svgI(I.redo, 15)}A reel that works</button>
        </div>
        <div id="rm-box">${boxHTML()}</div>
      </div>
      <nav class="rm-tabs" role="tablist" aria-label="Reels" id="rm-tabs">${tabsHTML()}</nav>
      <div id="rm-view" class="rm-view">${viewHTML()}</div>
    </div>
    <div class="rm-ed-scrim" id="rm-ed" hidden></div>
    <div class="rm-dropzone" id="rm-dz" hidden><span>${svgI(I.up, 22)}Drop the video to clip it</span></div>`;
  };
  const repaintBox = () => { const b = document.getElementById('rm-box'); if (b) b.innerHTML = boxHTML(); };
  const repaintView = () => {
    const v = document.getElementById('rm-view'), t = document.getElementById('rm-tabs');
    if (v) v.innerHTML = viewHTML(); if (t) t.innerHTML = tabsHTML();
    allClips().forEach(c => { c.fresh = false; });
  };
  const setView = (k) => { view = k; repaintView(); };

  /* ---------- product search: the whole catalogue, keyboard first ---------- */
  const matches = () => { const q = pq.trim().toLowerCase(); const l = q ? PRODUCTS.filter(p => p.n.toLowerCase().includes(q)) : PRODUCTS.slice(); return l.sort((a, b) => (b.best || 0) - (a.best || 0)); };
  const renderList = (show = true) => {
    const ul = document.getElementById('rm-plist'), inp = document.getElementById('rm-pq'); if (!ul || !inp) return;
    const l = matches();
    if (pAct >= l.length) pAct = l.length - 1;
    ul.innerHTML = l.length ? l.map((p, i) => {
      const k = PRODUCTS.indexOf(p);
      return `<li role="option" id="rm-po${k}" data-rmprod="${k}" aria-selected="${i === pAct}" aria-disabled="${!!p.nophoto}" class="${i === pAct ? 'is-act' : ''}">
        ${p.img ? `<img src="${p.img}" alt="">` : `<span class="rm-noimg">${svgI(I.box, 16)}</span>`}
        <span><b>${esc(p.n)}</b><em>${p.p}${p.best && !pq ? ' · Best seller' : ''}</em></span>
        ${p.nophoto ? '<i class="rm-tag" data-tip="Add photos in Shopify to shoot this one">No photos</i>' : p.oos ? '<i class="rm-tag is-warn">Out of stock</i>' : ''}</li>`;
    }).join('') : `<li class="rm-none">No product matches “${esc(pq)}”.</li>`;
    ul.hidden = !show; inp.setAttribute('aria-expanded', String(show));
    const act = l[pAct]; inp.setAttribute('aria-activedescendant', act ? 'rm-po' + PRODUCTS.indexOf(act) : '');
    const a = ul.querySelector('.is-act'); a && a.scrollIntoView({ block:'nearest' });
  };
  const pick = (k) => {
    const p = PRODUCTS[k]; if (!p) return;
    if (p.nophoto) return toast('No photos for this one yet. Add them in Shopify, then shoot.');
    picked = p; pq = ''; pAct = -1; repaintBox();
    page.querySelector('[data-rmshoot]')?.focus();
  };

  /* ---------- the editor: play, swap the opening, fix a word, plan or post ---------- */
  let ed = null, edT = 0, edW = 0, playing = true, edPop = false, edFix = false, edBusy = false;
  const STYLES = [['bold', 'Bold'], ['clean', 'Clean'], ['karaoke', 'Karaoke']];
  const edHTML = (c) => {
    const list = sorted(listOf(c) || [c]), i = list.indexOf(c), live = c.state === 'posted';
    return `
    <div class="rm-ed" role="dialog" aria-modal="true" aria-label="${esc(c.t)}">
      <div class="rm-player">
        <div class="rm-frame is-big" data-style="${c.style}"><img src="${c.img}" alt="">
          <span class="rm-hookline">${esc(c.hooks[c.hook])}</span>
          <span class="rm-cap is-live" id="rm-live"></span>
          <button class="rm-pp" data-rmpp aria-label="${playing ? 'Pause' : 'Play'}">${svgI(playing ? I.pause : I.play, 18)}</button>
          <i class="rm-bar"><i id="rm-bar"></i></i>
        </div>
      </div>
      <div class="rm-side">
        <header><span class="rm-score-big${tone(c.s)}">${c.s}</span><span><b>${esc(c.t)}</b><em>${c.d} · ${esc(c.reason || c.from)}</em></span>
          <span class="rm-nav"><button class="rm-x" data-rmstep="-1" aria-label="Previous clip" ${i <= 0 ? 'disabled' : ''}>${svgI(I.back, 17)}</button><button class="rm-x" data-rmstep="1" aria-label="Next clip" ${i >= list.length - 1 ? 'disabled' : ''}>${svgI(I.chev, 17)}</button><button class="rm-x" data-edx aria-label="Close">${svgI(I.x, 18)}</button></span></header>
        <p class="rm-why">${esc(c.why)}</p>
        <div class="rm-subs">${Object.entries(c.sub).map(([k, v]) => `<p><span>${k}</span><i><i style="--v:${v * 10}%"></i></i><b>${v.toFixed(1)}</b></p>`).join('')}</div>
        ${live ? `<p class="rm-note is-ok">${svgI(I.ok, 14)}It’s live on @arata.in, so changes here won’t reach Instagram.</p>` : ''}
        <fieldset class="rm-fs" ${live ? 'disabled' : ''}>
          <p class="rm-k">Opening line</p>
          <div class="rm-hooks">${c.hooks.map((h, j) => `<button data-rmhook="${j}" aria-pressed="${j === c.hook}">${esc(h)}</button>`).join('')}</div>
          <p class="rm-k">Captions</p>
          <div class="rm-styles">${STYLES.map(([k, l]) => `<button data-rmstyle="${k}" aria-pressed="${c.style === k}">${l}</button>`).join('')}<button class="rm-fixb" data-rmfix aria-expanded="${edFix}">Fix a word</button></div>
          ${edFix ? `<textarea class="rm-capedit" id="rm-capedit" rows="2" aria-label="Caption words">${esc(c.cap.join(' '))}</textarea><p class="rm-hint" id="rm-capmsg">Captions come from the transcript. Fix names and numbers here.</p>` : ''}
        </fieldset>
        <div class="rm-acts">
          ${live ? `<button class="rm-go" data-rmview-ig>View on Instagram</button>`
                 : `<button class="rm-go" data-rmpost ${edBusy ? 'disabled' : ''}>${edBusy ? 'Posting…' : 'Post now'}</button>
                    <span class="rm-popw"><button class="rm-sec" data-rmsched aria-expanded="${edPop}">${svgI(I.cal, 16)}${c.state === 'scheduled' ? esc(slot(c.when).s) : 'Schedule'}</button>
                    ${edPop ? `<div class="rm-pop" role="menu">${SLOTS.map(sl => { const by = allClips().find(x => x !== c && x.state === 'scheduled' && x.when === sl.k); return `<button role="menuitem" data-rmslot="${sl.k}" ${by ? 'disabled' : ''} aria-checked="${c.when === sl.k}"><span>${sl.l}</span><em>${by ? 'Taken by “' + esc(by.t) + '”' : sl.n || ''}</em>${c.when === sl.k ? svgI(I.ok, 15) : ''}</button>`; }).join('')}${c.state === 'scheduled' ? '<button role="menuitem" data-rmunsched class="is-quiet"><span>Don’t schedule</span></button>' : ''}</div>` : ''}</span>`}
          <button class="rm-sec rm-ic" data-rmdl aria-label="Download" data-tip="Download 1080×1920">${svgI(I.down, 16)}</button>
        </div>
        <div class="rm-subacts">
          <button class="rm-more" data-rmmore ${credits >= COST ? '' : 'disabled'} ${credits >= COST ? `data-tip="Uses ${COST} of your ${credits} Sloosh reels"` : 'data-tip="No Sloosh reels left this month"'}>${svgI(I.spark, 15)}Make 3 more like this</button>
          ${live ? '' : '<button class="rm-more" data-rmskip>Not this one</button>'}
        </div>
      </div>
    </div>`;
  };
  const playLive = () => {
    clearInterval(edT); const c = ed; if (!c) return;
    const live = document.getElementById('rm-live'), bar = document.getElementById('rm-bar'); if (!live) return;
    const tick = () => {
      if (!playing || !c.cap.length) return;
      edW = edW % c.cap.length;
      const g = Math.floor(edW / 3) * 3, words = c.cap.slice(g, g + 3);
      live.innerHTML = words.map((w, i) => `<span${g + i === edW ? ' class="on"' : ''}>${esc(w)}</span>`).join(' ');
      bar.style.width = ((edW + 1) / c.cap.length * 100) + '%';
      edW = (edW + 1) % c.cap.length;
    };
    tick(); edT = setInterval(tick, 380);
  };
  const openEd = (id) => {
    const c = findClip(id); if (!c) return;
    const was = !!ed; ed = c; edW = 0; playing = true; edPop = false; edFix = false; edBusy = false;
    const box = document.getElementById('rm-ed'); box.innerHTML = edHTML(c); box.hidden = false;
    if (!was) {
      box.animate([{ opacity:0 }, { opacity:1 }], { duration:220, easing:'ease' });
      box.querySelector('.rm-ed').animate([{ opacity:0, transform:'translateY(12px)' }, { opacity:1, transform:'none' }], { duration:420, easing:'cubic-bezier(.22,1,.36,1)' });
      box.querySelector('[data-edx]')?.focus({ preventScroll:true });
    }
    playLive();
  };
  const repaintEd = (keepFocus) => {
    if (!ed) return; const box = document.getElementById('rm-ed');
    const sel = keepFocus && document.activeElement && document.activeElement.closest('#rm-ed') ? (document.activeElement.id ? '#' + document.activeElement.id : null) : null;
    box.innerHTML = edHTML(ed); playLive();
    if (sel) { const el = box.querySelector(sel); if (el) { el.focus(); if (el.setSelectionRange) el.setSelectionRange(el.value.length, el.value.length); } }
  };
  const closeEd = () => { clearInterval(edT); ed = null; edPop = false; const box = document.getElementById('rm-ed'); if (box) box.hidden = true; repaintView(); };
  const step = (d) => { if (!ed) return; const l = sorted(listOf(ed) || []); const n = l[l.indexOf(ed) + d]; if (n) openEd(n.id); };
  const skip = () => {
    const c = ed, l = listOf(c); if (!l) return;
    const order = sorted(l), next = order[order.indexOf(c) + 1] || order[order.indexOf(c) - 1];
    const at = l.indexOf(c); l.splice(at, 1);
    if (next) openEd(next.id); else closeEd();
    repaintView();
    toast('Skipped. Sloosh will make fewer like it.', { label:'Undo', on:() => { l.splice(at, 0, c); repaintView(); } });
  };

  /* ---------- making reels: honest steps, ghost tiles, then real ones arrive ---------- */
  const STEPS = { video:['Fetching the video', 'Transcribing', 'Finding the moments', 'Reframing to 9:16', 'Writing captions'],
                  product:['Reading the product', 'Writing three scripts', 'Checking claims', 'Shooting with Sloosh', 'Adding captions'],
                  remake:['Watching the reel', 'Taking it apart', 'Rewriting it for Arata', 'Checking claims', 'Shooting with Sloosh'] };
  const IMGS = { video:['0fda74d9269e294b.webp', 'WhatsAppImage2026-09-29at1.13.38PM.webp', '013cebb255ef9f20.webp', '1ab2da3aaecb61e3.webp'], other:['0fda74d9269e294b.webp', '1ab2da3aaecb61e3.webp'] };
  const STEP_MS = 1100;
  const run = (opt) => {
    const p = { id:'p' + (++uid), status:'running', at:0, clips:[], steps:STEPS[opt.kind], n:opt.kind === 'video' ? 4 : 3, timers:[], ...opt };
    if (opt.kind !== 'video') { credits -= COST; p.paid = true; }
    projects.unshift(p);
    view = 'clips'; repaintView(); if (src !== 'link') repaintBox();
    document.getElementById('rm-tabs')?.scrollIntoView({ behavior:'smooth', block:'start' });
    const failAt = opt.fail ? 0 : -1;
    p.steps.forEach((_, i) => p.timers.push(setTimeout(() => {
      if (p.status !== 'running') return;
      if (i === failAt + 1 && failAt >= 0) { p.status = 'failed'; p.err = opt.fail; repaintView(); return; }
      p.at = i; repaintView();
    }, i * STEP_MS)));
    p.timers.push(setTimeout(() => {
      if (p.status !== 'running') return;
      const imgs = opt.imgs || (opt.kind === 'video' ? IMGS.video : [opt.img].concat(IMGS.other)).map(x => x.startsWith(A) ? x : A + x);
      const scores = opt.kind === 'video' ? [91, 86, 78, 71] : [90, 84, 79];
      p.clips = imgs.slice(0, p.n).map((im, i) => mk(CLIPS[(i + 1) % CLIPS.length], { img:im, s:scores[i], from:p.title, sloosh:opt.kind !== 'video', fresh:true }));
      p.status = 'done'; p.img = imgs[0];
      repaintView();
      const best = p.clips[0];
      if (page.hidden) toast(`${p.clips.length} reels ready from “${p.title}”`, { label:'Open', on:() => { view = 'clips'; go(); } });
      else toast(`${p.clips.length} clips ready. Best one scores ${best.s}.`);
    }, p.steps.length * STEP_MS + 300));
    return p;
  };
  const stop = (id) => {
    const p = projects.find(x => x.id === id); if (!p) return;
    p.timers.forEach(clearTimeout); projects = projects.filter(x => x !== p);
    if (p.paid) credits += COST;
    repaintView(); repaintBox();
    toast(p.paid ? `Stopped. Your ${COST} Sloosh reels are back.` : 'Stopped clipping.');
  };

  /* links: check before we spend anyone's time */
  const HOSTS = /(^|\.)(youtube\.com|youtu\.be|instagram\.com|drive\.google\.com|vimeo\.com|loom\.com|dropbox\.com)$/;
  const fromLink = (raw) => {
    linkVal = raw; linkErr = ''; linkDup = null;
    const v = raw.trim();
    if (!v) { linkErr = 'Paste a link first, or drop a video.'; return repaintBox(); }
    let u; try { u = new URL(/^https?:\/\//i.test(v) ? v : 'https://' + v); } catch (_) { u = null; }
    if (!u || !/\.[a-z]{2,}$/i.test(u.hostname) || /\s/.test(v)) { linkErr = 'That doesn’t look like a link.'; return repaintBox(); }
    const host = u.hostname.replace(/^www\.|^m\./, '').toLowerCase();
    if (!HOSTS.test(host)) { linkErr = 'We can read YouTube, Instagram, Drive, Vimeo, Loom and Dropbox links. For anything else, upload the file.'; return repaintBox(); }
    const norm = (host + u.pathname + u.search).replace(/\/$/, '').toLowerCase();
    const dup = projects.find(p => p.url === norm && p.status !== 'failed');
    if (dup) { linkErr = dup.status === 'running' ? 'This one is being clipped right now.' : 'You’ve already clipped this video.'; linkDup = dup.id; return repaintBox(); }
    if (running().filter(p => p.kind === 'video').length >= 2) { linkErr = 'Two videos are being clipped. Start this one when one finishes.'; return repaintBox(); }
    const name = host.includes('youtu') ? 'YouTube video' : host.includes('instagram') ? 'Instagram reel' : host.includes('drive') ? 'Drive video' : host.split('.')[0][0].toUpperCase() + host.split('.')[0].slice(1) + ' video';
    linkVal = ''; repaintBox();
    run({ kind:'video', url:norm, raw:v, title:name, meta:(host + u.pathname + u.search).replace(/\/$/, '').slice(0, 44) + ' · Added just now',
      fail:/private/i.test(v) ? 'This video is private, so we can’t read it. Make it public or unlisted, or upload the file.' : '',
      note:/long/i.test(v) ? 'It runs 3h 10m, past the 2-hour limit. We clipped the first 2 hours.' : '' });
  };
  const fromFile = (f) => {
    if (!f) return;
    src = 'link'; linkErr = ''; linkDup = null;
    if (!/^video\//.test(f.type) && !/\.(mp4|mov|webm|m4v)$/i.test(f.name)) { linkErr = `That’s a ${((f.name.split('.').pop() || 'non-video') + '').toUpperCase()} file. Drop a video: MP4, MOV or WebM.`; paintKeep(); return; }
    if (f.size > 4 * 1024 ** 3) { linkErr = 'That file is over 4 GB. Trim it, or share a Drive link instead.'; paintKeep(); return; }
    paintKeep();
    run({ kind:'video', url:'file:' + f.name + f.size, title:f.name.replace(/\.[^.]+$/, ''), meta:'Uploaded just now' });
  };
  const paintKeep = () => { page.querySelectorAll('[data-rmsrc]').forEach(b => b.setAttribute('aria-selected', String(b.dataset.rmsrc === src))); repaintBox(); };

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
    if (ed && edPop && !t.closest('.rm-popw')) { edPop = false; repaintEd(); if (!t.closest('#rm-ed .rm-ed')) return; }
    if (t.closest('[data-rmx]')) return close();
    if (t.closest('[data-edx]') || t.id === 'rm-ed') return closeEd();
    if (!t.closest('.rm-combo')) { const ul = document.getElementById('rm-plist'); if (ul && !ul.hidden) renderList(false); }
    const s = t.closest('[data-rmsrc]'); if (s) { src = s.dataset.rmsrc; linkErr = ''; linkDup = null; return paintKeep(); }
    const vw = t.closest('[data-rmview]'); if (vw) return setView(vw.dataset.rmview);
    const so = t.closest('[data-rmsort]'); if (so) { sort = so.dataset.rmsort; return repaintView(); }
    const cl = t.closest('[data-rmclip]'); if (cl) return openEd(cl.dataset.rmclip);
    if (t.closest('[data-rmup]')) return document.getElementById('rm-file')?.click();
    const op = t.closest('[data-rmopen]'); if (op) { linkErr = ''; linkDup = null; linkVal = ''; repaintBox(); setView('clips'); return page.querySelector(`[data-proj="${op.dataset.rmopen}"]`)?.scrollIntoView({ behavior:'smooth', block:'start' }); }
    const sp = t.closest('[data-rmstop]'); if (sp) return stop(sp.dataset.rmstop);
    const rt = t.closest('[data-rmretry]'); if (rt) { const p = projects.find(x => x.id === rt.dataset.rmretry); projects = projects.filter(x => x !== p); return run({ kind:p.kind, url:p.url, raw:p.raw, title:p.title, meta:p.meta, fail:p.fail, note:p.note }); }
    const dr = t.closest('[data-rmdrop]'); if (dr) { projects = projects.filter(x => x.id !== dr.dataset.rmdrop); return repaintView(); }
    const pr = t.closest('[data-rmprod]'); if (pr) return pick(+pr.dataset.rmprod);
    if (t.closest('#rm-pq')) { renderList(true); return; }
    if (t.closest('[data-rmchange]')) { picked = null; repaintBox(); const i = document.getElementById('rm-pq'); i && i.focus(); return renderList(true); }
    if (t.closest('[data-rmshoot]')) { if (credits < COST) return; const p = picked; picked = null; return run({ kind:'product', title:p.n, meta:'Shot by Sloosh · Started just now', img:p.img, note:p.oos ? 'Out of stock right now. Hold these until it’s back.' : '' }); }
    const wk = t.closest('[data-rmwork]'); if (wk) { if (credits < COST) return; const w = WORKS[+wk.dataset.rmwork]; return run({ kind:'remake', title:'“' + w.t + '”, for Arata', meta:'Remade by Sloosh · Started just now', imgs:['WhatsAppImage2026-09-29at1.13.38PM_2.webp', '013cebb255ef9f20.webp', 'af66b8c0b816ba22.webp'].map(x => A + x), note:'We dropped one line we can’t back: “regrows hair in 7 days”.' }); }
    if (!ed) return;
    const stp = t.closest('[data-rmstep]'); if (stp) return step(+stp.dataset.rmstep);
    const h = t.closest('[data-rmhook]'); if (h) { ed.hook = +h.dataset.rmhook; return repaintEd(); }
    const st = t.closest('[data-rmstyle]'); if (st) { ed.style = st.dataset.rmstyle; return repaintEd(); }
    if (t.closest('[data-rmfix]')) { edFix = !edFix; repaintEd(); return document.getElementById('rm-capedit')?.focus(); }
    if (t.closest('[data-rmpp]')) { playing = !playing; const b = t.closest('[data-rmpp]'); b.innerHTML = svgI(playing ? I.pause : I.play, 18); b.setAttribute('aria-label', playing ? 'Pause' : 'Play'); return; }
    if (t.closest('[data-rmview-ig]')) return toast('Opening the reel on Instagram');
    if (t.closest('[data-rmpost]')) {
      if (edBusy) return; const c = ed, was = c.state === 'scheduled' ? slot(c.when).l : '';
      edBusy = true; repaintEd();
      setTimeout(() => {
        edBusy = false; c.state = 'posted'; c.when = 'Just now';
        if (ed === c) repaintEd(); repaintView();
        toast(was ? `Posted now, and taken off ${was}.` : 'Posted to @arata.in');
      }, 1100);
      return;
    }
    if (t.closest('[data-rmsched]')) { edPop = !edPop; return repaintEd(); }
    const sl = t.closest('[data-rmslot]'); if (sl) { ed.state = 'scheduled'; ed.when = sl.dataset.rmslot; edPop = false; repaintEd(); repaintView(); return toast('Scheduled for ' + slot(ed.when).l); }
    if (t.closest('[data-rmunsched]')) { const was = slot(ed.when).l; ed.state = ''; ed.when = ''; edPop = false; repaintEd(); repaintView(); return toast('Taken off ' + was); }
    if (t.closest('[data-rmdl]')) return toast('Downloading the 1080×1920 file');
    if (t.closest('[data-rmskip]')) return skip();
    if (t.closest('[data-rmmore]')) { if (credits < COST) return; const base = ed; closeEd(); return run({ kind:'product', title:'3 more like “' + base.t + '”', meta:'Shot by Sloosh · Started just now', imgs:[base.img, A + 'cacf2208993c7254.webp', A + 'f62d1a59cebcbe98.webp'] }); }
  });
  page.addEventListener('submit', (e) => { if (!e.target.matches('[data-rmgo]')) return; e.preventDefault(); fromLink(e.target.querySelector('input').value); });
  page.addEventListener('input', (e) => {
    if (e.target.id === 'rm-url' && linkErr) { linkErr = ''; linkDup = null; linkVal = e.target.value; const f = e.target.closest('.rm-field'), m = document.getElementById('rm-urlmsg'); f.classList.remove('is-err'); e.target.setAttribute('aria-invalid', 'false'); m.className = 'rm-hint'; m.removeAttribute('role'); m.textContent = 'YouTube, Instagram, Drive, Vimeo, Loom or a file. Up to 2 hours. Clipping your own video is free.'; }
    if (e.target.id === 'rm-pq') { pq = e.target.value; pAct = pq ? 0 : -1; renderList(true); }
    if (e.target.id === 'rm-capedit' && ed) {
      const w = e.target.value.split(/\s+/).filter(Boolean), m = document.getElementById('rm-capmsg');
      if (!w.length) { m.textContent = 'Captions can’t be empty. Undo, or type the line.'; m.classList.add('is-err'); return; }
      m.textContent = 'Saved. Captions come from the transcript. Fix names and numbers here.'; m.classList.remove('is-err');
      ed.cap = w; edW = 0;
    }
  });
  page.addEventListener('change', (e) => { if (e.target.id === 'rm-file') { fromFile(e.target.files[0]); e.target.value = ''; } });
  page.addEventListener('keydown', (e) => {
    if (e.target.id !== 'rm-pq') return;
    const l = matches(), ul = document.getElementById('rm-plist');
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); if (ul.hidden) { renderList(true); return; } let i = pAct; do { i = (i + (e.key === 'ArrowDown' ? 1 : -1) + l.length) % l.length; } while (l[i] && l[i].nophoto && i !== pAct); pAct = i; renderList(true); }
    else if (e.key === 'Enter') { e.preventDefault(); const p = l[pAct] || (l.length === 1 ? l[0] : null); if (p) pick(PRODUCTS.indexOf(p)); }
    else if (e.key === 'Escape' && !ul.hidden) { e.preventDefault(); e.stopPropagation(); renderList(false); }
  });
  /* drop a file anywhere on the page */
  let dzN = 0;
  page.addEventListener('dragenter', (e) => { if (![...(e.dataTransfer?.types || [])].includes('Files')) return; e.preventDefault(); dzN++; const d = document.getElementById('rm-dz'); if (d) d.hidden = false; });
  page.addEventListener('dragover', (e) => { if ([...(e.dataTransfer?.types || [])].includes('Files')) e.preventDefault(); });
  page.addEventListener('dragleave', () => { dzN = Math.max(0, dzN - 1); if (!dzN) { const d = document.getElementById('rm-dz'); if (d) d.hidden = true; } });
  page.addEventListener('drop', (e) => { e.preventDefault(); dzN = 0; const d = document.getElementById('rm-dz'); if (d) d.hidden = true; const fs = e.dataTransfer?.files; if (!fs || !fs.length) return; if (fs.length > 1) toast('One video at a time. Clipping the first one.'); fromFile(fs[0]); });

  document.addEventListener('keydown', (e) => {
    if (page.hidden) return;
    const typing = e.target.matches && e.target.matches('input,textarea');
    if (e.key === 'Escape') { if (edPop) { edPop = false; return repaintEd(); } if (ed) return closeEd(); if (!typing) close(); return; }
    if (ed && !typing && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) { e.preventDefault(); step(e.key === 'ArrowRight' ? 1 : -1); }
  });

  /* ---------- a card at the top of the feed ---------- */
  const feedCard = () => {
    const top = suggest.slice(0, 3);
    return `<article class="card rm-card in" aria-label="Reel Maker">
      <div class="card-head"><img class="avatar" src="${(window.BRAND && BRAND.agents.creative) || ''}" alt=""><span class="identity"><span class="agent-name">Reel Maker</span><span class="meta">· 2 min</span></span><span class="badge info">New</span></div>
      <div class="card-body is-top"><h2 class="card-title">4 reels made for you overnight</h2><p class="card-sub">The best one answers the rosemary oil question, which is up 3x this week.</p></div>
      <div class="rm-strip">${top.map(c => `<button class="rm-tile" data-feedclip="${c.id}"><span class="rm-frame"><img src="${c.img}" alt=""><i class="rm-score${tone(c.s)}">${c.s}</i><i class="rm-dur">${c.d}</i><span class="rm-cap">${capHTML(c, 3, 1)}</span></span></button>`).join('')}</div>
      <button class="cta" data-openreels>${svgI(I.reel, 18)}<span>Open in Reel Maker</span>${svgI(I.chev, 17)}</button>
    </article>`;
  };
  const mount = () => { const f = document.getElementById('feed'); if (!f || f.querySelector('.rm-card')) return; f.insertAdjacentHTML('afterbegin', feedCard()); };
  document.addEventListener('click', (e) => {
    const o = e.target.closest('[data-openreels], .story[data-story="reels"]'), fc = e.target.closest('[data-feedclip]');
    if (fc) { e.preventDefault(); view = 'foryou'; go(); setTimeout(() => openEd(fc.dataset.feedclip), 900); return; }
    if (o) { e.preventDefault(); e.stopPropagation(); view = 'foryou'; go(); }
  }, true);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
  setTimeout(mount, 300);
  /* the Reel Maker link opens straight onto Reel Maker */
  if (window.RM_STANDALONE) setTimeout(open, 60);

  /* ---------- styles: built on the Feed's tokens ---------- */
  const css = `
  .rm-page{z-index:57}
  .rm-in{width:min(1040px,100%)!important}
  .rm-top{display:flex;align-items:flex-start;gap:16px}
  .rm-top > div{flex:1;min-width:0}
  .rm-top h1{margin:0;font-size:32px;line-height:40px;font-weight:500;letter-spacing:-.02em}
  .rm-top p{margin:8px 0 0;font-size:16px;line-height:24px;color:var(--fg-2);max-width:52ch}
  .rm-x{flex:0 0 auto;width:36px;height:36px;border:0;border-radius:999px;background:rgba(var(--ink),.08);color:var(--fg-2);display:grid;place-items:center;cursor:pointer;transition:background .15s,color .15s,opacity .15s}
  .rm-x:hover:not(:disabled){background:rgba(var(--ink),.14);color:var(--fg)}
  .rm-x:disabled{opacity:.35;cursor:default}
  .rm-icb{flex:0 0 auto;width:36px;height:36px;border:0;border-radius:999px;background:transparent;color:var(--fg-3);display:grid;place-items:center;cursor:pointer;transition:background .15s,color .15s}
  .rm-icb:hover{background:rgba(var(--ink),.08);color:var(--fg)}
  .rm-in-box{margin-top:28px;padding:16px;border-radius:24px;background:var(--s1);box-shadow:inset 0 0 0 1px var(--line-soft)}
  .rm-src{display:flex;gap:4px;margin-bottom:14px}
  .rm-src button,.rm-sort button,.rm-styles button,.rm-tabs button{height:32px;white-space:nowrap;padding:0 12px;border:0;border-radius:999px;background:transparent;color:var(--fg-2);font:inherit;font-size:13.5px;display:inline-flex;align-items:center;gap:7px;cursor:pointer;transition:background .15s,color .15s}
  .rm-src button:hover,.rm-sort button:hover,.rm-styles button:hover,.rm-tabs button:hover{color:var(--fg)}
  .rm-src button[aria-selected="true"],.rm-sort button[aria-selected="true"],.rm-styles button[aria-pressed="true"],.rm-tabs button[aria-selected="true"]{background:rgba(var(--ink),.1);color:var(--fg)}
  .rm-field{display:flex;align-items:center;gap:8px;height:56px;padding:0 6px 0 18px;border-radius:999px;background:var(--bg);box-shadow:inset 0 0 0 1px var(--line);color:var(--fg-3);transition:box-shadow .15s}
  .rm-field:focus-within{box-shadow:inset 0 0 0 1px var(--fg-3)}
  .rm-field.is-err{box-shadow:inset 0 0 0 1px var(--t-red)}
  .rm-field input{flex:1;min-width:0;height:100%;border:0;background:transparent;color:var(--fg);font:inherit;font-size:16px;outline:none}
  .rm-field input::placeholder{color:var(--fg-3)}
  .rm-go{height:44px;padding:0 20px;border:0;border-radius:999px;background:var(--fg);color:var(--bg);font:inherit;font-size:14px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;white-space:nowrap;transition:opacity .2s,transform .15s}
  .rm-go:hover:not(:disabled){opacity:.88} .rm-go:active:not(:disabled){transform:scale(.97)}
  .rm-go:disabled,.rm-sec:disabled,.rm-more:disabled,.rm-work:disabled{opacity:.4;cursor:not-allowed}
  .rm-sec{height:44px;padding:0 16px;border:0;border-radius:999px;background:rgba(var(--ink),.1);color:var(--fg);font:inherit;font-size:14px;font-weight:500;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;white-space:nowrap;transition:background .15s}
  .rm-sec:hover:not(:disabled){background:rgba(var(--ink),.16)}
  .rm-sec.rm-ic{width:44px;padding:0}
  .rm-sec.rm-sm{height:34px;padding:0 14px;font-size:13.5px}
  .rm-hint{margin:12px 4px 0;font-size:13px;line-height:18px;color:var(--fg-3);display:flex;align-items:center;gap:6px;flex-wrap:wrap}
  .rm-hint svg{flex:0 0 auto}
  .rm-hint.is-err{color:var(--t-red)} .rm-hint.is-warn{color:var(--t-orange)}
  .rm-link{border:0;padding:0;background:none;color:var(--fg);font:inherit;font-weight:600;text-decoration:underline;text-underline-offset:3px;cursor:pointer}
  .rm-warn{color:var(--t-orange)}

  /* product search */
  .rm-combo{position:relative}
  .rm-plist{position:absolute;left:0;right:0;top:calc(100% + 8px);z-index:5;margin:0;padding:6px;list-style:none;max-height:340px;overflow:auto;border-radius:20px;background:var(--s2);box-shadow:0 0 0 1px var(--line),0 20px 50px rgba(0,0,0,calc(.45 * var(--sh)))}
  .rm-plist li{display:flex;align-items:center;gap:12px;padding:6px 10px 6px 6px;border-radius:14px;cursor:pointer}
  .rm-plist li.is-act,.rm-plist li:hover{background:rgba(var(--ink),.08)}
  .rm-plist li[aria-disabled="true"]{cursor:not-allowed}
  .rm-plist li[aria-disabled="true"] > span,.rm-plist li[aria-disabled="true"] > .rm-noimg{opacity:.45}
  .rm-plist img,.rm-noimg{width:40px;height:40px;border-radius:10px;object-fit:cover;flex:0 0 auto;background:var(--s3)}
  .rm-noimg{display:grid;place-items:center;color:var(--fg-3)}
  .rm-plist li > span,.rm-picked > span{flex:1;min-width:0;display:flex;flex-direction:column}
  .rm-plist b,.rm-picked b{font-size:14px;font-weight:500;color:var(--fg);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .rm-plist em,.rm-picked em{font-style:normal;font-size:12.5px;color:var(--fg-3)}
  .rm-plist .rm-none{cursor:default;padding:14px;color:var(--fg-3);font-size:14px}
  .rm-plist .rm-none:hover{background:none}
  .rm-tag{flex:0 0 auto;height:22px;padding:0 8px;border-radius:999px;font-style:normal;font-size:11.5px;font-weight:600;display:inline-flex;align-items:center;color:var(--t-gray);background:var(--t-gray-bg)}
  .rm-tag.is-warn{color:var(--t-orange);background:var(--t-orange-bg)}
  .rm-picked{display:flex;align-items:center;gap:12px;padding:6px 6px 6px 6px;border-radius:999px;background:var(--bg);box-shadow:inset 0 0 0 1px var(--line)}
  .rm-picked img{width:44px;height:44px;border-radius:999px;object-fit:cover;flex:0 0 auto}

  .rm-works{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
  .rm-work{border:0;padding:0;background:none;color:var(--fg);font:inherit;text-align:left;cursor:pointer;display:flex;flex-direction:column;gap:8px}

  /* views */
  .rm-tabs{display:flex;gap:4px;margin:36px 0 18px;scroll-margin-top:16px}
  .rm-tabs button{height:36px;padding:0 14px;font-size:14.5px}
  .rm-tabs i{font-style:normal;font-size:12px;font-weight:600;min-width:20px;height:20px;padding:0 6px;border-radius:999px;display:inline-grid;place-items:center;background:rgba(var(--ink),.08);color:var(--fg-2);font-variant-numeric:tabular-nums}
  .rm-lede{margin:0 0 16px;font-size:14px;color:var(--fg-3)}
  .rm-empty{margin:8px 0;padding:40px 16px;border-radius:20px;text-align:center;font-size:14px;color:var(--fg-3);background:rgba(var(--ink),.03)}
  .rm-vbar{display:flex;justify-content:flex-end;margin:-6px 0 8px}
  .rm-proj + .rm-proj{margin-top:32px}
  .rm-ph{display:flex;align-items:center;gap:12px;margin-bottom:16px}
  .rm-ph img,.rm-pi{width:44px;height:44px;border-radius:12px;object-fit:cover;flex:0 0 auto}
  .rm-pi{display:grid;place-items:center;background:rgba(var(--ink),.07);color:var(--fg-2)}
  .rm-ph > span:not(.rm-pi){flex:1;min-width:0;display:flex;flex-direction:column}
  .rm-ph b{font-size:16px;font-weight:500;color:var(--fg);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .rm-ph em{font-style:normal;font-size:13px;color:var(--fg-3)}
  .rm-note{margin:-6px 0 14px;font-size:13px;line-height:18px;color:var(--fg-2);display:flex;align-items:center;gap:6px}
  .rm-note svg{flex:0 0 auto;color:var(--t-orange)}
  .rm-note.is-ok svg{color:var(--t-green)}
  .rm-fail{display:flex;align-items:center;gap:12px;padding:14px 14px 14px 16px;border-radius:20px;background:var(--t-red-bg);color:var(--t-red)}
  .rm-fail > svg{flex:0 0 auto}
  .rm-fail > span{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
  .rm-fail b{font-size:14.5px;font-weight:500;color:var(--fg)}
  .rm-fail em{font-style:normal;font-size:13.5px;color:var(--fg-2)}
  .rm-sort{display:flex;gap:2px;padding:3px;border-radius:999px;background:rgba(var(--ink),.05)}
  .rm-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px 14px}
  .rm-ghost{aspect-ratio:9/16;border-radius:16px;background:rgba(var(--ink),.05);background-image:linear-gradient(100deg,transparent 30%,rgba(var(--ink),.06) 50%,transparent 70%);background-size:250% 100%;animation:rmShim 1.6s linear infinite}
  .rm-steps{list-style:none;margin:0 0 16px;padding:0;display:flex;flex-wrap:wrap;gap:8px}
  .rm-steps li{height:32px;padding:0 12px;border-radius:999px;background:rgba(var(--ink),.05);color:var(--fg-3);font-size:13px;display:inline-flex;align-items:center;transition:background .3s,color .3s}
  .rm-steps li.now{color:var(--fg);background:rgba(var(--ink),.1);background-image:linear-gradient(100deg,transparent 30%,rgba(var(--ink),.12) 50%,transparent 70%);background-size:250% 100%;animation:rmShim 1.4s linear infinite}
  .rm-steps li.done{color:var(--t-green);background:var(--t-green-bg)}
  @keyframes rmShim{from{background-position:130% 0}to{background-position:-130% 0}}
  .rm-rows{display:flex;flex-direction:column;gap:4px}
  .rm-row{display:flex;align-items:center;gap:12px;padding:8px 12px 8px 8px;border:0;border-radius:16px;background:transparent;color:var(--fg-3);font:inherit;text-align:left;cursor:pointer;transition:background .15s}
  .rm-row:hover{background:rgba(var(--ink),.06)}
  .rm-row img{width:36px;height:64px;border-radius:8px;object-fit:cover;flex:0 0 auto}
  .rm-row > span{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
  .rm-row b{font-size:14.5px;font-weight:500;color:var(--fg)}
  .rm-row em{font-style:normal;font-size:13px}
  .rm-k{margin:22px 0 10px;font-size:12.5px;font-weight:600;color:var(--fg-3)}
  .rm-view > .rm-k:first-child{margin-top:0}

  /* tiles */
  .rm-tile{border:0;padding:0;background:none;color:var(--fg);font:inherit;text-align:left;cursor:pointer;display:flex;flex-direction:column;gap:8px;min-width:0}
  .rm-tile.is-fresh{animation:rmIn .6s cubic-bezier(.22,1,.36,1) both}
  .rm-grid > .rm-tile.is-fresh:nth-child(2){animation-delay:.12s} .rm-grid > .rm-tile.is-fresh:nth-child(3){animation-delay:.24s} .rm-grid > .rm-tile.is-fresh:nth-child(4){animation-delay:.36s}
  @keyframes rmIn{from{opacity:0;transform:translateY(10px)}}
  .rm-frame{position:relative;display:block;aspect-ratio:9/16;border-radius:16px;overflow:hidden;background:var(--s2)}
  .rm-frame img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform .6s cubic-bezier(.22,1,.36,1)}
  .rm-tile:hover .rm-frame img,.rm-work:hover:not(:disabled) .rm-frame img{transform:scale(1.04)}
  .rm-frame::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.35) 0%,transparent 26%,transparent 52%,rgba(0,0,0,.7) 100%);pointer-events:none}
  .rm-score{position:absolute;left:8px;top:8px;z-index:1;min-width:30px;height:24px;padding:0 8px;border-radius:999px;display:inline-grid;place-items:center;font-style:normal;font-size:12.5px;font-weight:700;color:#fff;background:rgba(0,0,0,.45);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);font-variant-numeric:tabular-nums}
  .rm-score.is-hi{color:#0b2e16;background:#30d158}
  .rm-score.is-mid{color:#3a2400;background:#ffd60a}
  .rm-dur{position:absolute;right:8px;top:8px;z-index:1;font-style:normal;font-size:12px;font-weight:600;color:#fff;text-shadow:0 1px 4px rgba(0,0,0,.5);font-variant-numeric:tabular-nums}
  .rm-state{position:absolute;left:8px;bottom:8px;z-index:2;height:22px;padding:0 8px;border-radius:999px;background:#fff;color:#000;font-style:normal;font-size:11.5px;font-weight:600;display:inline-flex;align-items:center;gap:4px}
  .rm-cap{position:absolute;left:10px;right:10px;bottom:16%;z-index:1;text-align:center;font-size:14px;line-height:1.25;font-weight:800;color:#fff;text-transform:uppercase;letter-spacing:-.01em;text-shadow:0 2px 10px rgba(0,0,0,.45)}
  .rm-cap span{display:inline-block;padding:1px 4px;border-radius:5px}
  .rm-cap span.on{background:#fff;color:#000;text-shadow:none}
  .rm-t{font-size:14px;line-height:19px;color:var(--fg);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
  .rm-m{font-size:12.5px;line-height:17px;color:var(--fg-3);margin-top:-4px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}

  /* editor */
  .rm-ed-scrim{position:fixed;inset:0;left:60px;z-index:60;background:rgba(0,0,0,.6);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);display:grid;place-items:center;padding:24px}
  :root[data-theme="light"] .rm-ed-scrim{background:rgba(242,242,247,.7)}
  .rm-ed-scrim[hidden],.rm-dropzone[hidden]{display:none}
  .rm-ed{display:flex;gap:28px;width:min(880px,100%);max-height:calc(100vh - 48px);padding:20px;border-radius:28px;background:var(--s1);box-shadow:0 0 0 1px var(--line),0 30px 80px rgba(0,0,0,calc(.6 * var(--sh)));overflow:auto}
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
  .rm-side header > span:nth-child(2){flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}
  .rm-side header b{font-size:18px;line-height:24px;font-weight:500;color:var(--fg)}
  .rm-side header em{font-style:normal;font-size:13px;color:var(--fg-3)}
  .rm-nav{display:flex;gap:6px;flex:0 0 auto}
  .rm-score-big{flex:0 0 auto;width:52px;height:52px;border-radius:16px;display:grid;place-items:center;font-size:20px;font-weight:700;color:var(--fg);background:rgba(var(--ink),.08);font-variant-numeric:tabular-nums}
  .rm-score-big.is-hi{color:var(--t-green);background:var(--t-green-bg)}
  .rm-score-big.is-mid{color:var(--t-orange);background:var(--t-orange-bg)}
  .rm-why{margin:14px 0 0;font-size:14.5px;line-height:21px;color:var(--fg-2)}
  .rm-subs{display:grid;grid-template-columns:1fr 1fr;gap:10px 20px;margin:16px 0 0}
  .rm-subs p{margin:0;display:grid;grid-template-columns:52px 1fr 28px;align-items:center;gap:10px;font-size:13px;color:var(--fg-2)}
  .rm-subs p > i{height:4px;border-radius:2px;background:rgba(var(--ink),.1);overflow:hidden}
  .rm-subs p > i > i{display:block;height:100%;width:var(--v);background:var(--fg);border-radius:2px;animation:rmBar .8s cubic-bezier(.22,1,.36,1) both}
  @keyframes rmBar{from{width:0}}
  .rm-subs b{font-weight:600;color:var(--fg);text-align:right;font-variant-numeric:tabular-nums}
  .rm-side > .rm-note{margin:16px 0 0}
  .rm-fs{border:0;margin:0;padding:0;min-width:0}
  .rm-fs:disabled{opacity:.45}
  .rm-fs:disabled button{cursor:not-allowed}
  .rm-hooks{display:flex;flex-direction:column;gap:6px}
  .rm-hooks button{padding:10px 12px;border:0;border-radius:12px;background:rgba(var(--ink),.05);color:var(--fg-1);font:inherit;font-size:14px;text-align:left;cursor:pointer;transition:background .15s,box-shadow .15s}
  .rm-hooks button:hover{background:rgba(var(--ink),.08)}
  .rm-hooks button[aria-pressed="true"]{background:rgba(var(--ink),.1);box-shadow:inset 0 0 0 1.5px var(--fg);color:var(--fg)}
  .rm-styles{display:flex;gap:4px;flex-wrap:wrap}
  .rm-styles .rm-fixb{margin-left:auto;color:var(--fg-3)}
  .rm-styles .rm-fixb[aria-expanded="true"]{color:var(--fg)}
  .rm-capedit{display:block;width:100%;margin-top:10px;padding:10px 12px;border:0;border-radius:12px;background:var(--bg);box-shadow:inset 0 0 0 1px var(--line);color:var(--fg);font:inherit;font-size:16px;line-height:22px;resize:vertical;outline:none}
  .rm-capedit:focus{box-shadow:inset 0 0 0 1px var(--fg-3)}
  .rm-capedit + .rm-hint{margin-top:6px}
  .rm-acts{display:flex;gap:8px;margin-top:auto;padding-top:22px}
  .rm-acts > .rm-go{flex:1}
  .rm-popw{position:relative;display:flex}
  .rm-pop{position:absolute;right:0;bottom:calc(100% + 8px);z-index:3;width:290px;padding:6px;border-radius:18px;background:var(--s2);box-shadow:0 0 0 1px var(--line),0 20px 50px rgba(0,0,0,calc(.45 * var(--sh)));display:flex;flex-direction:column;animation:rmIn .22s cubic-bezier(.22,1,.36,1)}
  .rm-pop button{display:grid;grid-template-columns:1fr auto;align-items:center;column-gap:8px;padding:9px 12px;border:0;border-radius:12px;background:transparent;color:var(--fg);font:inherit;font-size:14px;text-align:left;cursor:pointer}
  .rm-pop button:hover:not(:disabled){background:rgba(var(--ink),.08)}
  .rm-pop button:disabled{cursor:not-allowed}
  .rm-pop button:disabled span{color:var(--fg-3)}
  .rm-pop em{grid-column:1;font-style:normal;font-size:12.5px;color:var(--fg-3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .rm-pop em:empty{display:none}
  .rm-pop svg{grid-column:2;grid-row:1}
  .rm-pop .is-quiet{color:var(--fg-2);margin-top:4px;box-shadow:0 -1px 0 var(--line-soft);border-radius:0 0 12px 12px}
  .rm-subacts{display:flex;gap:4px;margin-top:10px}
  .rm-more{flex:1;height:40px;border:0;border-radius:999px;background:transparent;color:var(--fg-2);font:inherit;font-size:13.5px;display:inline-flex;align-items:center;justify-content:center;gap:7px;cursor:pointer;transition:background .15s,color .15s}
  .rm-more:hover:not(:disabled){background:rgba(var(--ink),.07);color:var(--fg)}
  .rm-dropzone{position:fixed;inset:12px;left:72px;z-index:61;border-radius:28px;background:rgba(var(--ink),.06);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);box-shadow:inset 0 0 0 2px var(--fg-3);display:grid;place-items:center;pointer-events:none}
  .rm-dropzone span{display:inline-flex;align-items:center;gap:10px;font-size:18px;font-weight:500;color:var(--fg)}

  /* feed card */
  .rm-card .card-head .badge{margin-left:auto}
  .rm-strip{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:0 12px}
  .rm-strip .rm-cap{font-size:11.5px}
  .rm-card .cta{margin:12px 12px 14px;width:calc(100% - 24px)}

  @media (max-width:900px){ .rm-grid,.rm-works{grid-template-columns:repeat(3,1fr)} }
  @media (max-width:600px){
    .rm-grid,.rm-works{grid-template-columns:repeat(2,1fr)}
    .rm-ed{flex-direction:column} .rm-player{flex:0 0 auto;width:min(260px,100%);margin:0 auto}
    .rm-ed-scrim{left:52px;padding:10px;place-items:start center;overflow:auto} .rm-ed{max-height:none;padding:14px;gap:18px}
    .rm-src,.rm-tabs{overflow-x:auto;scrollbar-width:none} .rm-src button,.rm-tabs button{flex:0 0 auto}
    .rm-go{padding:0 16px}
    .rm-picked{flex-wrap:wrap;border-radius:20px;padding:8px}
    .rm-picked > span{flex:1 1 calc(100% - 60px)} .rm-picked .rm-sec,.rm-picked .rm-go{flex:1}
    .rm-acts{position:relative} .rm-popw{position:static} .rm-pop{left:0;right:0;width:auto}
    .rm-side header{flex-wrap:wrap} .rm-nav{order:-1;width:100%;justify-content:flex-end;margin-bottom:-4px}
    .rm-dropzone{left:62px}
  }
  @media (prefers-reduced-motion:reduce){ .rm-frame.is-big img,.rm-tile.is-fresh,.rm-steps li.now,.rm-ghost,.rm-pop{animation:none} }
  `;
  const st = document.createElement('style'); st.id = 'reels-css'; st.textContent = css; document.head.appendChild(st);
})();
