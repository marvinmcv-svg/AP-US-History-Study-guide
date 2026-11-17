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
  $("#mq2").innerHTML = $("#mq2b").innerHTML = row(terms.slice(half));

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
  const picks = [];
  UNITS.forEach(U=>{
    const tl = U.timeline, n = Math.min(4, tl.length);
    for(let j=0;j<n;j++){ const ev = tl[Math.round(j*(tl.length-1)/Math.max(1,n-1))]; picks.push({u:U, y:ev[0], t:ev[1], first:j===0}); }
  });
  $("#hzTrack").innerHTML = picks.map(p=>`<div class="ev" style="--uc:var(${p.u.color})" data-year="${yearOf(p.y)||""}">
      <span class="u">Unit 0${p.u.id} · ${esc(p.u.title)}</span>
      <span class="y">${esc(p.y)}</span><p>${esc(p.t)}</p>
      ${p.first && IMG[HERO[p.u.id]] ? `<div class="th">${imgTag(HERO[p.u.id],600)}</div>` : ""}</div>`).join("")
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

  /* ---------- bento portrait demo ---------- */
  $("#demoWho").innerHTML = imgTag("washington",300) || "";

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
    const L = [[0,"Colonist"],[100,"Minuteman"],[250,"Patriot"],[500,"Founder"],[850,"Statesman"],[1300,"Justice"],[2000,"APUSH Legend"]];
    let i = 0; L.forEach((l,j)=>{ if(xp >= l[0]) i = j; });
    const nxt = L[i+1], pct = nxt ? Math.round((xp-L[i][0])/(nxt[0]-L[i][0])*100) : 100;
    $("#resume").innerHTML = `<div class="resume" data-reveal style="--w:${pct}%"><div><small>Your rank</small><span class="rk">${L[i][1]}</span></div>
      <div><small>${xp} XP · ${nxt ? (nxt[0]-xp)+" XP to "+nxt[1] : "Top rank reached"}</small><div class="xpb"><i></i></div></div>
      <a class="cta light sm" href="study.html" data-label="Study">Continue <span class="ar">→</span></a></div>`;
  }
})();
