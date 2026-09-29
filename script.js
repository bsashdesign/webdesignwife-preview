const CHEV_L = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M12.5 4.5 7 10l5.5 5.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const CHEV_R = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7.5 4.5 13 10l-5.5 5.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
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
  const sw = document.querySelector(".billing__switch");
  const billing = document.querySelector(".billing");
  const plans = document.querySelectorAll(".plan[data-price]");
  if (!buttons.length) return;
  const money = (n) => "$" + n.toLocaleString("en-US");

  function render(mode) {
    buttons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.billing === mode)));
    if (sw) sw.setAttribute("aria-checked", String(mode === "yearly"));
    // Yearly is the commitment: the ring box opens.
    if (billing) billing.classList.toggle("is-yearly", mode === "yearly");
    plans.forEach((plan) => {
      const price = Number(plan.dataset.price);
      const setup = Number(plan.dataset.setup);
      const terms = plan.querySelector(".plan__terms");
      const yearly = Math.round(price * 12 * 0.8);
      const perMonth = Math.round(price * 0.8);
      plan.querySelector(".plan__price").innerHTML = mode === "yearly"
        ? `<s class="plan__was">$${price}</s><b class="plan__now"><span>$${perMonth}</span>/month</b>`
        : `<b class="plan__now"><span>$${price}</span>/month</b>`;
      terms.innerHTML = mode === "yearly"
        ? `${money(yearly)} billed yearly · <strong>save ${money(price * 12 - yearly)}</strong><br>+ ${money(setup)} one-time setup`
        : `+ ${money(setup)} one-time setup`;
      const cta = plan.querySelector(".plan__cta");
      if (cta) cta.textContent = mode === "yearly" ? "Say “I Do”" : "Get Started";
      if (cta) { const u = new URL(cta.getAttribute("href"), location.href); u.searchParams.set("billing", mode); cta.setAttribute("href", "start.html" + u.search); }
    });
  }
  buttons.forEach((b) => b.addEventListener("click", () => render(b.dataset.billing)));
  if (sw) sw.addEventListener("click", () => render(sw.getAttribute("aria-checked") === "true" ? "monthly" : "yearly"));
  render("monthly");
})();

// ---------------------------------------------------------------
// Audit / callback tabs and forms
// ---------------------------------------------------------------
(function () {
  // Each tab list switches only its own panels (the "Talk to me" panel has a small list inside it).
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

  // Front-end validation only until a form backend is connected.
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

// ---------------------------------------------------------------
// Side drawer menu
// ---------------------------------------------------------------
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
// Examples: 3D carousel with a tilt-on-hover front card
// ---------------------------------------------------------------
(function () {
  const cf = document.getElementById("gallery");
  if (!cf || !cf.classList.contains("cf")) return;
  const cards = [...cf.querySelectorAll(".cf-card")];
  const picks = [...cf.querySelectorAll(".cf-pick")];
  const modes = [...document.querySelectorAll(".cf__modes button, #gallery .viewer__modes button")];
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let active = 0;


  function sizeFrames() {
    const st = getComputedStyle(cf);
    cards.forEach((c) => {
      const screen = c.querySelector(".cf-card__screen");
      const f = c.querySelector("iframe");
      if (!f) return;
      const sw = parseFloat(st.getPropertyValue("--sw"));
      f.style.transform = `scale(${screen.clientWidth / sw})`;
    });
  }

  function load(card, fresh) {
    const f = card.querySelector("iframe");
    if (!f) return;
    const want = card.dataset.src + "?embed" + (cf.dataset.mode === "mobile" ? "&m=1" : "");
    if (fresh || f.dataset.loaded !== want) { f.dataset.loaded = want; f.src = want + "&t=" + Date.now(); }
  }

  function render(replay) {
    const n = cards.length;
    const mobile = cf.dataset.mode === "mobile";
    const SC = mobile ? [1, 0.7, 0.6, 0.52, 0.46] : [1, 0.64, 0.48, 0.38, 0.32];
    const shown = mobile ? 4 : 3;           // the last one fades out at the edge
    cards.forEach((c, i) => {
      // A straight line: the current site first, the next ones to its right.
      const o = i - active;
      const a = Math.abs(o);
      const cw = c.offsetWidth || 600;
      let x = 0;
      if (o > 0) {
        // Desktop cards tuck behind each other; phones sit side by side with a small gap.
        x = mobile ? cw + 28 : cw * 0.9;
        for (let k = 2; k <= o; k++) {
          const w = cw * SC[Math.min(k - 1, 4)];
          x += mobile ? w + 20 : w * 0.74;
        }
      }
      if (o < 0) x = -cw * 0.5;
      // Scale around the middle of the device, so every device lines up on one center line.
      const f = c.querySelector(".cf-card__frame");
      c.style.transformOrigin = `0 ${f.offsetTop + f.offsetHeight / 2}px`;
      c.style.setProperty("--tx", `${x}px`);
      c.style.setProperty("--tz", `${-Math.max(0, Math.min(o, 5)) * 120}px`);
      c.style.setProperty("--ty", `${o > 0 ? (mobile ? 10 : 14) : 0}deg`);
      c.style.setProperty("--sc", o > 0 ? SC[Math.min(o, 4)] : 1);
      c.style.setProperty("--o", o);
      c.style.setProperty("--a", a);
      c.classList.toggle("is-active", o === 0);
      c.classList.toggle("is-far", o < 0 || o > shown);
      c.setAttribute("aria-hidden", o === 0 ? "false" : "true");
      if (o >= 0 && o <= shown) load(c, replay && o === 0);
    });
    picks.forEach((p, i) => p.setAttribute("aria-selected", String(i === active)));
    cards.forEach((c, i) => { const v = c.querySelector(".cf-card__view"); if (v) v.tabIndex = i === active ? 0 : -1; });
    // Keep the 3D vanishing point level with the devices so they share one center line.
    const af = cards[active].querySelector(".cf-card__frame");
    const mid = af.offsetTop + af.offsetHeight / 2;
    const stageEl = cf.querySelector(".cf__stage");
    stageEl.style.perspectiveOrigin = `50% ${mid}px`;
    stageEl.style.setProperty("--mid", `${mid}px`);
    stageEl.style.setProperty("--fb", `${af.offsetTop + af.offsetHeight}px`);
    // The edge fade starts just past the front device, so it never dims it.
    const cardRight = stageEl.getBoundingClientRect().left + cards[active].offsetLeft + af.offsetWidth;
    stageEl.style.setProperty("--fade-w", `${Math.max(48, Math.min(360, document.documentElement.clientWidth - cardRight - 16))}px`);
    prev.disabled = active === 0;
    next.disabled = active === n - 1;
    // The arrows sit level with the current site's name and tags.
    const head = cards[active].querySelector(".cf-card__head");
    // Measured from layout (offsets), not the screen, so a card still sliding into place can't skew it.
    if (head) {
      const track = cards[active].offsetParent;
      const y = stageEl.offsetTop + (track ? track.offsetTop : 0) + cards[active].offsetTop + head.offsetTop + head.offsetHeight / 2;
      cf.style.setProperty("--head-y", `${y}px`);
    }
    // The edge fade uses the section's own background, whatever the mood.
    const sec = cf.closest("section");
    if (sec) stageEl.style.setProperty("--cf-fade", getComputedStyle(sec).backgroundColor);
    // The last card is a small "that's all" card with its own buttons.
    cards[n - 1].querySelectorAll("a, button").forEach((b) => { b.tabIndex = active === n - 1 ? 0 : -1; });
    cf.classList.toggle("is-end", n - 1 - active < shown);
  }

  const prev = cf.querySelector(".cf__arrow--prev");
  const next = cf.querySelector(".cf__arrow--next");
  function go(i) { active = Math.max(0, Math.min(cards.length - 1, i)); render(true); }

  prev.addEventListener("click", () => go(active - 1));
  next.addEventListener("click", () => go(active + 1));
  // Stop here, or the end card's own click handler would jump straight back to it.
  cf.querySelectorAll("[data-cf-restart]").forEach((b) => b.addEventListener("click", (e) => { e.stopPropagation(); go(0); }));
  picks.forEach((p, i) => p.addEventListener("click", () => go(i)));
  cards.forEach((c, i) => c.addEventListener("click", (e) => { if (i !== active) { e.preventDefault(); go(i); } }));
  cf.addEventListener("keydown", (e) => { if (e.key === "ArrowLeft") go(active - 1); if (e.key === "ArrowRight") go(active + 1); });

  modes.forEach((b) => b.addEventListener("click", () => {
    modes.forEach((x) => x.setAttribute("aria-checked", String(x === b)));
    cf.dataset.mode = b.dataset.mode;
    setTimeout(() => { sizeFrames(); render(false); }, 20);
    setTimeout(() => { sizeFrames(); render(false); }, 550);
  }));

  // Swipe on touch screens
  let sx = null;
  cf.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; }, { passive: true });
  cf.addEventListener("touchend", (e) => {
    if (sx === null) return;
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 40) go(active + (dx < 0 ? 1 : -1));
    sx = null;
  });

  // The device under the pointer tilts toward it, like a collectible card.
  // Only its frame moves; the title above stays put.
  if (!reduced) {
    const reset = (c) => {
      c.classList.remove("is-tilting");
      const f = c.querySelector(".cf-card__frame");
      f.style.removeProperty("--rx"); f.style.removeProperty("--ry");
    };
    cards.forEach((c) => {
      const f = c.querySelector(".cf-card__frame");
      f.addEventListener("pointermove", (e) => {
        if (c.classList.contains("is-far")) return;
        const r = f.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        c.classList.add("is-tilting");
        f.style.setProperty("--ry", `${x * 12}deg`);
        f.style.setProperty("--rx", `${-y * 9}deg`);
        f.style.setProperty("--gx", `${(x + 0.5) * 100}%`);
        f.style.setProperty("--gy", `${(y + 0.5) * 100}%`);
      });
      f.addEventListener("pointerleave", () => reset(c));
    });
  }

  new ResizeObserver(() => { sizeFrames(); render(false); }).observe(cf);
  sizeFrames();
  render(false);
  requestAnimationFrame(() => requestAnimationFrame(() => cf.classList.add("is-ready")));
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
    { id: "plan-simple", name: "Essentials", price: 99, why: "Everything a small business needs on one polished page.",
      feats: ["One scrolling page", "Contact form", "Google Maps kept up to date", "Unlimited minor edits"] },
    { id: "plan-business", name: "Business", price: 149, why: "A full site that helps nearby customers find you.",
      feats: ["Up to 5 pages", "Google Maps growth and review routine", "Live Google reviews and Instagram feed", "Unlimited minor edits"] },
    { id: "plan-full", name: "Full Suite", price: 249, why: "Everything, plus tools that keep bringing in new customers.",
      feats: ["Up to 10 pages", "AI chat assistant", "Neighborhood SEO pages and a monthly blog post", "AI search optimization"] },
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
    // Finished steps can be clicked to go back to them.
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

  // Picking an answer moves to the next step, including re-picking the answer that's
  // already selected after going back (that fires a click but no change).
  let advance;
  const next = () => {
    clearTimeout(advance);
    advance = setTimeout(() => {
      if (current < 2) show(current + 1);
      else { renderResult(); show(3); }
    }, 260);
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
    document.querySelectorAll(".plan").forEach((card) => {
      const on = card.id === planId;
      card.classList.toggle("is-recommended", on);
      const badge = card.querySelector(".plan__rec");
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
          msg.textContent = "Enter an email address so I can send your notes.";
          return;
        }
        go("done");
      }
    });
  });
})();

// ---------------------------------------------------------------
// Motion: headings rise word by word, labels pop, icons hop.
// Content is never hidden before its moment; nothing waits on scroll to exist.
// ---------------------------------------------------------------
(function () {
  const root = document.documentElement;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // Split section headings into masked words.
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
  // Icons within one group hop one after another.
  document.querySelectorAll(".features, .extras__grid").forEach((g) => g.querySelectorAll(".ico, .xicon").forEach((el, i) => el.style.setProperty("--hi", i % 6)));
  root.classList.add("m-on");

  const pending = new Set(targets);
  let queued = false, first = true;
  function check() {
    queued = false;
    const limit = window.innerHeight * 0.9;
    pending.forEach((el) => {
      const r = el.getBoundingClientRect();
      // Anything in view, or already scrolled past, is revealed. Labels already on screen
      // when the page opens just appear; the pop is for ones you scroll to.
      if (r.top < limit) {
        if (first && el.classList.contains("eyebrow")) el.classList.add("m-instant");
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
  if (counter) counter.textContent = "1";
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
// "Free audit" and "let's talk" links open the get-in-touch forms in a pop-up instead of scrolling.
// The one form card moves into the pop-up while it's open, then goes back to its section.
(function () {
  const dialog = document.getElementById("audit-dialog");
  // Pages with the audit section lend it their form; other pages carry their own copy in the pop-up.
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

// Nav: the color strip shows at the top of the page, then tucks away
(function () {
  const nav = document.querySelector(".nav");
  if (!nav) return;
  const update = () => nav.classList.toggle("is-scrolled", window.scrollY > 24);
  window.addEventListener("scroll", update, { passive: true });
  update();
})();

// Hearts float up each time the About section comes into view
(function () {
  const hearts = document.querySelector(".hearts");
  if (!hearts || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  let inView = false;
  function check() {
    const r = hearts.getBoundingClientRect();
    const now = r.top < window.innerHeight * 0.75 && r.bottom > window.innerHeight * 0.1;
    if (now && !inView) {
      hearts.classList.remove("is-bursting");
      void hearts.offsetWidth;          // restart the animation
      hearts.classList.add("is-bursting");
    }
    inView = now;
  }
  window.addEventListener("scroll", () => setTimeout(check, 60), { passive: true });
  check();
})();

// Swipeable rows: a pair of arrows sits above the row, on the right
(function () {
  document.querySelectorAll("#blog .posts, .steps, .boroughs").forEach((row) => {
    const box = document.createElement("div");
    box.className = "rowx rowx--" + (row.classList.contains("boroughs") ? "boroughs" : row.classList.contains("steps") ? "steps" : "posts");
    row.before(box);
    box.innerHTML = '<div class="rowx__nav"><button type="button" class="rowx__btn rowx__btn--prev" aria-label="Previous">' + CHEV_L + '</button><button type="button" class="rowx__btn rowx__btn--next" aria-label="Next">' + CHEV_R + '</button></div>';
    box.appendChild(row);
    // Put the arrows on the same line as the section's own heading or intro when there's a slot for them.
    const nav = box.querySelector(".rowx__nav");
    const slot = row.closest("section")?.querySelector("[data-nav-slot]");
    if (slot) slot.appendChild(nav);
    const [prev, next] = nav.querySelectorAll(".rowx__btn");
    // Arrows move a whole view at a time: the first card that isn't fully visible becomes
    // the new first card (or last card, going back), so nothing is ever skipped.
    const stepBy = (d) => {
      const box = row.getBoundingClientRect(), from = row.scrollLeft;
      const pad = parseFloat(getComputedStyle(row).paddingLeft) || 0;   // room left for card shadows
      const view = row.clientWidth - pad * 2;
      const fade = 56;   // the edge fade hides the last bit of the view
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

// Nav: switch to the menu button as soon as the links would wrap
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

// ---------------------------------------------------------------
// Moods: switch the whole look in place, like light and dark mode
// ---------------------------------------------------------------
(function () {
  const MOODS = { calm: "theme-refined", transit: "theme-subway", tangy: "theme-blocks", sophisticated: "theme-wedding" };
  const root = document.documentElement;

  function swapCopy(cls) {
    document.querySelectorAll("[data-alt-theme-wedding]").forEach((el) => {
      if (!el.dataset.orig) el.dataset.orig = el.textContent;
      el.textContent = cls === "theme-wedding" ? el.getAttribute("data-alt-theme-wedding") : el.dataset.orig;
    });
  }
  function mark(key) {
    document.querySelectorAll("[data-mood]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.mood === key)));
    // The mood button shows the current mood's colors.
    const btn = document.querySelector(".mood__btn");
    const opt = document.querySelector(`.mood__opt[data-mood="${key}"] .moodicon`);
    if (btn && opt) btn.innerHTML = opt.outerHTML;
  }
  function apply(key, save) {
    if (!MOODS[key]) return;
    Object.values(MOODS).forEach((c) => root.classList.remove(c));
    root.classList.add(MOODS[key]);
    root.dataset.mood = key;
    swapCopy(MOODS[key]);
    mark(key);
    if (save) { try { localStorage.setItem("wdw-mood", key); } catch (e) {} }
    // Let size-dependent pieces (carousel, nav) re-measure for the new fonts.
    setTimeout(() => window.dispatchEvent(new Event("resize")), 60);
  }
  apply(root.dataset.mood || "transit", false);

  function switchTo(key) { if (key !== root.dataset.mood) apply(key, true); }
  document.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-mood]");
    if (b) switchTo(b.dataset.mood);
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
  // With a mouse, hovering the button opens the panel and moving away closes it.
  if (hover) {
    let t;
    m.addEventListener("mouseenter", () => { clearTimeout(t); setOpen(true); });
    m.addEventListener("mouseleave", () => { clearTimeout(t); t = setTimeout(() => setOpen(false), 250); });
  }
  m.querySelector(".mood__close").addEventListener("click", () => { setOpen(false); btn.focus(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && m.classList.contains("is-open")) setOpen(false); });
  document.addEventListener("click", (e) => { if (!m.contains(e.target)) { m.classList.remove("is-open"); btn.setAttribute("aria-expanded", "false"); } });
})();

// Blog filters
(function () {
  const bar = document.querySelector(".filters");
  if (!bar) return;
  const cards = [...document.querySelectorAll(".posts--index > .post-card")];
  bar.addEventListener("click", (e) => {
    const b = e.target.closest(".filter"); if (!b) return;
    bar.querySelectorAll(".filter").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    const f = b.dataset.filter;
    cards.forEach((c) => { c.hidden = !(f === "all" || c.dataset.group === f); });
  });
  const hash = location.hash.replace("#", "");
  const pre = bar.querySelector(`[data-filter="${hash}"]`);
  if (pre) pre.click();
})();



// ---------------------------------------------------------------
// Related articles: picked automatically from posts.json.
// Same category ranks first, then shared topic words; the top three show.
// ---------------------------------------------------------------
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
      <a class="post-card post-card--article related__card" href="${p.slug}.html">
        ${p.cover}
        <span class="post-card__body">
          <span class="post-card__kicker">${p.kicker}</span>
          <h3>${p.title}</h3>
          <span class="post-card__meta">${p.minutes} min read</span>
        </span>
      </a>`).join("");
    box.hidden = false;
  }).catch(() => {});
})();

// Address search: suggestions from OpenStreetMap (Photon), leaning toward New York.
// Any field with data-address gets it; typing a full address by hand still works.
(function () {
  const fields = document.querySelectorAll("input[data-address]");
  if (!fields.length) return;
  // Limited to the five boroughs and to real street addresses, which keeps results relevant and fast.
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
        if (pending) pending.abort();   // only the latest search matters
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

// Pop-ups open as ordinary page layers (not the browser's modal top layer) with a dimmed backdrop
// of our own. That keeps the mood button above them and usable, with no tricks or delay.
function openSheet(d) {
  document.querySelectorAll("dialog[open]").forEach((o) => { if (o !== d) o.close(); });
  if (!d.open) d.show();
}
(function () {
  const dialogs = [...document.querySelectorAll("dialog")];
  if (!dialogs.length) return;
  const scrim = document.createElement("div");
  scrim.className = "sheet-scrim";
  document.body.appendChild(scrim);
  const sync = () => document.documentElement.classList.toggle("has-sheet", dialogs.some((d) => d.open));
  const watch = new MutationObserver(sync);
  dialogs.forEach((d) => watch.observe(d, { attributes: true, attributeFilter: ["open"] }));
  scrim.addEventListener("click", () => dialogs.forEach((d) => d.open && d.close()));
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    const open = dialogs.filter((d) => d.open).pop();
    if (open) { e.preventDefault(); open.close(); }
  });
})();

// "Try on a look": the Your site card flips, a note confirms the switch, and the cards lift once on arrival.
(function () {
  const sec = document.getElementById("moods");
  if (!sec) return;
  const yours = sec.querySelector("[data-yours]");
  if (yours) {
    const front = yours.querySelector(".yours__front"), back = yours.querySelector(".yours__back");
    const flip = (open) => { yours.classList.toggle("is-open", open); back.hidden = !open; front.setAttribute("aria-expanded", String(open)); };
    front.addEventListener("click", () => flip(true));
    yours.querySelector(".yours__close").addEventListener("click", () => { flip(false); front.focus(); });
  }
  const toast = sec.querySelector(".tryon__toast");
  let t;
  sec.addEventListener("click", (e) => {
    const b = e.target.closest(".chip[data-mood], [data-shuffle-mood]");
    if (!b || !toast) return;
    setTimeout(() => {
      const name = { calm: "Calm", transit: "Transit", tangy: "Tangy", sophisticated: "Sophisticated" }[document.documentElement.dataset.mood];
      toast.textContent = `✨ You're viewing ${name}. Keep scrolling.`;
      toast.classList.add("is-on");
      clearTimeout(t);
      t = setTimeout(() => toast.classList.remove("is-on"), 2600);
    }, 60);
  });
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      if (entries.some((en) => en.isIntersecting)) { sec.classList.add("is-inviting"); io.disconnect(); }
    }, { threshold: 0.5 });
    io.observe(sec.querySelector(".tryon"));
  }
})();
