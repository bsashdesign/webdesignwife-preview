(function () {
document.querySelectorAll('[role="tablist"]').forEach((listEl) => {
const tabs = [...listEl.querySelectorAll('[role="tab"]')];
const select = (tab) => tabs.forEach((t) => {
const on = t === tab;
t.setAttribute("aria-selected", String(on));
t.tabIndex = on ? 0 : -1;
const panel = document.getElementById(t.getAttribute("aria-controls"));
if (panel) panel.hidden = !on;
});
tabs.forEach((tab) => {
tab.addEventListener("click", () => select(tab));
tab.addEventListener("keydown", (e) => {
const fwd = e.key === "ArrowRight" || e.key === "ArrowDown";
if (!fwd && e.key !== "ArrowLeft" && e.key !== "ArrowUp") return;
e.preventDefault();
const next = tabs[(tabs.indexOf(tab) + (fwd ? 1 : tabs.length - 1)) % tabs.length];
select(next);
next.focus();
});
});
});
document.querySelectorAll("form.form, form.news__form").forEach((form) => {
const msg = form.querySelector(".form__msg");
form.addEventListener("submit", (e) => {
e.preventDefault();
let firstInvalid = null;
form.querySelectorAll("input, textarea").forEach((field) => {
const ok = field.checkValidity() && (!field.required || field.value.trim() !== "");
field.setAttribute("aria-invalid", ok ? "false" : "true");
if (!ok && !firstInvalid) firstInvalid = field;
});
if (firstInvalid) {
msg.textContent = form.dataset.error || "Fill in the highlighted fields and try again.";
firstInvalid.focus();
return;
}
msg.textContent = form.dataset.success;
form.reset();
});
});
})();
(function () {
const button = document.querySelector(".nav__menu");
const drawer = document.getElementById("drawer");
if (!button || !drawer) return;
const panel = drawer.querySelector(".drawer__panel");
drawer.querySelectorAll(".drawer__big").forEach((el, n) => el.style.setProperty("--n", n));
function open() {
drawer.classList.add("is-open");
drawer.setAttribute("aria-hidden", "false");
button.setAttribute("aria-expanded", "true");
document.documentElement.classList.add("drawer-open");
holdPageBehind(drawer);
setTimeout(() => drawer.querySelector(".drawer__close").focus(), 50);
}
function close(returnFocus = true) {
drawer.classList.remove("is-open");
drawer.setAttribute("aria-hidden", "true");
button.setAttribute("aria-expanded", "false");
document.documentElement.classList.remove("drawer-open");
releasePage();
if (returnFocus) button.focus();
}
button.addEventListener("click", () => (drawer.classList.contains("is-open") ? close() : open()));
drawer.addEventListener("click", (e) => {
if (e.target.closest("[data-close-drawer]")) close();
const link = e.target.closest("a");
if (link) {
close(false);
if (link.hasAttribute("data-open-finder-after")) {
setTimeout(() => { const f = document.querySelector("[data-open-finder]"); if (f) f.click(); }, 500);
}
}
});
document.addEventListener("keydown", (e) => {
if (!drawer.classList.contains("is-open")) return;
if (e.key === "Escape") close();
if (e.key === "Tab") {
const f = [...panel.querySelectorAll("a, button")];
if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
}
});
})();
(function () {
const dialog = document.getElementById("audit-dialog");
const card = document.querySelector("#audit .formcard") || (dialog && dialog.querySelector(".formcard"));
if (!dialog || !card) return;
const borrowed = !dialog.contains(card);
const home = card.parentElement, after = card.nextSibling;
const slot = dialog.querySelector("[data-audit-slot]");
document.addEventListener("click", (e) => {
const link = e.target.closest('a[href="#audit"]');
if (!link) return;
e.preventDefault();
document.querySelectorAll("dialog[open]").forEach((d) => { if (d !== dialog) d.close(); });
if (borrowed) slot.appendChild(card);
if (!dialog.open) openSheet(dialog);
const first = card.querySelector("form:not([hidden]) input");
if (first) first.focus({ preventScroll: true });
});
dialog.addEventListener("click", (e) => {
if (e.target.closest("[data-close-audit]") || e.target === dialog) dialog.close();
});
dialog.addEventListener("close", () => { if (borrowed) home.insertBefore(card, after); });
})();
(function () {
const nav = document.querySelector(".nav");
if (!nav) return;
if (document.querySelector(".hero #demo")) nav.classList.add("nav--autohide");
const mark = document.createElement("div");
mark.setAttribute("aria-hidden", "true");
mark.style.cssText = "position:absolute;top:24px;left:0;width:1px;height:1px;pointer-events:none";
document.body.prepend(mark);
new IntersectionObserver(([e]) => nav.classList.toggle("is-scrolled", !e.isIntersecting && e.boundingClientRect.top < 0)).observe(mark);
})();
(function () {
const nav = document.querySelector(".nav");
const links = document.getElementById("nav-links");
if (!nav || !links) return;
const inner = nav.querySelector(".nav__inner");
function fit() {
nav.classList.remove("nav--compact");
const wraps = [...links.children].some((a) => a.offsetTop !== links.firstElementChild.offsetTop) || links.scrollWidth > links.clientWidth + 1;
const overflow = inner.scrollWidth > inner.clientWidth + 1;
if (getComputedStyle(links).display !== "none" && (wraps || overflow)) nav.classList.add("nav--compact");
}
let width = 0;
new ResizeObserver(() => { if (document.documentElement.clientWidth !== width) { width = document.documentElement.clientWidth; fit(); } }).observe(document.documentElement);
if (document.fonts) document.fonts.ready.then(fit);
fit();
})();
function openSheet(d) {
document.querySelectorAll("dialog[open]").forEach((o) => { if (o !== d) o.close(); });
if (!d.open) { d.returnFocusTo = document.activeElement; d.show(); }
}
function holdPageBehind(layer) {
for (const el of document.body.children) {
if (el === layer || el.id === "mood" || el.classList.contains("sheet-scrim") || el.tagName === "SCRIPT") continue;
el.inert = true;
}
}
function releasePage() {
for (const el of document.body.children) el.inert = false;
}
(function () {
const dialogs = [...document.querySelectorAll("dialog")];
if (!dialogs.length) return;
const scrim = document.createElement("div");
scrim.className = "sheet-scrim";
document.body.appendChild(scrim);
const sync = () => {
const open = dialogs.filter((d) => d.open).pop();
document.documentElement.classList.toggle("has-sheet", !!open);
if (open) holdPageBehind(open);
else if (!document.getElementById("drawer")?.classList.contains("is-open")) releasePage();
};
dialogs.forEach((d) => d.addEventListener("close", () => {
const to = d.returnFocusTo;
d.returnFocusTo = null;
if (to && to.isConnected && document.body.contains(to) && to !== document.body) setTimeout(() => to.focus(), 0);
}));
const watch = new MutationObserver(sync);
dialogs.forEach((d) => watch.observe(d, { attributes: true, attributeFilter: ["open"] }));
scrim.addEventListener("click", () => dialogs.forEach((d) => d.open && d.close()));
document.addEventListener("keydown", (e) => {
if (e.key !== "Escape") return;
const open = dialogs.filter((d) => d.open).pop();
if (open) { e.preventDefault(); open.close(); }
});
})();
(function () {
const here = location.pathname.replace(/\/index\.html$/, "/");
const section = /\/blog\//.test(here) ? "blog" : (here.match(/\/(pricing|included|contact)\.html$/) || [])[1];
if (!section) return;
document.querySelectorAll(".nav__links a, .drawer__big").forEach((a) => {
const href = a.getAttribute("href") || "";
const match = section === "blog" ? /blog\/(index\.html)?$|^index\.html$/.test(href) && href.includes("index.html") && (href.startsWith("blog/") || !href.includes("/") && location.pathname.includes("/blog/"))
: href.replace(/^\.\.\//, "").split("#")[0] === section + ".html";
if (match) a.setAttribute("aria-current", "page");
});
})();
(function () {
const shows = (el) => {
for (let e = el; e; e = e.parentElement) {
const c = getComputedStyle(e);
if (c.backgroundImage !== "none") return "image:" + c.backgroundImage;
if (c.backgroundColor !== "rgba(0, 0, 0, 0)") return c.backgroundColor;
}
return "page";
};
const look = (el) => { const c = getComputedStyle(el); return [shows(el), c.backgroundImage, c.borderTopWidth].join("|"); };
const join = () => document.querySelectorAll("main > section").forEach((s) => {
const prev = s.previousElementSibling;
const full = prev && parseFloat(getComputedStyle(prev).paddingBottom) >= 40;
const same = full && prev.tagName === "SECTION" && getComputedStyle(s).borderTopWidth === "0px" && look(prev).split("|").slice(0, 2).join() === look(s).split("|").slice(0, 2).join();
s.classList.toggle("is-joined", !!same);
});
join();
addEventListener("load", join);
new MutationObserver(() => setTimeout(join, 450)).observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
})();
document.addEventListener("click", (e) => {
const a = e.target.closest('a[href^="#"]');
if (!a || e.defaultPrevented || a.getAttribute("href").length < 2) return;
const t = document.getElementById(decodeURIComponent(a.getAttribute("href").slice(1)));
if (!t) return;
e.preventDefault();
t.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
history.pushState(null, "", a.getAttribute("href"));
});
(function () {
const bar = document.querySelector(".mobilebar");
const heroCta = document.querySelector("[data-scene='top'] .btn--primary");
const close = document.querySelector("[data-endpanel]");
const packsCta = document.querySelector("[data-scene='packages'] .btn--primary");
if (!bar || !heroCta || !close) return;
const seen = new Map([[heroCta, true], [close, false]]);
if (packsCta) seen.set(packsCta, false);
const watch = new IntersectionObserver((entries) => {
entries.forEach((e) => { if (seen.has(e.target)) seen.set(e.target, e.isIntersecting); });
const off = seen.get(heroCta) || seen.get(close) || (packsCta && seen.get(packsCta));
bar.style.transform = off ? "translateY(120%)" : "";
bar.style.visibility = off ? "hidden" : "";
}, { rootMargin: "0px 0px -100px 0px" });
bar.style.visibility = "hidden";
seen.forEach((_, el) => watch.observe(el));
})();
(function () {
const box = document.querySelector("[data-chat-replies]");
const thread = document.querySelector("[data-chat-thread]");
if (!box || !thread) return;
const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const wait = (ms) => new Promise((r) => setTimeout(r, calm ? 0 : ms));
const TICK = '<i class="chat__tick"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></i>';
function bubble(who, text, extra = "", cls = "") {
const m = document.createElement("div");
m.className = `bubble bubble--${who} chat__m chat__m--${who}${cls} chat__m--new`;
const face = document.createElement("span");
face.className = "bubble__face";
face.innerHTML = extra;
const words = document.createElement("span");
words.className = "bubble__text";
words.textContent = text;
const tail = document.createElement("i");
tail.className = "bubble__tail";
face.append(words, tail);
m.append(face);
return m;
}
thread.setAttribute("aria-live", "polite");
box.addEventListener("click", async (ev) => {
const pill = ev.target.closest("[data-chat-ask]");
if (!pill || box.dataset.busy) return;
box.dataset.busy = "1";
pill.hidden = true;
const trim = () => { while (thread.querySelectorAll(".chat__m").length > 5) thread.querySelector(".chat__m, .chat__stamp, .chat__receipt").remove(); };
thread.querySelectorAll(".chat__stamp, .chat__receipt").forEach((x) => x.remove());
thread.append(bubble("owner", pill.dataset.chatAsk));
trim();
await wait(500);
const typing = bubble("ben", "", "", " chat__typing");
typing.querySelector(".bubble__text").remove();
typing.querySelector(".bubble__face").insertAdjacentHTML("afterbegin", "<i></i><i></i><i></i>");
typing.setAttribute("aria-hidden", "true");
thread.append(typing);
await wait(900);
typing.replaceWith(bubble("ben", pill.dataset.chatAnswer, TICK, " chat__m--done"));
trim();
delete box.dataset.busy;
if (!box.querySelector("[data-chat-ask]:not([hidden])")) box.hidden = true;
});
})();
(function () {
const el = document.querySelector("[data-swap]");
if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
const words = el.dataset.swap.split("|");
let i = 0;
setInterval(() => {
if (document.hidden) return;
el.classList.add("is-out");
setTimeout(() => {
i = (i + 1) % words.length;
el.textContent = words[i];
el.classList.remove("is-out");
}, 320);
}, 2800);
})();
(function () {
const K = 0.5522847498;
const f = (n) => Math.round(n * 10) / 10;
function rounded(x, y, w, h, r) {
r = Math.max(0, Math.min(r, w / 2, h / 2));
const k = K * r;
const x1 = x + w, y1 = y + h;
return [
`M${f(x + r)} ${f(y)}`,
`L${f(x1 - r)} ${f(y)}`, `C${f(x1 - r + k)} ${f(y)} ${f(x1)} ${f(y + r - k)} ${f(x1)} ${f(y + r)}`,
`L${f(x1)} ${f(y1 - r)}`, `C${f(x1)} ${f(y1 - r + k)} ${f(x1 - r + k)} ${f(y1)} ${f(x1 - r)} ${f(y1)}`,
`L${f(x + r)} ${f(y1)}`, `C${f(x + r - k)} ${f(y1)} ${f(x)} ${f(y1 - r + k)} ${f(x)} ${f(y1 - r)}`,
`L${f(x)} ${f(y + r)}`, `C${f(x)} ${f(y + r - k)} ${f(x + r - k)} ${f(y)} ${f(x + r)} ${f(y)}`,
"Z",
].join("");
}
const pill = (x, y, w, h) => rounded(x, y, w, h, h / 2);
const circle = (cx, cy, d) => rounded(cx - d / 2, cy - d / 2, d, d, d / 2);
function shield(x, y, w, h, r) {
r = Math.max(0, Math.min(r, w / 2, h / 2));
const k = K * r;
const x1 = x + w, cx = x + w / 2, py = y + h;
const sy = y + h * 0.58;
return [
`M${f(x + r)} ${f(y)}`,
`L${f(x1 - r)} ${f(y)}`, `C${f(x1 - r + k)} ${f(y)} ${f(x1)} ${f(y + r - k)} ${f(x1)} ${f(y + r)}`,
`L${f(x1)} ${f(sy)}`, `C${f(x1)} ${f(sy + (py - sy) * 0.62)} ${f(cx + w * 0.3)} ${f(py - h * 0.06)} ${f(cx)} ${f(py)}`,
`L${f(cx)} ${f(py)}`, `C${f(cx - w * 0.3)} ${f(py - h * 0.06)} ${f(x)} ${f(sy + (py - sy) * 0.62)} ${f(x)} ${f(sy)}`,
`L${f(x)} ${f(y + r)}`, `C${f(x)} ${f(y + r - k)} ${f(x + r - k)} ${f(y)} ${f(x + r)} ${f(y)}`,
"Z",
].join("");
}
const STATES = {
row: { r: 24 }, photo: { r: 18 }, badge: { shape: "shield", r: 24 }, face: { shape: "circle" },
bubble: { r: 22 }, dial: { shape: "circle" }, call: { shape: "pill" }, page: { r: 14 }, ring: { shape: "circle" },
cards: { r: 18 }, card: { r: 18 }, tile: { r: 18 }, pill: { shape: "pill" },
};
function state(name, x, y, w, h) {
const s = STATES[name];
if (!s) throw new Error("no such state: " + name);
if (s.shape === "circle") { const d = Math.min(w, h); return circle(x + w / 2, y + h / 2, d); }
if (s.shape === "pill") return pill(x, y, w, h);
if (s.shape === "shield") return shield(x, y, w, h, s.r);
return rounded(x, y, w, h, s.r);
}
const points = (d) => (d.match(/[LC]/g) || []).length;
window.WDW_SHAPES = { rounded, pill, circle, shield, state, points, states: Object.keys(STATES) };
})();
(function () {
window.WDW_TECH = window.WDW_TECH || {};
window.WDW_TECH.arrival = {
load(section, E) {
const { g, split, K } = E;
const tl = g.timeline({ defaults: { ease: "out", duration: K.t4 } });
const lines = (el) => { if (!el) return []; const sp = split(el); return sp.lines; };
const h1 = section.querySelector("h1"), sentence = section.querySelector(".scene__sentence");
tl.from(lines(h1), { yPercent: K.riseMask, stagger: K.tStagger }, 0);
tl.from(lines(sentence), { yPercent: K.riseMask, stagger: K.tStagger }, .12);
const blocks = [...section.querySelectorAll(".hero__actions > *, .pitch__act, .pitch__row, .pitch__small, .pitch__more, .pitch__bigs > li")].filter((el) => !el.hidden);
blocks.forEach((el, i) => {
const kids = [...el.children], text = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
if (!kids.length || text) { tl.from(lines(el), { yPercent: K.riseMask, stagger: K.tStagger }, .24 + i * K.tStagger); return; }
g.set(el, { clipPath: "inset(-2px -12px -12px -12px)" }); tl.from(kids, { yPercent: 115 }, .24 + i * K.tStagger);
});
const slot = section.querySelector("[data-stage]");
if (slot) {
const pieces = [...slot.querySelectorAll(":scope > [data-part], :scope > * > [data-part]")].filter((el) => getComputedStyle(el).display !== "none");
const bubbles = pieces.filter((el) => el.matches(".bubble")), rest = pieces.filter((el) => !el.matches(".bubble"));
rest.forEach((el, i) => {
const t = .2 + i * .09;
tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: .01, ease: "none" }, t);
tl.from(el, { y: 32 }, t);
const tick = el.querySelector(".notice__tick path");
if (tick) tl.fromTo(tick, { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", duration: K.t3 }, t + .25);
});
bubbles.forEach((el, i) => {
const t = (rest.length ? .9 : .5) + i * .12;
tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: .01, ease: "none" }, t);
if (rest.length) tl.from(el, { y: -24 }, t); else tl.from(el, { scale: .6, y: 16, duration: K.t3, transformOrigin: "0% 100%" }, t);
tl.fromTo(el, { scale: 1 }, { scale: 1.04, duration: .12, yoyo: true, repeat: 1, ease: "spring" }, t + .5);
});
}
return tl;
},
};
})();
(function () {
window.WDW_TECH = window.WDW_TECH || {};
window.WDW_TECH.fallback = {
build(s, c) {
if (!s.pic) return;
const focus = s.focus;
const parts = [...s.slot.querySelectorAll("[data-part]")].filter((el) => !focus.includes(el) && !focus.some((f) => f.contains(el)) && !el.querySelector("[data-part]"));
const beats = [...s.el.querySelectorAll(".cap, .ingr, .deck__card")];
parts.forEach((el, i) => {
const t = beats.length ? c.at(beats[Math.min(i, beats.length - 1)], (i >= beats.length ? (i - beats.length + 1) * c.K.stagger * 2 : 0)) : c.at(el);
if (el.matches(".notice")) c.tick(el, t);
else if (el.matches(".bubble, .chip, .tag, .reaction")) c.pop(el, t);
else c.land(el, t);
});
s.el.querySelectorAll(".ingr").forEach((li) => c.block(li, c.when(li, .88)));
},
};
})();
(function () {
window.WDW_TECH = window.WDW_TECH || {};
window.WDW_TECH.deck = {
build(s, c) {
const { K } = c, q = (sel) => s.slot.querySelector(sel);
const ask = q('[data-part="ask"]'), title = s.el.querySelector("h2, h3");
if (ask) c.pop(ask, Math.max(c.lo, title ? c.at(title) : c.cutLen), "spring");
[...s.el.querySelectorAll(".deck__card")].forEach((card) => {
const n = q(`.notice[data-part="${card.dataset.part}"]`);
if (n && !s.focus.includes(n)) c.tick(n, c.at(card));
});
},
};
})();
(function () {
window.WDW_TECH = window.WDW_TECH || {};
const SENDS = { logo: ["logo", "call"], photo: ["raw"], headline: ["words", "headline", "rows"], reflow: ["reflow"] };
window.WDW_TECH.assemble = {
build(s, c) {
const { tl, K } = c, q = (sel) => s.slot.querySelector(sel), qa = (sel) => [...s.slot.querySelectorAll(sel)];
const msg = q('[data-part="message"]');
if (msg) c.pop(msg, c.cutLen + K.stagger, "spring");
const items = [...s.el.querySelectorAll(".ingr")];
items.forEach((li) => {
const t = c.at(li);
c.block(li, c.when(li, .88));
const n = li.querySelector(".ingr__n");
if (n) tl.from(n, { scale: .8, duration: K.pop, ease: "spring" }, t);
(SENDS[li.dataset.part] || [li.dataset.part]).forEach((name, k) => {
qa(`[data-part="${name}"]`).filter((el) => !s.focus.includes(el)).forEach((el) => {
const at = t + k * K.stagger * 2;
if (name === "raw") { c.show(el, at); tl.from(el, { rotation: 3, y: 24, duration: K.beat, ease: "out" }, at); }
else if (el.matches(".bubble, .chip")) c.pop(el, at, "spring");
else if (el.matches(".brandline")) { c.show(el, at); c.rise(el, at); }
else if (el.matches(".ruled")) { c.show(el, at); [...el.children].forEach((row, j) => c.slide(row, at + j * K.stagger)); }
else if (el.matches(".callpill")) c.slide(el, at);
else c.land(el, at);
});
});
});
},
};
})();
(function () {
window.WDW_TECH = window.WDW_TECH || {};
window.WDW_TECH.thread = {
build(s, c) {
const { K } = c;
const focus = s.focus;
const parts = [...s.slot.querySelectorAll("[data-part], .thread__receipt")].filter((el) => !focus.includes(el) && !focus.some((f) => f.contains(el)) && !el.matches('[data-part="messages"]') && !el.querySelector(".bubble, .brows, .chips"));
const groups = []; let pending = [];
parts.forEach((el) => {
if (el.matches(".thread__day")) { pending.push(el); return; }
if (el.matches(".bubble, .thread__sent, .reaction")) { groups.push([...pending, el]); pending = []; return; }
if (groups.length) groups[groups.length - 1].push(el); else pending.push(el);
});
const caps = [...s.el.querySelectorAll(".cap")];
const beats = [];
caps.forEach((cap) => { const n = +cap.dataset.beats || 1; const base = c.at(cap); for (let k = 0; k < n; k++) beats.push(base + (k - (n - 1) / 2) * (K.beat + K.hold) * .6); });
groups.forEach((g, i) => {
const t = beats.length ? beats[Math.min(i, beats.length - 1)] + (i >= beats.length ? (i - beats.length + 1) * K.beat : 0) : c.cutLen + i * (K.beat + K.hold);
g.forEach((el, j) => {
if (el.matches(".bubble")) c.pop(el, t, "spring");
else if (el.matches(".thread__sent")) { c.show(el, t); [...el.querySelectorAll(".brow, .chip")].forEach((row, k) => c.slide(row, t + k * K.stagger)); const line = el.querySelector(".thread__gline"); if (line) c.rise(line, t); }
else if (el.matches(".reaction, .tag")) c.pop(el, t + j * K.stagger, "spring");
else c.show(el, t + j * K.stagger);
});
});
},
};
})();
(function () {
window.WDW_TECH = window.WDW_TECH || {};
window.WDW_TECH.instrument = {
build(s, c) {
const { tl, K } = c, q = (sel) => s.slot.querySelector(sel), qa = (sel) => [...s.slot.querySelectorAll(sel)];
const arc = q(".dial__arc circle, .dial__arc path"), leaf = q('[data-part="leaf"]'), monitor = q('[data-part="monitor"]');
const rows = qa('[data-part="rows"]'), bars = qa('[data-part="bars"] > i'), note = q('[data-part="note"]');
const sentence = s.el.querySelector(".scene__sentence");
const t0 = Math.max(c.lo, sentence ? c.at(sentence) + K.hold : c.cutLen + K.hold);
const months = 3, M = Math.min(K.month, Math.max(K.beat, (c.D - t0 - K.beat) / months));
c.show(leaf, c.cutLen); c.show(monitor, c.cutLen);
if (arc) tl.fromTo(arc, { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", duration: months * M, ease: "none" }, t0);
const perRow = Math.ceil(rows.length / months), perBar = Math.ceil(bars.length / months);
for (let m = 0; m < months; m++) {
const t = t0 + m * M;
if (leaf) tl.fromTo(leaf, { y: -8 }, { y: 0, duration: K.pop, ease: "out" }, t);
rows.slice(m * perRow, (m + 1) * perRow).forEach((row, i) => c.tick(row, t + K.pop + i * K.stagger * 2));
bars.slice(m * perBar, (m + 1) * perBar).forEach((bar, i) => tl.from(bar, { scaleY: 0, transformOrigin: "50% 100%", duration: K.pop, ease: "out" }, t + K.pop + i * K.stagger));
if (m === 0 && note) c.rise(note, t + K.beat);
}
},
};
})();
(function () {
window.WDW_TECH = window.WDW_TECH || {};
window.WDW_TECH.taps = {
build(s, c) {
const { tl, K } = c, q = (sel) => s.slot.querySelector(sel), qa = (sel) => [...s.slot.querySelectorAll(sel)];
const cap = (name) => s.el.querySelector(`.cap[data-tap="${name}"]`);
const h2 = s.el.querySelector("h2"), sentence = s.el.querySelector(".scene__sentence");
const search = q('[data-part="search"]'), card = q('[data-part="card"]'), call = q('[data-part="call"]'), rings = qa('[data-part="rings"] > b');
const finger = q('[data-part="finger"]'), calling = q('[data-part="calling"]'), hours = q('[data-part="hours"]'), dirs = q('[data-part="directions"]');
const map = q('[data-part="map"]'), pin = map && map.querySelector(".mapcard__pin"), reviews = q('[data-part="reviews"]');
const b1 = Math.max(c.lo, c.cutLen), b2 = sentence ? c.at(sentence) : b1 + K.beat + K.hold;
c.land(search, b1); c.land(card, b1 + K.stagger * 2);
if (card) [...card.children].forEach((el, i) => { if (el !== call) c.pop(el, b1 + K.stagger * 2 + i * K.stagger); });
if (finger) { c.pop(finger, b2); }
const t3 = cap("call") ? c.at(cap("call")) : b2 + K.beat + K.hold;
if (call) tl.to(call, { scale: .96, duration: K.pop / 2, yoyo: true, repeat: 1, ease: "out" }, t3);
rings.forEach((r, i) => tl.fromTo(r, { scale: .6, opacity: 1 }, { scale: 1.6, opacity: 0, duration: K.beat, ease: "out" }, t3 + i * K.stagger * 2));
c.rise(calling, t3 + K.pop);
const t4 = cap("hours") ? c.at(cap("hours")) : t3 + K.beat + K.hold;
c.slide(hours, t4); c.slide(dirs, t4 + K.stagger * 2); c.pop(map, t4 + K.pop);
if (pin) tl.from(pin, { y: -24, duration: K.pop, ease: "spring" }, t4 + K.pop * 1.5);
const t6 = cap("reviews") ? c.at(cap("reviews")) : t4 + 2 * (K.beat + K.hold);
c.land(reviews, t6);
if (reviews) [...reviews.querySelectorAll(".star")].forEach((st, i) => tl.from(st, { scale: .6, duration: K.pop, ease: "spring" }, t6 + K.pop / 2 + i * K.stagger));
},
};
})();
(function () {
window.WDW_TECH = window.WDW_TECH || {};
window.WDW_TECH.collage = {
build(s, c) {
const { tl, K, doc } = c, q = (sel) => s.slot.querySelector(sel), qa = (sel) => [...s.slot.querySelectorAll(sel)];
const front = q('[data-part="front"]'), img = front && front.querySelector("img"), backs = qa('[data-part="back"]');
const tag = q('[data-part="tag"]'), chips = qa('[data-part="chips"]');
const caps = [...s.el.querySelectorAll(".cap")], sentence = s.el.querySelector(".scene__sentence");
const b1 = Math.max(c.lo, c.cutLen);
if (img) tl.fromTo(img, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: K.beat, ease: "out" }, b1);
const b2 = sentence ? c.at(sentence) : b1 + K.beat + K.hold;
if (front) backs.forEach((bk, i) => { const f = doc(front), b = doc(bk); c.show(bk, b2 + i * K.stagger * 2); tl.from(bk, { x: f.left - b.left, y: f.top - b.top, duration: K.beat, ease: "move" }, b2 + i * K.stagger * 2); });
c.pop(tag, caps[0] ? c.at(caps[0]) : b2 + K.beat + K.hold, "spring");
const b4 = caps[1] ? c.at(caps[1]) : b2 + 2 * (K.beat + K.hold);
chips.forEach((ch, i) => c.land(ch, b4 + i * .06 * K.vh));
},
};
})();
(function () {
window.WDW_TECH = window.WDW_TECH || {};
window.WDW_TECH.portrait = {
build(s, c) {
const { tl, K } = c, qa = (sel) => [...s.slot.querySelectorAll(sel)];
const places = qa('[data-part="boroughs"] > li'), pin = s.slot.querySelector('[data-part="pin"]');
const caps = [...s.el.querySelectorAll(".cap")], beatCap = s.el.querySelector(".cap[data-beats]") || caps[caps.length - 1];
const b1 = caps[0] ? c.at(caps[0]) : Math.max(c.lo, c.cutLen) + K.beat;
places.forEach((li, i) => {
const t = b1 + i * K.stagger * 2, path = li.querySelector("svg path"), name = li.querySelector("span");
c.show(li, t); c.draw(path, t, K.pop);
if (name) tl.from(name, { y: 8, duration: K.pop, ease: "out" }, t + K.pop / 2);
});
if (pin) { const t = beatCap ? c.at(beatCap) : b1 + K.beat + K.hold; c.show(pin, t); tl.from(pin, { y: -24, scale: .6, duration: K.pop, ease: "spring" }, t); }
},
};
})();
(function () {
window.WDW_TECH = window.WDW_TECH || {};
window.WDW_TECH.stack = {
build(s, c) {
const { tl, K } = c, tiles = [...s.slot.querySelectorAll('[data-part="tile"]')], sentence = s.el.querySelector(".scene__sentence");
const t0 = Math.max(c.lo, sentence ? c.at(sentence) + K.hold : c.cutLen + K.hold), step = Math.min(.2 * K.vh, Math.max(K.pop, (c.D - t0 - K.beat) / tiles.length));
tiles.forEach((tile, i) => {
const t = t0 + i * step, n = tile.querySelector(".tile__n");
if (i > 0) c.land(tile, t);
if (n) tl.from(n, { scale: .8, duration: K.pop, ease: "spring" }, t + K.pop);
});
},
};
})();
(function () {
window.WDW_TECH = window.WDW_TECH || {};
window.WDW_TECH.close = {
build(s, c) {
const { tl, K } = c, btn = s.focus[0];
if (btn) tl.from(btn, { scale: .96, duration: .08 * K.vh, ease: "spring" }, c.cutLen);
},
};
})();
(function () {
window.WDW_TECH = window.WDW_TECH || {};
window.WDW_TECH.plain = { build() {} };
})();
(function () {
const FOCUS = {
arrival: ['[data-part="hello"]', '[data-part="bubble"]', '[data-part="hours"]', "[data-part]"], assemble: ['[data-part="result"]', '[data-part="photo"]'], deck: [".notice", '[data-part="photo"]'],
thread: [".thread__msg"], instrument: ['[data-part="dial"]'], taps: ['[data-part="call"]'], collage: ['[data-part="front"]'],
portrait: ['[data-part="portrait"]'], fan: ['[data-part="card"]'], stack: ['[data-part="tile"]'], close: [".btn--primary"], plain: [],
};
const FOCUS_OUT = { thread: [".thread__msg"], deck: [".notice"] };
const ALL = { fan: true };
const WORDS = ".scene__head, .scene__body, .scene__words--top, .scene__words--centre, .scene__words--plain, .scene__shared, .scene__cta, .scene__more, .hero__title, .hero__sentence, .hero__actions, .pitch__words";
const RISE = ".scene__h2, .scene__sub, .scene__sentence, .scene__caption, .scene__small, .scene__offer, .scene__shared, .cap > h3, .cap > p, .cap--line, .close__title, .plain__title";
const BLOCKS = ".scene__cta, .scene__link, .scene__more";
function build(E, sections) {
const { g, S, T, K, wide, stage, doc } = E;
const L = E.beatLine, nav = E.nav;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const scenes = sections.map((el, i) => {
const tech = el.dataset.technique;
const slot = el.querySelector(".scene__slot, .scene__row");
const pic = slot && slot.firstElementChild;
const first = el.querySelector("h1, h2, h3");
const focusSel = FOCUS[tech] || ["[data-part]"];
const pick = (sels, last) => { for (const s of sels) { const found = slot ? [...slot.querySelectorAll(s)] : [...el.querySelectorAll(s)]; if (found.length) return ALL[tech] ? found : [found[last ? found.length - 1 : 0]]; } return []; };
const focus = pick(focusSel, false), focusOut = FOCUS_OUT[tech] ? pick(FOCUS_OUT[tech], true) : focus;
const words = [...el.querySelectorAll(WORDS)].filter((w) => getComputedStyle(w).display !== "contents");
return { i, el, id: el.dataset.scene, tech, surface: el.dataset.surface, state: el.dataset.state, slot, pic, first, focus, focusOut, words,
sec: doc(el), slotBox: slot ? doc(slot) : null, picBox: pic ? doc(pic) : null, firstBox: first ? doc(first) : doc(el) };
});
scenes.forEach((s) => {
s.sticky = false;
if (!wide || !s.slot || !s.pic || !s.slot.matches(".scene__grid > .scene__slot")) return;
const h = s.picBox.h, top = clamp(E.line - h / 2, nav + 16, Math.max(nav + 16, E.vh - h - 16));
g.set(s.pic, { "--stick": top + "px" });
s.sticky = true; s.stickTop = top;
});
const picTopAt = (s, y) => {
const flow = s.slotBox.top - y;
if (!s.sticky) return flow;
return flow + clamp(s.stickTop - flow, 0, Math.max(0, s.slotBox.h - s.picBox.h));
};
const boxAt = (s, el, y) => {
const b = doc(el);
if (s.slot && s.pic && (el === s.pic || s.pic.contains(el))) { const t = picTopAt(s, y); return { x: b.left - scrollX, y: t + (b.top - s.picBox.top), w: b.w, h: b.h }; }
return { x: b.left - scrollX, y: b.top - y, w: b.w, h: b.h };
};
scenes.forEach((s, i) => {
if (i === 0) { s.cut = 0; s.start = 0; return; }
s.cut = s.state === "none" || !s.focus.length ? 0 : (K.cuts[i - 1] || 0);
const arrive = s.state === "none" ? s.firstBox.top - E.vh * .88 : s.firstBox.top - L;
s.arrive = arrive;
s.start = Math.max(arrive - s.cut, scenes[i - 1].start + 1);
});
const pageEnd = document.documentElement.scrollHeight - E.vh;
scenes.forEach((s, i) => { s.end = i + 1 < scenes.length ? scenes[i + 1].start : pageEnd + 1; s.D = Math.max(1, s.end - s.start); });
function cut(prev, s, c) {
const { tl } = c, Lc = s.cut; if (!Lc) return;
const a = prev.focusOut.map((el) => boxAt(prev, el, s.start)), b = s.focus.map((el) => boxAt(s, el, s.start + Lc));
const n = Math.max(a.length, b.length);
for (let i = 0; i < Math.min(3, n); i++) {
const p = stage.paths[i], A = a[Math.min(i, a.length - 1)], B = b[Math.min(i, b.length - 1)];
const dA = S.state(prev.state === "none" ? "card" : prev.state, A.x, A.y, A.w, A.h), dB = S.state(s.state, B.x, B.y, B.w, B.h);
const shadow = /row|photo|call|page|cards|card|tile|pill/.test(s.state) ? 5 : 0;
tl.set(p.def, { attr: { d: dA } }, 0);
tl.set(p.shadow, { x: shadow, y: shadow }, 0);
if (i === 0) tl.set(stage.svg, { attr: { class: "stage" + (stage.surface.dataset.surface === "ink" || prev.surface === "ink" ? " stage--ink" : "") + (prev.state === "bubble" && s.state === "bubble" ? " stage--bubble" : "") } }, 0);
tl.fromTo(p.g, { autoAlpha: 0 }, { autoAlpha: 1, duration: E.EPS, ease: "none" }, 0);
tl.to(p.def, { morphSVG: { shape: dB, shapeIndex: 0 }, duration: Lc * .6, ease: "move" }, Lc * .2);
tl.to(p.g, { autoAlpha: 0, duration: E.EPS, ease: "none" }, Lc - E.EPS);
}
if (prev.tech !== "fan") {
prev.focusOut.forEach((el) => tl.to(el, { autoAlpha: 0, duration: E.EPS, ease: "none" }, 0));
if (prev.pic) {
const others = [...prev.pic.querySelectorAll("[data-part]")].filter((el) => !prev.focusOut.includes(el) && !prev.focusOut.some((f) => f.contains(el) || el.contains(f)));
if (others.length) { tl.set(prev.pic, { clipPath: "inset(-24px)" }, 0); tl.to(others, { y: -prev.picBox.h, duration: Lc * .35, ease: "move" }, 0); }
}
}
s.focus.forEach((el) => tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: E.EPS, ease: "none" }, Lc - E.EPS));
if (s.surface !== prev.surface) {
const B = b[0], cx = B.x + B.w / 2, cy = B.y + B.h / 2;
const far = Math.max(Math.hypot(cx, cy), Math.hypot(E.vw - cx, cy), Math.hypot(cx, E.vh - cy), Math.hypot(E.vw - cx, E.vh - cy));
const D = far * 2 + 4, ink = s.surface === "ink" || prev.surface === "ink";
tl.set(stage.bloom, { attr: { "data-c": s.surface }, x: cx - D / 2, y: cy - D / 2, width: D, height: D, scale: 0 }, 0);
tl.to(stage.bloom, { scale: 1, duration: Lc * (ink ? .4 : .6), ease: "move" }, Lc * (ink ? .6 : .4));
tl.set(stage.surface, { attr: { "data-surface": s.surface } }, Lc);
tl.set(document.documentElement, { attr: { "data-screen": s.surface } }, Lc);
tl.set(stage.bloom, { scale: 0 }, Lc);
tl.set(stage.svg, { attr: { class: "stage" + (s.surface === "ink" ? " stage--ink" : "") } }, Lc * .9);
if (ink && prev.words.length) tl.to(prev.words, { opacity: 0, duration: Lc * .2, ease: "none" }, Lc * .5);
}
}
scenes.forEach((s, i) => {
if (i === 0) return;
const prev = scenes[i - 1];
const tl = g.timeline({ defaults: { ease: "out" }, scrollTrigger: { trigger: s.el, start: s.start, end: s.end, scrub: E.scrub, id: s.id } });
const ink = s.surface === "ink" || prev.surface === "ink";
const lo = ink ? s.cut : 0;
const c = {
...E, tl, scene: s, prev, start: s.start, D: s.D, cutLen: s.cut, lo,
at: (el, off = 0) => clamp(doc(el).cy - L - s.start + off, lo, s.D - K.beat),
when: (el, frac) => clamp(doc(el).top - E.vh * frac - s.start, lo, s.D - K.line),
show: (el, t) => el && tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: E.EPS, ease: "none" }, t),
hide: (el, t) => el && tl.to(el, { autoAlpha: 0, duration: E.EPS, ease: "none" }, t),
rise: (el, t) => { if (!el) return; const sp = E.split(el); if (sp.lines.length) tl.from(sp.lines, { yPercent: K.riseMask, duration: K.line, ease: "out", stagger: K.stagger }, t); },
block: (el, t) => {
if (!el) return;
const kids = [...el.children], text = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
if (!kids.length || text) { c.rise(el, t); return; }
g.set(el, { clipPath: "inset(-2px -12px -12px -12px)" }); tl.from(kids, { yPercent: 115, duration: K.line, ease: "out" }, t);
},
pop: (el, t, ease = "out") => { if (!el) return; c.show(el, t); tl.from(el, { scale: .6, y: 16, duration: K.pop, ease }, t); },
land: (el, t) => { if (!el) return; c.show(el, t); tl.from(el, { y: 32, duration: K.beat, ease: "out" }, t); },
slide: (el, t) => { if (!el) return; c.show(el, t); tl.from(el, { x: -24, duration: K.slide, ease: "out" }, t); },
draw: (el, t, dur = K.pop) => { if (!el) return; tl.fromTo(el, { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", duration: dur, ease: "out" }, t); },
tick: (notice, t) => { if (!notice) return; c.land(notice, t); c.draw(notice.querySelector(".notice__tick path"), t + K.beat * .4); },
};
if (s.cut && prev.focusOut.length && s.focus.length) {
if (T[s.tech] && T[s.tech].cutIn) T[s.tech].cutIn(prev, s, c, cut); else cut(prev, s, c);
} else if (s.state === "none") {
tl.set(stage.surface, { attr: { "data-surface": s.surface } }, 0);
tl.set(document.documentElement, { attr: { "data-screen": s.surface } }, 0);
tl.set(stage.svg, { attr: { class: "stage" } }, 0);
}
s.el.querySelectorAll(RISE).forEach((el) => { if (!el.closest("[data-stage], .deck__card, .ingr, .tile, .hplan")) c.rise(el, c.when(el, .88)); });
s.el.querySelectorAll(BLOCKS).forEach((el) => c.block(el, c.when(el, .88)));
const tech = T[s.tech] || T.fallback;
if (tech && tech.build) tech.build(s, c);
tl.set({}, {}, s.D);
s.fit = tl.duration() / s.D;
if (s.fit > 1.001) tl.timeScale(s.fit);
s.tl = tl;
});
window.WDW_STORY = {
scenes: scenes.map((s) => s.i === 0 ? { id: s.id, technique: s.tech, state: s.state, surface: s.surface, start: 0, cutEnd: 0, end: Math.round(s.end), sticky: false, fit: 1 } : ({ id: s.id, technique: s.tech, state: s.state, surface: s.surface, start: Math.round(s.start), cutEnd: Math.round(s.start + s.cut), end: Math.round(s.end), sticky: !!s.sticky, fit: +s.fit.toFixed(2) })),
line: L, wide,
current() {
const y = scrollY;
let cur = scenes[0];
for (const s of scenes) if (y >= s.start) cur = s;
const inCut = cur.cut && y < cur.start + cur.cut;
return { id: cur.id, phase: inCut ? "cut" : "scene", progress: inCut ? (y - cur.start) / cur.cut : (y - cur.start - cur.cut) / Math.max(1, cur.D - cur.cut) };
},
};
}
window.WDW_SCENES = { build };
})();
(function () {
const g = window.gsap;
const log = (m) => console.info("WDW engine: " + m);
if (!g) { log("GSAP not loaded (no motion on this page)"); return; }
const want = ["CustomEase", "ScrollTrigger", "Flip", "MorphSVGPlugin", "SplitText", "DrawSVGPlugin"];
const have = want.filter((n) => window[n]);
g.registerPlugin(...have.map((n) => window[n]));
const S = window.WDW_SHAPES, T = window.WDW_TECH || {}, SC = window.WDW_SCENES;
const sections = [...document.querySelectorAll("section[data-scene]")];
if (!S || !SC || !sections.length) { log(`GSAP ${g.version} loaded with ${have.join(", ")}; nothing to build here`); return; }
if (have.length < want.length) { log(`missing ${want.filter((n) => !window[n]).join(", ")}: the still page`); return; }
const root = document.documentElement;
if (window.frameElement && window.frameElement.hasAttribute("data-frame")) { root.classList.add("story-still"); log("storyboard frame: the still page"); return; }
const query = new URLSearchParams(location.search);
const SCRUB = query.has("scrub");
const cs = getComputedStyle(root);
const tok = (n) => cs.getPropertyValue(n).trim();
const bez = (n, fb) => { const m = tok(n).match(/[\d.]+/g); return m && m.length === 4 ? m.join(",") : fb; };
CustomEase.create("out", bez("--ease-out", "0.22,1,0.36,1"));
CustomEase.create("move", bez("--ease-move", "0.65,0,0.35,1"));
CustomEase.create("spring", bez("--spring", "0.34,1.45,0.64,1"));
const sec = (n, fb) => { const m = /([\d.]+)\s*(ms|s)?/.exec(tok(n)); return m ? (m[2] === "s" ? +m[1] : +m[1] / 1000) : fb; };
const pct = (n, fb) => { const m = /([\d.]+)/.exec(tok(n)); return m ? +m[1] / 100 : fb; };
function tokens() {
const vh = innerHeight;
const len = (n, fb) => { const m = /(-?[\d.]+)\s*(vh|svh|px|%)?/.exec(tok(n)); if (!m) return fb * vh; return m[2] === "px" ? +m[1] : +m[1] / 100 * vh; };
const cuts = []; for (let i = 1; i <= 11; i++) cuts.push(len(`--s-cut-${i}`, 0));
return { vh, line: len("--s-line", .11), stagger: len("--s-stagger", .02), beat: len("--s-beat", .15), hold: len("--s-hold", .10), cuts,
pop: .12 * vh, slide: .08 * vh, month: .30 * vh, riseMask: pct("--rise-mask", 1.05) * 100, readingLine: pct("--reading-line", .5),
beatLineNarrow: pct("--beat-line-narrow", .72), scrub: SCRUB ? true : sec("--scrub", .4), t4: sec("--t-4", .7), t3: sec("--t-3", .42), tStagger: sec("--t-stagger", .07) };
}
const surface = document.querySelector(".surface[data-paint]");
const ns = "http://www.w3.org/2000/svg";
function makeStage() {
const svg = document.createElementNS(ns, "svg");
svg.setAttribute("class", "stage"); svg.setAttribute("aria-hidden", "true"); svg.setAttribute("focusable", "false");
const defs = document.createElementNS(ns, "defs"); svg.appendChild(defs);
const paths = [];
for (let i = 0; i < 3; i++) {
const p = document.createElementNS(ns, "path"); p.setAttribute("id", "wdw-o" + i); p.setAttribute("d", "M0 0Z"); defs.appendChild(p);
const grp = document.createElementNS(ns, "g"); grp.setAttribute("class", "stage__o"); grp.style.visibility = "hidden"; grp.style.opacity = "0";
const sh = document.createElementNS(ns, "use"); sh.setAttribute("href", "#wdw-o" + i); sh.setAttribute("class", "stage__shadow");
const face = document.createElementNS(ns, "use"); face.setAttribute("href", "#wdw-o" + i); face.setAttribute("class", "stage__face");
grp.appendChild(sh); grp.appendChild(face); svg.appendChild(grp);
paths.push({ def: p, g: grp, shadow: sh });
}
const bloom = document.createElement("div"); bloom.className = "bloom"; bloom.setAttribute("aria-hidden", "true");
(surface || document.body).after(bloom); bloom.after(svg);
return { svg, paths, bloom, surface };
}
const doc = (el) => { const r = el.getBoundingClientRect(); return { top: r.top + scrollY, left: r.left + scrollX, w: r.width, h: r.height, bottom: r.bottom + scrollY, cx: r.left + scrollX + r.width / 2, cy: r.top + scrollY + r.height / 2 }; };
function navHeight() { const n = document.querySelector(".nav"); if (!n) return 0; const p = getComputedStyle(n).position; return p === "sticky" || p === "fixed" ? n.getBoundingClientRect().height : 0; }
const EPS = 1;
function split(el) {
if (el.__split) return el.__split;
const sp = SplitText.create(el, { type: "lines", mask: "lines", linesClass: "sl" });
el.__split = sp;
return sp;
}
let live = null, K = null, stage = null, built = false;
function build() {
if (live) { live.revert(); live = null; }
const wide = innerWidth > 960;
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
if (reduce) { root.classList.remove("story-live"); root.classList.add("story-still"); log("reduced motion: the still page"); return; }
K = tokens();
live = g.context(() => {
root.classList.add("story-live");
root.setAttribute("data-screen", surface ? surface.dataset.surface : "paper");
stage = makeStage();
const nav = navHeight();
const E = {
g, S, T, K, wide, stage, nav, vh: innerHeight, vw: innerWidth, EPS, doc, split, surface, scrub: K.scrub,
line: nav + (innerHeight - nav) * K.readingLine,
beatLine: wide ? nav + (innerHeight - nav) * K.readingLine : innerHeight * K.beatLineNarrow,
col: (n) => tok(n),
};
SC.build(E, sections);
built = true;
return () => { stage.svg.remove(); stage.bloom.remove(); root.classList.remove("story-live"); root.removeAttribute("data-screen"); sections.forEach((s) => { s.__split = null; s.querySelectorAll("*").forEach((el) => { if (el.__split) el.__split = null; }); }); };
});
}
function hero() {
const first = sections[0];
if (!first || !T.arrival || !T.arrival.load) return;
if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
T.arrival.load(first, { g, split, doc, K: tokens(), EPS });
}
function scrubber() {
const bar = document.createElement("div"); bar.className = "scrubber";
const input = document.createElement("input"); input.type = "range"; input.min = "0"; input.step = "1"; input.setAttribute("aria-label", "Scrub the story");
const out = document.createElement("output"); bar.appendChild(input); bar.appendChild(out); document.body.appendChild(bar);
const max = () => document.documentElement.scrollHeight - innerHeight;
input.max = String(max());
input.addEventListener("input", () => scrollTo(0, +input.value));
g.ticker.add(() => {
input.max = String(max());
if (document.activeElement !== input) input.value = String(Math.round(scrollY));
const st = window.WDW_STORY, c = st && st.current();
out.textContent = c ? `${Math.round(scrollY)}px · ${c.id} ${c.phase} ${Math.round(c.progress * 100)}%` : `${Math.round(scrollY)}px`;
});
}
root.classList.add("story-live");
hero();
build();
let lastW = innerWidth, timer = 0;
addEventListener("resize", () => { if (innerWidth === lastW) return; lastW = innerWidth; clearTimeout(timer); timer = setTimeout(build, 250); });
matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", build);
Promise.all([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise((r) => (document.readyState === "complete" ? r() : addEventListener("load", r, { once: true })))])
.then(() => { if (built) { build(); ScrollTrigger.refresh(); } });
if (SCRUB) scrubber();
log(`GSAP ${g.version} loaded with ${have.join(", ")} (${S.states.length} outline states); Stage B: ${sections.length} scenes wired${SCRUB ? ", scrub mode" : ""}`);
})();
