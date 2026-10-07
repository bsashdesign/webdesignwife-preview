(function () {
const buttons = document.querySelectorAll("[data-billing]");
const sw = document.querySelector(".billing__switch");
const billing = document.querySelector(".billing");
const plans = document.querySelectorAll(".plan[data-price]");
if (!buttons.length) return;
const money = (n) => "$" + n.toLocaleString("en-US");
function render(mode) {
buttons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.billing === mode)));
if (sw) sw.setAttribute("aria-checked", String(mode === "yearly"));
if (billing) billing.classList.toggle("is-yearly", mode === "yearly");
document.querySelectorAll(".billing__save").forEach((t) => {
if (!t.querySelector(".billing__save-m")) t.innerHTML = '<span class="billing__save-m">Save ~20% on Your Subscription</span><span class="billing__save-y">You Are Saving ~20% on Your Subscription</span>';
t.classList.toggle("is-on", mode === "yearly");
});
plans.forEach((plan) => {
const P = window.WDW_PLANS[plan.dataset.planKey];
const price = P.month, setup = P.setup, yearly = P.year, perMonth = P.yearmo;
const terms = plan.querySelector(".plan__terms");
plan.querySelector(".plan__price").innerHTML = mode === "yearly"
? `<s class="plan__was">$${price}</s><b class="plan__now"><span>$${perMonth}</span>/month</b>`
: `<b class="plan__now"><span>$${price}</span>/month</b>`;
const F = window.WDW_FOUNDING;
const setupLine = F
? `+ <s>${money(setup)}</s> <strong>${money(P.found)} setup</strong> <span class="plan__founding"><i class="pi pi--crown-fill" aria-hidden="true"></i>${F.off}% Launch Offer</span>`
: `+ ${money(setup)} one-time setup`;
terms.innerHTML = mode === "yearly"
? `${money(yearly)} billed yearly · <strong>save ${money(P.save)} on your subscription</strong><br>${setupLine}`
: setupLine;
const cta = plan.querySelector(".plan__cta");
if (cta) { const u = new URL(cta.getAttribute("href"), location.href); u.searchParams.set("billing", mode); cta.setAttribute("href", "start.html" + u.search); }
});
}
buttons.forEach((b) => b.addEventListener("click", () => render(b.dataset.billing)));
if (sw) sw.addEventListener("click", () => render(sw.getAttribute("aria-checked") === "true" ? "monthly" : "yearly"));
render(sw && sw.getAttribute("aria-checked") === "false" ? "monthly" : "yearly");
})();
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
(function () {
const gems = [...document.querySelectorAll("canvas.plan-gem[data-plan]")];
if (!gems.length) return;
const circle = (n, r, y, off = 0) => Array.from({ length: n }, (_, i) => { const a = (i + off) / n * 2 * Math.PI; return [r * Math.cos(a), y, r * Math.sin(a)]; });
const octRect = (s, y, W = 1, D = .74, c = .3) => [[-W + c, D], [W - c, D], [W, D - c], [W, -D + c], [W - c, -D], [-W + c, -D], [-W, -D + c], [-W, D - c]].map(([x, z]) => [x * s, y, z * s]);
function loft(rings) {
const faces = [];
for (let k = 0; k < rings.length - 1; k++) {
const A = rings[k], B = rings[k + 1];
if (A.length === 1 || B.length === 1) {
const tip = A.length === 1 ? A[0] : B[0], R = A.length === 1 ? B : A;
R.forEach((p, i) => { const f = [tip, p, R[(i + 1) % R.length]]; f.alt = i % 2; faces.push(f); });
} else if (B.length === 2 * A.length) {
A.forEach((p, i) => {
const j = (i + 1) % A.length, b0 = B[2 * i], b1 = B[2 * i + 1], b2 = B[(2 * i + 2) % B.length];
const star = [p, b1, A[j]]; star.alt = 0;
const l = [p, b0, b1]; l.alt = 1; const r = [A[j], b1, b2]; r.alt = 1;
faces.push(star, l, r);
});
} else {
A.forEach((p, i) => { const j = (i + 1) % A.length, f = [p, B[i], B[j], A[j]]; f.alt = i % 2; faces.push(f); });
}
}
[rings[0], rings[rings.length - 1]].forEach((R) => { if (R.length > 2) faces.push(R.slice()); });
return faces;
}
const sq = (scale, y) => octRect(scale, y, 1, 1, .32);
const MODELS = {
essentials: () => loft([circle(4, .64, .34), circle(4, .8, .18), [[0, -.72, 0]]]),
business: () => loft([sq(.56, .52), sq(.95, .12), [[0, -1.02, 0]]]),
full: () => loft([circle(8, .52, .58), circle(16, .82, .36), circle(16, 1, .14), circle(16, 1, .05), circle(16, .5, -.55), [[0, -1.12, 0]]]),
};
const SIZE = { essentials: .8, business: .86, full: 1 };
const cache = {};
const model = (plan) => cache[plan] || (cache[plan] = (() => {
const polys = MODELS[plan](), pts = polys.flat();
const c = [0, 1, 2].map((k) => pts.reduce((sum, p) => sum + p[k], 0) / pts.length);
const faces = polys.map((poly) => {
const q = poly.map((p) => p.map((v, k) => v - c[k]));
let n = [0, 0, 0];
q.forEach((p, i) => { const r = q[(i + 1) % q.length]; n[0] += (p[1] - r[1]) * (p[2] + r[2]); n[1] += (p[2] - r[2]) * (p[0] + r[0]); n[2] += (p[0] - r[0]) * (p[1] + r[1]); });
const mid = [0, 1, 2].map((k) => q.reduce((sum, p) => sum + p[k], 0) / q.length);
const out = n[0] * mid[0] + n[1] * mid[1] + n[2] * mid[2] >= 0, len = Math.hypot(...n) || 1;
return { pts: q, n: n.map((v) => (out ? v : -v) / len), alt: poly.alt || 0 };
});
const radius = Math.max(...pts.map((p) => Math.hypot(p[0] - c[0], p[1] - c[1], p[2] - c[2])));
return { faces, radius };
})());
const DEG = Math.PI / 180, TILT = 26 * DEG, TIP = 20 * DEG, TURN = 9000;
const SIDE = (() => { const l = [-.75, .5, .45], d = Math.hypot(...l); return l.map((v) => v / d); })();
const LIGHT = (() => { const l = [-.45, .75, .55], d = Math.hypot(...l); return l.map((v) => v / d); })();
const rgbOf = (cv, now) => {
const key = cv.dataset.plan + "|" + document.documentElement.className;
if (!cv._rgb || now - cv._rgbAt > 1000 || cv._rgbKey !== key) { cv._rgb = (getComputedStyle(cv).color.match(/\d+(\.\d+)?/g) || [0, 0, 0]).slice(0, 3).map(Number); cv._rgbAt = now; cv._rgbKey = key; }
return cv._rgb;
};
function draw(cv, t) {
const dpr = Math.min(devicePixelRatio || 1, 2), W = cv.clientWidth, H = cv.clientHeight;
if (!W) return;
if (cv.width !== Math.round(W * dpr)) { cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); }
const ctx = cv.getContext("2d"); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
const m = model(cv.dataset.plan), base = rgbOf(cv, t);
const a = t / TURN * 2 * Math.PI + (cv._extra || 0), ca = Math.cos(a), sa = Math.sin(a), ci = Math.cos(TIP), si = Math.sin(TIP), ct = Math.cos(TILT), st = Math.sin(TILT);
const rot = ([x, y, z]) => { const x1 = x * ca + z * sa, z1 = -x * sa + z * ca; const y2 = y * ci - z1 * si, z2 = y * si + z1 * ci; return [x1 * ct - y2 * st, x1 * st + y2 * ct, z2]; };
const f = 8, scale = Math.min(W, H) / 2 / (1.25 * 1.08) * SIZE[cv.dataset.plan];
const plan = cv.dataset.plan;
const FINISH = {
essentials: { sat: 1.25, tone: [.62, .44], alt: .07, lift: 1.3, edge: .85 },
business: { sat: 1.3, tone: [.58, .44], alt: .07, lift: 1.5, edge: .9 },
full: { sat: 1.4, tone: [.7, .42], alt: .06, lift: 2.4, edge: .8 },
}[plan];
const grey = base[0] * .3 + base[1] * .59 + base[2] * .11;
const col0 = base.map((v) => Math.max(0, Math.min(255, grey + (v - grey) * FINISH.sat)));
const small = W < 48;
ctx.lineJoin = "round"; ctx.lineWidth = small ? .5 : Math.min(1.2, W / 100);
const dark = .22;
ctx.strokeStyle = `rgba(${col0.map((v) => Math.round(v * dark))}, ${small ? .55 : FINISH.edge})`;
const shown = [];
for (const face of m.faces) {
const n = rot(face.n), q = face.pts.map(rot), c = q[0];
if (n[0] * -c[0] + n[1] * -c[1] + n[2] * (f - c[2]) <= 0) continue;
shown.push({ face, n, p: q.map(([x, y, z]) => { const k = f / (f - z); return [W / 2 + x * k * scale, H / 2 - y * k * scale, z]; }) });
}
const path = (p) => { ctx.beginPath(); p.forEach((pt, i) => (i ? ctx.lineTo(pt[0], pt[1]) : ctx.moveTo(pt[0], pt[1]))); ctx.closePath(); };
const mood = document.documentElement.dataset.mood;
const style = { tangy: "tangy", transit: "transit", transitdark: "transit", sophisticated: "sophisticated" }[mood] || "calm";
if (style === "tangy") {
ctx.strokeStyle = "#111"; ctx.lineJoin = "round"; ctx.lineWidth = small ? 1.2 : Math.max(2, W / 34);
} else if (style === "transit") {
ctx.strokeStyle = "#fff"; ctx.lineWidth = small ? (plan === "full" ? .6 : .8) : Math.max(1, W / (plan === "full" ? 95 : 65));
} else if (style === "sophisticated") {
ctx.strokeStyle = `rgb(${base.map(Math.round)})`; ctx.lineWidth = small ? .7 : Math.max(1, W / 90);
}
for (const { face, p, n } of shown) {
const up = (face.n[1] + 1) / 2, alt = face.alt ? FINISH.alt : -FINISH.alt;
let tone, lift;
if (plan === "full") {
const d = n[0] * SIDE[0] + n[1] * SIDE[1] + n[2] * SIDE[2], side = d > 0 ? d : d * .42;
tone = .58 + .6 * side + alt; lift = Math.max(0, side - .45) * 1.5;
if (face.n[1] > .99) { tone += .2; lift += .35; }
}
else {
const d = n[0] * SIDE[0] + n[1] * SIDE[1] + n[2] * SIDE[2], side = d > 0 ? d : d * .42;
tone = .58 + .6 * side + alt; lift = Math.max(0, side - .45) * FINISH.lift;
if (face.n[1] > .99) { tone += .2; lift += .35; }
if (plan === "essentials") { tone += .08; lift += .12; }
}
if (face.n[1] < -.05) {
const h = Math.hypot(n[0], n[2]) || 1, around = (n[0] * -.8 + n[2] * .6) / h;
tone = .42 + .5 * (around + 1) / 2; lift = Math.max(0, around - .55) * .5;
if (plan === "essentials") { tone += .06; lift += .08; }
}
tone = Math.max(.26, tone);
if (style === "sophisticated") { path(p); ctx.stroke(); continue; }
{
ctx.fillStyle = `rgb(${col0.map((v) => Math.round(Math.min(255, v * tone + (255 - v * tone) * Math.min(1, lift))))})`;
}
path(p); ctx.fill(); ctx.stroke();
}
if (plan === "full" && !small) {
const PERIOD = cv._hover ? 1100 : 3200, phase = (t % PERIOD) / PERIOD;
const tw = phase < .3 ? Math.sin(phase / .3 * Math.PI) ** 2 : 0;
if (tw > .02) {
const r = W * .14 * tw, x = W * .66, y = H * .42;
ctx.fillStyle = "#fff";
ctx.beginPath(); ctx.moveTo(x, y - r); ctx.lineTo(x + r * .22, y - r * .22); ctx.lineTo(x + r, y); ctx.lineTo(x + r * .22, y + r * .22);
ctx.lineTo(x, y + r); ctx.lineTo(x - r * .22, y + r * .22); ctx.lineTo(x - r, y); ctx.lineTo(x - r * .22, y - r * .22); ctx.closePath(); ctx.fill();
}
}
}
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const live = new Set();
const io = new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? live.add(e.target) : live.delete(e.target))));
gems.forEach((cv) => { io.observe(cv); draw(cv, 1500); });
const BASE = 2 * Math.PI / TURN, BOOST = 4 * BASE, EASE = .003, TURN_R = 2 * Math.PI;
const aimAhead = (cv) => { const ahead = (cv._extra || 0) + Math.max(0, cv._vel || 0) / EASE; cv._target = Math.ceil(ahead / TURN_R - 1e-6) * TURN_R; };
gems.forEach((cv) => {
const hit = cv.closest(".plan-ring-tile") || cv;
const S = () => window.wdwGemSound;
hit.addEventListener("pointerenter", () => { cv._hover = true; cv._target = null; S() && S().start(); });
hit.addEventListener("pointerleave", () => { cv._hover = false; cv._held = false; cv.classList.remove("is-held"); aimAhead(cv); clearTimeout(cv._slowT); S() && S().stop(); });
hit.addEventListener("pointerdown", () => {
cv._held = true; cv._heldAt = performance.now(); cv.classList.add("is-held");
if (S()) { S().clink(); S().start(); }
clearTimeout(cv._slowT); cv._slowT = setTimeout(() => { if (cv._held && S()) S().rate(.32); }, 250);
});
const release = () => { cv._held = false; cv.classList.remove("is-held"); clearTimeout(cv._slowT); S() && S().rate(1); };
hit.addEventListener("pointerup", release); hit.addEventListener("pointercancel", release);
});
const step = (cv, dt, now) => {
let x = cv._extra || 0, v = cv._vel || 0;
const paused = cv._held && now - (cv._heldAt || 0) > 250;
if (paused) { v += (-.75 * BASE - v) * Math.min(1, dt / 200); cv._wasPaused = true; }
else {
if (cv._wasPaused) { cv._wasPaused = false; v = 0; if (!cv._hover) aimAhead(cv); }
if (cv._hover) v += (BOOST - v) * Math.min(1, dt / 250);
else if (cv._target != null) {
const left = cv._target - x, want = left * EASE;
v = v < want ? v + (want - v) * Math.min(1, dt / 300) : want;
if (left < .0005) { x = cv._target; v = 0; cv._target = null; }
} else v = 0;
}
cv._vel = v; cv._extra = x + v * dt;
};
let last = 0;
const loop = (now) => {
if (now - last >= 33) { const dt = Math.min(100, now - (last || now)); last = now; live.forEach((cv) => { step(cv, dt, now); draw(cv, now); }); }
requestAnimationFrame(loop);
};
if (!reduce) requestAnimationFrame(loop);
new MutationObserver(() => gems.forEach((cv) => { cv._rgb = null; draw(cv, reduce ? 1500 : performance.now()); }))
.observe(document.documentElement, { attributes: true, attributeFilter: ["data-mood"] });
})();
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
(function () {
const form = document.getElementById("start-form");
if (!form) return;
const PLANS = Object.fromEntries(Object.entries(window.WDW_PLANS).map(([k, p]) => [k, { ...p, price: p.month }]));
const money = (n) => "$" + n.toLocaleString("en-US");
const yearly = (p) => p.year;
const sum = (k) => document.querySelector(`[data-sum="${k}"]`);
const KEY = "wdw-start";
const WEEK = 7 * 24 * 60 * 60 * 1000;
Object.entries(PLANS).forEach(([k, p]) => {
const el = document.querySelector(`[data-price="${k}"]`);
if (el) el.textContent = `${money(p.price)}/month`;
});
const params = new URLSearchParams(location.search);
let saved = {};
try { saved = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) {}
if (Object.keys(saved).length && !(Date.now() - saved.t < WEEK)) {
saved = {};
try { localStorage.removeItem(KEY); } catch (e) {}
}
Object.entries(saved).forEach(([name, value]) => {
const field = form.elements[name];
if (!field || name === "agree" || name === "billing") return;
if (field instanceof RadioNodeList) field.value = value; else field.value = value;
});
if (PLANS[params.get("plan")]) form.elements.plan.value = params.get("plan");
const sw = document.querySelector(".billing__switch");
const billing = () => (sw && sw.getAttribute("aria-checked") === "true" ? "yearly" : "monthly");
const wantBilling = ["monthly", "yearly"].includes(params.get("billing")) ? params.get("billing") : saved.billing;
if (wantBilling === "monthly" && sw && sw.getAttribute("aria-checked") === "true") sw.click();
const main = document.querySelector(".start");
function render() {
const p = PLANS[form.elements.plan.value] || PLANS.business;
const isYearly = billing() === "yearly";
const key0 = PLANS[form.elements.plan.value] ? form.elements.plan.value : "business";
main.dataset.plan = key0;
main.dataset.mode = p.apply ? "apply" : "buy";
sum("plan").textContent = p.name;
const key = PLANS[form.elements.plan.value] ? form.elements.plan.value : "business";
sum("plan").dataset.plan = key;
const gem = document.querySelector(".ssum__gem"); if (gem) gem.dataset.plan = key;
const F = window.WDW_FOUNDING;
if (p.apply) {
sum("today").textContent = "$0";
sum("setup").textContent = money(F ? p.found : p.setup);
sum("setup-was").innerHTML = F
? `<s>${money(p.setup)}</s> 50% Launch Offer, for the first five businesses I accept. If those five spots are taken by the time you're approved, setup is the regular ${money(p.setup)}. `
: "";
} else if (F) sum("today").innerHTML = `<s>${money(p.setup)}</s> ${money(p.found)}`; else sum("today").textContent = money(p.setup);
sum("then").textContent = isYearly ? `${money(yearly(p))}/year` : `${money(p.price)}/month`;
sum("then-note").textContent = isYearly
? `Billed yearly, saving ${money(p.save)} (~20%) on your subscription. It starts the day your site goes live, once you've approved it.`
: "Your subscription starts the day your site goes live, once you've approved it.";
document.querySelectorAll("[data-price]").forEach((el) => {
const q = PLANS[el.dataset.price];
el.textContent = isYearly ? `${money(q.yearmo)}/month, billed yearly` : `${money(q.price)}/month`;
});
}
function save() {
const data = {};
[...form.elements].forEach((f) => {
if (!f.name || f.type === "checkbox" || f.type === "submit") return;
if (f.type === "radio") { if (f.checked) data[f.name] = f.value; } else data[f.name] = f.value;
});
data.billing = billing();
data.t = Date.now();
try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {}
}
form.addEventListener("input", () => { render(); save(); });
form.addEventListener("change", () => { render(); save(); });
form.addEventListener("click", (e) => { if (e.target.closest(".billing")) setTimeout(() => { render(); save(); }, 0); });
const backLink = document.querySelector("[data-back]");
if (backLink && document.referrer.startsWith(location.origin)) backLink.addEventListener("click", (e) => { e.preventDefault(); history.back(); });
render();
const msg = form.querySelector(".sform__msg");
form.addEventListener("submit", (e) => {
e.preventDefault();
let first = null;
const mode = main.dataset.mode;
form.querySelectorAll("input, textarea, select").forEach((f) => {
if (f.type === "radio") return;
const only = f.closest("[data-mode-only]");
if (only && only.dataset.modeOnly !== mode) { f.removeAttribute("aria-invalid"); return; }
const ok = f.type === "checkbox" ? (!f.required || f.checked) : f.checkValidity() && (!f.required || f.value.trim() !== "");
f.setAttribute("aria-invalid", ok ? "false" : "true");
if (!ok && !first) first = f;
});
if (first) {
msg.textContent = first.type === "checkbox" ? "Please agree to the terms to continue." : "Fill in the highlighted fields and try again.";
first.focus();
return;
}
save();
if (mode === "apply") { location.href = "applied.html"; return; }
location.href = "welcome.html";
});
})();
