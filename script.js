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
    enableChat();
    return;
  }

  // ---- The conversation plays through once, and the finished site stays as it is
  async function run() {
    await wait(700);
    {
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

    }
    await wait(1200);
    enableChat();
  }

  // ---- After the demo: the phone offers two replies to pick from. Each answer gets its own reply (sometimes the
  // site changes too), then two new choices, three levels deep; at the end you can start over.
  const T = (label, reply, apply, next) => ({ label, reply, apply, next });
  const hours = (t) => () => swapValue(rows.hours, t);
  const promo = (t) => () => setBanner(t);
  const TREE = [
    T("Can we do 24/7 for emergencies?", "Done! You're now the 2 a.m. hero.", hours("Mon–Fri 8–5 · 24/7 emergencies"), [
      T("Wait, who answers at 2 a.m.?", "You do 😅 Want a big Call Now button so they reach you fast?", null, [
        T("Yes! Big red button", "Big red Call Now button, live. Very hard to miss.", promo("Burst pipe? Call now, day or night"), null),
        T("Hmm, make it 7am to 11pm", "Changed. Your sleep schedule thanks me.", hours("Every day 7am–11pm"), null),
      ]),
      T("Can Google show that too?", "Already did. Your Google Maps hours match your site.", null, [
        T("Wow, that was fast", "Edits are done within one business day. Today it took four minutes.", null, null),
        T("Can you fix my reviews?", "I can't change reviews, but I can help you get more good ones. It's easier than it sounds.", null, null),
      ]),
    ]),
    T("Can we add a Meet the Team bit?", "Love it. Who's on the team?", null, [
      T("Me and my brother Sal", "Two Riveras, one family business. Got a photo of you both?", null, [
        T("We look goofy in it", "Goofy is good. People trust real faces. It's going up.", promo("Family-run: meet the Rivera brothers"), null),
        T("Use the dog instead", "Done. Biscuit is now Head of Customer Relations 🐶", promo("Meet Biscuit, Head of Customer Relations"), null),
      ]),
      T("Just me, it's a one-man show", "Then you're the star. I'll write a short bio that sounds like you.", null, [
        T("Make me sound cool", "\"Fixes leaks. Leaves no mess. Probably wears sunglasses.\" Too much?", null, null),
        T("Keep it simple", "Simple it is: licensed, local, on time. It's live.", promo("Licensed, local and always on time"), null),
      ]),
    ]),
  ];
  let bannerTip = null;
  function setBanner(text) {
    const p = banner.querySelector("p");
    if (bannerTip === null) bannerTip = p.textContent;
    banner.classList.add("is-open");
    p.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: "forwards" }).finished.then(() => {
      p.textContent = text;
      p.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 380, easing: EASE_OUT, fill: "forwards" });
    });
  }

  function enableChat() {
    const phone = demo.querySelector(".phone");
    const start = { hours: rows.hours.querySelector(".val").textContent, banner: banner.querySelector("p").textContent };
    compose.classList.add("is-choices");
    phone.removeAttribute("aria-hidden");
    let busy = false;
    const offer = (opts) => {
      const tip = document.createElement("span");
      tip.className = "chat-choices__tip"; tip.textContent = "Tap a reply to send";
      compose.replaceChildren(tip, ...opts.map((o) => {
        const b = document.createElement("button");
        b.type = "button"; b.className = "chat-choice"; b.textContent = o.label;
        b.addEventListener("click", () => pick(o));
        return b;
      }));
      compose.querySelectorAll(".chat-choice, .chat-choices__tip").forEach((b, i) => b.animate([{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }], { duration: 380, delay: i * 90, easing: EASE_OUT, fill: "backwards" }));
    };
    const again = () => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "chat-choice chat-choice--again"; b.textContent = "↺ Start over";
      b.addEventListener("click", async () => {
        if (busy) return; busy = true;
        compose.replaceChildren();
        await resetChat();
        offer(TREE); busy = false;
      });
      compose.replaceChildren(b);
      b.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, fill: "backwards" });
    };
    async function resetChat() {
      thread.classList.add("is-fading");
      await tick(450);
      thread.replaceChildren();
      addMessage("stamp", '<span class="stamp">Today 9:42 AM</span>');
      thread.classList.remove("is-fading");
      if (rows.hours.querySelector(".val").textContent !== start.hours) swapValue(rows.hours, start.hours, false);
      if (banner.querySelector("p").textContent !== start.banner) setBanner(start.banner);
    }
    async function pick(o) {
      if (busy) return; busy = true;
      compose.replaceChildren();
      hideOldReceipts();
      const sent = addMessage("them", '<div class="bubble"></div><div class="receipt"><span>Delivered</span></div>');
      sent.querySelector(".bubble").textContent = o.label;
      const receipt = sent.querySelector(".receipt span");
      await tick(700); receipt.classList.add("is-hidden"); await tick(200); receipt.textContent = "Read"; receipt.classList.remove("is-hidden");
      await tick(350);
      const typing = addMessage("typing", '<div class="bubble"><i></i><i></i><i></i></div>');
      await tick(1100);
      await removeMessage(typing);
      const r = addMessage("us", `<div class="bubble">${o.apply ? CHECK : ""}</div>`);
      r.querySelector(".bubble").append(o.reply);
      if (o.apply) { await tick(350); o.apply(); }
      await tick(650);
      if (o.next) offer(o.next); else again();
      busy = false;
    }
    offer(TREE);
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
    if (billing) billing.classList.toggle("is-yearly", mode === "yearly");
    // the tag says what you get: "Save 20%" before, "You Are Saving 20%" once yearly is on.
    // Both wordings sit in the same spot, so the tag keeps the longer one's width and the toggle never moves.
    document.querySelectorAll(".billing__save").forEach((t) => {
      if (!t.querySelector(".billing__save-m")) t.innerHTML = '<span class="billing__save-m">Save 20%</span><span class="billing__save-y">You Are Saving 20%</span>';
      t.classList.toggle("is-on", mode === "yearly");
    });
    plans.forEach((plan) => {
      const price = Number(plan.dataset.price);
      const setup = Number(plan.dataset.setup);
      const terms = plan.querySelector(".plan__terms");
      const yearly = Math.round(price * 12 * 0.8);
      const perMonth = Math.round(price * 0.8);
      plan.querySelector(".plan__price").innerHTML = mode === "yearly"
        ? `<s class="plan__was">$${price}</s><b class="plan__now"><span>$${perMonth}</span>/month</b>`
        : `<b class="plan__now"><span>$${price}</span>/month</b>`;
      // Founding 5: the setup fee shows struck through, with the $1 founding setup next to it.
      const F = window.WDW_FOUNDING;
      const setupLine = F
        ? `+ <s>${money(setup)}</s> <strong>${money(F.setup)} setup</strong> <span class="plan__founding"><i class="pi pi--crown-fill" aria-hidden="true"></i>Founder</span>`
        : `+ ${money(setup)} one-time setup`;
      terms.innerHTML = mode === "yearly"
        ? `${money(yearly)} billed yearly · <strong>save ${money(price * 12 - yearly)}</strong><br>${setupLine}`
        : setupLine;
      const cta = plan.querySelector(".plan__cta");
      if (cta) { const u = new URL(cta.getAttribute("href"), location.href); u.searchParams.set("billing", mode); cta.setAttribute("href", "start.html" + u.search); }
    });
  }
  buttons.forEach((b) => b.addEventListener("click", () => render(b.dataset.billing)));
  if (sw) sw.addEventListener("click", () => render(sw.getAttribute("aria-checked") === "true" ? "monthly" : "yearly"));
  // Yearly (20% off) is the default
  render("yearly");
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
  // An eyebrow appears together with the title right after it (never alone above an empty space),
  // so it waits for that title to reach the reveal line.
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
    // start as soon as the before/after panes come into view (not once the card is well up the screen)
    const panes = fig.querySelector(".profile__panes") || fig;
    const r = panes.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.95 && r.bottom > 0) {
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
  document.querySelectorAll("#blog .posts:not(.posts--compact), .steps, .boroughs, .must-reads__list").forEach((row) => {
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
    // The floating button is a mini TV in the current mood's style, showing its face.
    const btn = document.querySelector(".mood__btn");
    if (btn) btn.dataset.tv = key;
  }
  // When the channel changes, the mini TV flickers on and plays a tiny copy of that mood's channel
  // (when this page has one) for a couple of seconds, then settles on the face and stays there.
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
    if (key === "transitdark") key = "transit"; // an old name for Transit (dark)
    if (!MOODS[key]) return;
    // a mood can be more than one class (Transit Dark is Transit plus the dark layer)
    Object.values(MOODS).forEach((c) => root.classList.remove(...c.split(" ")));
    root.classList.add(...MOODS[key].split(" "));
    root.dataset.mood = key;
    swapCopy(MOODS[key]);
    mark(key);
    if (save) { try { localStorage.setItem("wdw-mood", key); } catch (e) {} miniPlay(key); }
    // Let size-dependent pieces (carousel, nav) re-measure for the new fonts.
    setTimeout(() => window.dispatchEvent(new Event("resize")), 60);
  }
  apply(root.dataset.mood || "tangy", false);

  // Moods change the height of sections, so the page would jump. Keep what you were looking at in the same place:
  // the button you pressed, or (for the floating switcher) whatever is in the middle of the screen.
  function keepInView(anchor, change) {
    // Keep what you were looking at in the same place: the key you pressed, or (for the pop-up) whatever
    // is in the middle of the screen. One correction now and one once the new fonts arrive, never a hold that
    // fights your scrolling, and it stops the moment you scroll or touch the page yourself.
    const inFlow = anchor && anchor.isConnected && !anchor.closest(".mood");
    const a = inFlow ? anchor : document.elementFromPoint(innerWidth / 2, innerHeight / 2);
    const top = a ? a.getBoundingClientRect().top : 0;
    root.style.overflowAnchor = "none"; // the browser's own scroll anchoring would fight this and bounce the page
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
  // The "Now playing" TV section switches moods through this too.
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
  // With a mouse, hovering the button opens the panel and moving away closes it.
  if (hover) {
    let t;
    m.addEventListener("mouseenter", () => { clearTimeout(t); setOpen(true); });
    m.addEventListener("mouseleave", () => { clearTimeout(t); t = setTimeout(() => setOpen(false), 250); });
  }
  m.querySelector(".mood__close").addEventListener("click", () => { setOpen(false); btn.focus(); });
  // On phones the pop-up covers the page, so picking a channel closes it straight away to reveal the change
  m.addEventListener("click", (e) => {
    if (!e.target.closest(".mood__opt[data-mood]") || !matchMedia("(max-width: 760px)").matches) return;
    setOpen(false);
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && m.classList.contains("is-open")) setOpen(false); });
  document.addEventListener("click", (e) => { if (!m.contains(e.target)) { m.classList.remove("is-open"); btn.setAttribute("aria-expanded", "false"); } });
})();

// Blog filters and search: a card shows when it matches the chosen category and every search word.
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
      // Borough guides have their own carousel, so the grid shows them only for a search.
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
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const flip = (open) => {
      front.setAttribute("aria-expanded", String(open));
      if (open) { yours.classList.add("is-open"); back.hidden = false; front.classList.remove("is-back"); return; }
      // Flip back: turn the back away, then bring the front around.
      const done = () => { back.classList.remove("is-leaving"); back.hidden = true; yours.classList.remove("is-open"); front.classList.add("is-back"); };
      if (reduced) return done();
      back.classList.add("is-leaving");
      back.addEventListener("animationend", done, { once: true });
    };
    front.addEventListener("click", () => flip(true));
    yours.querySelector(".yours__close").addEventListener("click", () => { flip(false); front.focus(); });
  }
  const toast = sec.querySelector(".tryon__toast");
  let t;
  sec.addEventListener("click", (e) => {
    const b = e.target.closest(".chip[data-mood], [data-shuffle-mood]");
    if (!b || !toast) return;
    setTimeout(() => {
      const name = { calm: "Calm", transit: "Transit", tangy: "Tangy", sophisticated: "Soirée" }[document.documentElement.dataset.mood];
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

// Mark the current page in the nav and the menu drawer.
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

// Articles: if you arrived from another article, the back link returns you there instead of the article list.
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

// Reference chips in articles: clicking one opens a preview card of that article; clicking the card reads it.
(function () {
  const chips = document.querySelectorAll(".ref-chip[data-slug]");
  if (!chips.length) return;
  let posts = null, card = null, openChip = null;
  // Chips live in /blog/ articles and on other pages (like Features); paths are relative to the chip's own link.
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
    void card.offsetWidth; // start the fade from the new spot, not the old one
    card.classList.add("is-on");
  };
  chips.forEach((c) => {
    c.setAttribute("aria-expanded", "false");
    c.addEventListener("click", (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return; // let new-tab clicks through
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

// Pricing page: an example of what's charged today and when the site goes live, for the chosen plan and billing.
(function () {
  const box = document.querySelector("[data-paysample]");
  if (!box) return;
  const PLANS = { essentials: [99, 199], business: [149, 399], full: [249, 599] };
  const money = (n) => "$" + n.toLocaleString("en-US");
  const set = (k, v) => { box.querySelector(`[data-ps="${k}"]`).innerHTML = v; };
  let plan = "business";
  const render = () => {
    const yearly = document.querySelector(".billing__switch")?.getAttribute("aria-checked") === "true";
    const [price, setup] = PLANS[plan];
    const F = window.WDW_FOUNDING;
    const year = Math.round(price * 12 * 0.8);
    set("today", F ? `<s>${money(setup)}</s> ${money(F.setup)}` : money(setup));
    set("today-note", F ? "One-time setup, with the Founding 5 offer" : "One-time setup fee");
    set("then", yearly ? `${money(year)}/year` : `${money(price)}/month`);
    set("then-note", yearly ? `Your plan starts: a year at 20% off, saving ${money(price * 12 - year)}` : "Your plan starts");
    set("after", yearly ? `${money(year)} every year` : `${money(price)} every month`);
    set("after-note", "Cancel anytime");
    box.querySelectorAll("[data-sample]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.sample === plan)));
  };
  box.addEventListener("click", (e) => { const b = e.target.closest("[data-sample]"); if (b) { plan = b.dataset.sample; render(); } });
  document.addEventListener("click", (e) => { if (e.target.closest("[data-billing], .billing__switch")) setTimeout(render); });
  render();
})();

// New Age before/after slider
document.querySelectorAll(".ba").forEach((ba) => {
  const range = ba.querySelector(".ba__range");
  if (range) range.addEventListener("input", () => ba.style.setProperty("--pos", range.value + "%"));
});

// Section rhythm: when two neighbouring bands end up with the same background (it depends on the mood),
// the second one drops its top padding so the gap between them is one band, not two. See styles.css.
(function () {
  const look = (el) => { const c = getComputedStyle(el); return [c.backgroundColor, c.backgroundImage, c.borderTopWidth].join("|"); };
  const join = () => document.querySelectorAll("main > section").forEach((s) => {
    const prev = s.previousElementSibling;
    // Only join after a full band: a thin strip (like the "who we build for" row) keeps the next band's full padding.
    const full = prev && parseFloat(getComputedStyle(prev).paddingBottom) >= 40;
    const same = full && prev.tagName === "SECTION" && getComputedStyle(s).borderTopWidth === "0px" && look(prev).split("|").slice(0, 2).join() === look(s).split("|").slice(0, 2).join();
    s.classList.toggle("is-joined", !!same);
  });
  join();
  addEventListener("load", join);
  // Moods switch in place; re-check once their colors have settled.
  new MutationObserver(() => setTimeout(join, 450)).observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
})();

// Cal.com inline calendar (used for the 15-minute phone call and the new-client kickoff call).
function wdwCalInline(selector, calLink, config) {
  (function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if (typeof namespace === "string") { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ["initNamespace", namespace]); } else p(cal, ar); return; } p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
  Cal("init", { origin: "https://cal.com" });
  Cal("inline", { elementOrSelector: selector, calLink, config: config || {} });
  Cal("ui", { hideEventTypeDetails: false, layout: "month_view" });
}

// Features chats: play the conversation once, one message at a time, when it scrolls into view.
(function () {
  const chats = document.querySelectorAll("[data-chat]");
  if (!chats.length) return;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const play = async (chat) => {
    const msgs = [...chat.querySelectorAll(".fx-chat__msg")];
    if (reduce) return;
    await wait(250);
    for (const m of msgs) {
      const me = m.classList.contains("fx-chat__msg--me");
      const dots = document.createElement("span");
      dots.className = "fx-typing fx-typing--" + (me ? "me" : "them");
      dots.innerHTML = "<i></i><i></i><i></i>";
      m.before(dots);
      await wait(me ? 650 : 480);
      dots.remove();
      m.classList.add("is-in");
      await wait(380);
    }
  };
  // Keep each chat at its finished height so the page doesn't shift while messages arrive.
  if (!reduce) chats.forEach((c) => { c.style.minHeight = c.offsetHeight + "px"; c.classList.add("is-waiting"); });
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { io.unobserve(e.target); play(e.target); }
  }), { threshold: 0.15 });
  chats.forEach((c) => io.observe(c));
})();

// "Now playing" (moods, version B): a TV and a control panel of push buttons. The pressed button is the mood
// on the page; pressing another switches the page instantly and the TV flickers to it.
// "For you" is a paper card beside the panel that flips over to the invitation.
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
  // power: the set goes dark on the press, then a moment later switches on like an old tube, with its "sweee"
  const play = (key, power) => {
    // the label above the title names whatever's on
    if (eyebrow) eyebrow.textContent = NAMES[key === "transitdark" ? "transit" : key] || eyebrow.textContent;
    if (key === "transitdark") key = "transit"; // the TV plays the Transit channel for Transit Dark too
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
  // A key looks pressed while it's held; the channel changes when it's let go (a click, which keyboards send too).
  sec.addEventListener("click", (e) => { const k = e.target.closest("[data-tv-key]"); if (k) press(k); });
  // A mood picked anywhere else presses its button here too.
  let lastMood = root.dataset.mood;
  new MutationObserver(() => { if (root.dataset.mood === lastMood) return; lastMood = root.dataset.mood; play(lastMood); })
    .observe(root, { attributes: true, attributeFilter: ["data-mood"] });
  play(root.dataset.mood || "tangy");

  // The "For you" card turns over like a sheet of paper.
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

// ---------------------------------------------------------------
// Plan rings: Essentials a thin plain band, Business a band with a pearl, Full Suite a band with a diamond.
// Each is a small 3D model turned on an axis tipped 30 degrees and filled in one solid color (its silhouette),
// drawn on a <canvas class="plan-ring" data-plan="…">. The color comes from CSS, so it follows the mood.
// ---------------------------------------------------------------
(function () {
  const canvases = document.querySelectorAll("canvas.plan-ring[data-plan]:not(.plan-gem)");
  if (!canvases.length) return;
  // Rather than a full turn (which shows the ring face-on, like an "O"), each ring rocks through a 44 degree arc
  // between a three-quarter view and near-profile, easing out at each end.
  const TILT = -30 * Math.PI / 180, DEG = Math.PI / 180, MID = 60 * DEG, SWING = 22 * DEG, PERIOD = 5000;
  const quad = (out, a, b, c, d) => out.push([a, b, c], [a, c, d]);
  // A ring in the x-y plane (seen face-on): outer radius 1, thickness t, width w. `rise` swells the top into a cradle.
  function band({ w, t, rise = 0, sharp = 4, n = 96 }) {
    const tris = [], outer = (a) => 1 + rise * Math.pow(Math.max(0, Math.sin(a)), sharp);
    const P = (a, r, z) => [r * Math.cos(a), r * Math.sin(a), z];
    for (let i = 0; i < n; i++) {
      const a0 = (i / n) * 2 * Math.PI, a1 = ((i + 1) / n) * 2 * Math.PI;
      const pr = (a) => [[outer(a), -w / 2], [outer(a), w / 2], [1 - t, w / 2], [1 - t, -w / 2]];
      const p0 = pr(a0), p1 = pr(a1);
      for (let k = 0; k < 4; k++) { const j = (k + 1) % 4; quad(tris, P(a0, ...p0[k]), P(a1, ...p1[k]), P(a1, ...p1[j]), P(a0, ...p0[j])); }
    }
    return tris;
  }
  function pearl(r, cy, n = 18) {
    const tris = [], P = (u, v) => [r * Math.sin(v) * Math.cos(u), cy + r * Math.cos(v), r * Math.sin(v) * Math.sin(u)];
    for (let i = 0; i < n; i++) for (let j = 0; j < n / 2; j++) {
      const u0 = (i / n) * 2 * Math.PI, u1 = ((i + 1) / n) * 2 * Math.PI, v0 = (j / (n / 2)) * Math.PI, v1 = ((j + 1) / (n / 2)) * Math.PI;
      quad(tris, P(u0, v0), P(u1, v0), P(u1, v1), P(u0, v1));
    }
    return tris;
  }
  // A simple cut diamond with 6 facets (flat table, sloped crown, pointed base), its point resting on top of the band.
  function diamond(s, base, n = 6) {
    const prof = [[0, 1], [0.55, 1], [1, 0.68], [0, 0]];
    const tris = [], P = (a, [r, h]) => [s * r * Math.cos(a), base + s * h, s * r * Math.sin(a)];
    for (let i = 0; i < n; i++) {
      const a0 = (i / n) * 2 * Math.PI + Math.PI / n, a1 = ((i + 1) / n) * 2 * Math.PI + Math.PI / n;
      for (let k = 0; k < prof.length - 1; k++) quad(tris, P(a0, prof[k]), P(a1, prof[k]), P(a1, prof[k + 1]), P(a0, prof[k + 1]));
    }
    return tris;
  }
  const MODELS = {
    essentials: () => band({ w: 0.16, t: 0.065 }),
    business: () => band({ w: 0.28, t: 0.13, rise: 0.16, sharp: 6 }).concat(pearl(0.24, 1.26)),
    full: () => band({ w: 0.36, t: 0.17 }).concat(diamond(0.6, 1.02)),
  };
  // How much of the tile each ring fills, so the rings step up in size with the plan.
  const SIZE = { essentials: 0.7, business: 0.9, full: 1 };
  const cache = {};
  // Each model with its size and middle, so every ring is centered and fills its tile the same way.
  const model = (plan) => cache[plan] || (cache[plan] = (() => {
    const tris = MODELS[plan](), pts = tris.flat();
    const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
    const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
    return { tris, mx: (minX + maxX) / 2, my: (minY + maxY) / 2, size: Math.max(maxX - minX, maxY - minY) };
  })());
  function draw(cv, t) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2), W = cv.clientWidth, H = cv.clientHeight;
    if (!W) return;
    if (cv.width !== Math.round(W * dpr)) { cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); }
    const ctx = cv.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const color = getComputedStyle(cv).color;
    const m = model(cv.dataset.plan);
    // small inline rings barely rock, and slowly, so they don't distract from the text beside them
    const small = cv.classList.contains("plan-ring--inline");
    const a = MID + (small ? 8 * DEG : SWING) * Math.sin((t / (small ? 11000 : PERIOD)) * 2 * Math.PI), ca = Math.cos(a), sa = Math.sin(a), ct = Math.cos(TILT), st = Math.sin(TILT);
    const scale = (Math.min(W, H) / (m.size * 1.18)) * (SIZE[cv.dataset.plan] || 1), f = 7;
    // put the model's middle (leaned like the ring) in the middle of the canvas
    const cx = W / 2 - (m.mx * ct - m.my * st) * scale, cy = H / 2 + (m.mx * st + m.my * ct) * scale;
    const project = ([x, y, z]) => {
      const x1 = x * ca + z * sa, z1 = -x * sa + z * ca, x2 = x1 * ct - y * st, y2 = x1 * st + y * ct, k = f / (f - z1);
      return [cx + x2 * k * scale, cy - y2 * k * scale];
    };
    const flat = m.tris.map((tri) => tri.map(project));
    const pass = (fill, stroke, width) => {
      ctx.fillStyle = fill; ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.lineJoin = "round";
      for (const [p, q, r] of flat) { ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.lineTo(r[0], r[1]); ctx.closePath(); ctx.fill(); ctx.stroke(); }
    };
    pass(color, color, 0.6);
  }
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const live = new Set();
  const io = new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? live.add(e.target) : live.delete(e.target))));
  canvases.forEach((cv) => { io.observe(cv); draw(cv, 1200); });
  const loop = (now) => { live.forEach((cv) => draw(cv, reduce ? 1200 : now)); if (!reduce) requestAnimationFrame(loop); };
  requestAnimationFrame(loop);
  if (reduce) new MutationObserver(() => canvases.forEach((cv) => draw(cv, 1200))).observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
})();

// Links to a spot on the same page glide there instead of jumping.
document.addEventListener("click", (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a || e.defaultPrevented || a.getAttribute("href").length < 2) return;
  const t = document.getElementById(decodeURIComponent(a.getAttribute("href").slice(1)));
  if (!t) return;
  e.preventDefault();
  t.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  history.pushState(null, "", a.getAttribute("href"));
});

// ---------------------------------------------------------------
// Plan gems (plan cards): Essentials a simple point stone, Business a square cut, Full Suite a round brilliant.
// Real 3D shapes turning on a tilted axis, drawn in flat tones of the plan's colour, each mood in its own way.
// Light to run: only gems on screen are drawn, about 30 frames a second, and still with reduced motion.
// ---------------------------------------------------------------
(function () {
  const gems = [...document.querySelectorAll("canvas.plan-gem[data-plan]")];
  if (!gems.length) return;
  const circle = (n, r, y, off = 0) => Array.from({ length: n }, (_, i) => { const a = (i + off) / n * 2 * Math.PI; return [r * Math.cos(a), y, r * Math.sin(a)]; });
  // an emerald cut's outline: a rectangle with its corners cut, lying flat (table up), at height y
  const octRect = (s, y, W = 1, D = .74, c = .3) => [[-W + c, D], [W - c, D], [W, D - c], [W, -D + c], [W - c, -D], [-W + c, -D], [-W, -D + c], [-W, D - c]].map(([x, z]) => [x * s, y, z * s]);
  // Whole faces (not triangles), so the edge lines only fall on the gem's real edges
  function loft(rings) {
    const faces = [];
    for (let k = 0; k < rings.length - 1; k++) {
      const A = rings[k], B = rings[k + 1];
      if (A.length === 1 || B.length === 1) {
        const tip = A.length === 1 ? A[0] : B[0], R = A.length === 1 ? B : A;
        R.forEach((p, i) => { const f = [tip, p, R[(i + 1) % R.length]]; f.alt = i % 2; faces.push(f); });
      } else if (B.length === 2 * A.length) {
        // star facets: each table edge fans out to three points of the finer ring below it
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
  // Three different stones, each clearly finer than the last, with its own outline:
  // Essentials a simple point stone, Business a square step cut, Full Suite a round brilliant.
  const sq = (scale, y) => octRect(scale, y, 1, 1, .32);
  const MODELS = {
    // a simple stone: a very short top above a tall point, almost an upside-down pyramid
    essentials: () => loft([circle(4, .64, .34), circle(4, .8, .18), [[0, -.72, 0]]]),
    // a square cut with bevelled corners: the table, one level of sides, and a point
    business: () => loft([sq(.56, .52), sq(.95, .12), [[0, -1.02, 0]]]),
    // a round brilliant: an eight-sided table ringed by star facets, a sixteen-sided girdle,
    // and a pavilion cut down to the point
    full: () => loft([circle(8, .52, .58), circle(16, .82, .36), circle(16, 1, .14), circle(16, 1, .05), circle(16, .5, -.55), [[0, -1.12, 0]]]),
  };
  // how big each one sits in its space: the gems grow with the plan
  const SIZE = { essentials: .8, business: .86, full: 1 };
  const cache = {};
  const model = (plan) => cache[plan] || (cache[plan] = (() => {
    const polys = MODELS[plan](), pts = polys.flat();
    const c = [0, 1, 2].map((k) => pts.reduce((sum, p) => sum + p[k], 0) / pts.length);
    // each face's outward normal (Newell's method); the shapes are convex, so back faces are simply skipped
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
  // light for the sides: from the upper left, the way the stone leans
  const SIDE = (() => { const l = [-.75, .5, .45], d = Math.hypot(...l); return l.map((v) => v / d); })();
  const LIGHT = (() => { const l = [-.45, .75, .55], d = Math.hypot(...l); return l.map((v) => v / d); })();
  // reading a colour from CSS is slow, so each canvas remembers its colour and checks again only once a second
  const rgbOf = (cv, now) => {
    // ...and straight away when its plan or the mood changes, so the colour never lags behind a click
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
    // spin around the gem's own axis, tip it toward the viewer, then lean the axis
    const rot = ([x, y, z]) => { const x1 = x * ca + z * sa, z1 = -x * sa + z * ca; const y2 = y * ci - z1 * si, z2 = y * si + z1 * ci; return [x1 * ct - y2 * st, x1 * st + y2 * ct, z2]; };
    const f = 8, scale = Math.min(W, H) / 2 / (1.25 * 1.08) * SIZE[cv.dataset.plan];
    // Each plan has its own finish: Essentials muted, Business in full color, Full Suite rich and glowing.
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
    // thin edges, a shade of the gem's own color (softer on the muted Essentials)
    const dark = .22;
    ctx.strokeStyle = `rgba(${col0.map((v) => Math.round(v * dark))}, ${small ? .55 : FINISH.edge})`;
    const shown = [];
    for (const face of m.faces) {
      // a face is visible when it faces the viewer's actual position (the view has perspective), not just "forward"
      const n = rot(face.n), q = face.pts.map(rot), c = q[0];
      if (n[0] * -c[0] + n[1] * -c[1] + n[2] * (f - c[2]) <= 0) continue;
      shown.push({ face, n, p: q.map(([x, y, z]) => { const k = f / (f - z); return [W / 2 + x * k * scale, H / 2 - y * k * scale, z]; }) });
    }
    const path = (p) => { ctx.beginPath(); p.forEach((pt, i) => (i ? ctx.lineTo(pt[0], pt[1]) : ctx.moveTo(pt[0], pt[1]))); ctx.closePath(); };
    // The sides go from light to dark across the stone as it turns; the top face always points the same way,
    // so its tone stays put.
    // Each mood draws the stone its own way:
    //   Calm: shaded faces in the mood colour, thin darker edges
    //   Tangy: the same, with thick ink edges and a hard ink shadow offset down and right
    //   Transit (a dark theme): the coloured stone with its cut drawn in white
    //   Sophisticated: no fill at all, just the cut drawn as a fine gold outline
    const mood = document.documentElement.dataset.mood;
    const style = { tangy: "tangy", transit: "transit", transitdark: "transit", sophisticated: "sophisticated" }[mood] || "calm";
    if (style === "tangy") {
    // one ink line for every edge, outer and inner alike, a little heavier than the other moods
    ctx.strokeStyle = "#111"; ctx.lineJoin = "round"; ctx.lineWidth = small ? 1.2 : Math.max(2, W / 34);
  } else if (style === "transit") {
      ctx.strokeStyle = "#fff"; ctx.lineWidth = small ? (plan === "full" ? .6 : .8) : Math.max(1, W / (plan === "full" ? 95 : 65));
    } else if (style === "sophisticated") {
      ctx.strokeStyle = `rgb(${base.map(Math.round)})`; ctx.lineWidth = small ? .7 : Math.max(1, W / 90);
    }
    for (const { face, p, n } of shown) {
      const up = (face.n[1] + 1) / 2, alt = face.alt ? FINISH.alt : -FINISH.alt;
      let tone, lift;
      // every stone is lit from the upper left: faces brighten as they turn toward it and keep darkening as they
      // turn away, so the lower facets still read as separate faces. Full Suite's richer colour sets it apart.
      if (plan === "full") {
        const d = n[0] * SIDE[0] + n[1] * SIDE[1] + n[2] * SIDE[2], side = d > 0 ? d : d * .42;
        // the same light as Business (Full Suite's richer colour still sets it apart)
        tone = .58 + .6 * side + alt; lift = Math.max(0, side - .45) * 1.5;
        if (face.n[1] > .99) { tone += .2; lift += .35; }
      }
      else {
        const d = n[0] * SIDE[0] + n[1] * SIDE[1] + n[2] * SIDE[2], side = d > 0 ? d : d * .42;
        tone = .58 + .6 * side + alt; lift = Math.max(0, side - .45) * FINISH.lift;
        // the table catches more light
        if (face.n[1] > .99) { tone += .2; lift += .35; }
        // Essentials is brightened a touch overall
        if (plan === "essentials") { tone += .08; lift += .12; }
      }
      // The facets underneath shade in one smooth sweep around the stone, like the top: lightest where they face the
      // front left, darkest at the back right, with no light/dark alternation from facet to facet.
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
    // a sparkle in the same spot on the crown, twinkling every few seconds
    if (plan === "full" && !small) {
      // while you hover and it spins faster, it twinkles more often
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
  // Hovering a gem spins it faster; letting go eases it back down so it lands in step with the others.
  // Pressing a gem pushes it down, and holding it slows it to a gentle turn; let go and it rises back up and
  // catches back up with the others.
  // Each gem keeps an extra angle on top of the shared one: it grows while hovered, shrinks to hold the gem
  // still while paused, and afterwards glides to the nearest whole turn ahead, so the gems line up again.
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
      // once the gem has slowed (after a moment's hold), the twinkle slows with it
      clearTimeout(cv._slowT); cv._slowT = setTimeout(() => { if (cv._held && S()) S().rate(.32); }, 250);
    });
    const release = () => { cv._held = false; cv.classList.remove("is-held"); clearTimeout(cv._slowT); S() && S().rate(1); };
    hit.addEventListener("pointerup", release); hit.addEventListener("pointercancel", release);
  });
  const step = (cv, dt, now) => {
    let x = cv._extra || 0, v = cv._vel || 0;
    // it only slows once you've held it a moment, so a quick click doesn't slow it
    const paused = cv._held && now - (cv._heldAt || 0) > 250;
    // held: it keeps turning, slowly (a quarter of its normal speed), easing down into it
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
  // redraw when the mood changes (the colour and the drawing style follow it)
  new MutationObserver(() => gems.forEach((cv) => { cv._rgb = null; draw(cv, reduce ? 1500 : performance.now()); }))
    .observe(document.documentElement, { attributes: true, attributeFilter: ["data-mood"] });
})();

// An open FAQ closes when you click its answer too, not just the question (links in the answer still work).
document.addEventListener("click", (e) => {
  const d = e.target.closest(".faq__list details[open], details.faq[open]");
  if (!d || e.target.closest("summary, a, button, input, select, textarea, label")) return;
  if (String(window.getSelection && window.getSelection()).trim()) return; // selecting text shouldn't close it
  d.open = false;
});

// A satisfying click when a key goes down (the "Change the Channel" board and the mood pop-up).
// Made on the fly with Web Audio, so there's no sound file to load: a sharp, bright tick.
(function () {
  let ac = null;
  // Sound on/off, remembered on this device. Every sound checks it first.
  let muted = false;
  try { muted = localStorage.getItem("wdw-muted") === "1"; } catch (e) {}
  // (the TVs used to dance and send out waves whenever a sound played; that's switched off)
  const dance = () => {};
  // the switches read "on" when sound is playing
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
      // a sharp, bright tick: a very short burst of high noise...
      const len = Math.floor(ac.sampleRate * .012), buf = ac.createBuffer(1, len, ac.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 8);
      const noise = ac.createBufferSource(), hp = ac.createBiquadFilter(), ng = ac.createGain();
      noise.buffer = buf; hp.type = "highpass"; hp.frequency.value = 3500; ng.gain.value = 1;
      noise.connect(hp).connect(ng).connect(out); noise.start(t);
      // ...with a tiny resonant snap, like a switch's spring
      const ping = ac.createOscillator(), pg = ac.createGain();
      ping.type = "triangle"; ping.frequency.setValueAtTime(2600, t); ping.frequency.exponentialRampToValueAtTime(1900, t + .02);
      pg.gain.setValueAtTime(.35, t); pg.gain.exponentialRampToValueAtTime(.001, t + .025);
      ping.connect(pg).connect(out); ping.start(t); ping.stop(t + .03);
    } catch (e) {}
  };
  // An old TV switching on: a soft, warm rise as the tube warms up, a low hum and a little static.
  window.wdwTvOn = () => {
    dance(2100, true);
    if (muted) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      if (ac.state === "suspended") ac.resume();
      const t = ac.currentTime, out = ac.createGain();
      out.gain.value = .22; out.connect(ac.destination);
      // a soft, warm rise as the tube warms up (lower and rounder than a whine)
      [[1, .07], [2, .012]].forEach(([mult, vol]) => {
        const o = ac.createOscillator(), g = ac.createGain();
        o.type = "sine";
        o.frequency.setValueAtTime(700 * mult, t); o.frequency.exponentialRampToValueAtTime(1800 * mult, t + .5);
        g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .1);
        g.gain.setValueAtTime(vol, t + .45); g.gain.exponentialRampToValueAtTime(.0001, t + 1.1);
        o.connect(g).connect(out); o.start(t); o.stop(t + 1.15);
      });
      // a gentle low hum underneath, like the set coming alive
      const hum = ac.createOscillator(), hg = ac.createGain(), lp = ac.createBiquadFilter();
      hum.type = "triangle"; hum.frequency.value = 110; lp.type = "lowpass"; lp.frequency.value = 400;
      hg.gain.setValueAtTime(.0001, t); hg.gain.exponentialRampToValueAtTime(.12, t + .06); hg.gain.exponentialRampToValueAtTime(.0001, t + .7);
      hum.connect(lp).connect(hg).connect(out); hum.start(t); hum.stop(t + .75);
      // a light, soft hiss of static
      const len = Math.floor(ac.sampleRate * .45), buf = ac.createBuffer(1, len, ac.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      const st = ac.createBufferSource(), sf = ac.createBiquadFilter(), sg = ac.createGain();
      st.buffer = buf; sf.type = "bandpass"; sf.frequency.value = 1800; sf.Q.value = .5;
      sg.gain.setValueAtTime(.0001, t); sg.gain.exponentialRampToValueAtTime(.04, t + .03); sg.gain.exponentialRampToValueAtTime(.0001, t + .4);
      st.connect(sf).connect(sg).connect(out); st.start(t);
    } catch (e) {}
  };
  // A sheet of paper turning over: a short, soft swoosh of air (filtered noise that sweeps up and fades).
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
  // Pressing a key that's already down: a dull, low clunk, like a button that can't go any further.
  const clunk = (big) => {
    dance(1380, big);
    if (muted) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      if (ac.state === "suspended") ac.resume();
      const t = ac.currentTime, out = ac.createGain();
      out.gain.value = .55; out.connect(ac.destination);
      // a short low thump that drops in pitch...
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = "sine"; o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(70, t + .09);
      g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.6, t + .005); g.gain.exponentialRampToValueAtTime(.0001, t + .14);
      o.connect(g).connect(out); o.start(t); o.stop(t + .16);
      // ...with a muffled knock of plastic on top
      const len = Math.floor(ac.sampleRate * .03), buf = ac.createBuffer(1, len, ac.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 4);
      const n = ac.createBufferSource(), lp = ac.createBiquadFilter(), ng = ac.createGain();
      n.buffer = buf; lp.type = "lowpass"; lp.frequency.value = 900; ng.gain.value = .5;
      n.connect(lp).connect(ng).connect(out); n.start(t);
    } catch (e) {}
  };
  // The gems: a soft twinkle of little bells while you hover (it slows down with the gem when you hold it),
  // and a glassy clink when you press one.
  const bell = (f, t, vol, decay) => {
    const g = ac.createGain();
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .006); g.gain.exponentialRampToValueAtTime(.0001, t + decay);
    g.connect(ac.destination);
    // a pure tone with a faint bell overtone above it
    [[1, 1], [2.76, .18]].forEach(([m, v]) => {
      const o = ac.createOscillator(), og = ac.createGain();
      o.type = "sine"; o.frequency.value = f * m; og.gain.value = v;
      o.connect(og).connect(g); o.start(t); o.stop(t + decay + .05);
    });
  };
  // a major pentatonic scale up high, so any run of notes sounds pretty
  const SCALE = [1318.5, 1480, 1661.2, 1975.5, 2217.5, 2637, 2960];
  let twinkleTimer = null, twinkleRate = 1, twinkleStep = 0;
  const twinkle = () => {
    // the TV dances for as long as you hover, even muted; the bells only ring with sound on
    dance(Math.round(700 / Math.max(twinkleRate, .3)));
    if (!muted) try {
      // wander up and down the scale a step or two at a time
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
    // 1 = normal; lower while the gem is held and turning slowly
    rate(r) { twinkleRate = r; },
    clink() {
      dance(1500);
      if (muted) return;
      try {
        ac = ac || new (window.AudioContext || window.webkitAudioContext)();
        if (ac.state === "suspended") ac.resume();
        const t = ac.currentTime;
        // two bright, slightly clashing partials, like a fingernail on crystal
        bell(3136, t, .12, .5); bell(4699, t, .05, .35);
        const len = Math.floor(ac.sampleRate * .008), buf = ac.createBuffer(1, len, ac.sampleRate), d = buf.getChannelData(0);
        for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
        const n = ac.createBufferSource(), hp = ac.createBiquadFilter(), ng = ac.createGain();
        n.buffer = buf; hp.type = "highpass"; hp.frequency.value = 5000; ng.gain.value = .15;
        n.connect(hp).connect(ng).connect(ac.destination); n.start(t);
      } catch (e) {}
    },
  };
  // The big TV's dials and speaker: the top dial spins with a clack, the small one ticks round 20° with a ratchet,
  // and the speaker plays a little jingle.
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
    // a short, bright TV jingle (about two seconds)
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
        // the big dial sweeps a random big way round (200–340°) and stays where it lands; the small one ticks a random 25–70°
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
  // keyboard presses of the same keys make the same sounds
  document.addEventListener("keydown", (e) => {
    const key = (e.key === "Enter" || e.key === " ") && document.activeElement && document.activeElement.closest("[data-tv-key], .mood__opt, .moods__key");
    if (key) sound(key);
  });
})();

// Change the Channel: if "Press one. Seriously, press one." and the Sound effects switch can't share a line,
// drop the "Seriously, press one." part so they do.
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

// Homepage plan cards: a click anywhere on a card (outside its own links) goes where its arrow goes.
document.querySelectorAll(".hplans .hplan").forEach((card) => {
  const go = card.querySelector(".hplan__go");
  if (!go) return;
  card.addEventListener("click", (e) => {
    if (e.target.closest("a, button") || String(getSelection()).trim()) return;
    go.click();
  });
});

// Pricing page: the buyout calculator. Months with me sets the year; each year has its buyout in months of the plan,
// plus the one-time transfer fee. From month 73 (after six years) the site is already yours.
(function () {
  const box = document.querySelector("[data-buycalc]");
  if (!box) return;
  const PRICE = { essentials: 99, business: 149, full: 249 };
  const MONTHS = [24, 20, 16, 12, 8, 4], FEE = 299;
  const money = (n) => "$" + Math.round(n).toLocaleString("en-US");
  const set = (k, v) => { box.querySelector(`[data-bc="${k}"]`).textContent = v; };
  const range = box.querySelector("[data-bc-months]");
  let plan = "business", bill = "yearly";
  const render = () => {
    const m = +range.value;
    const per = bill === "yearly" ? Math.round(PRICE[plan] * 0.8) : PRICE[plan];
    range.style.setProperty("--fill", ((m - 1) / 72 * 100) + "%");
    if (m > 72) {
      set("when", "After six years");
      set("buyout", "$0"); set("buyout-note", "After six years, the buyout price is $0: you own the site.");
      set("total", money(FEE)); set("total-note", `If you decide to move it away from Web Design Wife, the ${money(FEE)} technical transfer fee covers packaging the site and handing the code and content to you or your new developer.`);
    } else {
      const year = Math.ceil(m / 12), n = MONTHS[year - 1];
      set("when", `Month ${m} · year ${year}`);
      set("buyout", money(n * per)); set("buyout-note", `${n} months of your plan at ${money(per)}/month`);
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

// "Built for" band: three slot reels (verb, business, neighborhood) that tick one step at a time, taking turns.
// Spin whirls them through words and stars; your spins land on three stars, then roll on to a new sentence.
// Now and then a gloved hand pops up from the band's bottom line, hovers, and presses Spin itself (its spins
// skip the stars and go straight to a new sentence).
document.querySelectorAll(".for--spin .slot.tick").forEach((slot) => {
  const band = slot.closest(".for--spin"), btn = slot.querySelector(".drift__btn"), msg = slot.querySelector(".jackpot"), hand = band.querySelector(".pokehand");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const VERBS = ["Built", "Designed", "Developed", "Crafted", "Launched", "Managed", "Made", "Polished"];
  const TYPES = ["Plumbers", "Salons", "Barbers", "Dentists", "Restaurants", "Contractors", "Cleaners", "Gyms", "Accountants", "Bakeries", "Florists", "Pharmacies", "Law offices", "Auto shops"];
  const HOODS = ["Bushwick", "Park Slope", "Astoria", "Harlem", "Flushing", "Williamsburg", "Jackson Heights", "Bay Ridge", "The Bronx", "Chelsea", "Fort Greene", "St. George", "Crown Heights", "Long Island City"];
  const STAR = '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 4.5l4.7 9.7 10.6 1.3-7.8 7.4 2 10.5L20 28.2l-9.5 5.2 2-10.5-7.8-7.4 10.6-1.3z" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linejoin="round"/></svg>';
  const LISTS = [VERBS, TYPES, HOODS], LOOPS = 12;
  const wordsHTML = (items) => Array.from({ length: LOOPS }, () => items.map((t) => `<li><span>${t}</span></li>`).join("")).join("");

  const reels = [...slot.querySelectorAll(".treel")].map((reel, k) => {
    const items = LISTS[k], ul = reel.querySelector("ul"), n = items.length;
    ul.innerHTML = wordsHTML(items);
    return { reel, ul, items, n, dir: reel.dataset.dir === "down" ? -1 : 1, pos: n * 6 + (k === 1 ? 5 : 0) };
  });
  // each window is as wide as its longest word, measured in whichever mood's font is showing
  const horizMQ = matchMedia("(max-width: 0px)"), horiz = () => false;
  const size = () => {
    const widths = reels.map((r) => {
      const probe = document.createElement("li"); probe.style.cssText = "position:absolute;visibility:hidden;width:auto;padding:0 .5em"; r.ul.appendChild(probe);
      let w = 0; r.items.forEach((t) => { probe.textContent = t; w = Math.max(w, probe.getBoundingClientRect().width); }); probe.remove();
      return Math.ceil(w);
    });
    // stacked on phones, all three frames share the widest one's width
    const same = Math.max(...widths);
    reels.forEach((r, k) => {
      r.reel.style.width = horiz() ? "" : widths[k] + 2 + "px";
      r.reel.style.setProperty("--fw", (horiz() ? same : widths[k]) + 4 + "px");
      show(r, 0);
    });
  };
  horizMQ.addEventListener("change", () => setTimeout(() => { size(); fit(); }, 30));
  const row = (r) => r.ul.firstElementChild.getBoundingClientRect()[horiz() ? "width" : "height"];
  const show = (r, ms, ease) => {
    r.ul.style.transition = ms ? `transform ${ms}ms ${ease}, filter .45s ease-out` : "filter .45s ease-out";
    r.ul.style.transform = horiz()
      ? `translateX(${-r.pos * row(r) + (r.reel.clientWidth - row(r)) / 2}px)`
      : `translateY(${-(r.pos - peek()) * row(r)}px)`;
    if (horiz()) huddle(r, ms);
  };
  // phones: every slot is as wide as the frame, so short neighbours would sit far off; nudge the words either side
  // in towards the frame (and back to centre as one arrives), so they sit a short, even distance from it
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
  // keep the sentence centred unless it would run into the Sound switch
  const wrap = slot.parentElement, sound = wrap.querySelector(".bf-sound");
  const fit = () => {
    if (!sound) return;
    wrap.classList.remove("is-tight");
    const kids = [...slot.children].filter((c) => c.offsetParent && !c.classList.contains("jackpot") && !c.classList.contains("confetti"));
    const right = Math.max(...kids.map((c) => c.getBoundingClientRect().right));
    if (right + 16 > sound.getBoundingClientRect().left) wrap.classList.add("is-tight");
  };
  // phones: shrink the sentence's text until all three reels fit on one line
  const phoneMQ = matchMedia("(max-width: 600px)");
  const shrink = () => {
    slot.style.fontSize = "";
    if (!phoneMQ.matches) return;
    size();
    const kids = [...slot.children].filter((c) => c.classList.contains("treel") || c.classList.contains("slot__word"));
    // a key's socket (version B) reaches a little past its reel, so measure that instead
    const need = kids.reduce((w, c) => w + (c.querySelector(".treel__well") || c).getBoundingClientRect().width, 0) + parseFloat(getComputedStyle(slot).columnGap || 0) * (kids.length - 1);
    const room = slot.clientWidth - 8; // a little slack for the frames' shadows
    if (need > room) { slot.style.fontSize = (parseFloat(getComputedStyle(slot).fontSize) * room / need) + "px"; }
  };
  const sizeAll = () => { shrink(); size(); fit(); };
  addEventListener("resize", () => { shrink(); size(); });
  sizeAll();
  if (document.fonts) document.fonts.ready.then(sizeAll);
  addEventListener("resize", fit);
  new MutationObserver(() => setTimeout(fit, 80)).observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  addEventListener("resize", size);
  new MutationObserver(() => setTimeout(size, 60)).observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

  let drifting = true, spins = 0;
  const STEP = 4500, GLIDE = 1600, CLICK = "cubic-bezier(.34,1.45,.55,1)";
  const step = (r) => {
    if (!drifting || reduce || document.hidden) return;
    // after a win the stars stay put until each reel's next ordinary step, which carries on to the new word
    if (r.after) {
      const { to, toAt } = r.after; r.after = null;
      r.pos = toAt; show(r, GLIDE, CLICK);
      setTimeout(() => { r.reel.classList.add("is-click"); setTimeout(() => r.reel.classList.remove("is-click"), 120); }, GLIDE * .6);
      const gen = spins;
      setTimeout(() => { if (gen !== spins) return; r.reel.classList.remove("is-win"); r.ul.innerHTML = wordsHTML(r.items); r.pos = r.n * 6 + to; show(r, 0); }, GLIDE + 40);
      return;
    }
    recentre(r); show(r, 0); void r.ul.offsetWidth;
    r.pos += r.dir; show(r, GLIDE, CLICK);
    setTimeout(() => { r.reel.classList.add("is-click"); setTimeout(() => r.reel.classList.remove("is-click"), 120); }, GLIDE * .6);
  };
  reels.forEach((r, k) => setTimeout(() => { step(r); setInterval(() => step(r), STEP); }, 900 + k * STEP / 3));

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

  // Spin. It can be pressed again while it's still spinning: each press starts a fresh full spin from wherever
  // the reels are at that moment, and only the last one lands (and only its timers run)
  btn.addEventListener("click", () => {
    const gen = ++spins; drifting = false; msg.classList.remove("is-on");
    const win = btn.dataset.byHand !== "1"; // your spins line up three stars; the hand's never do
    const LEN = 24, plans = [];
    reels.forEach((r, k) => {
      const n = r.n; r.after = null; r.reel.classList.remove("is-win");
      // where the reel is right now, even mid-glide: the row showing in the frame, and the one it came from
      const R = row(r), ty = new DOMMatrixReadOnly(getComputedStyle(r.ul).transform).m42;
      const now = -ty / R + peek(), at0 = Math.max(1, Math.min(r.ul.children.length - 2, Math.round(now))), frac = now - at0;
      const cur = r.ul.children[at0].outerHTML, prev = r.ul.children[at0 - r.dir].outerHTML;
      let to; do { to = Math.floor(Math.random() * n); } while (n > 1 && r.ul.children[at0].textContent === r.items[to]);
      const word = (i) => `<li><span>${r.items[((i % n) + n) % n]}</span></li>`, star = () => `<li class="bf-ico">${STAR}</li>`;
      // current word → a whirl of words and stars → (your spins: a star) → the new word with its real neighbours
      const seq = [prev, cur];
      for (let i = 0; i < LEN; i++) seq.push(i % 2 ? word(Math.floor(Math.random() * n)) : star());
      // your spins stop on a star with the new word right after it; the hand's go straight to the new word
      const symAt = seq.length; if (win) seq.push(star()); else seq.push(word(to - r.dir));
      const toAt = seq.length; seq.push(word(to), word(to + r.dir), word(to + 2 * r.dir));
      const L = seq.length, items = r.dir > 0 ? seq : seq.slice().reverse(), at = (i) => (r.dir > 0 ? i : L - 1 - i);
      r.ul.innerHTML = items.join("");
      r.pos = at(1) + frac; show(r, 0); void r.ul.offsetWidth;
      const ms = reduce ? 0 : 1300 + k * 350;
      r.reel.classList.add("is-spinning"); r.pos = at(win ? symAt : toAt); show(r, ms, "cubic-bezier(.15,.85,.25,1.06)");
      // the blur eases off while the reel is still slowing, so the last few rows are crisp as it settles
      setTimeout(() => { if (gen === spins) r.reel.classList.remove("is-spinning"); }, ms * .45);
      plans.push({ r, to, toAt: at(toAt) });
    });
    const land = reduce ? 0 : 1300 + 2 * 350 + 40;
    const later = (fn, ms) => setTimeout(() => { if (gen === spins) fn(); }, ms);
    if (win) later(() => {
      reels.forEach((r) => { r.reel.classList.remove("is-win"); void r.reel.offsetWidth; r.reel.classList.add("is-win"); });
      confetti();
    }, land);
    if (win) {
      // hold the stars, then let the usual ticking carry on from them
      later(() => { msg.classList.remove("is-on"); plans.forEach(({ r, to, toAt }) => { r.after = { to, toAt }; }); drifting = true; }, land + 1600);
    } else {
      later(() => { plans.forEach(({ r, to }) => { r.ul.innerHTML = wordsHTML(r.items); r.pos = r.n * 6 + to; show(r, 0); }); drifting = true; }, land + 60);
    }
  });

  // phones: no Spin button; a tap anywhere on the sentence spins it
  if (hand) band.addEventListener("click", (e) => { if (phoneMQ.matches && !e.target.closest(".drift__btn")) btn.click(); });

  // phones: a lever on the right edge; drag the red ball down (or tap it) to spin
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

  // the hand (only where the round Spin button is showing)
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  // what the hand presses: on desktop the Spin button, reaching in from the right edge; on phones (no button)
  // the middle reel, rising from the band's bottom line
  const target = () => (btn.offsetParent ? btn : slot.querySelector(".treel--biz .treel__frame"));
  const aim = () => {
    const b = band.getBoundingClientRect(), r = target().getBoundingClientRect(), side = !!btn.offsetParent;
    hand.classList.toggle("from-right", side);
    if (side) {
      // turned to point left, the fingertip sits 126px left of the sleeve's end (which is 22px in, 130px down)
      const tipX = r.right - b.left - 6, tipY = r.top - b.top + r.height / 2;
      hand.style.setProperty("--hx", (tipX + 126 - 22) + "px");
      hand.style.setProperty("--hy", (tipY - 130) + "px");
      hand.style.setProperty("--hxo", (b.width + 150) + "px");
    } else {
      // the fingertip, at the end of the press, lands on the middle of the frame (k: the hand is smaller on phones)
      const k = hand.offsetHeight / 130, cx = r.left - b.left + r.width / 2, cy = r.top - b.top + r.height * .55;
      hand.style.setProperty("--hx", (cx + 58 * k + 4) + "px");
      hand.style.setProperty("--hy", (cy - b.height + 102 * k + 6) + "px");
    }
  };
  async function poke() {
    if (reduce || document.hidden || !drifting) return;
    aim(); hand.classList.remove("is-leave"); hand.classList.add("is-up", "is-hover"); await wait(380);
    await wait(900 + Math.random() * 700);
    hand.classList.remove("is-hover"); hand.classList.add("is-press"); btn.classList.add("is-down");
    const tapped = btn.offsetParent ? null : slot.querySelector(".treel--biz");
    if (tapped) { tapped.classList.add("is-click"); setTimeout(() => tapped.classList.remove("is-click"), 140); }
    btn.dataset.byHand = "1"; btn.click(); delete btn.dataset.byHand; await wait(110);
    hand.classList.remove("is-press"); btn.classList.remove("is-down"); await wait(140);
    hand.classList.add("is-leave"); hand.classList.remove("is-up"); await wait(240);
    hand.classList.remove("is-leave");
  }
  const next = () => setTimeout(async () => { await poke(); next(); }, 8000 + Math.random() * 8000);
  const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { io.disconnect(); setTimeout(async () => { await poke(); next(); }, 3000); } }, { threshold: .6 });
  if (hand) io.observe(band);

  // version B: no Spin button and no hand; each of the three word frames is a key. Press any of them to spin.
  // The first time the band comes into view, the middle key presses itself once, to show it can be pressed.
  if (band.classList.contains("for--keys")) {
    reels.forEach((r) => {
      const up = () => r.reel.classList.remove("is-press");
      r.reel.addEventListener("pointerdown", () => r.reel.classList.add("is-press"));
      r.reel.addEventListener("pointerup", up); r.reel.addEventListener("pointerleave", up); r.reel.addEventListener("pointercancel", up);
      r.reel.addEventListener("click", () => btn.click());
    });
    const demo = new IntersectionObserver((es) => {
      if (!es.some((e) => e.isIntersecting)) return;
      demo.disconnect();
      if (reduce) return;
      setTimeout(async () => {
        const mid = reels[1].reel;
        mid.classList.add("is-press", "is-demo"); await wait(220);
        btn.dataset.byHand = "1"; btn.click(); delete btn.dataset.byHand;
        mid.classList.remove("is-press"); await wait(700); mid.classList.remove("is-demo");
      }, 1200);
    }, { threshold: .6 });
    demo.observe(band);
  }
});
