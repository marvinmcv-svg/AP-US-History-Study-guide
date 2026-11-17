/* =========================================================
   STATE (saved in this browser)
   ========================================================= */
let state = {
  xp: store.get("xp",0),
  mastered: store.get("mastered",{}),
  qstats: store.get("qstats",{}),   // unit -> {c,t}
  wrongs: store.get("wrongs",{}),   // qid -> true
  ordBest: store.get("ordBest",0)
};
function save(){ for(const k in state) store.set(k,state[k]); if(typeof renderXP==="function" && document.getElementById("xpPillM")) renderXP(); }

const LEVELS = [[0,"Colonist"],[100,"Minuteman"],[250,"Patriot"],[500,"Founder"],[850,"Statesman"],[1300,"Justice"],[2000,"APUSH Legend"]];
function levelInfo(xp){
  let i = 0; for(let j=0;j<LEVELS.length;j++) if(xp>=LEVELS[j][0]) i=j;
  const cur = LEVELS[i][0], next = LEVELS[i+1] ? LEVELS[i+1][0] : cur;
  return {name:LEVELS[i][1], pct: next===cur ? 100 : Math.round((xp-cur)/(next-cur)*100), idx:i, next: LEVELS[i+1] ? LEVELS[i+1] : null};
}
function addXP(n){
  const before = levelInfo(state.xp).idx;
  state.xp += n; save(); renderXP();
  const after = levelInfo(state.xp);
  if(after.idx > before){ toast("Rank up: you're now a " + after.name + "."); confetti(); }
}
function renderXP(){
  const L = levelInfo(state.xp);
  document.getElementById("xpPill").textContent = state.xp + " XP";
  document.getElementById("levelPill").textContent = L.name;
  document.getElementById("xpFill").style.width = L.pct + "%";
  document.getElementById("xpPillM").textContent = state.xp + " XP";
  document.getElementById("nextLvl").textContent = L.next ? `${L.next[0]-state.xp} XP to ${L.next[1]}` : "Top rank";
  document.querySelectorAll('.tab[data-unit]').forEach(t=>{ t.querySelector(".meter i").style.width = unitMastery(+t.dataset.unit).pct + "%"; });
}

/* =========================================================
   HELPERS
   ========================================================= */
const $ = s => document.querySelector(s);
const shuffle = a => { a = a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const unitColor = u => `var(${UNITS[u-1].color})`;
function toast(msg){ const t=$("#toast"); t.textContent=msg; t.classList.add("show"); clearTimeout(t._h); t._h=setTimeout(()=>t.classList.remove("show"),2600); }
function confetti(){
  const cs = ["--u1","--u2","--u3","--u4","--u5","--gold"];
  for(let i=0;i<36;i++){
    const d=document.createElement("div"); d.className="confetti";
    d.style.background=`var(${cs[i%cs.length]})`; d.style.left=Math.random()*100+"vw";
    d.style.animationDuration=(1.6+Math.random()*1.6)+"s"; d.style.animationDelay=(Math.random()*.4)+"s";
    document.body.appendChild(d); setTimeout(()=>d.remove(),3800);
  }
}
function unitMastery(u){
  const terms = UNITS[u-1].terms; let m=0;
  terms.forEach((_,i)=>{ if(state.mastered[u+"-"+i]) m++; });
  return {m, total:terms.length, pct: Math.round(m/terms.length*100)};
}

/* =========================================================
   NAVIGATION
   ========================================================= */
let currentUnit = 1;
const VIEWS = ["home","unit","cards","quiz","order","who","videos","cheat","skills"];
function go(view, unit, fromHistory){
  if(!VIEWS.includes(view)) view = "home";
  if(view==="unit") unit = Math.min(5, Math.max(1, +unit || 1));
  const hash = view==="home" ? "" : "#" + (view==="unit" ? "unit-"+unit : view);
  if(!fromHistory && location.hash !== hash) history.pushState({view,unit}, "", hash || location.pathname);
  document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));
  document.getElementById("view-"+view).classList.add("active");
  document.querySelectorAll(".tab").forEach(t=>{
    const on = t.dataset.view===view && (view!=="unit" || +t.dataset.unit===+unit);
    t.classList.toggle("active", on);
    if(on) $("#whereLbl").textContent = view==="unit" ? `Unit ${unit} · ${UNITS[unit-1].title}` : t.querySelector(".lbl").textContent;
  });
  document.body.classList.remove("nav-open");
  if(view==="unit"){ currentUnit = +unit; renderUnit(currentUnit); }
  if(view==="home") renderHome();
  if(view==="cards") renderCardsView();
  if(view==="quiz") renderQuizSetup();
  if(view==="order") nextOrder();
  if(view==="cheat") renderCheat();
  if(view==="who") nextWho();
  if(view==="videos") renderVideos();
  window.scrollTo({top:0,behavior:"instant"});
  animateView(document.getElementById("view-"+view));
}
/* route from the address bar (#unit-3, #quiz, …) so every view has its own link */
function route(fromHistory){
  const h = location.hash.replace(/^#\/?/,"");
  const m = h.match(/^unit-?(\d)$/);
  if(m) go("unit", +m[1], fromHistory); else go(h || "home", undefined, fromHistory);
}
addEventListener("popstate", ()=>route(true));

/* =========================================================
   MOTION: every view enters with a staggered rise; long
   pages reveal section by section as you scroll.
   ========================================================= */
const REVEAL_SEL = ".section,.scene,.flip,.hack,.tl-item,.src,details.acc,.tvn .c,.vcard,.urow,.card,.res,.theme-chip,.band,.phone,.cast .p,.hit,.evt,.who-wrap,.today,.ruler,.tbl tr";
function animateView(v){
  if(!v || !window.FX) return;
  v.classList.remove("enter"); void v.offsetWidth; v.classList.add("enter");
  const groups = new Map();
  v.querySelectorAll(REVEAL_SEL).forEach(el=>{
    if(el.closest(".unit-hero,.mast")) return;
    if(el.matches(".section") && el.querySelector(REVEAL_SEL.replace(".section,",""))) return; /* reveal the children instead */
    const parent = el.parentElement, i = groups.get(parent) || 0; groups.set(parent, i+1);
    el.classList.remove("in"); el.setAttribute("data-reveal",""); el.style.setProperty("--d", Math.min(i,8)*60);
  });
  v.querySelectorAll(".unit-hero .ph").forEach(el=>el.setAttribute("data-reveal","mask"));
  FX.refresh(v);
}
$("#menuBtn").addEventListener("click",()=>document.body.classList.add("nav-open"));
$("#scrim").addEventListener("click",()=>document.body.classList.remove("nav-open"));
document.getElementById("tabs").addEventListener("click",e=>{
  const b = e.target.closest(".tab"); if(!b || b.tagName==="A") return;
  go(b.dataset.view, b.dataset.unit);
});
document.addEventListener("click",e=>{
  const g = e.target.closest("[data-go]"); if(!g) return;
  go(g.dataset.go, g.dataset.unit);
});

/* =========================================================
   HOME
   ========================================================= */
function renderHome(){
  const wrap = $("#unitCards");
  wrap.innerHTML = UNITS.map(U=>{
    const m = unitMastery(U.id); const qs = state.qstats[U.id];
    const acc = qs && qs.t ? Math.round(qs.c/qs.t*100)+"%" : "–";
    return `<button class="urow" style="--uc:var(${U.color})" data-go="unit" data-unit="${U.id}">
      <span class="n">0${U.id}</span>
      <span><h3>${esc(U.title)}</h3><span class="yrs">${U.years}</span></span>
      <span class="w">${U.weight}<small>of exam</small></span>
      <span class="prog">${m.m}/${m.total} terms · quiz ${acc}<span class="progress"><i style="width:${m.pct}%"></i></span></span>
      <span class="go">→</span>
    </button>`;
  }).join("");
  const span = U => { const [a,b] = U.years.split("–").map(Number); return b-a; };
  $("#ruler").innerHTML = `<div class="bar">${UNITS.map(U=>`<button class="seg" style="--uc:var(${U.color});--span:${span(U)};--pct:${unitMastery(U.id).pct}%" data-go="unit" data-unit="${U.id}" title="Unit ${U.id}: ${esc(U.title)} (${U.years})" aria-label="Unit ${U.id}"><i></i><span>0${U.id}</span></button>`).join("")}</div>
    <div class="ticks" style="position:relative;height:1.2em">${(()=>{ const tot=UNITS.reduce((a,U)=>a+span(U),0); let acc=0; const out=[`<span style="position:absolute;left:0">1491</span>`]; UNITS.forEach((U,i)=>{ acc+=span(U); const end=U.years.split("–")[1]; if(i<UNITS.length-1 && i!==3) out.push(`<span class="${i===2?"mid":""}" style="position:absolute;left:${acc/tot*100}%;transform:translateX(-50%)">${end}</span>`); }); out.push(`<span style="position:absolute;right:0">1877</span>`); return out.join(""); })()}</div>`;
  $("#todayDate").textContent = new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"});
  let totalM = 0; UNITS.forEach(U=> totalM += unitMastery(U.id).m);
  let c=0,t=0; for(const k in state.qstats){ c+=state.qstats[k].c; t+=state.qstats[k].t; }
  $("#statMastered").textContent = totalM;
  $("#statAcc").textContent = t ? Math.round(c/t*100)+"%" : "–";
  $("#statWrong").textContent = Object.keys(state.wrongs).length;
  $("#missionText").innerHTML = mission().text;
}
function mission(){
  // first unit that isn't well-mastered
  for(const U of UNITS){
    const m = unitMastery(U.id); const qs = state.qstats[U.id];
    if(m.pct < 60) return {text:`Study <b>Unit ${U.id}: ${esc(U.title)}</b>. Read the story scenes and the group chat, then flip cards until you master at least 60%.`, view:"unit", unit:U.id};
    if(!qs || qs.t < 5) return {text:`You know your Unit ${U.id} terms. Now prove it! Take the <b>Unit ${U.id} quiz</b>.`, view:"quizU", unit:U.id};
  }
  if(Object.keys(state.wrongs).length) return {text:`Crush your <b>${Object.keys(state.wrongs).length} mistakes</b> in Review mode. Mistakes are where the points hide.`, view:"review"};
  return {text:"You've covered everything. Take a <b>20-question mixed quiz</b> to keep it fresh. Legend behavior.", view:"mixed"};
}
$("#startMission").addEventListener("click",()=>{
  const m = mission();
  if(m.view==="unit") go("unit",m.unit);
  else if(m.view==="quizU"){ go("quiz"); startQuiz([m.unit],10,false); }
  else if(m.view==="review"){ go("quiz"); startQuiz([1,2,3,4,5],999,true); }
  else { go("quiz"); startQuiz([1,2,3,4,5],20,false); }
});

/* =========================================================
   UNIT VIEW
   ========================================================= */
function renderUnit(u){
  const U = UNITS[u-1]; const m = unitMastery(u);
  const v = $("#view-unit"); v.style.setProperty("--uc", `var(${U.color})`);
  const sec = [["u-story","Story"],["u-watch","Watch"],["u-chat","Group chat"],["u-now","Then vs. now"],["u-concepts","Concepts"],["u-sources","Sources"],["u-terms","Terms"],["u-timeline","Timeline"],["u-hacks","Memory hacks"],["u-chains","Cause & effect"],["u-quiz","Quiz"]];
  const n = id => String(sec.findIndex(x=>x[0]===id)+1).padStart(2,"0");
  const sh = (id,title,sub) => `<div class="sh"><span class="sn">§ ${n(id)}</span><h2>${title}</h2>${sub?`<p>${sub}</p>`:""}</div>`;
  v.innerHTML = `
  <div class="unit-hero">
    <div>
      <span class="kicker">Unit ${String(U.id).padStart(2,"0")} · ${U.years} · ${U.weight} of the exam</span>
      <h2>${esc(U.title)}</h2>
      <p class="hook">${U.hook}</p>
      <div class="mastery"><div class="progress"><i style="width:${m.pct}%"></i></div><span>${m.m} of ${m.total} terms mastered</span></div>
    </div>
    ${pic(HERO_IMG[u],{w:1000,alt:IMG[HERO_IMG[u]]?IMG[HERO_IMG[u]][1]:""})}
  </div>
  <nav class="unitnav" aria-label="Sections">${sec.map((x,i)=>`<button data-jump="${x[0]}"><span>${String(i+1).padStart(2,"0")}</span>${x[1]}</button>`).join("")}</nav>

  <div class="section story" id="u-story">
    ${sh("u-story",`The story in ${U.story.length} scenes`,"Read it like a movie. Tap any picture to see it full size: these are real paintings, drawings and maps.")}
    <div>${U.story.map((p,i)=>{ const sc=(SCENES[u]||[])[i]||[null,"📜"]; return `<div class="scene">${pic(sc[0],{emoji:sc[1],cap:sc[0]?undefined:false,alt:sc[0]?undefined:"Scene "+(i+1)})}<div><div class="num">Scene ${String(i+1).padStart(2,"0")}</div><p>${p}</p></div></div>`; }).join("")}</div>
    <div style="margin-top:20px"><button class="btn sm ghost" id="storyDone">${store.get("story"+u,false)?"Story complete ✓":"I read it · +10 XP"}</button></div>
  </div>

  <div class="section" id="u-watch">
    ${sh("u-watch","Watch it","Rather watch than read? Same XP energy.")}
    <div class="vgrid">${(VIDEOS[u]||[]).map(videoCard).join("")}</div>
  </div>

  <div class="section" id="u-chat">
    ${sh("u-chat","The group chat","If history had group chats. A dramatized parody, but every event in it really happened.")}
    <div class="phone" id="phone">
      <div class="bar"><div class="gav">U${U.id}</div><div><b>${esc(CHATS[u].title)}</b><span>${esc(CHATS[u].sub)}</span></div></div>
      <div class="msgs" id="msgs"></div>
      <div class="ctrl"><button class="btn sm ghost" id="chatAll">Show all</button><button class="btn sm" id="chatNext">Next message</button></div>
    </div>
  </div>

  <div class="section" id="u-now">
    ${sh("u-now","Then vs. now","The same idea, translated into today's terms.")}
    <div class="tvn">${THENNOW[u].map(t=>`<div class="c"><div class="then"><small>Then</small><b>${esc(t[0])}</b></div><div class="now"><small>Today's terms</small>${esc(t[1])}</div></div>`).join("")}</div>
  </div>

  <div class="section" id="u-concepts">
    ${sh("u-concepts","Key concepts","The “why” behind the facts. Questions love these. Tap to open.")}
    ${U.concepts.map((c,i)=>`<details class="acc"${i===0?" open":""}><summary>${esc(c[0])}</summary><div class="body"><ul>${c[1].map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div></details>`).join("")}
  </div>

  <div class="section" id="u-sources">
    ${sh("u-sources","Primary sources","The real exam shows images like these. Look first, guess what's going on, then analyze.")}
    ${SOURCES[u].map((s,i)=>`<div class="src" id="src-${u}-${i}">${pic(s[0],{cap:false,badge:true})}<div class="sb">
      <h3>${esc(s[1])}</h3><div class="meta">${esc(s[2])}</div>
      <p class="small"><b>Before you click:</b> What do you notice? Who made it, and why?</p>
      <button class="btn sm askbtn" data-src="src-${u}-${i}">Analyze it · +3 XP</button>
      <div class="reveal"><span class="kicker">What to notice</span><ul>${s[3].map(n=>`<li>${esc(n)}</li>`).join("")}</ul><div class="note small"><b>AP hook:</b> ${esc(s[4])}</div></div>
    </div></div>`).join("")}
  </div>

  <div class="section" id="u-terms">
    ${sh("u-terms","Must-know terms","Look at the term, explain it out loud, then tap to flip. Mark “Got it” only when you truly know it.")}
    <div class="flipgrid">${U.terms.map((t,i)=>flipCard(u,i,t)).join("")}</div>
  </div>

  <div class="section" id="u-timeline">
    ${sh("u-timeline","Timeline","Put it in order. Chronology quietly decides a lot of answers.")}
    <div class="tl">${U.timeline.map(x=>`<div class="tl-item"><span class="y">${x[0]}</span><span class="ev">${esc(x[1])}</span></div>`).join("")}</div>
  </div>

  <div class="section" id="u-hacks">
    ${sh("u-hacks","Memory hacks","Silly is good. Silly sticks.")}
    <div class="grid g2">${U.hacks.map(h=>`<div class="hack"><h4>${esc(h[0])}</h4><div class="mn">${esc(h[1])}</div><div class="small">${esc(h[2])}</div></div>`).join("")}</div>
  </div>

  <div class="section" id="u-chains">
    ${sh("u-chains","Cause &amp; effect","Before you click, <b>guess</b> what happens next. That's exactly the causation skill the test checks.")}
    <div class="grid g2">${U.chains.map((c,ci)=>`<div class="card"><div class="chain" data-chain="${ci}">
      ${c.map((s,si)=>`${si>0?`<div class="arrow${si>1?" hidden":""}"></div>`:""}<div class="link${si>1?" hidden":""}">${esc(s)}</div>`).join("")}
      </div><button class="btn sm ghost" style="margin-top:14px" data-next-link>What happened next? <span class="arr">→</span></button></div>`).join("")}</div>
  </div>

  <div class="section" id="u-quiz">
    <div class="band">
      <div><span class="kicker">§ ${n("u-quiz")} · Check yourself</span><h3>Unit ${U.id} quiz</h3><p>${U.quiz.length} AP-style questions with explanations. +10 XP for every correct answer.</p></div>
      <div class="row"><button class="btn" id="unitQuizBtn">Start quiz <span class="arr">→</span></button>
      ${u<5?`<button class="btn ghost" data-go="unit" data-unit="${u+1}">Unit ${u+1}</button>`:""}</div>
    </div>
  </div>`;
  v.querySelectorAll("[data-jump]").forEach(b=>b.addEventListener("click",()=>document.getElementById(b.dataset.jump).scrollIntoView({behavior:"smooth",block:"start"})));
  $("#storyDone").addEventListener("click",e=>{
    const key="story"+u; if(store.get(key,false)){ toast("Already counted. Nice re-read though."); return; }
    store.set(key,true); addXP(10); toast("+10 XP · story complete"); e.target.textContent="Story complete ✓";
  });
  $("#unitQuizBtn").addEventListener("click",()=>{ go("quiz"); startQuiz([u],999,false); });
  v.querySelectorAll("[data-next-link]").forEach(btn=>btn.addEventListener("click",()=>{
    const ch = btn.previousElementSibling;
    const hiddenLink = ch.querySelector(".link.hidden");
    if(!hiddenLink){ ch.querySelectorAll(".link,.arrow").forEach((el,i)=>{ if(i>2) el.classList.add("hidden"); }); btn.innerHTML='What happened next? <span class="arr">→</span>'; return; }
    hiddenLink.previousElementSibling.classList.remove("hidden"); hiddenLink.classList.remove("hidden");
    if(!ch.querySelector(".link.hidden")){ btn.textContent="Reset chain"; addXP(2); }
  }));
  bindFlips(v);
  initChat(u);
  v.querySelectorAll(".askbtn").forEach(b=>b.addEventListener("click",()=>{
    document.getElementById(b.dataset.src).classList.add("open");
    const key="src_"+b.dataset.src; if(!store.get(key,false)){ store.set(key,true); addXP(3); }
  }));
}

/* ---------- group chat ---------- */
const AVATAR = {"Las Casas":"lascasas","Cortés":"cortes","Thomas Jefferson":"jefferson","Andrew Jackson":"jackson","Henry Clay":"clay","John C. Calhoun":"calhoun","John Marshall":"marshall","Lincoln":"lincoln","Frederick Douglass":"douglass","Ben Franklin":null};
function initChat(u){
  const C = CHATS[u]; let i = 0; const box = $("#msgs"); let busy = false;
  const av = name => { const k = AVATAR[name]; const ini = name.split(" ").map(w=>w[0]).join("").slice(0,2);
    return `<div class="av">${k?`<img src="${imgURL(k,80)}" alt="" referrerpolicy="no-referrer" onerror="this.replaceWith(document.createTextNode('${ini}'))">`:ini}</div>`; };
  const render = m => {
    if(m[0]==="sys") return `<div class="sys">${esc(m[1])}</div>`;
    if(m[0]==="fact") return `<div class="sys fact">${esc(m[1])}</div>`;
    return `<div class="msg${m[2]==="me"?" me":""}">${av(m[0])}<div class="bub"><div class="who">${esc(m[0])}</div>${esc(m[1])}</div></div>`;
  };
  const done = () => { $("#chatNext").textContent = "Replay"; const key="chat"+u; if(!store.get(key,false)){ store.set(key,true); addXP(5); toast("+5 XP · chat complete"); } };
  const next = () => {
    if(busy) return;
    if(i >= C.msgs.length){ i=0; box.innerHTML=""; $("#chatNext").textContent="Next message"; return; }
    busy = true; box.insertAdjacentHTML("beforeend",`<div class="typing"><i></i><i></i><i></i></div>`); box.scrollTop = box.scrollHeight;
    setTimeout(()=>{ const t=box.querySelector(".typing"); if(t) t.remove(); box.insertAdjacentHTML("beforeend",render(C.msgs[i++])); box.scrollTop=box.scrollHeight; busy=false; if(i>=C.msgs.length) done(); }, 450);
  };
  $("#chatNext").onclick = next;
  $("#chatAll").onclick = () => { box.innerHTML = C.msgs.map(render).join(""); i = C.msgs.length; busy=false; box.scrollTop=box.scrollHeight; done(); };
  next();
}

/* ---------- video cards ---------- */
function videoCard(v){
  const url = v[4] ? `https://www.youtube.com/watch?v=${v[0]}&list=${v[4]}` : `https://www.youtube.com/watch?v=${v[0]}`;
  const watched = store.get("vid_"+v[0], false);
  return `<a class="vcard${watched?" done":""}" href="${url}" target="_blank" rel="noopener" data-vid="${v[0]}">
    <figure class="ph" data-emoji="▶️" style="--uc:#c4302b"><img src="https://i.ytimg.com/vi/${v[0]}/hqdefault.jpg" alt="" loading="lazy" onerror="this.parentNode.classList.add('noimg')"><div class="play"><i>▶</i></div></figure>
    <div class="vb"><b>${esc(v[1])}</b><span>${esc(v[2])} · ${esc(v[3])}</span></div></a>`;
}
document.addEventListener("click",e=>{
  const a = e.target.closest("[data-vid]"); if(!a) return;
  const key = "vid_"+a.dataset.vid; if(!store.get(key,false)){ store.set(key,true); addXP(15); toast("+15 XP for watching"); }
  a.classList.add("done");
});
function renderVideos(){
  $("#videoArea").innerHTML = UNITS.map(U=>`<div class="section" style="--uc:var(${U.color});margin-top:32px"><div class="sh"><span class="sn">0${U.id}</span><h2>${esc(U.title)}</h2><p class="mono small">${U.years}</p></div><div class="vgrid">${VIDEOS[U.id].map(videoCard).join("")}</div></div>`).join("");
}

/* ---------- lightbox ---------- */
document.addEventListener("click",e=>{
  const f = e.target.closest(".ph.zoom[data-k]"); if(!f || f.classList.contains("noimg")) return;
  if(f.closest(".flip")) return;
  const k = f.dataset.k, lb = $("#lightbox");
  lb.querySelector("img").src = imgURL(k,1600); lb.querySelector("img").alt = IMG[k][1];
  lb.querySelector("p").innerHTML = `${esc(IMG[k][1])}<br><a href="${pageURL(k)}" target="_blank" rel="noopener">Source: Wikimedia Commons (public domain)</a>`;
  lb.classList.add("show");
});
$("#lightbox").addEventListener("click",e=>{ if(e.target.tagName!=="A" && e.target.tagName!=="IMG") $("#lightbox").classList.remove("show"); });
document.addEventListener("keydown",e=>{ if(e.key==="Escape") $("#lightbox").classList.remove("show"); });

/* ---------- who am I ---------- */
let whoStreak = 0, whoScore = store.get("whoScore",0), whoCur = null, whoDeck = [];
function nextWho(){
  if(!whoDeck.length) whoDeck = shuffle(WHO.map((_,i)=>i));
  whoCur = WHO[whoDeck.pop()];
  const others = shuffle(WHO.filter(w=>w!==whoCur)).slice(0,3);
  const opts = shuffle([whoCur, ...others]);
  $("#whoStreak").textContent = whoStreak; $("#whoScore").textContent = whoScore;
  $("#whoArea").innerHTML = `<div class="who-wrap" style="--uc:${unitColor(whoCur[3])}">
    ${pic(whoCur[0],{cap:false,badge:false,zoom:false,emoji:"🕵️",w:600,alt:"Portrait hidden: name the person"})}
    <div><div class="quote-bub">“${esc(whoCur[2])}”</div>
    <div style="margin-bottom:14px"><span class="tag u">Hint · Unit ${whoCur[3]}</span></div>
    <div id="whoOpts">${opts.map(o=>`<button class="opt" data-n="${esc(o[1])}"><span class="l">${"ABCD"[opts.indexOf(o)]}</span><span>${esc(o[1])}</span></button>`).join("")}</div>
    <div id="whoFb"></div></div></div>`;
  document.querySelectorAll("#whoOpts .opt").forEach(b=>b.addEventListener("click",()=>{
    const ok = b.dataset.n === whoCur[1];
    document.querySelectorAll("#whoOpts .opt").forEach(x=>{ x.disabled=true; if(x.dataset.n===whoCur[1]) x.classList.add("right"); else if(x===b) x.classList.add("wrong"); });
    if(ok){ whoStreak++; whoScore++; store.set("whoScore",whoScore); addXP(5); if(whoStreak%5===0) confetti(); } else whoStreak=0;
    $("#whoStreak").textContent = whoStreak; $("#whoScore").textContent = whoScore;
    $("#whoFb").innerHTML = `<div class="explain ${ok?"good":"badx"}"><b>${ok?"Correct":"Not quite"}</b>${ok?"Yes, that's "+esc(whoCur[1])+".":"That was "+esc(whoCur[1])+"."}<div class="small muted" style="margin-top:4px">Unit ${whoCur[3]} · ${esc(IMG[whoCur[0]][1])}</div></div><button class="btn" id="whoNext">Next face <span class="arr">→</span></button>`;
    $("#whoNext").onclick = nextWho; $("#whoNext").focus({preventScroll:true});
  }));
}

function flipCard(u,i,t,big){
  const id = u+"-"+i; const done = !!state.mastered[id]; const tk = TERM_IMG[t[0]];
  return `<div class="flip${big?" bigcard":""}" data-id="${id}" style="--uc:${unitColor(u)}">
    <div class="inner">
      <div class="face front" data-u="UNIT 0${u} · No. ${String(i+1).padStart(2,"0")}">${done?'<span class="mastered-badge">Mastered</span>':""}
        ${tk?`<div class="thumb ph"><img src="${imgURL(tk,200)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.parentNode.classList.add('noimg')"></div>`:""}
        <b>${esc(t[0])}</b><div class="yr">${esc(t[1])}</div><div class="tap">Tap to flip</div></div>
      <div class="face back"><div>${esc(t[2])}</div><div class="why">Why it matters: ${esc(t[3])}</div>
        <div class="row" style="margin-top:12px;gap:8px">
          <button class="btn sm ok" data-master="${id}">${done?"Mastered ✓":"Got it"}</button>
          <button class="btn sm ghost" data-unmaster="${id}">Still learning</button>
        </div></div>
    </div></div>`;
}
function bindFlips(root){
  root.querySelectorAll(".flip").forEach(f=>f.addEventListener("click",e=>{
    if(e.target.closest("[data-master]")){
      e.stopPropagation(); const id=e.target.closest("[data-master]").dataset.master;
      if(!state.mastered[id]){ state.mastered[id]=true; save(); addXP(5); toast("+5 XP · card mastered"); }
      markCard(f,true); if(root.id==="bigCardArea") setTimeout(()=>{ cardIdx++; drawBigCard(); },350);
      return;
    }
    if(e.target.closest("[data-unmaster]")){
      e.stopPropagation(); const id=e.target.closest("[data-unmaster]").dataset.unmaster;
      delete state.mastered[id]; save(); markCard(f,false); toast("No problem. It'll come back around.");
      if(root.id==="bigCardArea") setTimeout(()=>{ cardIdx++; drawBigCard(); },350);
      return;
    }
    f.classList.toggle("flipped");
  }));
}
function markCard(f,done){
  const front = f.querySelector(".front"); let b = front.querySelector(".mastered-badge");
  if(done && !b){ b=document.createElement("span"); b.className="mastered-badge"; b.textContent="Mastered"; front.prepend(b); }
  if(!done && b) b.remove();
  const mb = f.querySelector("[data-master]"); if(mb) mb.textContent = done ? "Mastered ✓" : "Got it";
  f.classList.remove("flipped");
}

/* =========================================================
   FLASHCARD MODE
   ========================================================= */
let cardUnits = new Set([1,2,3,4,5]), cardDeck = [], cardIdx = 0;
function renderCardsView(){
  $("#cardFilters").innerHTML = UNITS.map(U=>`<label class="chk"><input type="checkbox" data-cu="${U.id}" ${cardUnits.has(U.id)?"checked":""}> Unit ${U.id}</label>`).join("");
  $("#cardFilters").querySelectorAll("input").forEach(i=>i.addEventListener("change",()=>{
    i.checked ? cardUnits.add(+i.dataset.cu) : cardUnits.delete(+i.dataset.cu); buildDeck();
  }));
  buildDeck();
}
function buildDeck(shuf){
  const hide = $("#hideMastered").checked; cardDeck = [];
  UNITS.forEach(U=>{ if(!cardUnits.has(U.id)) return; U.terms.forEach((t,i)=>{ if(hide && state.mastered[U.id+"-"+i]) return; cardDeck.push([U.id,i]); }); });
  if(shuf) cardDeck = shuffle(cardDeck);
  cardIdx = 0; drawBigCard();
}
function drawBigCard(){
  const area = $("#bigCardArea");
  $("#cardCount").textContent = cardDeck.length ? `${Math.min(cardIdx+1,cardDeck.length)} / ${cardDeck.length}` : "";
  if(!cardDeck.length){ area.innerHTML = `<div class="card" style="max-width:620px"><span class="kicker">Deck cleared</span><h3>Every card here is mastered.</h3><p class="muted">Uncheck “Hide mastered” to review them, or pick other units.</p></div>`; return; }
  if(cardIdx >= cardDeck.length){ area.innerHTML = `<div class="card" style="max-width:620px"><span class="kicker">Round complete</span><h3>Nice. Go again.</h3><p class="muted">Cards you marked “Got it” drop out, so the pile keeps shrinking.</p><button class="btn" id="againBtn">Next round</button></div>`; $("#againBtn").onclick=()=>buildDeck(true); confetti(); return; }
  const [u,i] = cardDeck[cardIdx];
  area.innerHTML = flipCard(u,i,UNITS[u-1].terms[i],true) + `
    <div class="row" style="max-width:620px;justify-content:space-between;margin-top:16px">
      <button class="btn sm ghost" id="prevCard">← Prev</button>
      <span class="tag u" style="--uc:${unitColor(u)}">Unit ${u}</span>
      <button class="btn sm ghost" id="nextCard">Skip →</button>
    </div>`;
  bindFlips(area);
  $("#prevCard").onclick=()=>{ cardIdx=Math.max(0,cardIdx-1); drawBigCard(); };
  $("#nextCard").onclick=()=>{ cardIdx++; drawBigCard(); };
}
$("#hideMastered").addEventListener("change",()=>buildDeck());
$("#shuffleCards").addEventListener("click",()=>buildDeck(true));

/* =========================================================
   QUIZ ARENA
   ========================================================= */
let Q = null;
function renderQuizSetup(){
  if(Q && Q.active) return;
  const nWrong = Object.keys(state.wrongs).length;
  $("#quizArea").innerHTML = `
    <div class="phead"><span class="kicker">Practice · Multiple choice</span>
    <h2>Quiz</h2>
    <p>AP-style questions, some with primary sources just like the exam. Every answer comes with an explanation, so wrong answers are learning, not failing.</p></div>
    <div class="card setup">
      <h3>01 · Units</h3>
      <div class="row" id="qUnits">${UNITS.map(U=>`<label class="chk"><input type="checkbox" value="${U.id}" checked> Unit ${U.id}</label>`).join("")}</div>
      <h3 style="margin-top:22px">02 · Length</h3>
      <div class="row" id="qCount">
        <label class="chk"><input type="radio" name="qc" value="10" checked> 10 (quick)</label>
        <label class="chk"><input type="radio" name="qc" value="20"> 20</label>
        <label class="chk"><input type="radio" name="qc" value="999"> All of them</label>
      </div>
      <div class="row" style="margin-top:20px">
        <button class="btn" id="qGo">Start quiz <span class="arr">→</span></button>
        <button class="btn ghost" id="qReview" ${nWrong?"":"disabled"}>Review my mistakes (${nWrong})</button>
      </div>
    </div>`;
  $("#qGo").onclick=()=>{
    const units=[...document.querySelectorAll("#qUnits input:checked")].map(i=>+i.value);
    if(!units.length){ toast("Pick at least one unit!"); return; }
    startQuiz(units, +document.querySelector("#qCount input:checked").value, false);
  };
  $("#qReview").onclick=()=>{ if(nWrong) startQuiz([1,2,3,4,5],999,true); };
}
function startQuiz(units, n, reviewOnly){
  let pool = [];
  units.forEach(u=>UNITS[u-1].quiz.forEach((q,i)=>{ const id=u+"-q"+i; if(reviewOnly && !state.wrongs[id]) return; pool.push({...q,u,id}); }));
  pool = shuffle(pool).slice(0,n);
  if(!pool.length){ toast("Nothing to review. You're clean."); Q=null; renderQuizSetup(); return; }
  // shuffle options per question
  pool = pool.map(q=>{ const order = shuffle(q.o.map((_,i)=>i)); return {...q, o:order.map(i=>q.o[i]), a:order.indexOf(q.a)}; });
  Q = {pool, i:0, score:0, active:true, review:reviewOnly, streak:0};
  drawQ();
}
function drawQ(){
  const q = Q.pool[Q.i]; const L = "ABCD";
  $("#quizArea").innerHTML = `
    <div class="qhead">
      <span class="tag u" style="--uc:${unitColor(q.u)}">Unit ${q.u}</span>
      <div class="qbar"><i style="width:${Q.i/Q.pool.length*100}%"></i></div>
      <span class="qcount"><b>${String(Q.i+1).padStart(2,"0")}</b> / ${String(Q.pool.length).padStart(2,"0")} · ${Q.score} correct${Q.streak>=3?` · streak ${Q.streak}`:""}</span>
    </div>
    <div class="card" style="padding:26px">
      ${q.img?pic(q.img,{cls:"qimg",badge:true}):""}
      ${q.s?`<div class="stim">${esc(q.s)}<cite>— ${esc(q.c)}</cite></div>`:""}
      <div class="qtext">${esc(q.q)}</div>
      <div id="opts">${q.o.map((o,i)=>`<button class="opt" data-i="${i}"><span class="l">${L[i]}</span><span>${esc(o)}</span></button>`).join("")}</div>
      <div id="qFeedback"></div>
    </div>
    <div class="row" style="margin-top:14px"><button class="btn sm ghost" id="qQuit">Quit quiz</button></div>`;
  document.querySelectorAll("#opts .opt").forEach(b=>b.addEventListener("click",()=>answer(+b.dataset.i)));
  $("#qQuit").onclick=()=>{ Q.active=false; renderQuizSetup(); };
}
function answer(i){
  const q = Q.pool[Q.i]; const ok = i===q.a;
  document.querySelectorAll("#opts .opt").forEach((b,j)=>{ b.disabled=true; if(j===q.a) b.classList.add("right"); else if(j===i) b.classList.add("wrong"); });
  const st = state.qstats[q.u] || {c:0,t:0}; st.t++; if(ok) st.c++; state.qstats[q.u]=st;
  if(ok){ Q.score++; Q.streak++; delete state.wrongs[q.id]; addXP(Q.streak>=3?15:10); }
  else { Q.streak=0; state.wrongs[q.id]=true; }
  save();
  const cheers = ["Nailed it","That's AP thinking","Correct","Exactly right","Yes"];
  $("#qFeedback").innerHTML = `<div class="explain ${ok?"good":"badx"}"><b>${ok?cheers[Math.floor(Math.random()*cheers.length)]:"Not quite · here's the key"}</b>${esc(q.e)}${!ok?`<div class="small muted" style="margin-top:6px">Saved to your “Review my mistakes” pile.</div>`:""}</div>
    <button class="btn" id="qNext">${Q.i+1<Q.pool.length?'Next question <span class="arr">→</span>':'See my results <span class="arr">→</span>'}</button>`;
  $("#qNext").onclick=()=>{ Q.i++; Q.i<Q.pool.length ? drawQ() : finishQuiz(); };
  $("#qNext").focus({preventScroll:true});
}
function finishQuiz(){
  Q.active=false; const pct = Math.round(Q.score/Q.pool.length*100);
  let msg = pct>=90 ? "A-level work. You're ready." : pct>=75 ? "Strong. Review the misses and you're there." : pct>=50 ? "Solid start. Hit the flashcards for those units, then try again." : "That's okay, this is exactly how learning works. Read the stories again, then come back. You'll see the jump.";
  if(pct>=80) confetti();
  addXP(pct===100?30:0);
  $("#quizArea").innerHTML = `<div class="card" style="padding:32px">
    <span class="kicker">Results</span>
    <div class="score-big">${pct}<span style="font-size:.45em;color:var(--muted)">%</span></div>
    <p class="mono small muted" style="margin-top:8px">${Q.score} of ${Q.pool.length} correct${pct===100?" · +30 XP perfect bonus":""}</p>
    <p style="font-family:var(--serif);font-size:1.25rem;max-width:44ch">${msg}</p>
    <div class="row" style="margin-top:18px">
      <button class="btn" id="qAgain">Play again</button>
      <button class="btn ghost" id="qRev">Review mistakes (${Object.keys(state.wrongs).length})</button>
      <button class="btn ghost" data-go="cards">Flashcards</button>
    </div></div>`;
  $("#qAgain").onclick=()=>renderQuizSetup();
  $("#qRev").onclick=()=>startQuiz([1,2,3,4,5],999,true);
}

/* =========================================================
   WHICH CAME FIRST?
   ========================================================= */
let ordStreak = 0, ordPair = null;
function allEvents(){
  const sel = $("#ordUnit").value; const ev=[];
  UNITS.forEach(U=>{ if(sel!=="all" && +sel!==U.id) return; U.timeline.forEach(t=>ev.push({y:t[0],e:t[1],u:U.id})); });
  return ev;
}
function nextOrder(){
  $("#ordBest").textContent = state.ordBest; $("#ordStreak").textContent = ordStreak;
  const ev = allEvents(); let a,b,tries=0;
  do{ a=ev[Math.floor(Math.random()*ev.length)]; b=ev[Math.floor(Math.random()*ev.length)]; tries++; } while((a.y===b.y) && tries<200);
  ordPair=[a,b];
  $("#ordArea").innerHTML = `<button class="evt" data-k="0" style="--uc:${unitColor(a.u)}"><span>${esc(a.e)}</span><span class="yy">····</span></button><div class="or">or</div><button class="evt" data-k="1" style="--uc:${unitColor(b.u)}"><span>${esc(b.e)}</span><span class="yy">····</span></button>`;
  $("#ordFeedback").innerHTML = "";
  document.querySelectorAll(".evt").forEach(btn=>btn.addEventListener("click",()=>pickOrder(+btn.dataset.k)));
}
function pickOrder(k){
  const [a,b]=ordPair; const earlier = a.y<b.y?0:1; const ok = k===earlier;
  document.querySelectorAll(".evt").forEach((btn,j)=>{ btn.disabled=true; btn.querySelector(".yy").textContent=ordPair[j].y; btn.classList.add(j===earlier?"right":"wrong"); });
  if(ok){ ordStreak++; addXP(3); if(ordStreak>state.ordBest){ state.ordBest=ordStreak; save(); if(ordStreak%10===0) confetti(); } }
  else ordStreak=0;
  $("#ordStreak").textContent=ordStreak; $("#ordBest").textContent=state.ordBest;
  const gap = Math.abs(a.y-b.y);
  $("#ordFeedback").innerHTML = `<div class="explain ${ok?"good":"badx"}"><b>${ok?"Correct":"Other way around"}</b>“${esc(ordPair[earlier].e)}” came ${gap} year${gap===1?"":"s"} earlier.</div><button class="btn" id="ordNext">Next pair <span class="arr">→</span></button>`;
  $("#ordNext").onclick=nextOrder; $("#ordNext").focus({preventScroll:true});
}
$("#ordUnit").addEventListener("change",()=>{ ordStreak=0; nextOrder(); });

/* =========================================================
   CHEAT SHEETS + SEARCH
   ========================================================= */
function renderCheat(){
  if($("#cheatContent").dataset.done) return;
  $("#cheatContent").dataset.done = 1;
  $("#cheatContent").innerHTML = `
  <div class="section"><div class="sh"><span class="sn">01</span><h2>Presidents, 1789–1877</h2></div><div class="scroll"><table class="tbl">
    <tr><th>#</th><th>President</th><th>Years</th><th>Party</th><th>Know them for</th></tr>
    ${PRESIDENTS.map((p,i)=>`<tr><td class="mono small">${String(i+1).padStart(2,"0")}</td><td><b>${esc(p[0])}</b></td><td class="mono small">${p[1]}</td><td><span class="tag">${esc(p[2])}</span></td><td>${esc(p[3])}</td></tr>`).join("")}
  </table></div><p class="small muted" style="margin-top:8px">Trick for the first 7: “<b>W</b>ashington <b>A</b>nd <b>J</b>efferson <b>M</b>ade <b>M</b>any <b>A</b>wesome <b>J</b>okes” (Washington, Adams, Jefferson, Madison, Monroe, Adams, Jackson).</p></div>

  <div class="section grid g2">
    <div class="card"><span class="kicker">02</span><h3>Supreme Court cases</h3><div class="scroll"><table class="tbl">
      <tr><th>Case</th><th>Year</th><th>Ruling</th></tr>
      ${CASES.map(c=>`<tr><td><b>${esc(c[0])}</b></td><td>${c[1]}</td><td>${esc(c[2])}<div class="small muted">${esc(c[3])}</div></td></tr>`).join("")}
    </table></div></div>
    <div class="card"><span class="kicker">03</span><h3>The great compromises</h3><div class="scroll"><table class="tbl">
      <tr><th>Compromise</th><th>Year</th><th>Deal</th></tr>
      ${COMPROMISES.map(c=>`<tr><td><b>${esc(c[0])}</b></td><td>${c[1]}</td><td>${esc(c[2])}</td></tr>`).join("")}
    </table></div><p class="small muted" style="margin-top:8px">Pattern: every compromise over slavery bought time, and each one lasted less long than the last.</p></div>
  </div>

  <div class="section"><div class="sh"><span class="sn">04</span><h2>Political parties</h2></div>
    <div class="tl" style="--uc:var(--accent2)">${PARTIES.map(p=>`<div class="tl-item"><span class="y">${p[0]}</span><span class="ev">${esc(p[1])}</span></div>`).join("")}</div>
  </div>

  <div class="section grid g2">
    <div class="card"><span class="kicker">05</span><h3>Colonial regions at a glance</h3><div class="scroll"><table class="tbl">
      <tr><th>Region</th><th>Economy</th><th>Society</th></tr>
      <tr><td><b>New England</b></td><td>Fishing, shipbuilding, small farms, trade</td><td>Puritan, families, town meetings, literacy</td></tr>
      <tr><td><b>Middle</b></td><td>Wheat (“breadbasket”), ports</td><td>Most diverse, religious tolerance (Quakers)</td></tr>
      <tr><td><b>Chesapeake</b></td><td>Tobacco</td><td>Indentured servants → slaves, young men, high death rate</td></tr>
      <tr><td><b>Carolinas/Georgia</b></td><td>Rice, indigo</td><td>Enslaved majority, planter elite, strict slave codes</td></tr>
    </table></div></div>
    <div class="card"><span class="kicker">06</span><h3>North vs. South in 1861</h3><div class="scroll"><table class="tbl">
      <tr><th>Union (North)</th><th>Confederacy (South)</th></tr>
      <tr><td>~22 million people</td><td>~9 million (3.5 million enslaved)</td></tr>
      <tr><td>~90% of factories</td><td>Cotton, little industry</td></tr>
      <tr><td>Most railroads &amp; the navy</td><td>Defensive war on home ground</td></tr>
      <tr><td>Lincoln; Grant (later)</td><td>Strong generals: Lee, “Stonewall” Jackson</td></tr>
      <tr><td>Strategy: Anaconda Plan</td><td>Strategy: outlast the North; hope for British help</td></tr>
    </table></div></div>
  </div>`;
}
$("#cheatSearch").addEventListener("input",e=>{
  const q = e.target.value.trim().toLowerCase(); const out = $("#searchResults");
  if(q.length<2){ out.innerHTML=""; return; }
  const hits=[];
  UNITS.forEach(U=>{
    U.terms.forEach(t=>{ if((t.join(" ")).toLowerCase().includes(q)) hits.push(`<div class="hit" style="--uc:var(${U.color})"><span class="tag u">Unit ${U.id}</span> <b>${esc(t[0])}</b> <span class="muted small mono">${esc(t[1])}</span><div class="small">${esc(t[2])} <i>${esc(t[3])}</i></div></div>`); });
    U.timeline.forEach(t=>{ if((t[0]+" "+t[1]).toLowerCase().includes(q)) hits.push(`<div class="hit" style="--uc:var(${U.color})"><span class="tag u">Unit ${U.id} · timeline</span> <b class="mono">${t[0]}</b> ${esc(t[1])}</div>`); });
  });
  PRESIDENTS.forEach(p=>{ if(p.join(" ").toLowerCase().includes(q)) hits.push(`<div class="hit"><span class="tag">President</span> <b>${esc(p[0])}</b> <span class="mono small muted">${p[1]}</span> ${esc(p[3])}</div>`); });
  out.innerHTML = hits.length ? `<p class="small muted mono">${hits.length} result${hits.length>1?"s":""}</p>`+hits.slice(0,40).join("") : `<p class="muted">No matches. Try another word.</p>`;
});

/* =========================================================
   FOCUS TIMER
   ========================================================= */
let tLeft = 15*60, tRunning = null, tMode = "focus";
function drawTimer(){ const m=Math.floor(tLeft/60), s=tLeft%60; $("#timerDisplay").textContent=`${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`; }
function setMode(mode){ tMode=mode; clearInterval(tRunning); tRunning=null; tLeft = mode==="focus"?15*60:5*60; $("#timerStart").textContent="Start"; $("#timerLabel").textContent = mode==="focus"?"Focus session":"Break: stretch, water, look away from the screen"; drawTimer(); }
$("#timerStart").addEventListener("click",()=>{
  if(tRunning){ clearInterval(tRunning); tRunning=null; $("#timerStart").textContent="Resume"; return; }
  $("#timerStart").textContent="Pause";
  tRunning = setInterval(()=>{ tLeft--; drawTimer(); if(tLeft<=0){ clearInterval(tRunning); tRunning=null;
    if(tMode==="focus"){ addXP(20); confetti(); toast("Focus session done · +20 XP. Take your 5-minute break."); setMode("break"); }
    else { toast("Break's over. Ready for another round?"); setMode("focus"); } } },1000);
});
$("#timerReset").addEventListener("click",()=>setMode(tMode));
$("#timerBreak").addEventListener("click",()=>setMode(tMode==="focus"?"break":"focus"));

/* INIT */
/* home hero painting + cast */
$("#castStrip").innerHTML = WHO.slice().sort((a,b)=>a[3]-b[3]).map(w=>`<div class="p" data-go="who" style="--uc:${unitColor(w[3])}">${pic(w[0],{cap:false,zoom:false,badge:false,w:240}).replace("<figure ",`<figure data-ini="${w[1].split(" ").filter(x=>/^[A-Z]/.test(x)).map(x=>x[0]).join("").slice(0,3)}" `)}<b>${esc(w[1])}</b><span>Unit 0${w[3]}</span></div>`).join("");
renderXP(); drawTimer(); route(true);
