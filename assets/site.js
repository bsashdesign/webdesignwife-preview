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
const root = document.documentElement;
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
document.querySelectorAll(".section h2, .blog-hero h1, .article h1").forEach((h) => {
if (h.closest(".finder-dialog, .drawer")) return;
const walk = (node) => {
[...node.childNodes].forEach((n) => {
if (n.nodeType === 3) {
const frag = document.createDocumentFragment();
n.textContent.split(/(\s+)/).forEach((part) => {
if (!part) return;
if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
const w = document.createElement("span");
w.className = "w";
const inner = document.createElement("span");
inner.textContent = part;
w.appendChild(inner);
frag.appendChild(w);
});
n.replaceWith(frag);
} else if (n.nodeType === 1 && !n.matches("br")) walk(n);
});
};
walk(h);
h.querySelectorAll(".w > span").forEach((sp, i) => sp.style.setProperty("--wi", i));
h.classList.add("m-words");
});
const targets = [...document.querySelectorAll(".m-words, .eyebrow, .hl")];
targets.forEach((el) => el.classList.add("m-ready"));
document.querySelectorAll(".features, .extras__grid").forEach((g) => g.querySelectorAll(".ico, .xicon").forEach((el, i) => el.style.setProperty("--hi", i % 6)));
root.classList.add("m-on");
const pending = new Set(targets);
const partner = new Map();
targets.forEach((el) => {
if (!el.classList.contains("eyebrow")) return;
let n = el.nextElementSibling;
while (n && !n.matches("h1, h2, h3") && !n.querySelector("h1, h2, h3")) n = n.nextElementSibling;
const h = n && (n.matches("h1, h2, h3") ? n : n.querySelector("h1, h2, h3"));
if (h && h.classList.contains("m-words")) partner.set(el, h);
});
let queued = false, first = true;
function check() {
queued = false;
const limit = window.innerHeight * 0.9;
pending.forEach((el) => {
const r = (partner.get(el) || el).getBoundingClientRect();
if (r.top < limit) {
el.classList.add("m-in");
pending.delete(el);
}
});
first = false;
}
const schedule = () => { if (!queued) { queued = true; setTimeout(check, 40); } };
window.addEventListener("scroll", schedule, { passive: true });
window.addEventListener("resize", schedule);
schedule();
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
const update = () => nav.classList.toggle("is-scrolled", window.scrollY > 24);
window.addEventListener("scroll", update, { passive: true });
update();
})();
const CHEV_L = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M12.5 4.5 7 10l5.5 5.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const CHEV_R = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7.5 4.5 13 10l-5.5 5.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
(function () {
document.querySelectorAll("#blog .posts:not(.posts--compact), .steps, .boroughs, .must-reads__list").forEach((row) => {
const box = document.createElement("div");
box.className = "rowx rowx--" + (row.classList.contains("boroughs") ? "boroughs" : row.classList.contains("steps") ? "steps" : "posts");
row.before(box);
box.innerHTML = '<div class="rowx__nav"><button type="button" class="rowx__btn rowx__btn--prev" aria-label="Previous">' + CHEV_L + '</button><button type="button" class="rowx__btn rowx__btn--next" aria-label="Next">' + CHEV_R + '</button></div>';
box.appendChild(row);
const nav = box.querySelector(".rowx__nav");
const slot = row.closest("section")?.querySelector("[data-nav-slot]");
if (slot) slot.appendChild(nav);
const [prev, next] = nav.querySelectorAll(".rowx__btn");
const stepBy = (d) => {
const box = row.getBoundingClientRect(), from = row.scrollLeft;
const pad = parseFloat(getComputedStyle(row).paddingLeft) || 0;
const view = row.clientWidth - pad * 2;
const fade = 56;
const cards = [...row.children].map((k) => { const r = k.getBoundingClientRect(); return { l: r.left - box.left + from, r: r.right - box.left + from }; });
let to;
if (d > 0) { const c = cards.find((c) => c.r > from + pad + view - fade + 2); to = c ? c.l - pad : from + view; }
else { const c = [...cards].reverse().find((c) => c.l < from + pad - 2); to = c ? c.r - pad - view + fade : 0; }
row.scrollTo({ left: Math.max(0, Math.min(to, row.scrollWidth - row.clientWidth)), behavior: "smooth" });
};
prev.addEventListener("click", () => stepBy(-1));
next.addEventListener("click", () => stepBy(1));
const update = () => {
const scrollable = row.scrollWidth > row.clientWidth + 2;
box.classList.toggle("is-scrollable", scrollable);
nav.hidden = !scrollable;
row.style.setProperty("--fade-l", row.scrollLeft > 30 ? "40px" : "0px");
row.style.setProperty("--fade-r", row.scrollLeft + row.clientWidth < row.scrollWidth - 4 ? "56px" : "0px");
prev.disabled = row.scrollLeft < 4;
next.disabled = row.scrollLeft + row.clientWidth >= row.scrollWidth - 4;
};
row.addEventListener("scroll", () => requestAnimationFrame(update), { passive: true });
window.addEventListener("resize", update);
update();
});
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
window.addEventListener("resize", fit);
if (document.fonts) document.fonts.ready.then(fit);
fit();
})();
(function () {
const MOODS = { calm: "theme-refined", transit: "theme-subway theme-dark", tangy: "theme-blocks", sophisticated: "theme-wedding" };
const root = document.documentElement;
function swapCopy(cls) {
document.querySelectorAll("[data-alt-theme-wedding]").forEach((el) => {
if (!el.dataset.orig) el.dataset.orig = el.textContent;
el.textContent = cls === "theme-wedding" ? el.getAttribute("data-alt-theme-wedding") : el.dataset.orig;
});
}
function mark(key) {
document.querySelectorAll("[data-mood]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.mood === key)));
const btn = document.querySelector(".mood__btn");
if (btn) btn.dataset.tv = key;
}
let miniTimer = 0;
function miniPlay(key) {
const tv = document.querySelector(".mood__btn .minitv"); if (!tv) return;
const screen = tv.querySelector(".minitv__screen"), stage = tv.querySelector(".minitv__show");
clearTimeout(miniTimer);
const scene = document.querySelector(`#moods-tv .tv-ch--${key === "transitdark" ? "transit" : key}`);
stage.innerHTML = "";
if (scene && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
const copy = scene.cloneNode(true); copy.style.display = "block"; stage.appendChild(copy);
screen.classList.add("is-showing");
}
screen.classList.remove("is-flicker"); void screen.offsetWidth; screen.classList.add("is-flicker");
miniTimer = setTimeout(() => { screen.classList.remove("is-showing"); setTimeout(() => (stage.innerHTML = ""), 400); }, 2600);
}
function apply(key, save) {
if (key === "transitdark") key = "transit";
if (!MOODS[key]) return;
Object.values(MOODS).forEach((c) => root.classList.remove(...c.split(" ")));
root.classList.add(...MOODS[key].split(" "));
root.dataset.mood = key;
swapCopy(MOODS[key]);
mark(key);
if (save) { try { localStorage.setItem("wdw-mood", key); } catch (e) {} miniPlay(key); }
setTimeout(() => window.dispatchEvent(new Event("resize")), 60);
}
apply(root.dataset.mood || "tangy", false);
function keepInView(anchor, change) {
const inFlow = anchor && anchor.isConnected && !anchor.closest(".mood");
const a = inFlow ? anchor : document.elementFromPoint(innerWidth / 2, innerHeight / 2);
const top = a ? a.getBoundingClientRect().top : 0;
root.style.overflowAnchor = "none";
change();
if (!a) { root.style.overflowAnchor = ""; return; }
let user = false;
const stop = () => { user = true; };
["wheel", "touchstart", "keydown"].forEach((ev) => addEventListener(ev, stop, { once: true, passive: true }));
const settle = () => { if (user) return; const d = a.getBoundingClientRect().top - top; if (Math.abs(d) > 1) window.scrollBy(0, d); };
settle();
if (document.fonts) document.fonts.ready.then(settle);
setTimeout(() => { settle(); root.style.overflowAnchor = ""; ["wheel", "touchstart", "keydown"].forEach((ev) => removeEventListener(ev, stop)); }, 400);
}
function switchTo(key, anchor) { if (key !== root.dataset.mood) keepInView(anchor, () => apply(key, true)); }
window.wdwSetMood = switchTo;
document.addEventListener("click", (e) => {
const b = e.target.closest("button[data-mood]");
if (b) switchTo(b.dataset.mood, b);
const sh = e.target.closest("[data-shuffle-mood]");
if (sh) {
const others = Object.keys(MOODS).filter((k) => k !== root.dataset.mood);
switchTo(others[Math.floor(Math.random() * others.length)]);
}
});
const m = document.getElementById("mood");
if (!m) return;
const btn = m.querySelector(".mood__btn");
const setOpen = (o) => { m.classList.toggle("is-open", o); btn.setAttribute("aria-expanded", String(o)); };
const hover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
btn.addEventListener("click", () => setOpen(hover || !m.classList.contains("is-open")));
if (hover) {
let t;
m.addEventListener("mouseenter", () => { clearTimeout(t); setOpen(true); });
m.addEventListener("mouseleave", () => { clearTimeout(t); t = setTimeout(() => setOpen(false), 250); });
}
m.querySelector(".mood__close").addEventListener("click", () => { setOpen(false); btn.focus(); });
m.addEventListener("click", (e) => {
if (!e.target.closest(".mood__opt[data-mood]") || !matchMedia("(max-width: 760px)").matches) return;
setOpen(false);
});
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && m.classList.contains("is-open")) setOpen(false); });
document.addEventListener("click", (e) => { if (!m.contains(e.target)) { m.classList.remove("is-open"); btn.setAttribute("aria-expanded", "false"); } });
})();
(function () {
const fields = document.querySelectorAll("input[data-address]");
if (!fields.length) return;
const API = "https://photon.komoot.io/api/?limit=6&lang=en&bbox=-74.26,40.49,-73.69,40.92&layer=house&layer=street&q=";
const cache = new Map();
const label = (p) => {
const street = [p.housenumber, p.street].filter(Boolean).join(" ") || p.name || "";
const area = p.district || p.city || p.locality || "";
const state = p.state === "New York" ? "NY" : p.state || "";
return [street, area, [state, p.postcode].filter(Boolean).join(" ")].filter(Boolean).join(", ");
};
fields.forEach((input, n) => {
const box = input.closest(".saddr") || input.parentElement;
const list = document.createElement("ul");
list.className = "saddr__list";
list.id = `addr-list-${n}`;
list.setAttribute("role", "listbox");
list.hidden = true;
box.appendChild(list);
input.setAttribute("role", "combobox");
input.setAttribute("aria-autocomplete", "list");
input.setAttribute("aria-controls", list.id);
input.setAttribute("aria-expanded", "false");
let items = [], active = -1, timer, last = "", pending;
const open = (on) => { list.hidden = !on; input.setAttribute("aria-expanded", String(on)); };
const highlight = (i) => {
active = i;
[...list.querySelectorAll("[role=option]")].forEach((li, k) => li.setAttribute("aria-selected", String(k === i)));
if (i >= 0) input.setAttribute("aria-activedescendant", `${list.id}-${i}`); else input.removeAttribute("aria-activedescendant");
};
const choose = (i) => {
if (!items[i]) return;
input.value = items[i];
open(false);
input.dispatchEvent(new Event("input", { bubbles: true }));
last = input.value;
};
const show = (results) => {
items = results;
list.innerHTML = results.map((t, i) => `<li role="option" id="${list.id}-${i}" aria-selected="false">${t.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c])}</li>`).join("")
+ (results.length ? '<li class="saddr__credit" aria-hidden="true">Address data © OpenStreetMap</li>' : "");
highlight(-1);
open(results.length > 0);
};
input.addEventListener("input", () => {
const q = input.value.trim();
if (q === last) return;
clearTimeout(timer);
if (q.length < 3) { open(false); return; }
if (cache.has(q)) { show(cache.get(q)); return; }
timer = setTimeout(async () => {
if (pending) pending.abort();
pending = new AbortController();
try {
const res = await fetch(API + encodeURIComponent(q), { signal: pending.signal });
const data = await res.json();
const seen = new Set();
const found = data.features.map((f) => label(f.properties)).filter((t) => t && !seen.has(t) && seen.add(t)).slice(0, 5);
cache.set(q, found);
if (input.value.trim() === q) show(found);
} catch (e) { if (e.name !== "AbortError") open(false); }
}, 180);
});
input.addEventListener("keydown", (e) => {
if (list.hidden) return;
if (e.key === "ArrowDown") { e.preventDefault(); highlight(Math.min(active + 1, items.length - 1)); }
else if (e.key === "ArrowUp") { e.preventDefault(); highlight(Math.max(active - 1, 0)); }
else if (e.key === "Enter" && active >= 0) { e.preventDefault(); choose(active); }
else if (e.key === "Escape") { open(false); }
});
list.addEventListener("mousedown", (e) => {
const li = e.target.closest("[role=option]");
if (li) { e.preventDefault(); choose(+li.id.split("-").pop()); }
});
input.addEventListener("blur", () => setTimeout(() => open(false), 120));
});
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
const section = /\/blog\//.test(here) ? "blog" : (here.match(/\/(pricing|features|contact)\.html$/) || [])[1];
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
function wdwCalInline(selector, calLink, config) {
(function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if (typeof namespace === "string") { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ["initNamespace", namespace]); } else p(cal, ar); return; } p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
Cal("init", { origin: "https://cal.com" });
Cal("inline", { elementOrSelector: selector, calLink, config: config || {} });
Cal("ui", { hideEventTypeDetails: false, layout: "month_view" });
}
document.addEventListener("click", (e) => {
const a = e.target.closest('a[href^="#"]');
if (!a || e.defaultPrevented || a.getAttribute("href").length < 2) return;
const t = document.getElementById(decodeURIComponent(a.getAttribute("href").slice(1)));
if (!t) return;
e.preventDefault();
t.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
history.pushState(null, "", a.getAttribute("href"));
});
document.addEventListener("click", (e) => {
const d = e.target.closest(".faq__list details[open], details.faq[open]");
if (!d || e.target.closest("summary, a, button, input, select, textarea, label")) return;
if (String(window.getSelection && window.getSelection()).trim()) return;
d.open = false;
});
(function () {
let ac = null;
let muted = false;
try { muted = localStorage.getItem("wdw-muted") === "1"; } catch (e) {}
const danceT = new Map();
const dance = (ms, big, moves = !big) => {
if (!(big && moves)) return;
const el = document.querySelector("#moods-tv .tv");
if (!el) return;
el.classList.add("is-dancing");
el.classList.toggle("is-sounding", !muted);
clearTimeout(danceT.get(el));
danceT.set(el, setTimeout(() => el.classList.remove("is-dancing", "is-sounding"), ms));
};
const syncMute = () => document.querySelectorAll("[data-mute]").forEach((b) => b.setAttribute("aria-checked", String(!muted)));
syncMute();
document.addEventListener("click", (e) => {
if (!e.target.closest("[data-mute]")) return;
muted = !muted;
try { localStorage.setItem("wdw-muted", muted ? "1" : "0"); } catch (err) {}
syncMute();
});
const click = (big) => {
dance(1320, big);
if (muted) return;
try {
ac = ac || new (window.AudioContext || window.webkitAudioContext)();
if (ac.state === "suspended") ac.resume();
const t = ac.currentTime, out = ac.createGain();
out.gain.value = .5; out.connect(ac.destination);
const len = Math.floor(ac.sampleRate * .012), buf = ac.createBuffer(1, len, ac.sampleRate), d = buf.getChannelData(0);
for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 8);
const noise = ac.createBufferSource(), hp = ac.createBiquadFilter(), ng = ac.createGain();
noise.buffer = buf; hp.type = "highpass"; hp.frequency.value = 3500; ng.gain.value = 1;
noise.connect(hp).connect(ng).connect(out); noise.start(t);
const ping = ac.createOscillator(), pg = ac.createGain();
ping.type = "triangle"; ping.frequency.setValueAtTime(2600, t); ping.frequency.exponentialRampToValueAtTime(1900, t + .02);
pg.gain.setValueAtTime(.35, t); pg.gain.exponentialRampToValueAtTime(.001, t + .025);
ping.connect(pg).connect(out); ping.start(t); ping.stop(t + .03);
} catch (e) {}
};
window.wdwTvOn = () => {
dance(2100, true);
if (muted) return;
try {
ac = ac || new (window.AudioContext || window.webkitAudioContext)();
if (ac.state === "suspended") ac.resume();
const t = ac.currentTime, out = ac.createGain();
out.gain.value = .22; out.connect(ac.destination);
[[1, .07], [2, .012]].forEach(([mult, vol]) => {
const o = ac.createOscillator(), g = ac.createGain();
o.type = "sine";
o.frequency.setValueAtTime(700 * mult, t); o.frequency.exponentialRampToValueAtTime(1800 * mult, t + .5);
g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .1);
g.gain.setValueAtTime(vol, t + .45); g.gain.exponentialRampToValueAtTime(.0001, t + 1.1);
o.connect(g).connect(out); o.start(t); o.stop(t + 1.15);
});
const hum = ac.createOscillator(), hg = ac.createGain(), lp = ac.createBiquadFilter();
hum.type = "triangle"; hum.frequency.value = 110; lp.type = "lowpass"; lp.frequency.value = 400;
hg.gain.setValueAtTime(.0001, t); hg.gain.exponentialRampToValueAtTime(.12, t + .06); hg.gain.exponentialRampToValueAtTime(.0001, t + .7);
hum.connect(lp).connect(hg).connect(out); hum.start(t); hum.stop(t + .75);
const len = Math.floor(ac.sampleRate * .45), buf = ac.createBuffer(1, len, ac.sampleRate), d = buf.getChannelData(0);
for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
const st = ac.createBufferSource(), sf = ac.createBiquadFilter(), sg = ac.createGain();
st.buffer = buf; sf.type = "bandpass"; sf.frequency.value = 1800; sf.Q.value = .5;
sg.gain.setValueAtTime(.0001, t); sg.gain.exponentialRampToValueAtTime(.04, t + .03); sg.gain.exponentialRampToValueAtTime(.0001, t + .4);
st.connect(sf).connect(sg).connect(out); st.start(t);
} catch (e) {}
};
window.wdwSwoosh = () => {
dance(1450, true);
if (muted) return;
try {
ac = ac || new (window.AudioContext || window.webkitAudioContext)();
if (ac.state === "suspended") ac.resume();
const t = ac.currentTime, dur = .32;
const len = Math.floor(ac.sampleRate * dur), buf = ac.createBuffer(1, len, ac.sampleRate), d = buf.getChannelData(0);
for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
const src = ac.createBufferSource(), bp = ac.createBiquadFilter(), g = ac.createGain();
src.buffer = buf; bp.type = "bandpass"; bp.Q.value = .9;
bp.frequency.setValueAtTime(700, t); bp.frequency.exponentialRampToValueAtTime(2600, t + dur * .55); bp.frequency.exponentialRampToValueAtTime(1500, t + dur);
g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.09, t + .09); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
src.connect(bp).connect(g).connect(ac.destination); src.start(t); src.stop(t + dur);
} catch (e) {}
};
const clunk = (big) => {
dance(1380, big);
if (muted) return;
try {
ac = ac || new (window.AudioContext || window.webkitAudioContext)();
if (ac.state === "suspended") ac.resume();
const t = ac.currentTime, out = ac.createGain();
out.gain.value = .55; out.connect(ac.destination);
const o = ac.createOscillator(), g = ac.createGain();
o.type = "sine"; o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(70, t + .09);
g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.6, t + .005); g.gain.exponentialRampToValueAtTime(.0001, t + .14);
o.connect(g).connect(out); o.start(t); o.stop(t + .16);
const len = Math.floor(ac.sampleRate * .03), buf = ac.createBuffer(1, len, ac.sampleRate), d = buf.getChannelData(0);
for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 4);
const n = ac.createBufferSource(), lp = ac.createBiquadFilter(), ng = ac.createGain();
n.buffer = buf; lp.type = "lowpass"; lp.frequency.value = 900; ng.gain.value = .5;
n.connect(lp).connect(ng).connect(out); n.start(t);
} catch (e) {}
};
const bell = (f, t, vol, decay) => {
const g = ac.createGain();
g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .006); g.gain.exponentialRampToValueAtTime(.0001, t + decay);
g.connect(ac.destination);
[[1, 1], [2.76, .18]].forEach(([m, v]) => {
const o = ac.createOscillator(), og = ac.createGain();
o.type = "sine"; o.frequency.value = f * m; og.gain.value = v;
o.connect(og).connect(g); o.start(t); o.stop(t + decay + .05);
});
};
const SCALE = [1318.5, 1480, 1661.2, 1975.5, 2217.5, 2637, 2960];
let twinkleTimer = null, twinkleRate = 1, twinkleStep = 0;
const twinkle = () => {
dance(Math.round(700 / Math.max(twinkleRate, .3)));
if (!muted) try {
twinkleStep = Math.max(0, Math.min(SCALE.length - 1, twinkleStep + [-1, 1, 1, 2, -2][Math.floor(Math.random() * 5)]));
bell(SCALE[twinkleStep] * (twinkleRate < 1 ? .5 : 1), ac.currentTime, .022, twinkleRate < 1 ? 1.6 : .9);
} catch (e) {}
twinkleTimer = setTimeout(twinkle, (140 + Math.random() * 90) / twinkleRate);
};
window.wdwGemSound = {
start() {
if (!muted) { try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); if (ac.state === "suspended") ac.resume(); } catch (e) {} }
if (twinkleTimer) return;
twinkleRate = 1; twinkleStep = 2; twinkle();
},
stop() { clearTimeout(twinkleTimer); twinkleTimer = null; },
rate(r) { twinkleRate = r; },
clink() {
dance(1500);
if (muted) return;
try {
ac = ac || new (window.AudioContext || window.webkitAudioContext)();
if (ac.state === "suspended") ac.resume();
const t = ac.currentTime;
bell(3136, t, .12, .5); bell(4699, t, .05, .35);
const len = Math.floor(ac.sampleRate * .008), buf = ac.createBuffer(1, len, ac.sampleRate), d = buf.getChannelData(0);
for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
const n = ac.createBufferSource(), hp = ac.createBiquadFilter(), ng = ac.createGain();
n.buffer = buf; hp.type = "highpass"; hp.frequency.value = 5000; ng.gain.value = .15;
n.connect(hp).connect(ng).connect(ac.destination); n.start(t);
} catch (e) {}
},
};
const tone = (f, t, dur, vol, type = "triangle") => {
const o = ac.createOscillator(), g = ac.createGain();
o.type = type; o.frequency.value = f;
g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .012); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
o.connect(g).connect(ac.destination); o.start(t); o.stop(t + dur + .05);
};
const noiseTick = (t, freq, vol, len = .012) => {
const n = Math.floor(ac.sampleRate * len), buf = ac.createBuffer(1, n, ac.sampleRate), d = buf.getChannelData(0);
for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 6);
const src = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
src.buffer = buf; f.type = "bandpass"; f.frequency.value = freq; f.Q.value = 1.2; g.gain.value = vol;
src.connect(f).connect(g).connect(ac.destination); src.start(t);
};
const audio = () => { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); if (ac.state === "suspended") ac.resume(); return ac; };
const knobSpin = () => {
dance(1400, true);
if (muted) return;
try { const t = audio().currentTime; noiseTick(t, 900, .9, .03); tone(180, t, .12, .25, "sine"); for (let k = 1; k < 6; k++) noiseTick(t + k * .07, 2400, .25 - k * .03); } catch (e) {}
};
const knobTick = () => {
dance(1200, true);
if (muted) return;
try { const t = audio().currentTime; noiseTick(t, 3200, .7); noiseTick(t + .045, 2600, .45); } catch (e) {}
};
const tune = () => {
const notes = [[784, 0], [988, .16], [1175, .32], [1568, .48], [1319, .72], [1568, .88], [1760, 1.04], [1568, 1.36]];
dance(3300, true, true);
if (muted) return;
try {
const t = audio().currentTime + .02;
notes.forEach(([f, at], i) => { tone(f, t + at, i === notes.length - 1 ? .7 : .22, .09); tone(f / 2, t + at, .18, .035, "sine"); });
} catch (e) {}
};
document.addEventListener("click", (e) => {
const k = e.target.closest("[data-tv-knob]");
if (k) {
if (k.dataset.tvKnob === "spin") {
const turn = (Number(k.dataset.turn) || 0) + Math.round(200 + Math.random() * 140); k.dataset.turn = turn; k.style.setProperty("--turn", turn + "deg");
knobSpin();
} else {
const turn = (Number(k.dataset.turn) || 0) + Math.round(25 + Math.random() * 45); k.dataset.turn = turn; k.style.setProperty("--turn", turn + "deg");
knobTick();
}
return;
}
if (e.target.closest("[data-tv-grille]")) tune();
});
const sound = (key) => { const big = !!key.closest("#moods-tv"); return key.getAttribute("aria-pressed") === "true" ? clunk(big) : click(big); };
document.addEventListener("pointerdown", (e) => {
const key = e.button === 0 && e.target.closest("[data-tv-key], .mood__opt, .moods__key");
if (key) sound(key);
});
document.addEventListener("keydown", (e) => {
const key = (e.key === "Enter" || e.key === " ") && document.activeElement && document.activeElement.closest("[data-tv-key], .mood__opt, .moods__key");
if (key) sound(key);
});
})();
(function () {
try {
const saved = JSON.parse(localStorage.getItem("wdw-start") || "null");
if (saved && !(Date.now() - saved.t < 7 * 24 * 60 * 60 * 1000)) localStorage.removeItem("wdw-start");
} catch (e) {}
})();
