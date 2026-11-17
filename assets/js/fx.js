/* =========================================================
   FX — the shared motion engine for every page.
   No libraries. Everything degrades to "just visible" when
   prefers-reduced-motion is on or JS fails.
   ========================================================= */
(function(){
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const FINE = matchMedia("(pointer: fine)").matches;
  const root = document.documentElement;
  const lsGet = (k,d)=>{ try{ const v=localStorage.getItem("apushq_"+k); return v?JSON.parse(v):d; }catch(e){ return d; } };
  const lsSet = (k,v)=>{ try{ localStorage.setItem("apushq_"+k, JSON.stringify(v)); }catch(e){} };

  /* ---------- theme (shared across all pages) ---------- */
  const savedTheme = lsGet("theme", null);
  if(savedTheme) root.dataset.theme = savedTheme;
  function toggleTheme(){
    const cur = root.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const nxt = cur === "dark" ? "light" : "dark";
    const apply = ()=>{ root.dataset.theme = nxt; lsSet("theme", nxt); };
    if(document.startViewTransition && !RM) document.startViewTransition(apply); else apply();
  }
  document.addEventListener("click", e=>{ if(e.target.closest("[data-theme-toggle]")) toggleTheme(); });

  /* ---------- chrome: grain, progress line, cursor, curtain ---------- */
  function inject(html){ const t=document.createElement("template"); t.innerHTML=html.trim(); return document.body.appendChild(t.content.firstChild); }
  let progress, cur, dot, curtain;
  function chrome(){
    if(!RM) inject('<div class="grain" aria-hidden="true"></div>');
    progress = inject('<div class="progressline" aria-hidden="true"></div>');
    curtain = inject('<div class="curtain up" aria-hidden="true"><span class="cy"></span></div>');
    if(FINE && !RM && !document.body.hasAttribute("data-no-cursor")){
      document.body.classList.add("has-cursor");
      cur = inject('<div class="cur" aria-hidden="true"></div>');
      dot = inject('<div class="cur-dot" aria-hidden="true"></div>');
    }
  }

  /* ---------- page transitions: curtain drops, page changes, curtain lifts ---------- */
  function setupCurtain(){
    const arrived = sessionStorage.getItem("fx_nav");
    if(arrived && !RM){
      sessionStorage.removeItem("fx_nav");
      curtain.classList.remove("up"); curtain.classList.add("cover");
      curtain.querySelector(".cy").textContent = arrived;
      requestAnimationFrame(()=>requestAnimationFrame(()=>{ curtain.classList.remove("cover"); curtain.classList.add("up"); }));
    }
    document.addEventListener("click", e=>{
      const a = e.target.closest("a[href]"); if(!a || RM) return;
      if(e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target === "_blank" || a.hasAttribute("download")) return;
      const href = a.getAttribute("href");
      if(!href || href.startsWith("#") || /^(mailto|tel|javascript):/.test(href)) return;
      const url = new URL(href, location.href);
      if(url.origin !== location.origin && location.protocol !== "file:") return;
      if(location.protocol === "file:" && url.protocol !== "file:") return;
      if(url.pathname === location.pathname){ return; } /* same page, let the hash router handle it */
      e.preventDefault();
      const label = a.dataset.label || (a.textContent || "").trim().split(/\s+/).slice(0,3).join(" ");
      sessionStorage.setItem("fx_nav", label.length < 28 ? label : "");
      curtain.querySelector(".cy").textContent = label.length < 28 ? label : "";
      curtain.classList.remove("up"); curtain.classList.add("down");
      void curtain.offsetWidth;
      curtain.classList.remove("down"); curtain.classList.add("cover");
      setTimeout(()=>{ location.href = url.href; }, 820);
    });
    /* coming back with the back button: never leave the page covered */
    addEventListener("pageshow", e=>{ if(e.persisted){ curtain.classList.remove("cover","down"); curtain.classList.add("up"); } });
  }

  /* ---------- cursor ---------- */
  function setupCursor(){
    if(!cur) return;
    let x = innerWidth/2, y = innerHeight/2, cx = x, cy = y;
    addEventListener("pointermove", e=>{ x = e.clientX; y = e.clientY; dot.style.transform = `translate(${x}px,${y}px)`; }, {passive:true});
    (function loop(){ cx += (x-cx)*.18; cy += (y-cy)*.18; cur.style.transform = `translate(${cx}px,${cy}px)`; requestAnimationFrame(loop); })();
    document.addEventListener("pointerover", e=>{
      const t = e.target;
      cur.classList.toggle("big", !!t.closest("[data-cursor='big']"));
      cur.classList.toggle("text", !t.closest("a,button,[data-cursor],select,label") && !!t.closest("input[type=text],input:not([type]),textarea"));
      cur.style.opacity = t.closest("a,button,select,label,summary,[data-cursor],.flip,.opt,.evt") ? ".55" : "1";
    });
    document.addEventListener("pointerleave", ()=>{ cur.style.opacity = 0; dot.style.opacity = 0; });
    document.addEventListener("pointerenter", ()=>{ cur.style.opacity = 1; dot.style.opacity = 1; });
  }

  /* ---------- split text into masked words (keeps <em>, <br>, etc.) ---------- */
  function splitWords(el){
    if(el.dataset.splitDone) return; el.dataset.splitDone = 1;
    let i = 0;
    const walk = node=>{
      [...node.childNodes].forEach(n=>{
        if(n.nodeType === 3){
          const parts = n.textContent.split(/(\s+)/);
          const frag = document.createDocumentFragment();
          parts.forEach(p=>{
            if(!p) return;
            if(/^\s+$/.test(p)){ frag.appendChild(document.createTextNode(p)); return; }
            const w = document.createElement("span"); w.className = "w";
            const s = document.createElement("span"); s.textContent = p; s.style.setProperty("--i", i++);
            w.appendChild(s); frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if(n.nodeType === 1 && n.tagName !== "BR"){ walk(n); }
      });
    };
    walk(el);
  }
  function splitScrub(el){
    if(el.dataset.splitDone) return; el.dataset.splitDone = 1;
    const walk = node=>{
      [...node.childNodes].forEach(n=>{
        if(n.nodeType === 3){
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(p=>{
            if(!p) return;
            if(/^\s+$/.test(p)){ frag.appendChild(document.createTextNode(p)); return; }
            const s = document.createElement("span"); s.className = "w"; s.textContent = p; frag.appendChild(s);
          });
          n.replaceWith(frag);
        } else if(n.nodeType === 1){ walk(n); }
      });
    };
    walk(el);
  }

  /* ---------- reveal on scroll ---------- */
  const io = "IntersectionObserver" in window ? new IntersectionObserver(entries=>{
    entries.forEach(en=>{
      if(!en.isIntersecting) return;
      const el = en.target; el.classList.add("in"); io.unobserve(el);
      if(el.dataset.count !== undefined) countUp(el);
      if(el.hasAttribute("data-reveal")){
        const d = parseFloat(getComputedStyle(el).getPropertyValue("--d")) || 0;
        setTimeout(()=>{ el.removeAttribute("data-reveal"); el.style.removeProperty("--d"); }, 1500 + d);
      }
    });
  }, {rootMargin:"0px 0px -8% 0px", threshold:.12}) : null;

  const maskIO = io ? new IntersectionObserver(entries=>{
    entries.forEach(en=>{
      if(!en.isIntersecting) return;
      maskIO.unobserve(en.target);
      (en.target._masks || []).forEach(el=>{ el.classList.add("in"); setTimeout(()=>el.removeAttribute("data-reveal"), 1600); });
      en.target._masks = null;
    });
  }, {rootMargin:"0px 0px -8% 0px"}) : null;

  function countUp(el){
    const end = parseFloat(el.dataset.count), suffix = el.dataset.suffix || "", dur = 1600;
    if(RM){ el.textContent = end + suffix; return; }
    const t0 = performance.now();
    const step = t=>{ const p = Math.min(1,(t-t0)/dur), e = 1-Math.pow(1-p,4); el.textContent = Math.round(end*e) + suffix; if(p<1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }

  /* ---------- scroll-linked effects (one rAF loop) ---------- */
  let scrubs = [], parallax = [], sticky = [], ticking = false, lastY = scrollY;
  function onScroll(){
    if(ticking) return; ticking = true;
    requestAnimationFrame(()=>{
      ticking = false;
      const y = scrollY, vh = innerHeight, max = document.documentElement.scrollHeight - vh;
      if(progress) progress.style.setProperty("--p", max > 0 ? (y/max).toFixed(4) : 0);
      const nav = document.querySelector(".snav");
      if(nav){
        nav.classList.toggle("scrolled", y > 40 && !nav.classList.contains("force-clear"));
        nav.classList.toggle("hide", y > lastY && y > 400 && !document.body.classList.contains("menu-open"));
        /* switch nav ink when it sits over a dark band */
        let dark = false;
        document.querySelectorAll("[data-dark]").forEach(s=>{ const r = s.getBoundingClientRect(); if(r.top <= 34 && r.bottom >= 34) dark = true; });
        nav.classList.toggle("on-dark", dark);
        if(dark) nav.classList.remove("scrolled");
      }
      lastY = y;
      if(RM) return;
      parallax.forEach(el=>{
        const r = el.getBoundingClientRect(); if(r.bottom < -200 || r.top > vh + 200) return;
        const k = parseFloat(el.dataset.parallax) || .15;
        el.style.transform = `translate3d(0,${((r.top + r.height/2) - vh/2) * -k}px,0)`;
      });
      scrubs.forEach(el=>{
        const r = el.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (vh*.85 - r.top) / (r.height + vh*.35)));
        const ws = el._w || (el._w = el.querySelectorAll(".w"));
        const n = Math.round(p * ws.length);
        ws.forEach((w,i)=>w.classList.toggle("lit", i < n));
      });
      sticky.forEach(fn=>fn(y, vh));
    });
  }
  addEventListener("scroll", onScroll, {passive:true});
  addEventListener("resize", onScroll);

  /* ---------- magnetic buttons ---------- */
  function magnet(el){
    if(!FINE || RM || el._mag) return; el._mag = 1;
    const k = parseFloat(el.dataset.magnetic) || .3;
    el.addEventListener("pointermove", e=>{ const r = el.getBoundingClientRect(); el.style.transform = `translate(${(e.clientX - r.left - r.width/2)*k}px,${(e.clientY - r.top - r.height/2)*k}px)`; });
    el.addEventListener("pointerleave", ()=>{ el.style.transform = ""; });
  }
  /* ---------- 3D tilt + spotlight ---------- */
  function tilt(el){
    if(el._tilt) return; el._tilt = 1;
    el.addEventListener("pointermove", e=>{
      const r = el.getBoundingClientRect(), px = (e.clientX - r.left)/r.width, py = (e.clientY - r.top)/r.height;
      el.style.setProperty("--mx", px*100 + "%"); el.style.setProperty("--my", py*100 + "%");
      if(FINE && !RM && el.classList.contains("tilt")){ const m = parseFloat(el.dataset.tilt) || 7; el.style.transform = `perspective(900px) rotateX(${(.5-py)*m}deg) rotateY(${(px-.5)*m}deg)`; }
    });
    el.addEventListener("pointerleave", ()=>{ if(el.classList.contains("tilt")) el.style.transform = ""; });
  }

  /* ---------- public: scan a subtree for animated things ---------- */
  function refresh(scope){
    const s = scope || document;
    s.querySelectorAll("[data-split]").forEach(el=>{ splitWords(el); el.classList.add("split"); if(io && !RM) io.observe(el); else el.classList.add("in"); });
    s.querySelectorAll("[data-reveal]").forEach((el)=>{
      if(!io || RM){ el.classList.add("in"); return; }
      /* a fully clipped element never "intersects", so masks are watched through their parent */
      if(el.dataset.reveal === "mask" && el.parentElement){ (el.parentElement._masks = el.parentElement._masks || new Set()).add(el); maskIO.observe(el.parentElement); }
      else io.observe(el);
    });
    s.querySelectorAll("[data-count]").forEach(el=>{ if(io) io.observe(el); else countUp(el); });
    s.querySelectorAll("[data-scrub]").forEach(el=>{ splitScrub(el); el.classList.add("scrub"); if(!scrubs.includes(el)) scrubs.push(el); });
    s.querySelectorAll("[data-parallax]").forEach(el=>{ if(!parallax.includes(el)) parallax.push(el); });
    s.querySelectorAll("[data-magnetic]").forEach(magnet);
    s.querySelectorAll(".tilt,.spot").forEach(tilt);
    /* stagger helper: children of [data-stagger] reveal one after another */
    s.querySelectorAll("[data-stagger]").forEach(p=>{
      const step = parseInt(p.dataset.stagger) || 70;
      [...p.children].forEach((c,i)=>{ if(!c.hasAttribute("data-reveal")){ c.setAttribute("data-reveal", p.dataset.as || ""); c.style.setProperty("--d", i*step); if(io && !RM) io.observe(c); else c.classList.add("in"); } });
    });
    onScroll();
  }

  /* ---------- mobile menu ---------- */
  document.addEventListener("click", e=>{
    if(e.target.closest(".burger")){ document.body.classList.toggle("menu-open"); return; }
    if(e.target.closest(".snav nav a")) document.body.classList.remove("menu-open");
  });
  document.addEventListener("keydown", e=>{ if(e.key === "Escape") document.body.classList.remove("menu-open"); });

  function boot(){ chrome(); setupCurtain(); setupCursor(); refresh(); }
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();

  window.FX = { refresh, onScroll:fn=>{ sticky.push(fn); onScroll(); }, RM, FINE, countUp };
})();
