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
document.querySelectorAll("form.quickcheck").forEach((form) => {
const steps = {};
form.querySelectorAll(".quickcheck__step").forEach((el) => { steps[el.dataset.step] = el; });
const msg = form.querySelector(".quickcheck__msg");
let stage = "url";
function go(next) {
steps[stage].hidden = true;
stage = next;
steps[stage].hidden = false;
const input = steps[stage].querySelector("input");
if (input) input.focus();
}
form.addEventListener("submit", (e) => {
e.preventDefault();
msg.textContent = "";
const input = steps[stage].querySelector("input");
if (stage === "url") {
const raw = input.value.trim().replace(/^https?:\/\//i, "").replace(/\/.*$/, "");
if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(raw)) {
input.setAttribute("aria-invalid", "true");
msg.textContent = "Enter a web address like yourbusiness.com.";
return;
}
input.setAttribute("aria-invalid", "false");
form.querySelectorAll(".qc-url").forEach((el) => { el.textContent = raw; });
go("email");
} else if (stage === "email") {
if (!input.checkValidity() || !input.value.trim()) {
input.setAttribute("aria-invalid", "true");
msg.textContent = "Enter an email address so I can send your notes.";
return;
}
go("done");
}
});
});
})();
(function () {
const root = document.documentElement;
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
document.querySelectorAll(".section h2, .blog-hero h1, .article h1, .pr-title, .ct-title, .inc-title").forEach((h) => {
if (h.closest(".finder-dialog, .drawer, .chap")) return;
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
const partner = new Map();
targets.forEach((el) => {
if (!el.classList.contains("eyebrow")) return;
let n = el.nextElementSibling;
while (n && !n.matches("h1, h2, h3") && !n.querySelector("h1, h2, h3")) n = n.nextElementSibling;
const h = n && (n.matches("h1, h2, h3") ? n : n.querySelector("h1, h2, h3"));
if (h && h.classList.contains("m-words")) partner.set(el, h);
});
const waiting = new Map();
const watch = (seen, el) => { if (!waiting.has(seen)) waiting.set(seen, []); waiting.get(seen).push(el); };
targets.forEach((el) => watch(partner.get(el) || el, el));
document.querySelectorAll("[data-reveal]").forEach((el) => watch(el, el));
const io = new IntersectionObserver((entries) => entries.forEach((e) => {
if (!e.isIntersecting && e.boundingClientRect.top > 0) return;
(waiting.get(e.target) || []).forEach((el) => el.classList.add(el.hasAttribute("data-reveal") ? "is-in" : "m-in"));
io.unobserve(e.target);
}), { rootMargin: "0px 0px -10% 0px" });
waiting.forEach((_, el) => io.observe(el));
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
let width = 0;
new ResizeObserver(() => { if (document.documentElement.clientWidth !== width) { width = document.documentElement.clientWidth; fit(); } }).observe(document.documentElement);
if (document.fonts) document.fonts.ready.then(fit);
fit();
})();
(function () {
const bar = document.querySelector(".filters");
if (!bar) return;
const cards = [...document.querySelectorAll(".posts--index > .post-card")];
const search = document.querySelector("[data-blog-search]");
const empty = document.querySelector(".blog-search__empty");
let filter = "all";
const text = (c) => c.textContent.toLowerCase().replace(/\s+/g, " ");
const apply = () => {
const words = (search ? search.value : "").toLowerCase().trim().split(/\s+/).filter(Boolean);
let shown = 0;
cards.forEach((c) => {
const match = words.every((w) => text(c).includes(w));
const ok = "searchOnly" in c.dataset ? filter === "all" && words.length > 0 && match : (filter === "all" || c.dataset.group === filter) && match;
c.hidden = !ok; if (ok) shown++;
});
if (empty) empty.hidden = shown > 0;
};
bar.addEventListener("click", (e) => {
const b = e.target.closest(".filter"); if (!b) return;
bar.querySelectorAll(".filter").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
filter = b.dataset.filter;
apply();
});
if (search) search.addEventListener("input", apply);
const hash = location.hash.replace("#", "");
const pre = bar.querySelector(`[data-filter="${hash}"]`);
if (pre) pre.click();
})();
(function () {
const box = document.querySelector(".related");
if (!box) return;
const STOP = new Set("a an and are as at be by can do for from how in is it of on or our the to vs we what when which who why with you your web design wife website websites business businesses local honest comparison".split(" "));
const words = (t) => new Set(t.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w)));
fetch("posts.json").then((r) => r.json()).then((posts) => {
const me = posts.find((p) => p.slug === box.dataset.slug);
if (!me) return;
const mine = words(me.title + " " + me.summary);
const picks = posts
.filter((p) => p.slug !== me.slug)
.map((p) => {
let score = p.group === me.group ? 10 : 0;
words(p.title + " " + p.summary).forEach((w) => { if (mine.has(w)) score += 2; });
return { p, score };
})
.sort((a, b) => b.score - a.score || a.p.title.localeCompare(b.p.title))
.slice(0, 3)
.map(({ p }) => p);
box.querySelector(".related__list").innerHTML = picks.map((p) => `
      <a class="post-card post-card--article related__card" href="${p.slug}.html" data-tone="${p.tone}" style="--cover:${p.bg};--cover-dark:${p.bgDark}">
        ${p.cover}
        <span class="post-card__body">
          <span class="post-card__kicker">${p.kicker}</span>
          <h3>${p.title}</h3>
          <p>${p.summary}</p>
          <span class="post-card__meta"><img src="../images/favicon.jpg" alt="" width="22" height="22">Ben Sash · ${p.minutes} min read</span>
        </span>
      </a>`).join("");
box.hidden = false;
}).catch(() => {});
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
const back = document.querySelector(".article__back");
if (!back || !document.referrer) return;
let from;
try { from = new URL(document.referrer); } catch (e) { return; }
if (from.origin !== location.origin || !/\/blog\/(?!index\.html)[^/]+\.html$/.test(from.pathname) || from.pathname === location.pathname) return;
const title = sessionStorage.getItem("wdw-title:" + from.pathname);
back.lastChild.textContent = " Back to " + (title || "the previous article");
back.addEventListener("click", (e) => { e.preventDefault(); history.back(); });
})();
(function () {
const h = document.querySelector(".article h1");
if (h) try { sessionStorage.setItem("wdw-title:" + location.pathname, h.textContent.trim()); } catch (e) {}
})();
(function () {
const chips = document.querySelectorAll(".ref-chip[data-slug]");
if (!chips.length) return;
let posts = null, card = null, openChip = null;
const base = chips[0].getAttribute("href").replace(/[^/]*$/, "");
const load = () => posts || (posts = fetch(base + "posts.json").then((r) => r.json()).catch(() => []));
const close = () => {
if (!card || !openChip) return;
card.classList.remove("is-on");
openChip.setAttribute("aria-expanded", "false");
openChip = null;
};
const place = () => {
if (!openChip) return;
const r = openChip.getBoundingClientRect(), w = card.offsetWidth, h = card.offsetHeight;
const left = Math.min(Math.max(12, r.left + r.width / 2 - w / 2), innerWidth - w - 12);
const below = r.bottom + 10 + h < innerHeight || r.top - 10 - h < 0;
card.style.left = left + scrollX + "px";
card.style.top = (below ? r.bottom + 10 : r.top - 10 - h) + scrollY + "px";
};
const open = async (chip) => {
const list = await load();
const p = list.find((x) => x.slug === chip.dataset.slug);
if (!p) { location.href = chip.href; return; }
if (!card) {
card = document.createElement("a");
card.className = "ref-preview post-card post-card--article";
document.body.appendChild(card);
}
close();
card.href = base + p.slug + ".html";
card.dataset.tone = p.tone;
card.style.setProperty("--cover", p.bg);
card.style.setProperty("--cover-dark", p.bgDark);
card.setAttribute("aria-label", "Read: " + p.title);
card.innerHTML = `${base ? p.cover.replaceAll('src="../', `src="${base}../`) : p.cover}<span class="post-card__body"><span class="post-card__kicker">${p.kicker}</span><h3>${p.title}</h3><p>${p.summary}</p><span class="post-card__meta"><img src="${base}../images/favicon.jpg" alt="" width="22" height="22">Ben Sash · ${p.minutes} min read</span><span class="ref-preview__go">Read the article <svg class="i-arrow" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9.5M8.5 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span></span>`;
openChip = chip;
chip.setAttribute("aria-expanded", "true");
place();
void card.offsetWidth;
card.classList.add("is-on");
};
chips.forEach((c) => {
c.setAttribute("aria-expanded", "false");
c.addEventListener("click", (e) => {
if (e.metaKey || e.ctrlKey || e.shiftKey) return;
e.preventDefault();
openChip === c ? close() : open(c);
});
});
document.addEventListener("click", (e) => {
if (openChip && !e.target.closest(".ref-preview, .ref-chip")) close();
});
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && openChip) { const c = openChip; close(); c.focus(); } });
addEventListener("resize", place);
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
document.addEventListener("click", (e) => {
const d = e.target.closest(".faq__list details[open], details.faq[open]");
if (!d || e.target.closest("summary, a, button, input, select, textarea, label")) return;
if (String(window.getSelection && window.getSelection()).trim()) return;
d.open = false;
});
