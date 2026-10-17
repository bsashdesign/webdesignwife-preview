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
document.addEventListener("click", (e) => {
const d = e.target.closest(".faq__list details[open], details.faq[open]");
if (!d || e.target.closest("summary, a, button, input, select, textarea, label")) return;
if (String(window.getSelection && window.getSelection()).trim()) return;
d.open = false;
});
(function () {
const box = document.querySelector("[data-buycalc]");
if (!box) return;
const PRICE = Object.fromEntries(Object.entries(window.WDW_PLANS).map(([k, p]) => [k, p.month]));
const YEARMO = Object.fromEntries(Object.entries(window.WDW_PLANS).map(([k, p]) => [k, p.yearmo]));
const MONTHS = [24, 20, 16, 12, 8, 4], FEE = 299;
const money = (n) => "$" + Math.round(n).toLocaleString("en-US");
const set = (k, v) => { box.querySelector(`[data-bc="${k}"]`).textContent = v; };
const range = box.querySelector("[data-bc-months]");
let plan = "business", bill = "monthly";
const render = () => {
const m = +range.value;
const per = bill === "yearly" ? YEARMO[plan] : PRICE[plan];
range.style.setProperty("--fill", ((m - 1) / 72 * 100) + "%");
if (m > 72) {
set("when", "After six years");
set("buyout", "$0"); set("buyout-note", "After six years, the buyout price is $0: you own the site.");
set("total", money(FEE)); set("total-note", `If you decide to move it away from Web Design Wife, the ${money(FEE)} technical transfer fee covers packaging the site and handing the code and content to you or your new developer.`);
} else {
const year = Math.ceil(m / 12), n = MONTHS[year - 1];
set("when", `Month ${m} (Year ${year})`);
set("buyout", money(n * per)); set("buyout-note", `${n} months of your package at ${money(per)}/month`);
set("total", money(n * per + FEE)); set("total-note", "Or stay: it's yours after six years either way.");
}
set("fee", money(FEE));
box.querySelectorAll("[data-bc-plan]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.bcPlan === plan)));
box.querySelectorAll("[data-bc-bill]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.bcBill === bill)));
};
box.addEventListener("click", (e) => {
const p = e.target.closest("[data-bc-plan]"), b = e.target.closest("[data-bc-bill]");
if (p) plan = p.dataset.bcPlan; if (b) bill = b.dataset.bcBill;
if (p || b) render();
});
range.addEventListener("input", render);
render();
})();
(function () {
const main = document.querySelector("main.pr");
const sw = document.querySelector("[data-bill-switch]");
if (!main || !sw) return;
const say = document.querySelector("[data-bill-say]");
const P = window.WDW_PLANS;
const money = (n) => "$" + n.toLocaleString("en-US");
sw.addEventListener("click", () => {
const yearly = sw.getAttribute("aria-checked") !== "true";
sw.setAttribute("aria-checked", String(yearly));
main.classList.toggle("is-monthly", !yearly);
say.textContent = yearly
? `Billed yearly: Essentials ${money(P.essentials.yearmo)}, Business ${money(P.business.yearmo)}, Full Suite ${money(P.full.yearmo)} a month.`
: `Billed monthly: Essentials ${money(P.essentials.month)}, Business ${money(P.business.month)}, Full Suite ${money(P.full.month)} a month.`;
});
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
document.documentElement.classList.add("story-on");
requestAnimationFrame(() => requestAnimationFrame(() => document.documentElement.classList.add("story-run")));
}
})();
(function () {
const surface = document.querySelector(".surface[data-paint]");
const main = document.querySelector("main");
const chapters = [...document.querySelectorAll("[data-chapter]")];
if (!surface || !main || !chapters.length || document.querySelector("[data-one]")) return;
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
let cur = "";
let late = 0;
let fgTimer = 0;
const set = (c) => {
if (c === cur) return;
const turn = cur && (cur === "ink" || c === "ink");
if (turn) {
surface.classList.add("is-late");
clearTimeout(late);
late = setTimeout(() => surface.classList.remove("is-late"), 450);
}
cur = c;
surface.dataset.surface = c;
main.dataset.surface = c;
clearTimeout(fgTimer);
const fg = c === "ink" ? "ink" : "light";
if (turn) fgTimer = setTimeout(() => { main.dataset.fg = fg; }, 180);
else main.dataset.fg = fg;
};
const live = new Set();
const pick = () => {
for (let i = chapters.length - 1; i >= 0; i--) if (live.has(chapters[i])) return set(chapters[i].dataset.chapter);
const first = chapters[0].getBoundingClientRect();
set((first.top > innerHeight / 2 ? chapters[0] : chapters[chapters.length - 1]).dataset.chapter);
};
const io = new IntersectionObserver((entries) => {
entries.forEach((e) => (e.isIntersecting ? live.add(e.target) : live.delete(e.target)));
pick();
}, { rootMargin: "-50% 0px -50% 0px" });
chapters.forEach((c) => io.observe(c));
set(chapters[0].dataset.chapter);
document.documentElement.classList.add("story-on");
requestAnimationFrame(() => requestAnimationFrame(() => document.documentElement.classList.add("story-run")));
})();
