// Get started page: plan picker, live order summary, saved progress, and checkout hand-off.
(function () {
  const form = document.getElementById("start-form");
  if (!form) return;

  // prices come from the build (build_home.py PLANS → window.WDW_PLANS)
  const PLANS = Object.fromEntries(Object.entries(window.WDW_PLANS).map(([k, p]) => [k, { ...p, price: p.month }]));
  const money = (n) => "$" + n.toLocaleString("en-US");
  const yearly = (p) => p.year;
  const sum = (k) => document.querySelector(`[data-sum="${k}"]`);
  const KEY = "wdw-start";

  // Prices on the plan cards
  Object.entries(PLANS).forEach(([k, p]) => {
    const el = document.querySelector(`[data-price="${k}"]`);
    if (el) el.textContent = `${money(p.price)}/month`;
  });

  // Plan and billing from the link they clicked, then anything they already typed here
  const params = new URLSearchParams(location.search);
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (e) {}
  Object.entries(saved).forEach(([name, value]) => {
    const field = form.elements[name];
    if (!field || name === "agree" || name === "billing") return;
    if (field instanceof RadioNodeList) field.value = value; else field.value = value;
  });
  if (PLANS[params.get("plan")]) form.elements.plan.value = params.get("plan");
  // Billing uses the same switch as the homepage (script.js runs it); this page just reads it.
  const sw = document.querySelector(".billing__switch");
  const billing = () => (sw && sw.getAttribute("aria-checked") === "true" ? "yearly" : "monthly");
  const wantBilling = ["monthly", "yearly"].includes(params.get("billing")) ? params.get("billing") : saved.billing;
  // yearly is the default; someone who chose monthly gets the switch turned off
  if (wantBilling === "monthly" && sw && sw.getAttribute("aria-checked") === "true") sw.click();

  const main = document.querySelector(".start");
  function render() {
    const p = PLANS[form.elements.plan.value] || PLANS.business;
    const isYearly = billing() === "yearly";
    // Essentials is bought here; Business and Full Suite are applied for (nothing is charged until I approve it)
    const key0 = PLANS[form.elements.plan.value] ? form.elements.plan.value : "business";
    main.dataset.plan = key0;
    main.dataset.mode = p.apply ? "apply" : "buy";
    sum("plan").textContent = p.name;
    // the selected plan's gem and name colour follow the choice
    const key = PLANS[form.elements.plan.value] ? form.elements.plan.value : "business";
    sum("plan").dataset.plan = key;
    const gem = document.querySelector(".ssum__gem"); if (gem) gem.dataset.plan = key;
    const F = window.WDW_FOUNDING;
    if (p.apply) {
      sum("today").textContent = "$0";
      // the setup they'd pay once approved, said quietly (no strike-through)
      sum("setup").textContent = money(F ? p.found : p.setup);
      // the price shown is already the Founding 5 price; it's only for the first five clients I accept
      sum("setup-was").textContent = F
        ? `That's 50% off the regular ${money(p.setup)}, a thank-you to the first five clients I accept. If those five spots are taken by the time you're approved, setup is the regular ${money(p.setup)}. `
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
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {}
  }

  form.addEventListener("input", () => { render(); save(); });
  form.addEventListener("change", () => { render(); save(); });
  // The switch lives in the form, so its clicks re-render after script.js flips it.
  form.addEventListener("click", (e) => { if (e.target.closest(".billing")) setTimeout(() => { render(); save(); }, 0); });
  // "Back to website" returns to wherever they came from on this site.
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
      // questions for the other mode are hidden, so they don't count
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
    // Business and Full Suite: the application goes to me to review (TODO: send it to a form backend).
    if (mode === "apply") { location.href = "applied.html"; return; }
    // TODO: create a Stripe Checkout session here and redirect to it, with welcome.html as the
    // success page. Until then, the preview skips checkout and goes straight to the welcome page.
    location.href = "welcome.html";
  });
})();
