// Get started page: plan picker, live order summary, saved progress, and checkout hand-off.
(function () {
  const form = document.getElementById("start-form");
  if (!form) return;

  const PLANS = {
    essentials: { name: "Essentials", price: 99, setup: 199 },
    business: { name: "Business", price: 149, setup: 399 },
    full: { name: "Full Suite", price: 249, setup: 599 },
  };
  const money = (n) => "$" + n.toLocaleString("en-US");
  const yearly = (p) => Math.round(p.price * 12 * 0.8);
  const startDate = new Date(Date.now() + 14 * 864e5).toLocaleDateString("en-US", { month: "long", day: "numeric" });
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
    if (!field || name === "agree") return;
    if (field instanceof RadioNodeList) field.value = value; else field.value = value;
  });
  if (PLANS[params.get("plan")]) form.elements.plan.value = params.get("plan");
  if (["monthly", "yearly"].includes(params.get("billing"))) form.elements.billing.value = params.get("billing");

  function render() {
    const p = PLANS[form.elements.plan.value] || PLANS.business;
    const isYearly = form.elements.billing.value === "yearly";
    sum("plan").textContent = p.name;
    sum("today").textContent = money(p.setup);
    sum("start").textContent = startDate;
    sum("then").textContent = isYearly ? `${money(yearly(p))}/year` : `${money(p.price)}/month`;
    sum("then-note").textContent = isYearly
      ? `Billed yearly, saving ${money(p.price * 12 - yearly(p))}. Your plan starts 14 days from today, around when your site goes live.`
      : "Your plan starts 14 days from today, around when your site goes live.";
    document.querySelectorAll("[data-price]").forEach((el) => {
      const q = PLANS[el.dataset.price];
      el.textContent = isYearly ? `${money(Math.round(q.price * 0.8))}/month, billed yearly` : `${money(q.price)}/month`;
    });
  }

  function save() {
    const data = {};
    [...form.elements].forEach((f) => {
      if (!f.name || f.type === "checkbox" || f.type === "submit") return;
      if (f.type === "radio") { if (f.checked) data[f.name] = f.value; } else data[f.name] = f.value;
    });
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {}
  }

  form.addEventListener("input", () => { render(); save(); });
  form.addEventListener("change", () => { render(); save(); });
  render();

  const msg = form.querySelector(".sform__msg");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let first = null;
    form.querySelectorAll("input").forEach((f) => {
      if (f.type === "radio") return;
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
    // TODO: create a Stripe Checkout session here and redirect to it.
    msg.textContent = "Secure checkout isn't connected yet in this preview. Your details are saved on this device.";
  });
})();
