/* Builds Mr Marvin's reference sheet from the same data the website shows,
   so the tutor and the pages never disagree. */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

let cached = null;
function courseText() {
  if (cached) return cached;
  const src = fs.readFileSync(path.join(__dirname, "..", "assets", "js", "data.js"), "utf8");
  const sandbox = { localStorage: undefined, console };
  vm.createContext(sandbox);
  vm.runInContext(src + "\n;this.__d={UNITS,VIDEOS,CHATS,SOURCES,WHO,PRESIDENTS,CASES,COMPROMISES,PARTIES,IMG};", sandbox);
  const d = sandbox.__d;
  const strip = s => String(s).replace(/<[^>]+>/g, "");
  const out = [];
  d.UNITS.forEach(U => {
    out.push(`\n# UNIT ${U.id}: ${U.title} (${U.years}, ${U.weight} of the exam)`);
    out.push(`Hook: ${strip(U.hook)}`);
    out.push(`## Story`); U.story.forEach((p, i) => out.push(`Scene ${i + 1}: ${strip(p)}`));
    out.push(`## Key concepts`); U.concepts.forEach(c => out.push(`- ${c[0]}: ${c[1].join("; ")}`));
    out.push(`## Must-know terms`); U.terms.forEach(t => out.push(`- ${t[0]} (${t[1]}): ${t[2]} Why it matters: ${t[3]}`));
    out.push(`## Timeline`); U.timeline.forEach(t => out.push(`- ${t[0]}: ${t[1]}`));
    out.push(`## Memory hacks`); U.hacks.forEach(h => out.push(`- ${h[0]}: "${h[1]}" ${h[2]}`));
    out.push(`## Cause and effect chains`); U.chains.forEach(c => out.push(`- ${c.join(" -> ")}`));
    if (d.SOURCES[U.id]) { out.push(`## Primary sources on the site`); d.SOURCES[U.id].forEach(s => out.push(`- ${s[1]} (${s[2]}): ${s[3].join("; ")}. AP hook: ${s[4]}`)); }
    if (d.VIDEOS[U.id]) { out.push(`## Videos on the site`); d.VIDEOS[U.id].forEach(v => out.push(`- "${v[1]}" by ${v[2]} (${v[3]}): https://www.youtube.com/watch?v=${v[0]}`)); }
    out.push(`## Practice questions on the site`);
    U.quiz.forEach(q => out.push(`- Q: ${strip(q.q)} | Answer: ${strip(q.o[q.a])}${q.e ? " | Why: " + strip(q.e) : ""}`));
  });
  out.push(`\n# CHEAT SHEETS`);
  out.push(`## Presidents`); d.PRESIDENTS.forEach(p => out.push(`- ${p.join(" | ")}`));
  out.push(`## Supreme Court cases`); d.CASES.forEach(p => out.push(`- ${p.join(" | ")}`));
  out.push(`## Compromises`); d.COMPROMISES.forEach(p => out.push(`- ${p.join(" | ")}`));
  out.push(`## Political parties`); d.PARTIES.forEach(p => out.push(`- ${p.join(" | ")}`));
  out.push(`## People in the portrait gallery`); d.WHO.forEach(w => out.push(`- ${w[1]} (Unit ${w[3]}): ${w[2]}`));
  cached = out.join("\n");
  return cached;
}
module.exports = { courseText };
