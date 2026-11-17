/* =========================================================
   MR MARVIN — the AI tutor widget (every page).
   Talks to /api/tutor (Claude). If that can't be reached
   (for example the site was opened from a downloaded file),
   he answers from the site's own notes instead.
   ========================================================= */
(function(){
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, r=document) => r.querySelector(s);
  const escH = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

  /* Mr Marvin's portrait: a friendly history teacher with glasses, a mustache and a bow tie */
  const AVATAR = (size) => `<svg viewBox="0 0 120 120" width="${size||"100%"}" height="${size||"100%"}" aria-hidden="true">
    <circle cx="60" cy="60" r="60" fill="#e9b872"/>
    <circle cx="60" cy="60" r="60" fill="url(#mmg)"/>
    <defs><radialGradient id="mmg" cx=".3" cy=".25" r=".9"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#a3301f" stop-opacity=".25"/></radialGradient></defs>
    <path d="M18 120c3-24 20-36 42-36s39 12 42 36z" fill="#24416b"/>
    <path d="M48 86l12 10 12-10 4 6-16 10-16-10z" fill="#f4efe4"/>
    <path d="M50 96l10 5 10-5-2 9-8-3-8 3z" fill="#a3301f"/>
    <rect x="52" y="70" width="16" height="16" rx="6" fill="#c98a5e"/>
    <ellipse cx="60" cy="56" rx="23" ry="26" fill="#d9a074"/>
    <ellipse cx="37" cy="58" rx="4" ry="6" fill="#c98a5e"/><ellipse cx="83" cy="58" rx="4" ry="6" fill="#c98a5e"/>
    <path d="M37 50c0-18 10-26 23-26s23 8 23 26c-4-7-12-11-23-11s-19 4-23 11z" fill="#5b3b2a"/>
    <circle cx="50" cy="56" r="7.5" fill="#fff" fill-opacity=".55" stroke="#1b1a17" stroke-width="2.2"/>
    <circle cx="70" cy="56" r="7.5" fill="#fff" fill-opacity=".55" stroke="#1b1a17" stroke-width="2.2"/>
    <path d="M57.5 56h5" stroke="#1b1a17" stroke-width="2.2"/>
    <circle cx="51" cy="57" r="2.4" fill="#1b1a17"/><circle cx="71" cy="57" r="2.4" fill="#1b1a17"/>
    <path d="M44 46q6-4 12-1M64 45q6-3 12 1" stroke="#5b3b2a" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <path d="M49 69q11-7 22 0q-5 3-11 1q-6 2-11-1z" fill="#5b3b2a"/>
    <path d="M53 75q7 4 14 0" stroke="#8b4a3a" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M28 27l32-13 32 13-32 13z" fill="#1b1a17"/>
    <path d="M44 33v8q16 7 32 0v-8l-16 7z" fill="#2b2925"/>
    <path d="M92 27v16" stroke="#d6a85a" stroke-width="2"/><circle cx="92" cy="45" r="3" fill="#d6a85a"/>
  </svg>`;

  /* ---------- where am I? (makes suggestions + answers fit the page) ---------- */
  function context(){
    const p = location.pathname.split("/").pop() || "index.html";
    const m = location.hash.match(/unit-?(\d)/);
    const U = (typeof UNITS !== "undefined" && m) ? UNITS[+m[1]-1] : null;
    if(U) return { label:`Unit ${U.id}: ${U.title}`, unit:U };
    const names = {"index.html":"Home page","":"Home page","timeline.html":"Timeline","people.html":"The Cast portrait gallery","study.html":"Study hub"};
    const v = location.hash.replace("#","");
    const views = {cards:"Flashcards",quiz:"Quiz",order:"Which Came First game",who:"Who Am I game",videos:"Videos",cheat:"Cheat sheets",skills:"MCQ skills"};
    return { label: views[v] || names[p] || document.title, unit:null };
  }
  function suggestions(){
    const c = context();
    if(c.unit){
      const t = c.unit.terms;
      return [`Explain Unit ${c.unit.id} like I'm 12`, `What's the difference between ${t[2][0]} and ${t[5][0]}?`, `Quiz me on Unit ${c.unit.id}`, `Give me a memory trick for ${t[Math.min(8,t.length-1)][0]}`];
    }
    return ["What caused the American Revolution?", "Explain the Missouri Compromise simply", "Quiz me on Unit 3", "How do I answer a source question?", "Federalists vs. Anti-Federalists?", "Make me a 15-minute study plan"];
  }

  /* ---------- tiny, safe markdown (bold, italics, lists, links, headings) ---------- */
  function md(text){
    const lines = escH(text).split(/\n/);
    let html = "", list = null;
    const inline = s => s
      .replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>")
      .replace(/(^|[^*])\*(?!\s)(.+?)\*(?!\*)/g,"$1<em>$2</em>")
      .replace(/_(.+?)_/g,"<em>$1</em>")
      .replace(/(https?:\/\/[^\s)]+)/g,'<a href="$1" target="_blank" rel="noopener">$1</a>');
    const close = ()=>{ if(list){ html += `</${list}>`; list = null; } };
    lines.forEach(l=>{
      let m;
      if((m = l.match(/^\s*[-•*]\s+(.*)/))){ if(list!=="ul"){ close(); html += "<ul>"; list="ul"; } html += `<li>${inline(m[1])}</li>`; }
      else if((m = l.match(/^\s*\d+[.)]\s+(.*)/))){ if(list!=="ol"){ close(); html += "<ol>"; list="ol"; } html += `<li>${inline(m[1])}</li>`; }
      else if((m = l.match(/^#{1,4}\s+(.*)/))){ close(); html += `<h4>${inline(m[1])}</h4>`; }
      else if(!l.trim()){ close(); }
      else { close(); html += `<p>${inline(l)}</p>`; }
    });
    close();
    return html;
  }

  /* ---------- offline brain: search the site's own notes ---------- */
  function notes(){
    if(notes.cache) return notes.cache;
    const out = [];
    if(typeof UNITS === "undefined") return out;
    const strip = s => String(s).replace(/<[^>]+>/g,"");
    UNITS.forEach(U=>{
      U.terms.forEach(t=>out.push({u:U.id, title:t[0], body:`**${t[0]}** (${t[1]}): ${t[2]} *Why it matters:* ${t[3]}`}));
      U.concepts.forEach(c=>out.push({u:U.id, title:c[0], body:`**${c[0]}**\n${c[1].map(x=>"- "+x).join("\n")}`}));
      U.hacks.forEach(h=>out.push({u:U.id, title:h[0], body:`**Memory hack, ${h[0]}:** "${h[1]}". ${h[2]}`}));
      U.timeline.forEach(e=>out.push({u:U.id, title:String(e[0]), body:`**${e[0]}:** ${e[1]}`}));
      U.story.forEach((s,i)=>out.push({u:U.id, title:`Unit ${U.id} story`, body:strip(s)}));
    });
    if(typeof CASES!=="undefined") CASES.forEach(c=>out.push({title:c[0], body:`**${c[0]}** (${c[1]}): ${c[2]}. ${c[3]}.`}));
    if(typeof COMPROMISES!=="undefined") COMPROMISES.forEach(c=>out.push({title:c[0], body:`**${c[0]}**: ${c.slice(1).join(". ")}`}));
    if(typeof PRESIDENTS!=="undefined") PRESIDENTS.forEach(p=>out.push({title:p[0], body:`**${p[0]}** (${p[1]}, ${p[2]}): ${p[3]}`}));
    return notes.cache = out;
  }
  const STOP = new Set("the a an and or of to in on for is was were what why how who when did does do i me my you about explain tell with as at by it its that this be are from can give between difference vs like simply".split(" "));
  function offlineAnswer(q){
    const words = q.toLowerCase().replace(/[^a-z0-9' ]/g," ").split(/\s+/).filter(w=>w.length>2 && !STOP.has(w));
    const quiz = /quiz|test me/.test(q.toLowerCase());
    const um = q.match(/unit\s*(\d)/i);
    if(quiz && typeof UNITS!=="undefined"){
      const U = UNITS[(um ? +um[1] : 1+Math.floor(Math.random()*5)) - 1] || UNITS[0];
      const Q = U.quiz[Math.floor(Math.random()*U.quiz.length)];
      return `Here's one from **Unit ${U.id}**:\n\n**${Q.q.replace(/<[^>]+>/g,"")}**\n${Q.o.map((o,i)=>"- "+"ABCD"[i]+") "+o).join("\n")}\n\nThink it through, then check the **Quiz** page for the answer and explanation.`;
    }
    if(!words.length) return "Ask me about any person, event, law or idea from Units 1–5 and I'll pull it from the notes.";
    const scored = notes().map(n=>{
      const hay = (n.title+" "+n.body).toLowerCase(), t = n.title.toLowerCase();
      let s = 0; words.forEach(w=>{ if(t.includes(w)) s += 4; if(hay.includes(w)) s += 1; });
      if(um && n.u === +um[1]) s += 1;
      return {n,s};
    }).filter(x=>x.s>1).sort((a,b)=>b.s-a.s).slice(0,3);
    if(!scored.length) return "I couldn't find that in my notes. Try naming a person, event or law (like *Stamp Act*, *Andrew Jackson* or *Dred Scott*).";
    return `Here's what my notes say:\n\n${scored.map(x=>x.n.body).join("\n\n")}`;
  }

  /* ---------- build the widget ---------- */
  const KEY = "mm_history";
  let history = []; try{ history = JSON.parse(sessionStorage.getItem(KEY) || "[]"); }catch(e){}
  const save = ()=>{ try{ sessionStorage.setItem(KEY, JSON.stringify(history.slice(-30))); }catch(e){} };
  let busy = false, offline = false;

  function build(){
    document.body.insertAdjacentHTML("beforeend", `
      <button class="mm-fab" type="button" data-tutor-open aria-label="Ask Mr Marvin, your AI tutor">
        <span class="av">${AVATAR()}<span class="dot"></span></span>
        <span class="lbl">Ask Mr Marvin<small>AI TUTOR · UNITS 1–5</small></span>
      </button>
      <div class="mm-hint" role="status"><button type="button" aria-label="Dismiss">✕</button><b>Stuck on something?</b>I'm Mr Marvin. Ask me anything about Units 1–5 and I'll explain it simply.</div>
      <section class="mm" role="dialog" aria-label="Mr Marvin, AI tutor" aria-modal="false">
        <header class="mm-head">
          <span class="av">${AVATAR()}<span class="dot"></span></span>
          <div><b>Mr Marvin</b><span>AI TUTOR · UNITS 1–5 · 1491–1877</span></div>
          <div class="acts"><button type="button" class="new" title="New chat" aria-label="Start a new chat">↺</button><button type="button" class="x" aria-label="Close">✕</button></div>
        </header>
        <div class="mm-body" aria-live="polite"></div>
        <div class="mm-sugg"></div>
        <div class="mm-foot">
          <form class="mm-form"><textarea rows="1" placeholder="Ask about a person, event, law or idea…" aria-label="Your question"></textarea>
          <button type="submit" aria-label="Send"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10h13M11 4l6 6-6 6"/></svg></button></form>
          <div class="mm-fine">Mr Marvin uses AI and can make mistakes. Double-check key facts in your notes.</div>
        </div>
      </section>`);
    const panel = $(".mm"), body = $(".mm-body", panel), sugg = $(".mm-sugg", panel), form = $(".mm-form", panel), ta = $("textarea", form), hint = $(".mm-hint");

    const scrollDown = ()=>{ body.scrollTop = body.scrollHeight; };
    function welcome(){
      body.innerHTML = `<div class="mm-welcome"><div class="big">${AVATAR()}</div><h3>Hi, I'm Mr Marvin.</h3><p>Your history tutor for Units 1–5. Ask me anything, or tap a question to start.</p></div>`;
      history.forEach(m=>addMsg(m.role, m.content, false));
      renderSugg();
    }
    function renderSugg(){ sugg.innerHTML = history.length > 1 ? "" : suggestions().slice(0,4).map(s=>`<button type="button">${escH(s)}</button>`).join(""); }
    function addMsg(role, text, anim=true){
      const el = document.createElement("div");
      el.className = "mm-msg" + (role === "user" ? " me" : "");
      if(!anim) el.style.animation = "none";
      el.innerHTML = role === "user" ? `<p>${escH(text)}</p>` : md(text);
      if(role === "user") body.appendChild(el);
      else { const row = document.createElement("div"); row.className = "mm-row"; row.innerHTML = `<span class="mini">${AVATAR()}</span>`; row.appendChild(el); body.appendChild(row); }
      scrollDown(); return el;
    }
    async function ask(q){
      q = q.trim(); if(!q || busy) return;
      busy = true; $("button", form).disabled = true;
      history.push({role:"user", content:q}); save();
      addMsg("user", q); sugg.innerHTML = "";
      const row = document.createElement("div"); row.className = "mm-row";
      row.innerHTML = `<span class="mini">${AVATAR()}</span><div class="mm-msg"><span class="mm-typing"><i></i><i></i><i></i></span></div>`;
      body.appendChild(row); scrollDown();
      const bubble = $(".mm-msg", row);
      let answer = "";
      try{
        if(offline || location.protocol === "file:") throw new Error("offline");
        const r = await fetch("/api/tutor", {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({messages:history, page:context().label})});
        if(!r.ok || !r.body) throw new Error("http " + r.status);
        const reader = r.body.getReader(), dec = new TextDecoder();
        while(true){
          const {done, value} = await reader.read(); if(done) break;
          answer += dec.decode(value, {stream:true});
          if(answer.includes("__TUTOR_ERROR__")) throw new Error("upstream");
          bubble.innerHTML = md(answer); scrollDown();
        }
        if(!answer.trim()) throw new Error("empty");
      }catch(e){
        offline = offline || e.message === "offline" || /http (404|405|503)/.test(e.message);
        answer = offlineAnswer(q);
        bubble.innerHTML = md(answer) + `<span class="note">${offline ? "OFFLINE MODE · ANSWERING FROM THE SITE'S NOTES" : "MY AI BRAIN IS BUSY · HERE ARE MY NOTES"}</span>`;
      }
      history.push({role:"assistant", content:answer}); save();
      busy = false; $("button", form).disabled = false; scrollDown();
      if(window.matchMedia("(pointer:fine)").matches) ta.focus();
    }

    function open(prefill){
      document.body.classList.add("mm-open"); hint.classList.remove("show");
      try{ localStorage.setItem("apushq_mm_seen", "1"); }catch(e){}
      if(!body.childElementCount) welcome();
      setTimeout(()=>{ if(prefill) ask(prefill); else if(window.matchMedia("(pointer:fine)").matches) ta.focus(); }, RM ? 0 : 350);
    }
    function close(){ document.body.classList.remove("mm-open"); }

    document.addEventListener("click", e=>{
      const o = e.target.closest("[data-tutor-open]");
      if(o){ e.preventDefault(); open(o.dataset.ask); return; }
      if(e.target.closest(".mm-head .x")) close();
      if(e.target.closest(".mm-head .new")){ history = []; save(); body.innerHTML = ""; welcome(); }
      if(e.target.closest(".mm-hint button")){ hint.classList.remove("show"); try{ localStorage.setItem("apushq_mm_seen","1"); }catch(_){} }
    });
    sugg.addEventListener("click", e=>{ const b = e.target.closest("button"); if(b) ask(b.textContent); });
    form.addEventListener("submit", e=>{ e.preventDefault(); const v = ta.value; ta.value = ""; ta.style.height = ""; ask(v); });
    ta.addEventListener("keydown", e=>{ if(e.key === "Enter" && !e.shiftKey){ e.preventDefault(); form.requestSubmit(); } });
    ta.addEventListener("input", ()=>{ ta.style.height = "auto"; ta.style.height = Math.min(120, ta.scrollHeight) + "px"; });
    document.addEventListener("keydown", e=>{ if(e.key === "Escape" && document.body.classList.contains("mm-open")) close(); });
    addEventListener("hashchange", ()=>{ if(history.length < 2) renderSugg(); });

    let seen = false; try{ seen = localStorage.getItem("apushq_mm_seen"); }catch(e){}
    if(!seen) setTimeout(()=>{ if(!document.body.classList.contains("mm-open")) hint.classList.add("show"); }, 4500);
    window.MrMarvin = { open, ask, avatar: AVATAR };
  }
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
})();
