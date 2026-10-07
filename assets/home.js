(function () {
const demo = document.getElementById("demo");
const thread = document.getElementById("thread");
if (!demo || !thread) return;
const compose = demo.querySelector(".phone__compose");
const EASE_OUT = "cubic-bezier(.22, 1, .36, 1)";
const CHECK = '<span class="bubble__check"><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 6.4l2.3 2.3 4.7-5" fill="none" stroke="#5b3df5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';
let onScreen = true;
new IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting; }, { threshold: 0.2 }).observe(demo);
const tick = (ms) => new Promise((r) => setTimeout(r, ms));
async function wait(ms) {
while (ms > 0) {
await tick(50);
if (onScreen && !document.hidden) ms -= 50;
}
}
const nextFrame = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
function addMessage(kind, html) {
const m = document.createElement("div");
m.className = `m m--${kind}`;
m.innerHTML = `<div class="m__in">${html}</div>`;
thread.append(m);
while (thread.children.length > 12) thread.firstElementChild.remove();
const show = () => m.classList.add("is-in");
nextFrame().then(show); setTimeout(show, 120);
return m;
}
async function removeMessage(m) {
m.classList.remove("is-in");
await tick(420);
m.remove();
}
function hideOldReceipts() {
thread.querySelectorAll(".receipt:not(.is-gone)").forEach((r) => r.classList.add("is-gone"));
}
function run() {
addMessage("stamp", '<span class="stamp">Today 9:41 AM</span>');
enableChat();
}
const T = (label, reply, apply, next) => ({ label, reply, apply, next });
const hours = (t) => ({ k: "Hours", v: t });
const promo = (t) => ({ k: "Banner", v: t });
const services = (t) => ({ k: "Services", v: t });
const TREE = [
T("Can you add Saturday hours?", "Done!", hours("Mon–Fri 8–5 · Sat 9–2"), [
T("Actually, make it 10 to 3", "No problem!", hours("Mon–Fri 8–5 · Sat 10–3"), [
T("Perfect, thank you!", "Anytime!", null, null),
T("And we're closed July 4th", "Got it!", promo("Closed Friday, July 4th. Happy Fourth!"), null),
]),
T("Will Google show it too?", "Yep, Google too.", null, [
T("Wow, that was fast", "Took four minutes.", null, null),
T("Can we add a promo too?", "Got it!", promo("This month: 10% off drain cleaning"), null),
]),
]),
T("We do water heaters now", "Done!", services("Drains · Leak repair · Water heaters"), [
T("Can we run a deal on them?", "Got it!", promo("$50 off water heater installs this month"), [
T("Make it $75 off", "No problem!", promo("$75 off water heater installs this month"), null),
T("Love it, thanks!", "Anytime!", null, null),
]),
T("And take off leak repair?", "Done!", services("Drains · Water heaters"), [
T("Oops, put it back", "No problem!", services("Drains · Leak repair · Water heaters"), null),
T("Perfect, thanks!", "Anytime!", null, null),
]),
]),
];
function enableChat() {
const phone = demo.querySelector(".phone");
compose.classList.add("is-choices");
compose.replaceChildren();
phone.removeAttribute("aria-hidden");
let busy = false;
let cued = false;
const pickPanel = (opts, first) => {
const you = document.createElement("span");
you.className = "chat-you"; you.setAttribute("aria-hidden", "true"); you.textContent = "Suggested replies";
const tip = document.createElement("span");
tip.className = "chat-choices__tip"; tip.setAttribute("aria-hidden", "true");
tip.innerHTML = first ? '<b>↑</b> Choose a reply, <em>really.</em>' : "<b>↑</b> Choose a reply";
const panel = document.createElement("div");
panel.className = "chat-pick"; panel.setAttribute("role", "group"); panel.setAttribute("aria-label", "Choose a reply");
opts.forEach((o, i) => {
if (i && first) { const or = document.createElement("span"); or.className = "chat-pick__or"; or.textContent = "or"; panel.append(or); }
const b = document.createElement("button");
b.type = "button"; b.className = "chat-choice";
b.innerHTML = '<span class="chat-choice__text"></span>';
b.querySelector(".chat-choice__text").textContent = o.label;
b.addEventListener("click", () => pick(o));
panel.append(b);
});
return first ? [you, panel, tip] : [you, panel];
};
let morphing = null;
const morph = (fill) => {
if (morphing) morphing.cancel();
const from = compose.offsetHeight;
fill();
const to = compose.offsetHeight;
if (from === to) return Promise.resolve();
compose.style.overflow = "hidden";
const a = morphing = compose.animate([{ height: from + "px" }, { height: to + "px" }], { duration: 480, easing: EASE_OUT });
return a.finished.catch(() => {}).then(() => { if (morphing === a) { morphing = null; compose.style.overflow = ""; } });
};
const clearChoices = () => {
if (!compose.children.length) return Promise.resolve();
if (morphing) morphing.cancel();
const from = compose.offsetHeight;
compose.style.overflow = "hidden";
const a = morphing = compose.animate([{ height: from + "px", opacity: 1 }, { height: "0px", opacity: 0 }], { duration: 380, easing: EASE_OUT, fill: "forwards" });
return a.finished.catch(() => {}).then(() => {
if (morphing !== a) return;
compose.replaceChildren(); a.cancel(); morphing = null; compose.style.overflow = "";
});
};
const offer = (opts) => {
const first = !cued; cued = true;
morph(() => compose.replaceChildren(...pickPanel(opts, first)));
compose.querySelectorAll(".chat-you, .chat-choice, .chat-pick__or, .chat-choices__tip").forEach((el, i) => el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 320, delay: i * 70, easing: "ease-out", fill: "backwards" }));
if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
const btns = [...compose.querySelectorAll(".chat-choice")];
let stopped = false;
btns.forEach((b) => ["pointerenter", "pointerdown", "focus"].forEach((ev) => b.addEventListener(ev, () => { stopped = true; }, { once: true })));
const DANCE = 700, GAP = 620;
const round = (n) => {
if (stopped || n >= 3 || !btns[0].isConnected) return;
btns.forEach((b, i) => setTimeout(() => {
if (stopped || !b.isConnected) return;
b.animate([
{ transform: "none" },
{ transform: "translateY(-5px) rotate(-3deg)", offset: .2 },
{ transform: "translateY(0) rotate(2.5deg)", offset: .42 },
{ transform: "translateY(-3px) rotate(-1.5deg)", offset: .62 },
{ transform: "translateY(0) rotate(.8deg)", offset: .8 },
{ transform: "none" },
], { duration: DANCE, easing: "ease-in-out" });
}, i * GAP));
setTimeout(() => round(n + 1), (btns.length - 1) * GAP + DANCE + 3000);
};
setTimeout(() => round(0), 650);
}
};
const again = () => {
const b = document.createElement("button");
b.type = "button"; b.className = "chat-choice chat-choice--again"; b.textContent = "↺ Start Over";
b.addEventListener("click", restart);
morph(() => compose.replaceChildren(b));
b.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, fill: "backwards" });
};
async function pick(o) {
if (busy) return; busy = true;
clearChoices();
hideOldReceipts();
const sent = addMessage("them", '<div class="bubble"></div><div class="receipt"><span>Delivered</span></div>');
sent.querySelector(".bubble").textContent = o.label;
if (demo.classList.contains("is-intro")) { await tick(650); await handoff(); }
const receipt = sent.querySelector(".receipt span");
await tick(700); receipt.classList.add("is-hidden"); await tick(200); receipt.textContent = "Read"; receipt.classList.remove("is-hidden");
await tick(350);
const typing = addMessage("typing", '<div class="bubble"><i></i><i></i><i></i></div>');
await tick(1100);
await removeMessage(typing);
const r = addMessage("us", `<div class="bubble">${o.apply ? CHECK : ""}</div>`);
r.querySelector(".bubble").append(o.reply);
if (o.apply) {
await tick(450);
const card = document.createElement("div");
card.className = "lpv";
card.innerHTML = '<span class="lpv__site">yourwebsite.com</span><span class="lpv__row"><b></b> <mark></mark></span>';
card.querySelector("b").textContent = o.apply.k;
card.querySelector("mark").textContent = o.apply.v;
r.querySelector(".m__in").append(card);
card.animate([{ opacity: 0, transform: "translateY(6px) scale(.96)" }, { opacity: 1, transform: "none" }], { duration: 420, easing: EASE_OUT });
}
await tick(650);
if (o.next) offer(o.next); else again();
busy = false;
}
async function checkIn() {
await tick(500);
const typing = addMessage("typing", '<div class="bubble"><i></i><i></i><i></i></div>');
await tick(1100);
await removeMessage(typing);
addMessage("us", '<div class="bubble">Hey, just checking in :)</div>');
await tick(800);
}
let big = null, fromRow = null, extra = 0;
const small = () => innerWidth <= 640;
function fitSpace() {
if (!demo.classList.contains("is-intro")) return;
const top = thread.querySelector(".m--from, .m--us");
if (!top) return;
const over = demo.getBoundingClientRect().top + 4 - top.getBoundingClientRect().top;
if (over > 0) { extra += Math.ceil(over); big = fitBig(); }
}
const fitBig = () => {
phone.style.transform = phone.style.width = phone.style.height = "";
let P = phone.getBoundingClientRect(), D = demo.getBoundingClientRect();
const norm = { w: phone.offsetWidth, h: phone.offsetHeight };
const T = thread.getBoundingClientRect(), inset = (P.width - T.width) / 2 + 4;
const K = innerWidth <= 760 ? Math.min(1.5, D.width / (P.width - 2 * inset)) : Math.min(2.2, (D.width * .98) / P.width);
demo.style.minHeight = innerWidth <= 760 ? Math.round(156 * K + 30 + extra) + "px" : "";
D = demo.getBoundingClientRect();
if (small()) { phone.style.width = (D.width + 16) / K + "px"; phone.style.height = (D.height + 6) / K + "px"; }
P = phone.getBoundingClientRect();
const below = innerWidth <= 760 && !small() ? (P.bottom - compose.getBoundingClientRect().bottom) * K : 0;
const dx = D.left + D.width / 2 - (P.left + P.width / 2);
const cy = P.top + P.height / 2, target = small() ? D.bottom + 3 : D.bottom - (innerWidth <= 760 ? 16 - below : 6);
const dy = target - (cy + (P.height / 2) * K);
phone.style.transform = `translate(${dx}px, ${dy}px) scale(${K})`;
return { dx, dy, K, norm };
};
async function handoff() {
const SLOW = +new URLSearchParams(location.search).get("slowmo") || 1;
if (fromRow) fromRow.classList.remove("is-in");
demo.classList.remove("is-bare");
const { dx, dy, K, norm } = big;
let move;
if (small()) {
const from = { width: phone.style.width, height: phone.style.height, transform: phone.style.transform };
move = phone.animate([from, { width: norm.w + "px", height: norm.h + "px", transform: "none" }], { duration: 820 * SLOW, easing: "cubic-bezier(.65, 0, .25, 1)" });
phone.style.width = phone.style.height = "";
} else {
const ease = (u) => 1 - Math.pow(1 - u, 3);
const swing = Math.min(150, Math.max(90, Math.abs(dx) * .85));
const frames = [];
for (let n = 0; n <= 48; n++) {
const e = ease(n / 48);
frames.push({ transform: `translate(${dx * (1 - e) - swing * Math.sin(Math.PI * e) * (1 - e * .4)}px, ${dy * (1 - e)}px) scale(${K + (1 - K) * e})` });
}
move = phone.animate(frames, { duration: 900 * SLOW, easing: "linear" });
}
phone.style.transform = "";
const h0 = demo.offsetHeight;
demo.classList.remove("is-intro");
demo.style.minHeight = "";
const h1 = demo.offsetHeight;
if (h1 !== h0) demo.animate([{ height: h0 + "px" }, { height: h1 + "px" }], { duration: 820 * SLOW, easing: "cubic-bezier(.65, 0, .25, 1)" });
await move.finished.catch(() => {});
if (fromRow) { fromRow.remove(); fromRow = null; }
}
async function restart() {
if (busy) return; busy = true;
await demo.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 380, easing: "ease-in", fill: "forwards" }).finished.catch(() => {});
if (morphing) { morphing.cancel(); morphing = null; }
compose.replaceChildren(); compose.style.overflow = "";
thread.replaceChildren();
addMessage("stamp", '<span class="stamp">Today 9:41 AM</span>');
cued = false;
demo.classList.add("is-intro", "is-bare");
big = fitBig();
fromRow = addMessage("from", '<span class="chat-from"><img src="images/favicon.jpg" alt=""><span><strong>Web Design Wife</strong></span></span>');
demo.getAnimations().forEach((x) => { if (x.effect && x.effect.target === demo) x.cancel(); });
demo.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 420, easing: "ease-out" });
await checkIn(); offer(TREE); busy = false; setTimeout(fitSpace, 560);
}
busy = true;
demo.classList.add("is-intro", "is-bare");
big = fitBig();
let lastW = innerWidth;
addEventListener("resize", () => { if (innerWidth !== lastW && demo.classList.contains("is-intro")) { lastW = innerWidth; big = fitBig(); } });
fromRow = addMessage("from", '<span class="chat-from"><img src="images/favicon.jpg" alt=""><span><strong>Web Design Wife</strong></span></span>');
checkIn().then(() => { offer(TREE); busy = false; setTimeout(fitSpace, 560); });
}
run();
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
const dialog = document.getElementById("finder-dialog");
const form = document.getElementById("finder-form");
if (!dialog || !form) return;
const steps = [...form.querySelectorAll("[data-step]")];
const stepper = [...dialog.querySelectorAll(".stepper li")];
const back = document.getElementById("finder-back");
const restart = document.getElementById("finder-restart");
const othersToggle = document.getElementById("finder-others-toggle");
const others = document.getElementById("finder-others");
const PLANS = [
{ id: "plan-simple", name: "Essentials", price: window.WDW_PLANS.essentials.month, why: "Everything a small business needs on one polished page, set up remotely.",
feats: ["One scrolling page", "Remote kickoff, with your own photos", "Google Maps kept up to date", "Unlimited minor edits"] },
{ id: "plan-business", name: "Business", price: window.WDW_PLANS.business.month, why: "I come to your business, then build a full site that helps nearby customers find you.",
feats: ["In-person kickoff + original business photography", "Up to 5 pages", "Google Maps growth and review routine", "Live Google reviews and Instagram feed"] },
{ id: "plan-full", name: "Full Suite", price: window.WDW_PLANS.full.month, why: "Everything in Business, plus tools that keep bringing in new customers.",
feats: ["In-person kickoff + original business photography", "Up to 10 pages", "AI chat assistant", "Neighborhood SEO pages and a monthly blog post"] },
];
let current = 0;
function show(i) {
current = i;
steps.forEach((el, n) => { el.hidden = n !== i; });
stepper.forEach((li, n) => {
li.classList.toggle("is-current", n === i);
li.classList.toggle("is-done", n < i);
});
back.hidden = i === 0 || i === 3;
stepper.forEach((li, n) => {
const done = n < i;
li.tabIndex = done ? 0 : -1;
if (done) li.setAttribute("role", "button"); else li.removeAttribute("role");
});
const focusable = steps[i].querySelector("input:checked, input, button");
if (focusable) focusable.focus({ preventScroll: true });
}
const answer = (n) => Number((form.querySelector(`input[name="${n}"]:checked`) || { value: 0 }).value);
const recommended = () => PLANS[Math.max(answer("pages"), answer("maps"), answer("extras"))];
function renderResult() {
const plan = recommended();
document.getElementById("finder-plan").textContent = plan.name;
document.getElementById("finder-why").textContent = plan.why;
document.getElementById("finder-price").innerHTML = `<span>$${plan.price}</span>/month`;
document.getElementById("finder-feats").innerHTML = plan.feats.map((f) => `<li>${f}</li>`).join("");
document.getElementById("finder-apply").textContent = `Choose ${plan.name}`;
others.innerHTML = PLANS.filter((p) => p !== plan).map((p) => `
      <div class="finder__other">
        <div><strong>${p.name}</strong><span>${p.why}</span></div>
        <p><b>$${p.price}</b>/mo</p>
        <button type="button" class="btn btn--ghost btn--sm" data-pick="${p.id}">Choose</button>
      </div>`).join("");
others.hidden = true;
othersToggle.setAttribute("aria-expanded", "false");
othersToggle.textContent = "View Other Plans";
}
let advance;
const next = () => {
clearTimeout(advance);
advance = setTimeout(() => {
if (current < 2) show(current + 1);
else { renderResult(); show(3); }
}, 0);
};
form.addEventListener("change", next);
form.addEventListener("click", (e) => { if (e.target.matches('input[type="radio"]')) next(); });
back.addEventListener("click", () => show(Math.max(0, current - 1)));
stepper.forEach((li, n) => {
const go = () => { if (n < current) show(n); };
li.addEventListener("click", go);
li.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
});
restart.addEventListener("click", () => { form.reset(); show(0); });
othersToggle.addEventListener("click", () => {
const open = others.hidden;
others.hidden = !open;
othersToggle.setAttribute("aria-expanded", String(open));
othersToggle.textContent = open ? "Hide Other Plans" : "View Other Plans";
});
function choose(planId) {
dialog.close();
document.querySelectorAll(".plan, .hplan").forEach((card) => {
const on = card.id === planId;
card.classList.toggle("is-recommended", on);
const badge = card.querySelector(".plan__rec, .hplan__rec");
if (badge) badge.hidden = !on;
});
setTimeout(() => document.getElementById(planId).scrollIntoView({ block: "center" }), 150);
}
document.getElementById("finder-apply").addEventListener("click", () => choose(recommended().id));
others.addEventListener("click", (e) => { const b = e.target.closest("[data-pick]"); if (b) choose(b.dataset.pick); });
document.addEventListener("click", (e) => {
if (e.target.closest("[data-open-finder]")) { e.preventDefault(); form.reset(); openSheet(dialog); show(0); }
if (e.target.closest("[data-close-finder]")) dialog.close();
});
dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });
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
(function () {
const hearts = document.querySelector(".hearts");
if (!hearts || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
let inView = false;
function check() {
const r = hearts.getBoundingClientRect();
const now = r.top < window.innerHeight * 0.75 && r.bottom > window.innerHeight * 0.1;
if (now && !inView) {
hearts.classList.remove("is-bursting");
void hearts.offsetWidth;
hearts.classList.add("is-bursting");
}
inView = now;
}
window.addEventListener("scroll", () => setTimeout(check, 60), { passive: true });
check();
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
document.querySelectorAll(".ba").forEach((ba) => {
const range = ba.querySelector(".ba__range");
if (range) range.addEventListener("input", () => ba.style.setProperty("--pos", range.value + "%"));
});
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
(function () {
const sec = document.getElementById("moods-tv");
if (!sec) return;
const root = document.documentElement;
const NAMES = { tangy: "Tangy", calm: "Calm", transit: "Transit", sophisticated: "Soirée" };
const keys = [...sec.querySelectorAll("[data-tv-key]")];
const show = sec.querySelector("[data-tv-show]");
const nameEl = sec.querySelector("[data-tv-name]");
const screen = sec.querySelector(".tv__screen");
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
let playing = null;
const eyebrow = sec.querySelector("[data-tv-eyebrow]");
let powerTimer = 0;
const play = (key, power) => {
if (eyebrow) eyebrow.textContent = NAMES[key === "transitdark" ? "transit" : key] || eyebrow.textContent;
if (key === "transitdark") key = "transit";
if (key === playing || !NAMES[key]) return;
playing = key;
keys.forEach((k) => k.setAttribute("aria-pressed", String(k.dataset.tvKey === key)));
show.dataset.tvShow = key;
nameEl.textContent = NAMES[key];
if (reduce) return;
clearTimeout(powerTimer);
screen.classList.remove("is-on", "is-powering", "is-off");
void screen.offsetWidth;
if (!power) { screen.classList.add("is-on"); return; }
screen.classList.add("is-off");
powerTimer = setTimeout(() => {
screen.classList.remove("is-off"); void screen.offsetWidth; screen.classList.add("is-powering");
if (window.wdwTvOn) window.wdwTvOn();
}, 300);
};
const press = (k) => {
play(k.dataset.tvKey, true); if (window.wdwSetMood) window.wdwSetMood(k.dataset.tvKey, k);
};
sec.addEventListener("click", (e) => { const k = e.target.closest("[data-tv-key]"); if (k) press(k); });
let lastMood = root.dataset.mood;
new MutationObserver(() => { if (root.dataset.mood === lastMood) return; lastMood = root.dataset.mood; play(lastMood); })
.observe(root, { attributes: true, attributeFilter: ["data-mood"] });
play(root.dataset.mood || "tangy");
const card = sec.querySelector("[data-tv-yours]");
if (card) {
const front = card.querySelector(".tv-yours__front"), back = card.querySelector(".tv-yours__back");
const flip = (open) => {
front.setAttribute("aria-expanded", String(open));
if (open) back.hidden = false;
card.classList.toggle("is-flipped", open);
if (window.wdwSwoosh) window.wdwSwoosh();
if (!open) setTimeout(() => { if (!card.classList.contains("is-flipped")) back.hidden = true; }, reduce ? 0 : 600);
(open ? back.querySelector("a") : front).focus({ preventScroll: true });
};
front.addEventListener("click", () => flip(true));
card.querySelector(".tv-yours__close").addEventListener("click", () => flip(false));
}
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
(() => {
const top = document.querySelector("#moods-tv .tv-deck__top");
const cue = top && top.querySelector(".tv-deck__cue");
const sound = top && top.querySelector(".sound-toggle");
if (!cue || !sound) return;
const fit = () => {
top.classList.remove("is-tight");
if (sound.offsetTop > cue.offsetTop + cue.offsetHeight / 2 || cue.getClientRects().length > 1 || cue.offsetHeight > sound.offsetHeight * 1.8) top.classList.add("is-tight");
};
let w = 0;
new ResizeObserver(() => { if (top.parentElement.clientWidth !== w) { w = top.parentElement.clientWidth; fit(); } }).observe(top.parentElement);
new MutationObserver(fit).observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
if (document.fonts) document.fonts.ready.then(fit);
})();
document.querySelectorAll(".for--spin .slot.tick").forEach((slot) => {
const band = slot.closest(".for--spin"), btn = slot.querySelector(".drift__btn") || band.querySelector(".bf-spin"), msg = slot.querySelector(".jackpot"), hand = band.querySelector(".pokehand");
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const VERBS = ["Built", "Designed", "Developed", "Crafted", "Launched", "Managed", "Made", "Polished"];
const TYPES = ["Plumbers", "Salons", "Barbers", "Dentists", "Restaurants", "Contractors", "Cleaners", "Gyms", "Accountants", "Bakeries", "Florists", "Pharmacies", "Law Offices", "Auto Shops"];
const HOODS = ["Bushwick", "Park Slope", "Astoria", "Harlem", "Flushing", "Williamsburg", "Jackson Heights", "Bay Ridge", "The Bronx", "Chelsea", "Fort Greene", "St. George", "Crown Heights", "Long Island City"];
const LISTS = [VERBS, TYPES, HOODS], LOOPS = 12;
const wordsHTML = (items) => Array.from({ length: LOOPS }, () => items.map((t) => `<li><span>${t}</span></li>`).join("")).join("");
const reels = [...slot.querySelectorAll(".treel")].map((reel, k) => {
const items = LISTS[k], ul = reel.querySelector("ul"), n = items.length;
ul.innerHTML = wordsHTML(items);
return { k, reel, ul, items, n, dir: reel.dataset.dir === "down" ? -1 : 1, pos: n * 6 + (k === 1 ? 5 : 0) };
});
const horizMQ = matchMedia("(max-width: 0px)"), horiz = () => false;
const size = () => {
const widths = reels.map((r) => {
const probe = document.createElement("li"); probe.style.cssText = "position:absolute;visibility:hidden;width:auto;padding:0 .5em"; r.ul.appendChild(probe);
let w = 0; r.items.forEach((t) => { probe.textContent = t; w = Math.max(w, probe.getBoundingClientRect().width); }); probe.remove();
return Math.ceil(w);
});
const same = Math.max(...widths);
reels.forEach((r, k) => {
r.reel.style.width = horiz() ? "" : widths[k] + 2 + "px";
r.reel.style.setProperty("--fw", (horiz() ? same : widths[k]) + 4 + "px");
if (!(performance.now() < r.until)) show(r, 0);
});
};
horizMQ.addEventListener("change", () => setTimeout(() => { size(); fit(); }, 30));
const row = (r) => r.ul.firstElementChild.getBoundingClientRect()[horiz() ? "width" : "height"];
const show = (r, ms, ease) => {
r.until = ms ? performance.now() + ms : 0;
r.ul.style.transition = ms ? `transform ${ms}ms ${ease}, filter .45s ease-out` : "filter .45s ease-out";
r.ul.style.transform = horiz()
? `translateX(${-r.pos * row(r) + (r.reel.clientWidth - row(r)) / 2}px)`
: `translateY(${-(r.pos - peek()) * row(r)}px)`;
if (horiz()) huddle(r, ms);
};
const huddle = (r, ms) => {
const lis = r.ul.children, at = Math.round(r.pos), W = row(r), GAP = 14;
for (let i = Math.max(0, at - 3); i <= Math.min(lis.length - 1, at + 3); i++) {
const sp = lis[i].firstElementChild; if (!sp || sp.tagName !== "SPAN") continue;
const shift = i === at ? 0 : Math.max(0, (W - sp.offsetWidth) / 2 - GAP) * (i < at ? 1 : -1);
sp.style.transition = ms ? `transform ${ms}ms ease` : "none";
sp.style.transform = shift ? `translateX(${shift}px)` : "";
}
};
const peek = () => parseFloat(getComputedStyle(slot).getPropertyValue("--peek")) || .75;
const idx = (r) => ((Math.round(r.pos) % r.n) + r.n) % r.n;
const recentre = (r) => { r.pos = r.n * 6 + idx(r); };
const wrap = slot.parentElement, sound = wrap.querySelector(".bf-sound");
const fit = () => {
if (!sound) return;
wrap.classList.remove("is-tight");
const kids = [...slot.children].filter((c) => c.offsetParent && !c.classList.contains("jackpot") && !c.classList.contains("confetti"));
const right = Math.max(...kids.map((c) => c.getBoundingClientRect().right));
if (right + 16 > sound.getBoundingClientRect().left) wrap.classList.add("is-tight");
};
const phoneMQ = matchMedia("(max-width: 600px)");
const shrink = () => {
slot.style.fontSize = "";
if (!phoneMQ.matches) return;
size();
const kids = [...slot.children].filter((c) => c.classList.contains("treel") || c.classList.contains("slot__word"));
const need = kids.reduce((w, c) => w + c.getBoundingClientRect().width, 0) + parseFloat(getComputedStyle(slot).columnGap || 0) * (kids.length - 1);
const room = slot.clientWidth - 8;
if (need > room) { slot.style.fontSize = (parseFloat(getComputedStyle(slot).fontSize) * room / need) + "px"; }
};
const sizeAll = () => { shrink(); size(); fit(); };
let lastW = innerWidth;
const widthChanged = () => { if (innerWidth === lastW) return false; lastW = innerWidth; return true; };
addEventListener("resize", () => { if (widthChanged()) { shrink(); size(); } });
sizeAll();
if (document.fonts) document.fonts.ready.then(sizeAll);
addEventListener("resize", fit);
let lastMood = document.documentElement.className;
new MutationObserver(() => {
const now = document.documentElement.className;
if (now === lastMood) return; lastMood = now;
setTimeout(sizeAll, 60);
if (document.fonts) document.fonts.ready.then(() => setTimeout(sizeAll, 30));
setTimeout(sizeAll, 450);
}).observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
let drifting = true, spins = 0, youSpun = false;
const hero = document.querySelector(".hero .phone");
let overHero = false, heroTouch = 0;
if (hero) {
hero.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") overHero = true; });
hero.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") overHero = false; });
hero.addEventListener("pointerdown", () => { heroTouch = performance.now(); });
hero.addEventListener("focusin", () => { heroTouch = performance.now(); });
}
const heroBusy = () => overHero || performance.now() - heroTouch < 8000;
const BRAND = ["Web", "Design", "Wife"];
const links = [slot.querySelector(".slot__word--for"), slot.querySelector(".slot__word--in")];
const away = [false, false];
const travel = (i) => -reels[i].dir * row(reels[i]);
const linkAway = (i) => {
if (away[i] || !links[i]) return; away[i] = true;
links[i].animate([{ transform: "none", opacity: 1 }, { transform: `translateY(${travel(i)}px)`, opacity: 0 }], { duration: reduce ? 0 : 420, easing: "cubic-bezier(.5,0,.75,0)", fill: "forwards" });
};
const linkBack = (i, ms = GLIDE) => {
if (!away[i] || !links[i]) return; away[i] = false;
links[i].animate([{ transform: `translateY(${-travel(i)}px)`, opacity: 0 }, { transform: "none", opacity: 1 }], { duration: reduce ? 0 : ms, easing: CLICK, fill: "forwards" });
};
const STEP = 9000, GLIDE = 1600, CLICK = "cubic-bezier(.34,1.45,.55,1)";
const step = (r) => {
if (!drifting || reduce || document.hidden || heroBusy()) return;
recentre(r); show(r, 0); void r.ul.offsetWidth;
r.pos += r.dir; show(r, GLIDE, CLICK);
if (r.keep != null) {
const at = r.keep, gen = spins; r.keep = null;
setTimeout(() => { const li = r.ul.children[at]; if (gen === spins && li) li.outerHTML = `<li><span>${r.items[((at % r.n) + r.n) % r.n]}</span></li>`; }, GLIDE + 40);
}
setTimeout(() => { r.reel.classList.add("is-click"); setTimeout(() => r.reel.classList.remove("is-click"), 120); }, GLIDE * .6);
};
let ticks = [];
const startTicking = (delay) => {
ticks.forEach(clearTimeout); ticks.forEach(clearInterval); ticks = [];
reels.forEach((r, k) => ticks.push(setTimeout(() => { step(r); ticks.push(setInterval(() => step(r), STEP)); }, delay + k * STEP / 3)));
};
startTicking(900);
const moveOn = (plans, gen) => {
plans.forEach(({ r, to, toAt }) => {
r.pos = toAt; show(r, GLIDE, CLICK);
setTimeout(() => { r.reel.classList.add("is-click"); setTimeout(() => r.reel.classList.remove("is-click"), 120); }, GLIDE * .6);
setTimeout(() => {
if (gen !== spins) return;
const brand = r.ul.children[r.dir > 0 ? toAt - 1 : toAt + 1]?.outerHTML;
r.reel.classList.remove("is-win"); r.ul.innerHTML = wordsHTML(r.items); r.pos = r.n * 6 + to; show(r, 0);
const at = r.pos - r.dir, li = r.ul.children[at];
if (brand && li) { li.outerHTML = brand; r.keep = at; }
}, GLIDE + 40);
});
linkBack(0); linkBack(1);
setTimeout(() => { if (gen !== spins) return; drifting = true; startTicking(STEP * .5); }, GLIDE + 60);
};
const confetti = () => {
const box = slot.getBoundingClientRect(), COLS = ["#ff4fa6", "#d4ff4f", "#9fd8ff", "#ffe27a", "#ff7d33", "#b6f5c8"];
reels.forEach((r) => {
const f = r.reel.querySelector(".treel__frame").getBoundingClientRect();
for (let i = 0; i < 12; i++) {
const c = document.createElement("i"); c.className = "confetti";
c.style.left = (f.left - box.left + f.width / 2) + "px"; c.style.top = (f.top - box.top + f.height / 2) + "px"; c.style.background = COLS[i % COLS.length];
const a = Math.random() * Math.PI * 2, d = 45 + Math.random() * 70;
c.style.setProperty("--dx", Math.cos(a) * d + "px"); c.style.setProperty("--dy", Math.sin(a) * d - 20 + "px"); c.style.setProperty("--rot", (Math.random() * 720 - 360) + "deg");
slot.appendChild(c); setTimeout(() => c.remove(), 1200);
}
});
};
const LABELS = ["Spin", "Spin Again", "Once More?", "Okay, Again", "Try Me", "LOL, Again", "You're Hooked", "Still Going?!", "One More…", "Last One!!", "You Won!", "Go Again"];
const PERKS = [
["No", "Logins", "Needed"], ["No", "Dashboards", "To Learn"], ["Change", "Hours", "Anytime"], ["New", "Hire?", "Added"],
["New", "Number?", "Updated"], ["Holiday", "Hours?", "Done"], ["Menu", "Changed?", "Handled"], ["Prices", "Updated", "Quickly"],
["New", "Photos?", "Swapped"], ["Just", "Text", "Me"], ["Edits", "In One", "Business Day"], ["Google", "Maps", "Handled"],
["A Real", "Person", "Replies"], ["Minor", "Edits", "Included"], ["Hosting", "Fully", "Included"], ["Your", "Domain,", "Yours"],
["Looks", "Great", "On Phones"], ["No", "Plugins", "To Update"], ["More", "Time", "For You"], ["Your", "Site,", "Handled"],
];
const FINALE = ["Web", "Design", "Wife"];
let perkBag = [];
const nextPerk = () => {
if (!perkBag.length) perkBag = PERKS.slice().sort(() => Math.random() - .5);
return perkBag.pop();
};
let level = 0;
if (btn.classList.contains("bf-spin")) {
btn.innerHTML = LABELS.map((t, i) => `<span class="bf-spin__l" data-l="${i}"${i ? ' aria-hidden="true"' : ""}>${t}</span>`).join("");
}
const setLabel = (i) => {
if (!btn.classList.contains("bf-spin")) return;
btn.querySelectorAll(".bf-spin__l").forEach((el) => {
const on = +el.dataset.l === i;
el.classList.toggle("is-on", on);
if (on) el.removeAttribute("aria-hidden"); else el.setAttribute("aria-hidden", "true");
});
btn.style.setProperty("--wild", Math.min(i, 9));
btn.classList.remove("is-new"); void btn.offsetWidth; btn.classList.add("is-new");
};
setLabel(0);
const bumpLabel = () => {
level = level >= 10 ? 1 : level + 1;
setLabel(level);
return level;
};
const megaParty = () => {
if (reduce) return;
band.classList.remove("is-jackpot"); void band.offsetWidth; band.classList.add("is-jackpot");
setTimeout(() => band.classList.remove("is-jackpot"), 1600);
const root = document.documentElement, mood = root.classList.contains("theme-subway") ? "transit" : root.classList.contains("theme-refined") ? "calm" : root.classList.contains("theme-wedding") ? "soiree" : "tangy";
const SETS = {
tangy: ["#ff4fa6", "#d4ff4f", "#9fd8ff", "#ffe27a", "#ff7d33", "#b6f5c8"],
calm: ["#5b3df5", "#8b74ff", "#c9bdff", "#e3defa", "#b4abe6"],
transit: ["#ee352e", "#ff6319", "#fccc0a", "#00933c", "#0039a6", "#b933ad"],
soiree: ["#b8955a", "#d9c49a", "#e9d9b4", "#fffdf8", "#a2741f"],
};
const cols = SETS[mood], count = mood === "calm" ? 90 : 140;
for (let i = 0; i < count; i++) {
const c = document.createElement("i"); c.className = `bf-rain bf-rain--${mood}`;
if (mood === "transit" && i % 4 === 0) c.classList.add("is-strip");
c.style.left = Math.random() * 100 + "vw"; c.style.background = cols[i % cols.length];
const slow = mood === "calm" || mood === "soiree";
c.style.setProperty("--fall", ((slow ? 2.8 : 1.8) + Math.random() * 1.6) + "s"); c.style.setProperty("--delay", (Math.random() * (slow ? 1.2 : .8)) + "s");
c.style.setProperty("--drift", (Math.random() * (slow ? 260 : 160) - (slow ? 130 : 80)) + "px"); c.style.setProperty("--spin", (Math.random() * 1080 - 540) + "deg");
document.body.appendChild(c); setTimeout(() => c.remove(), 5600);
}
};
btn.addEventListener("click", () => {
const gen = ++spins; drifting = false; msg.classList.remove("is-on");
const win = btn.dataset.byHand !== "1";
if (win) youSpun = true;
const tier = win ? bumpLabel() : 0, jackpot = tier === 10;
if (win) { linkAway(0); linkAway(1); }
const brandNow = !win ? BRAND : jackpot ? FINALE : nextPerk();
const LEN = 24, plans = [];
reels.forEach((r, k) => {
const n = r.n; r.keep = null; r.reel.classList.remove("is-win");
const R = row(r), ty = new DOMMatrixReadOnly(getComputedStyle(r.ul).transform).m42;
const now = -ty / R + peek(), at0 = Math.max(1, Math.min(r.ul.children.length - 2, Math.round(now))), frac = now - at0;
const cur = r.ul.children[at0].outerHTML, prev = r.ul.children[at0 - r.dir].outerHTML;
let to; do { to = Math.floor(Math.random() * n); } while (n > 1 && r.ul.children[at0].textContent === r.items[to]);
const word = (i) => `<li><span>${r.items[((i % n) + n) % n]}</span></li>`;
const seq = [prev, cur];
for (let i = 0; i < LEN; i++) seq.push(word(Math.floor(Math.random() * n)));
const symAt = seq.length; if (win) seq.push(`<li class="bf-brand"><span>${brandNow[k]}</span></li>`); else seq.push(word(to - r.dir));
const toAt = seq.length; seq.push(word(to), word(to + r.dir), word(to + 2 * r.dir));
const L = seq.length, items = r.dir > 0 ? seq : seq.slice().reverse(), at = (i) => (r.dir > 0 ? i : L - 1 - i);
r.ul.innerHTML = items.join("");
r.pos = at(1) + frac; show(r, 0); void r.ul.offsetWidth;
const ms = reduce ? 0 : 1300 + k * 350;
r.reel.classList.add("is-spinning"); r.pos = at(win ? symAt : toAt); show(r, ms, "cubic-bezier(.15,.85,.25,1.06)");
setTimeout(() => { if (gen === spins) r.reel.classList.remove("is-spinning"); }, ms * .45);
plans.push({ r, to, toAt: at(toAt) });
});
const land = reduce ? 0 : 1300 + 2 * 350 + 40;
const later = (fn, ms) => setTimeout(() => { if (gen === spins) fn(); }, ms);
if (win) later(() => {
reels.forEach((r) => { r.reel.classList.remove("is-win"); void r.reel.offsetWidth; r.reel.classList.add("is-win"); });
confetti();
if (jackpot) megaParty();
}, land);
if (jackpot) {
btn.disabled = true;
later(() => { btn.disabled = false; setLabel(11); }, land + 3600 + GLIDE + 200);
}
if (win) {
later(() => { msg.classList.remove("is-on"); moveOn(plans, gen); }, land + (jackpot ? 3600 : 1600));
} else {
later(() => { plans.forEach(({ r, to }) => { r.ul.innerHTML = wordsHTML(r.items); r.pos = r.n * 6 + to; show(r, 0); }); linkBack(0, 500); linkBack(1, 500); drifting = true; }, land + 60);
}
});
if (!band.classList.contains("for--b")) band.addEventListener("click", (e) => { if (phoneMQ.matches && !e.target.closest(".drift__btn, a")) btn.click(); });
const lever = band.querySelector(".bf-lever");
if (lever) {
const knob = lever.querySelector(".bf-lever__knob"), stick = lever.querySelector(".bf-lever__stick");
const TOP = 2, PIVOT = 78, MAX = 56, FIRE = 32, R = 14;
let pull = 0, startY = 0, dragging = false, fired = false;
const draw = () => { const ky = TOP + pull; knob.style.top = ky + "px"; const a = Math.min(ky + R, PIVOT), b = Math.max(ky + R, PIVOT); stick.style.top = a + "px"; stick.style.height = Math.max(4, b - a) + "px"; };
const back = () => { lever.classList.add("is-back"); pull = 0; draw(); setTimeout(() => lever.classList.remove("is-back"), 520); };
const fire = () => { if (fired) return; fired = true; btn.click(); };
draw();
lever.addEventListener("pointerdown", (e) => { dragging = true; fired = false; startY = e.clientY; lever.setPointerCapture(e.pointerId); lever.classList.remove("is-back"); e.preventDefault(); });
lever.addEventListener("pointermove", (e) => { if (!dragging) return; pull = Math.max(0, Math.min(MAX, e.clientY - startY)); draw(); if (pull >= FIRE) fire(); });
const up = () => { if (!dragging) return; dragging = false; if (!fired) { pull = MAX; draw(); setTimeout(() => { fire(); back(); }, 200); } else back(); };
lever.addEventListener("pointerup", up); lever.addEventListener("pointercancel", () => { dragging = false; back(); });
}
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const target = () => (btn.offsetParent ? btn : slot.querySelector(".treel--biz .treel__frame"));
const aim = () => {
const b = band.getBoundingClientRect(), r = target().getBoundingClientRect(), side = !!btn.offsetParent;
hand.classList.toggle("from-right", side); hand.classList.remove("from-corner");
if (side) {
const tipX = r.right - b.left - 6, tipY = r.top - b.top + r.height / 2;
hand.style.setProperty("--hx", (tipX + 126 - 22) + "px");
hand.style.setProperty("--hy", (tipY - 130) + "px");
hand.style.setProperty("--hxo", (b.width + 150) + "px");
} else {
hand.classList.add("from-corner");
const H = hand.offsetHeight, w = hand.offsetWidth;
const cx = r.left - b.left + r.width * .62, cy = r.top - b.top + r.height * .4;
hand.style.setProperty("--hx", (cx - w / 2 + .866 * H) + "px");
hand.style.setProperty("--hy", (cy - b.height - .5 * H) + "px");
}
};
async function poke() {
if (reduce || document.hidden || !drifting || youSpun) return;
hand.style.transition = "none"; aim(); void hand.offsetWidth; hand.style.transition = "";
hand.classList.remove("is-leave"); hand.classList.add("is-up", "is-hover"); await wait(380);
await wait(900 + Math.random() * 700);
hand.classList.remove("is-hover"); hand.classList.add("is-press"); btn.classList.add("is-down");
const tapped = btn.offsetParent ? null : slot.querySelector(".treel--biz");
if (tapped) { tapped.classList.add("is-click"); setTimeout(() => tapped.classList.remove("is-click"), 140); }
btn.dataset.byHand = "1"; btn.click(); delete btn.dataset.byHand; await wait(110);
hand.classList.remove("is-press"); btn.classList.remove("is-down"); await wait(140);
hand.classList.add("is-leave"); hand.classList.remove("is-up"); await wait(240);
hand.classList.remove("is-leave");
}
reels.forEach((r) => r.reel.addEventListener("click", () => {
r.reel.classList.add("is-click"); setTimeout(() => r.reel.classList.remove("is-click"), 140);
btn.click();
}));
const next = () => setTimeout(async () => { if (youSpun) return; await poke(); next(); }, 8000 + Math.random() * 8000);
const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { io.disconnect(); setTimeout(async () => { await poke(); next(); }, 3000); } }, { threshold: .6 });
if (hand) io.observe(band);
});
(() => {
const dialog = document.getElementById("plans-dialog");
if (!dialog || !dialog.show) return;
document.addEventListener("click", (e) => {
const a = e.target.closest('a[href="start.html"]');
if (!a || dialog.contains(a) || e.metaKey || e.ctrlKey) return;
e.preventDefault(); openSheet(dialog);
});
dialog.querySelector("[data-close-plans]").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });
})();
(() => {
const dialog = document.getElementById("btype-dialog");
if (!dialog || !dialog.show) return;
document.querySelectorAll(".bf-actions__more").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); openSheet(dialog); }));
dialog.querySelector("[data-close-btype]").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });
if (location.hash === "#business") {
const band = document.querySelector(".for--spin");
if (band) band.scrollIntoView({ block: "center", behavior: "instant" });
openSheet(dialog);
history.replaceState(null, "", location.pathname + location.search);
}
})();
(function () {
try {
const saved = JSON.parse(localStorage.getItem("wdw-start") || "null");
if (saved && !(Date.now() - saved.t < 7 * 24 * 60 * 60 * 1000)) localStorage.removeItem("wdw-start");
} catch (e) {}
})();
