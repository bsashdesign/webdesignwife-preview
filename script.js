// ---------------------------------------------------------------
// Hero demo: a client messages a change, the site updates live.
// ---------------------------------------------------------------
(function () {
  const demo = document.getElementById("demo");
  const thread = document.getElementById("thread");
  if (!demo || !thread) return;

  const compose = demo.querySelector(".phone__compose");
  const live = document.getElementById("live");
  const liveText = live.querySelector(".live__text");
  const banner = document.getElementById("slot-banner");
  const rows = {
    hours: document.getElementById("row-hours"),
    services: document.getElementById("row-services"),
  };
  const initial = {
    hours: rows.hours.querySelector(".val").textContent,
    services: rows.services.querySelector(".val").textContent,
  };

  const EASE_OUT = "cubic-bezier(.22, 1, .36, 1)";
  const CHECK = '<span class="bubble__check"><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 6.4l2.3 2.3 4.7-5" fill="none" stroke="#5b3df5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';

  const steps = [
    {
      ask: "Hi! Can you add Saturday hours, 9 to 2?",
      reply: "Done. It's live on your site.",
      apply: () => swapValue(rows.hours, "Mon–Fri 8–5 · Sat 9–2"),
    },
    {
      ask: "We install tankless water heaters now",
      reply: "Added to your services.",
      apply: () => swapValue(rows.services, "Drains · Leak repair · Water heaters"),
    },
    {
      ask: "Can we run 10% off heater installs in July?",
      reply: "Your promo banner is up.",
      apply: () => banner.classList.add("is-open"),
    },
  ];

  // ---- Timing: waits only count down while the demo is on screen and the tab is visible.
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

  // ---- Thread helpers
  function addMessage(kind, html) {
    const m = document.createElement("div");
    m.className = `m m--${kind}`;
    m.innerHTML = `<div class="m__in">${html}</div>`;
    thread.append(m);
    // Drop messages that have scrolled far out of view.
    while (thread.children.length > 12) thread.firstElementChild.remove();
    nextFrame().then(() => m.classList.add("is-in"));
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

  async function typeIntoCompose(text) {
    compose.classList.add("is-typing");
    compose.innerHTML = '<span class="compose__text"></span><span class="caret"></span>';
    const out = compose.querySelector(".compose__text");
    for (const ch of text) {
      out.textContent += ch;
      await wait(ch === " " ? 55 : 32 + Math.random() * 28);
    }
    await wait(280);
  }
  function clearCompose() {
    compose.classList.remove("is-typing");
    compose.innerHTML = "<span>Message</span>";
  }

  // ---- Site helpers
  function swapValue(row, text, flash = true) {
    const dd = row.querySelector("dd");
    const oldVal = dd.querySelector(".val");
    const startH = dd.offsetHeight;

    const newVal = document.createElement("span");
    newVal.className = "val";
    newVal.textContent = text;
    dd.append(newVal);
    oldVal.style.visibility = "hidden";
    const endH = Math.max(newVal.offsetHeight, 1);
    oldVal.style.visibility = "";

    dd.animate([{ height: `${startH}px` }, { height: `${endH}px` }], { duration: 520, easing: EASE_OUT });
    oldVal.animate(
      [{ transform: "translateY(0)", opacity: 1 }, { transform: "translateY(-110%)", opacity: 0 }],
      { duration: 420, easing: EASE_OUT, fill: "forwards" }
    ).finished.then(() => oldVal.remove());
    newVal.animate(
      [{ transform: "translateY(110%)", opacity: 0 }, { transform: "translateY(0)", opacity: 1 }],
      { duration: 560, delay: 90, easing: EASE_OUT, fill: "backwards" }
    );
    if (flash) {
      row.animate(
        [{ backgroundColor: "rgba(25, 164, 99, 0)" }, { backgroundColor: "rgba(25, 164, 99, .16)", offset: 0.15 }, { backgroundColor: "rgba(25, 164, 99, 0)" }],
        { duration: 2200, easing: "ease-out" }
      );
    }
  }

  async function setLive(text, updated) {
    liveText.classList.add("is-swapping");
    await tick(220);
    liveText.textContent = text;
    live.classList.toggle("is-updated", updated);
    liveText.classList.remove("is-swapping");
  }

  async function resetAll() {
    thread.classList.add("is-fading");
    await wait(500);
    thread.replaceChildren();
    thread.classList.remove("is-fading");
    banner.classList.remove("is-open");
    swapValue(rows.hours, initial.hours, false);
    swapValue(rows.services, initial.services, false);
    await wait(900);
  }

  // ---- Reduced motion: show the finished conversation, no animation.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const last = steps[steps.length - 1];
    steps.forEach((s) => s.apply());
    [
      ["stamp", '<span class="stamp">Today 9:41 AM</span>'],
      ["them", `<div class="bubble">${last.ask}</div>`],
      ["us", `<div class="bubble">${CHECK}${last.reply}</div>`],
    ].forEach(([k, h]) => addMessage(k, h).classList.add("is-in"));
    return;
  }

  // ---- The loop
  async function run() {
    await wait(700);
    for (;;) {
      addMessage("stamp", '<span class="stamp">Today 9:41 AM</span>');
      await wait(500);

      for (const step of steps) {
        await typeIntoCompose(step.ask);
        clearCompose();
        hideOldReceipts();
        const sent = addMessage("them", `<div class="bubble">${step.ask}</div><div class="receipt"><span>Delivered</span></div>`);
        const receipt = sent.querySelector(".receipt span");

        await wait(900);
        receipt.classList.add("is-hidden");
        await wait(220);
        receipt.textContent = "Read";
        receipt.classList.remove("is-hidden");

        await wait(500);
        const typing = addMessage("typing", '<div class="bubble"><i></i><i></i><i></i></div>');
        await wait(1500);
        await removeMessage(typing);
        addMessage("us", `<div class="bubble">${CHECK}${step.reply}</div>`);

        await wait(450);
        step.apply();
        setLive("Updated just now", true);
        await wait(2000);
        setLive("Live", false);
        await wait(900);
      }

      await wait(2600);
      await resetAll();
    }
  }
  run();
})();

// ---------------------------------------------------------------
// Pricing: monthly / yearly toggle
// ---------------------------------------------------------------
(function () {
  const buttons = document.querySelectorAll("[data-billing]");
  const plans = document.querySelectorAll(".plan[data-price]");
  if (!buttons.length) return;
  const money = (n) => "$" + n.toLocaleString("en-US");

  function render(mode) {
    buttons.forEach((b) => b.setAttribute("aria-checked", String(b.dataset.billing === mode)));
    plans.forEach((plan) => {
      const price = Number(plan.dataset.price);
      const setup = Number(plan.dataset.setup);
      const terms = plan.querySelector(".plan__terms");
      terms.innerHTML = mode === "yearly"
        ? `<s>${money(setup)} setup</s> <strong>Free setup, our wedding gift to you</strong><br>Billed ${money(price * 12)} yearly`
        : `Plus ${money(setup)} one-time setup`;
      const cta = plan.querySelector(".plan__cta");
      if (cta) cta.textContent = mode === "yearly" ? "Say “I do”" : "Get started";
    });
  }
  buttons.forEach((b) => b.addEventListener("click", () => render(b.dataset.billing)));
  render("monthly");
})();

// ---------------------------------------------------------------
// Audit / callback tabs and forms
// ---------------------------------------------------------------
(function () {
  const tabs = document.querySelectorAll('.tabs [role="tab"]');
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => select(tab));
    tab.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const list = [...tabs];
      const next = list[(list.indexOf(tab) + (e.key === "ArrowRight" ? 1 : list.length - 1)) % list.length];
      select(next);
      next.focus();
    });
  });
  function select(tab) {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
  }

  // Front-end validation only until a form backend is connected.
  document.querySelectorAll("form.form").forEach((form) => {
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
        msg.textContent = "Fill in the highlighted fields and try again.";
        firstInvalid.focus();
        return;
      }
      msg.textContent = form.dataset.success;
      form.reset();
    });
  });
})();

// ---------------------------------------------------------------
// Side drawer menu
// ---------------------------------------------------------------
(function () {
  const button = document.querySelector(".nav__menu");
  const drawer = document.getElementById("drawer");
  if (!button || !drawer) return;
  const panel = drawer.querySelector(".drawer__panel");
  drawer.querySelectorAll(".drawer__item").forEach((el, n) => el.style.setProperty("--n", n));

  function open() {
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    button.setAttribute("aria-expanded", "true");
    document.documentElement.classList.add("drawer-open");
    setTimeout(() => drawer.querySelector(".drawer__close").focus(), 50);
  }
  function close(returnFocus = true) {
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    button.setAttribute("aria-expanded", "false");
    document.documentElement.classList.remove("drawer-open");
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
      // Keep focus inside the drawer while it's open.
      const f = [...panel.querySelectorAll("a, button")];
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });
})();

// ---------------------------------------------------------------
// Examples gallery: pick an industry, preview the sample site
// ---------------------------------------------------------------
(function () {
  const gallery = document.getElementById("gallery");
  if (!gallery) return;
  const chips = gallery.querySelectorAll(".gallery__chips button");
  const viewer = gallery.querySelector(".viewer");
  const stage = document.getElementById("viewer-stage");
  const frame = document.getElementById("viewer-frame");
  const iframe = document.getElementById("viewer-iframe");
  const modeButtons = gallery.querySelectorAll(".viewer__modes button");
  const url = document.getElementById("viewer-url");
  const name = document.getElementById("viewer-name");
  const meta = document.getElementById("viewer-meta");
  const open = document.getElementById("viewer-open");

  const DESKTOP_W = 1280, PHONE_W = 390, PHONE_H = 800, PHONE_BORDER = 10;

  function layout() {
    const W = stage.clientWidth, H = stage.clientHeight;
    if (viewer.dataset.mode === "phone") {
      const outerW = PHONE_W + PHONE_BORDER * 2, outerH = PHONE_H + PHONE_BORDER * 2;
      const s = Math.min(1, (H - 40) / outerH, (W - 24) / outerW);
      frame.style.width = PHONE_W + PHONE_BORDER * 2 + "px";
      frame.style.height = PHONE_H + PHONE_BORDER * 2 + "px";
      frame.style.transform = `scale(${s})`;
      frame.style.left = (W - outerW * s) / 2 + "px";
      frame.style.top = (H - outerH * s) / 2 + "px";
    } else {
      const s = W / DESKTOP_W;
      frame.style.width = DESKTOP_W + "px";
      frame.style.height = H / s + "px";
      frame.style.transform = `scale(${s})`;
      frame.style.left = "0px";
      frame.style.top = "0px";
    }
  }

  function show(chip) {
    chips.forEach((c) => c.setAttribute("aria-selected", String(c === chip)));
    reload(chip.dataset.src);
    url.textContent = chip.dataset.url;
    name.textContent = chip.dataset.name;
    meta.textContent = chip.dataset.meta;
    open.href = chip.dataset.src;
  }
  // Reloading replays each sample's entrance animation.
  function reload(src) {
    frame.classList.add("is-loading");
    setTimeout(() => { iframe.src = src + "?embed&t=" + Date.now(); }, 200);
  }
  iframe.addEventListener("load", () => frame.classList.remove("is-loading"));

  chips.forEach((chip) => chip.addEventListener("click", () => show(chip)));
  modeButtons.forEach((b) => b.addEventListener("click", () => {
    modeButtons.forEach((x) => x.setAttribute("aria-checked", String(x === b)));
    frame.classList.add("is-loading");
    setTimeout(() => {
      viewer.dataset.mode = b.dataset.mode;
      layout();
      iframe.src = open.getAttribute("href") + "?embed&t=" + Date.now();
    }, 200);
  }));

  new ResizeObserver(layout).observe(stage);
  layout();
})();

// ---------------------------------------------------------------
// Plan finder dialog: three questions, one per step, then a result
// ---------------------------------------------------------------
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
    { id: "plan-simple", name: "Simple Site", price: 99, why: "Everything a small business needs on one polished page.",
      feats: ["One scrolling page", "Contact form", "Hosting, backups and uptime monitoring", "Unlimited minor edits"] },
    { id: "plan-business", name: "Business", price: 149, why: "A full site that helps nearby customers find you.",
      feats: ["Up to 5 pages", "Google Maps setup and management", "Live Google reviews and Instagram feed", "Unlimited minor edits"] },
    { id: "plan-full", name: "Full Suite", price: 249, why: "Everything, plus tools that keep bringing in new customers.",
      feats: ["Up to 10 pages", "AI chat assistant", "Neighborhood SEO pages and a monthly blog post", "Priority edits"] },
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
    restart.hidden = i !== 3;
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
    othersToggle.textContent = "View other plans";
  }

  // Picking an answer moves to the next step.
  form.addEventListener("change", () => {
    setTimeout(() => {
      if (current < 2) show(current + 1);
      else { renderResult(); show(3); }
    }, 260);
  });
  back.addEventListener("click", () => show(Math.max(0, current - 1)));
  restart.addEventListener("click", () => { form.reset(); show(0); });
  othersToggle.addEventListener("click", () => {
    const open = others.hidden;
    others.hidden = !open;
    othersToggle.setAttribute("aria-expanded", String(open));
    othersToggle.textContent = open ? "Hide other plans" : "View other plans";
  });

  function choose(planId) {
    dialog.close();
    document.querySelectorAll(".plan").forEach((card) => {
      const on = card.id === planId;
      card.classList.toggle("is-recommended", on);
      const badge = card.querySelector(".plan__rec");
      if (badge) badge.hidden = !on;
    });
    setTimeout(() => document.getElementById(planId).scrollIntoView({ behavior: "smooth", block: "center" }), 150);
  }
  document.getElementById("finder-apply").addEventListener("click", () => choose(recommended().id));
  others.addEventListener("click", (e) => { const b = e.target.closest("[data-pick]"); if (b) choose(b.dataset.pick); });

  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-open-finder]")) { e.preventDefault(); form.reset(); show(0); dialog.showModal(); }
    if (e.target.closest("[data-close-finder]")) dialog.close();
  });
  dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });
})();

// ---------------------------------------------------------------
// "Get our take" inline check on blog posts: URL, then email.
// Front-end only until a form backend is connected.
// ---------------------------------------------------------------
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
          msg.textContent = "Enter an email address so we can send your notes.";
          return;
        }
        go("done");
      }
    });
  });
})();

// ---------------------------------------------------------------
// Quiet scroll reveals: fade and rise once, staggered in grids
// ---------------------------------------------------------------
(function () {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const singles = ".hero__copy > *, .demo, .section-head, .section > .wrap > .eyebrow, .section > .wrap > h2, .section > .wrap > .intro, .viewer, .gallery__chips, .compare, .extras__title, .extras__row, .maps > div, .local > div, .pricing__head, .edits-banner, .about > *, .faq > div:first-child, .audit > *, .blog-hero .wrap > *, .article__wrap > *";
  const groups = [".features > li", ".extras__grid > li", ".steps > li", ".plans > .plan", ".promises > p", ".posts > a", ".boroughs > li", ".faq__list > details"];
  const els = new Set(document.querySelectorAll(singles));
  groups.forEach((sel) => document.querySelectorAll(sel).forEach((el, n) => { el.style.setProperty("--i", n % 4); els.add(el); }));
  document.querySelectorAll(".hero__copy > *").forEach((el, n) => el.style.setProperty("--i", n));

  const pending = new Set();
  function reveal(el) {
    pending.delete(el);
    el.classList.add("is-in");
    // Hand hover transitions back to the element once the reveal is done.
    setTimeout(() => { el.removeAttribute("data-reveal"); el.classList.remove("is-in"); el.style.removeProperty("--i"); }, 1500 + 85 * 4);
  }
  // A plain position check on scroll: robust everywhere, cheap with requestAnimationFrame.
  let queued = false;
  function check() {
    queued = false;
    const limit = window.innerHeight * 0.94;
    pending.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < limit) reveal(el); // in view, or already scrolled past
    });
  }
  // A short timer rather than requestAnimationFrame, which background tabs pause.
  const schedule = () => { if (!queued) { queued = true; setTimeout(check, 60); } };

  els.forEach((el) => {
    if (reduced) return;
    el.setAttribute("data-reveal", "");
    pending.add(el);
  });
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  schedule();
})();

// ---------------------------------------------------------------
// Google Maps illustration: play once, count the page number up
// ---------------------------------------------------------------
(function () {
  const fig = document.getElementById("rank");
  if (!fig) return;
  fig.querySelectorAll(".rank__feed--below .sk").forEach((el, k) => el.style.setProperty("--k", k));
  const counter = fig.querySelector("[data-count-to]");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function play() {
    fig.classList.add("is-played");
    if (reduced || !counter) return;
    const to = Number(counter.dataset.countTo);
    const start = performance.now(), dur = 1800;
    (function step(now) {
      const t = Math.min(1, (now - start) / dur);
      const eased = t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      counter.textContent = Math.max(1, Math.round(1 + eased * (to - 1)));
      if (t < 1) requestAnimationFrame(step);
    })(start);
  }
  if (reduced) { fig.classList.add("is-played"); return; }
  counter.textContent = "1";
  let done = false;
  function check() {
    if (done) return;
    const r = fig.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.7 && r.bottom > 0) {
      done = true;
      window.removeEventListener("scroll", onScroll);
      setTimeout(play, 300);
    }
  }
  const onScroll = () => setTimeout(check, 60);
  window.addEventListener("scroll", onScroll, { passive: true });
  check();
})();

// Footer "Speak to Ben" opens the callback tab
document.querySelectorAll('a[data-tab="callback"]').forEach((a) => a.addEventListener("click", () => {
  const tab = document.getElementById("tab-callback");
  if (tab) tab.click();
}));
