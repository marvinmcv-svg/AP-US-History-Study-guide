/* =========================================================
   LANDING PAGE — builds content from data.js and wires the
   page-specific motion (intro, plates, stack, pinned scroll).
   ========================================================= */
(function(){
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = s => document.querySelector(s);
  const yearOf = s => { const m = String(s).match(/\d{4}/); return m ? +m[0] : null; };
  const img = (k,w) => (typeof imgURL === "function" && IMG[k]) ? imgURL(k,w) : "";
  const imgTag = (k,w,extra="") => IMG[k] ? `<img src="${img(k,w)}" alt="${esc(IMG[k][1])}" loading="lazy" referrerpolicy="no-referrer" onerror="this.parentNode.classList.add('noimg');this.remove()" ${extra}>` : "";

  /* ---------- intro + hero ---------- */
  const hero = $("#hero"), intro = $("#intro");
  const heroOn = () => hero.classList.add("hero-on");
  let seen = false; try{ seen = sessionStorage.getItem("introSeen"); }catch(e){}
  const viaCurtain = (()=>{ try{ return sessionStorage.getItem("fx_nav") !== null; }catch(e){ return false; } })();
  if(RM || seen || viaCurtain){ intro.classList.add("gone"); setTimeout(heroOn, viaCurtain ? 450 : 60); }
  else{
    try{ sessionStorage.setItem("introSeen","1"); }catch(e){}
    document.documentElement.style.overflow = "hidden";
    const yr = $("#introYr"), bar = $("#introBar"), t0 = performance.now(), dur = 1700;
    const step = t => {
      const p = Math.min(1,(t-t0)/dur), e = p<.5 ? 4*p*p*p : 1-Math.pow(-2*p+2,3)/2;
      yr.textContent = Math.round(1491 + (1877-1491)*e);
      bar.style.setProperty("--p", e);
      if(p < 1) requestAnimationFrame(step);
      else setTimeout(()=>{ intro.classList.add("open"); document.documentElement.style.overflow = ""; setTimeout(heroOn, 250); setTimeout(()=>intro.classList.add("gone"), 1200); }, 260);
    };
    requestAnimationFrame(step);
  }

  /* floating museum plates behind the headline */
  const plates = [["declaration","1776",.06],["gettysburg","1863",.1],["mayflower","1620",.045],["lewisclark","1804",.08],["columbus","1492",.03]];
  $("#plates").innerHTML = plates.map((p,i)=>`<figure class="plate p${i+1}${IMG[p[0]]?"":" noimg"}" data-depth="${p[2]}"><div class="fr">${imgTag(p[0],700,'loading="eager"')}</div><figcaption>${p[1]} · ${esc((IMG[p[0]]||["",""])[1].split(",")[0])}</figcaption></figure>`).join("");
  if(!RM && matchMedia("(pointer:fine)").matches){
    const els = [...document.querySelectorAll(".plate")];
    let tx = 0, ty = 0, cx = 0, cy = 0, sy = 0;
    hero.addEventListener("pointermove", e=>{ tx = e.clientX/innerWidth - .5; ty = e.clientY/innerHeight - .5; });
    addEventListener("scroll", ()=>{ sy = scrollY; }, {passive:true});
    (function loop(){
      cx += (tx-cx)*.06; cy += (ty-cy)*.06;
      if(sy < innerHeight*1.2) els.forEach(el=>{ const d = +el.dataset.depth; el.style.transform = `translate3d(${-cx*d*900}px,${-cy*d*700 - sy*d*4}px,0)`; });
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- marquee of terms ---------- */
  const terms = UNITS.flatMap(U => U.terms.map(t => t[0]));
  const half = Math.ceil(terms.length/2);
  const row = list => list.map((t,i)=>`<span class="mq-item${i%2?" it":""}">${esc(t)}</span><span class="mq-star">✦</span>`).join("");
  $("#mq1").innerHTML = $("#mq1b").innerHTML = row(terms.slice(0,half));
  /* second row: a moving strip of real paintings */
  const stripKeys = Object.keys(IMG).filter(k=>!["paine","commonsense","emancipation"].includes(k));
  $("#mq2").innerHTML = $("#mq2b").innerHTML = stripKeys.map(k=>`<figure class="mq-pic">${imgTag(k,360)}<figcaption>${esc(IMG[k][1].split(",")[0].split(":")[0])}</figcaption></figure>`).join("");

  /* ---------- archive wall: three columns of paintings drifting at different speeds ---------- */
  const wallKeys = ["delaware","declaration","progress","gettysburg","mayflower","penn","teaparty","lewisclark","columbus","constitution","cornwallis","massacre","whitefield","cottongin","firstcolored","caning","compact","taos"];
  const cols = [[],[],[]]; wallKeys.forEach((k,i)=>cols[i%3].push(k));
  $("#awCols").innerHTML = cols.map((c,i)=>`<div class="aw-col" data-speed="${[.12,-.1,.18][i]}">${c.concat(c).map(k=>`<figure class="aw-pic${IMG[k]?"":" noimg"}">${imgTag(k,600)}<figcaption>${esc(IMG[k] ? IMG[k][1] : "")}</figcaption></figure>`).join("")}</div>`).join("");
  const awCols = [...document.querySelectorAll(".aw-col")], aw = document.querySelector(".archive");
  FX.onScroll((y, vh)=>{
    if(RM) return;
    const r = aw.getBoundingClientRect(); if(r.bottom < -100 || r.top > vh + 100) return;
    const p = (vh - r.top);
    awCols.forEach(c=>{ c.style.transform = `translate3d(0,${-p * parseFloat(c.dataset.speed) - 200}px,0)`; });
  });

  /* ---------- five eras: stacking cards ---------- */
  const mastered = store.get("mastered", {});
  const HERO = typeof HERO_IMG !== "undefined" ? HERO_IMG : {};
  $("#stack").innerHTML = UNITS.map((U,i)=>{
    const m = U.terms.filter((_,j)=>mastered[U.id+"-"+j]).length, pct = Math.round(m/U.terms.length*100);
    const k = HERO[U.id];
    return `<a class="era" href="study.html#unit-${U.id}" data-label="Unit ${U.id}" style="--i:${i};--uc:var(${U.color})" data-cursor="big">
      <span class="ring"></span><span class="shade"></span>
      <div class="txt">
        <div class="num"><span>Unit <b>0${U.id}</b> / 05</span><span>${U.weight} of the exam</span></div>
        <h3>${esc(U.title)}</h3>
        <div class="yrs">${U.years}</div>
        <p class="hook">${U.hook}</p>
        <div class="meta"><span class="chip">${U.terms.length} terms</span><span class="chip">${U.quiz.length} questions</span><span class="chip">${U.story.length} scenes</span><span class="go">→</span></div>
        <div class="bar" title="${pct}% of terms mastered"><i style="width:${pct}%"></i></div>
      </div>
      <div class="pic${IMG[k]?"":" noimg"}" data-cap="${esc((IMG[k]||["",""])[1])}">${imgTag(k,1100)}</div>
    </a>`;
  }).join("");
  const eras = [...document.querySelectorAll(".era")];
  FX.onScroll((y, vh)=>{
    if(RM) return;
    eras.forEach((el,i)=>{
      const next = eras[i+1]; if(!next){ return; }
      const top = parseFloat(getComputedStyle(next).top) || 100;
      const r = next.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh - top)));
      el.style.transform = `scale(${1 - p*.06})`;
      el.querySelector(".shade").style.setProperty("--shade", (p*.55).toFixed(3));
    });
  });

  /* ---------- horizontal pinned timeline ---------- */
  const picks = [], hzUsed = new Set();
  UNITS.forEach(U=>{
    const tl = U.timeline, n = Math.min(4, tl.length);
    for(let j=0;j<n;j++){ const ev = tl[Math.round(j*(tl.length-1)/Math.max(1,n-1))]; picks.push({u:U, y:ev[0], t:ev[1], k:eventPic(ev[1], U.id, hzUsed)}); }
  });
  $("#hzTrack").innerHTML = picks.map(p=>`<div class="ev" style="--uc:var(${p.u.color})" data-year="${yearOf(p.y)||""}">
      <div class="th">${imgTag(p.k,600)}</div>
      <span class="u">Unit 0${p.u.id} · ${esc(p.u.title)}</span>
      <span class="y">${esc(p.y)}</span><p>${esc(p.t)}</p></div>`).join("")
    + `<div class="ev end"><span class="u" style="--uc:var(--u5)">And that's 386 years.</span><p style="font-family:var(--display);font-size:2.4rem;line-height:1;color:var(--night-ink)">Every event, every unit, in one place.</p><a class="cta light sm" href="timeline.html" data-label="1491 → 1877" style="align-self:flex-start">Open the timeline <span class="ar">→</span></a></div>`;
  const hz = $("#hz"), track = $("#hzTrack"), ghost = $("#hzGhost"), meter = $("#hzMeter");
  const evs = [...track.querySelectorAll(".ev[data-year]")];
  let dist = 0;
  function sizeHz(){ dist = Math.max(0, track.scrollWidth - innerWidth); hz.style.height = (innerHeight + dist) + "px"; }
  sizeHz(); addEventListener("resize", sizeHz); addEventListener("load", sizeHz);
  FX.onScroll((y, vh)=>{
    const r = hz.getBoundingClientRect();
    const p = dist ? Math.min(1, Math.max(0, -r.top / dist)) : 0;
    track.style.transform = `translate3d(${-p*dist}px,0,0)`;
    meter.style.setProperty("--p", p.toFixed(4));
    /* ghost year = the event nearest the middle of the screen */
    let best = null, bd = 1e9;
    evs.forEach(e=>{ const b = e.getBoundingClientRect(); const d = Math.abs(b.left + b.width/2 - innerWidth*.4); if(d < bd){ bd = d; best = e; } });
    if(best && best.dataset.year) ghost.textContent = best.dataset.year;
  });

  /* ---------- stats ---------- */
  $("#stTerms").dataset.count = terms.length;
  $("#stQuiz").dataset.count = UNITS.reduce((a,U)=>a+U.quiz.length,0);
  $("#stWho").dataset.count = WHO.length;

  /* ---------- seven ways to study ---------- */
  const ICON = {
    cards:'<path d="M4 7h12v12H4z"/><path d="M8 4h12v12"/>',
    quiz:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17.5v.5"/>',
    order:'<path d="M7 4v16M3 8l4-4 4 4M17 20V4M13 16l4 4 4-4"/>',
    who:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4.5-6 8-6s7 2 8 6"/>',
    chat:'<path d="M4 5h16v11H9l-5 4z"/><path d="M8 10h8M8 13h5"/>',
    video:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M10 9l5 3-5 3z"/>',
    cheat:'<path d="M6 3h9l4 4v14H6z"/><path d="M9 11h7M9 15h7M9 7h3"/>'
  };
  const WAYS = [
    {k:"cards", t:[5,15], title:"Flashcards", time:"5–10 min", img:"compact", color:"--u4", href:"study.html#cards", label:"Flashcards",
      desc:"Index cards that flip. Read the term, say the answer out loud, then flip to check.", best:"Memorizing terms and dates", you:"Mark “Got it” and the card leaves your pile", start:"Start flashcards"},
    {k:"quiz", t:[15,30], title:"AP-style quiz", time:"10–20 min", img:"declaration", color:"--u3", href:"study.html#quiz", label:"Quiz",
      desc:"Real exam-style questions with sources. Every answer comes with an explanation.", best:"Checking you're ready for the test", you:"+10 XP per right answer; mistakes go to review", start:"Take a quiz"},
    {k:"order", t:[5], title:"Which came first?", time:"3–5 min", img:"delaware", color:"--u2", href:"study.html#order", label:"Which came first?",
      desc:"Two events, one tap. Pick the one that happened earlier and build a streak.", best:"Getting the order of events right", you:"Chase a 10-answer streak", start:"Play now"},
    {k:"who", t:[5], title:"Who am I?", time:"3–5 min", img:"washington", color:"--u5", href:"study.html#who", label:"Who am I?",
      desc:"A portrait and a clue. Name the person. Faces stick better than names on a list.", best:"Remembering the key people", you:"Guess from the face and the clue", start:"Play now"},
    {k:"chat", t:[15,30], title:"Story + group chat", time:"10–15 min", img:"teaparty", color:"--u1", href:"study.html#unit-3", label:"Unit 3",
      desc:"Each unit told as a short story with real paintings, plus history's group chat.", best:"Understanding why things happened", you:"Read it like a show, then flip the unit's cards", start:"Read a story"},
    {k:"video", t:[15,30], title:"Watch a video", time:"10–40 min", img:"gettysburg", color:"--u3", href:"study.html#videos", label:"Videos",
      desc:"Hand-picked Heimler's History and Crash Course reviews for every unit.", best:"When you're tired of reading", you:"Watch at 1.25×, pause and write down new things", start:"Pick a video"},
    {k:"cheat", t:[5,15], title:"Cheat sheets", time:"5 min", img:"constitution", color:"--u4", href:"study.html#cheat", label:"Cheat sheets",
      desc:"Presidents, court cases, compromises and parties on one page you can search.", best:"Quick review the night before", you:"Search any name, year or law", start:"Open cheat sheets"}
  ];
  $("#waysGrid").innerHTML = WAYS.map(w=>`<a class="way spot" href="${w.href}" data-label="${esc(w.label)}" data-times="${w.t.join(" ")}" style="--wc:var(${w.color})">
      <div class="pic${IMG[w.img]?"":" noimg"}">${imgTag(w.img,700)}<span class="time">⏱ ${w.time}</span><span class="rec">✓ Good fit</span></div>
      <div class="bd">
        <span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${ICON[w.k]}</svg></span>
        <h3>${w.title}</h3><p>${w.desc}</p>
        <dl><dt>Best for</dt><dd>${w.best}</dd><dt>How it works</dt><dd>${w.you}</dd></dl>
        <span class="go">${w.start} <span class="ar">→</span></span>
      </div></a>`).join("");
  document.querySelector(".tp-btns").addEventListener("click", e=>{
    const b = e.target.closest("button"); if(!b) return;
    document.querySelectorAll(".tp-btns button").forEach(x=>x.classList.toggle("on", x===b));
    const t = b.dataset.t;
    document.querySelectorAll(".way").forEach(w=>{
      const fit = t === "all" || w.dataset.times.split(" ").includes(t);
      w.classList.toggle("dim", !fit); w.classList.toggle("fit", fit && t !== "all");
    });
  });

  /* ---------- how to use this site: four steps ---------- */
  const STEPS = [
    ["columbus","Pick your unit","Start with the unit your class is on right now. Each one takes about 30 minutes, start to finish.","See the units","#eras",""],
    ["teaparty","Read the story","Ten minutes of short scenes with real paintings, plus history's group chat. It reads like a show.","Open Unit 1","study.html#unit-1","Unit 1"],
    ["compact","Flip the cards","Say each answer out loud, then flip. Only mark “Got it” when you really know it.","Go to flashcards","study.html#cards","Flashcards"],
    ["gettysburg","Take the quiz","AP-style questions with explanations. Every mistake goes to a review pile so you can fix it.","Start a quiz","study.html#quiz","Quiz"]
  ];
  $("#steps").innerHTML = STEPS.map((st,i)=>`<li class="step">
      <div class="pic${IMG[st[0]]?"":" noimg"}">${imgTag(st[0],600)}<span class="n">${i+1}</span></div>
      <h3>${st[1]}</h3><p>${st[2]}</p>
      <a class="cta line sm" href="${st[4]}"${st[5]?` data-label="${st[5]}"`:""}>${st[3]} <span class="ar">→</span></a></li>`).join("");

  /* Mr Marvin's portrait (the tutor script builds it once the page is ready) */
  const putAvatar = ()=>{ if(window.MrMarvin) $("#mvAvatar").innerHTML = MrMarvin.avatar(); };
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", ()=>setTimeout(putAvatar)); else setTimeout(putAvatar);

  /* ---------- cast strip: drag with inertia + slow drift ---------- */
  const castTrack = $("#castTrack"), castWrap = $("#castWrap");
  const cast = WHO.slice().sort((a,b)=>a[3]-b[3]);
  castTrack.innerHTML = cast.map(w=>`<a class="person" href="people.html#${w[0]}" data-label="The Cast" draggable="false">
      <div class="ph" data-u="UNIT 0${w[3]}">${imgTag(w[0],400,'draggable="false"')}</div>
      <b>${esc(w[1])}</b><span>${esc(w[2])}</span></a>`).join("");
  let x = 0, v = 0, dragging = false, moved = 0, lx = 0, hover = false;
  const maxX = () => Math.max(0, castTrack.scrollWidth - innerWidth);
  castWrap.addEventListener("pointerdown", e=>{ dragging = true; moved = 0; lx = e.clientX; castWrap.classList.add("drag"); castWrap.setPointerCapture(e.pointerId); });
  castWrap.addEventListener("pointermove", e=>{ if(!dragging) return; const dx = e.clientX - lx; lx = e.clientX; moved += Math.abs(dx); x -= dx; v = -dx; });
  const end = ()=>{ dragging = false; castWrap.classList.remove("drag"); };
  castWrap.addEventListener("pointerup", end); castWrap.addEventListener("pointercancel", end);
  castWrap.addEventListener("click", e=>{ if(moved > 6){ e.preventDefault(); e.stopPropagation(); } }, true);
  castWrap.addEventListener("pointerenter", ()=>hover = true); castWrap.addEventListener("pointerleave", ()=>hover = false);
  castWrap.addEventListener("wheel", e=>{ if(Math.abs(e.deltaX) > Math.abs(e.deltaY)){ x += e.deltaX; e.preventDefault(); } }, {passive:false});
  (function loop(){
    if(!dragging){ x += v; v *= .93; if(!hover && !RM && Math.abs(v) < .1) x += .35; }
    const m = maxX(); if(x > m){ x = m; v = 0; if(!hover && !dragging) x = 0; } if(x < 0){ x = 0; v = 0; }
    castTrack.style.transform = `translate3d(${-x}px,0,0)`;
    requestAnimationFrame(loop);
  })();

  /* ---------- returning students: pick up where you left off ---------- */
  const xp = store.get("xp", 0);
  if(xp > 0){
    const L = [[0,"Colonist"],[100,"Minuteman"],[250,"Patriot"],[500,"Founder"],[850,"Statesman"],[1300,"Justice"],[2000,"History Legend"]];
    let i = 0; L.forEach((l,j)=>{ if(xp >= l[0]) i = j; });
    const nxt = L[i+1], pct = nxt ? Math.round((xp-L[i][0])/(nxt[0]-L[i][0])*100) : 100;
    $("#resume").innerHTML = `<div class="resume" data-reveal style="--w:${pct}%"><div><small>Your rank</small><span class="rk">${L[i][1]}</span></div>
      <div><small>${xp} XP · ${nxt ? (nxt[0]-xp)+" XP to "+nxt[1] : "Top rank reached"}</small><div class="xpb"><i></i></div></div>
      <a class="cta light sm" href="study.html" data-label="Study">Continue <span class="ar">→</span></a></div>`;
  }
})();
