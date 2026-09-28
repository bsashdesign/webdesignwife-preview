# Generates the blog index and article pages from one template.
# Edit the ARTICLES list below, then run: python3 blog/build.py
import pathlib, html
from comparisons import PLATFORMS, EXTRA, comparison_body

HERE = pathlib.Path(__file__).parent

ARTICLES = [
  {
    "slug": "local-business-website-checklist",
    "kicker": "Checklist",
    "title": "7 things every local business website needs",
    "summary": "The short list that separates sites that get calls from sites that don't.",
    "minutes": 5,
    "body": """
<p>Most local business websites don't fail because they're ugly. They fail because a customer lands on them, can't find what they need in a few seconds, and goes back to Google to pick someone else. Here's the short list that fixes that.</p>

<h2>1. Say what you do and where, right at the top</h2>
<p>The first thing a visitor sees should answer two questions: what do you do, and do you serve my area? “Emergency plumbing in Queens, same-day service” beats “Welcome to our website” every time.</p>

<h2>2. Make contacting you effortless</h2>
<p>Put a clear button near the top, like “Get a free quote” or “Book an appointment,” and repeat it further down the page. On phones, it should be one tap to call, message or get directions.</p>

<h2>3. Show your hours and location clearly</h2>
<p>It sounds obvious, but it's one of the most common reasons people call a competitor instead. Keep hours current, including holidays. Outdated hours cost you customers and trust.</p>

<h2>4. Put your reviews front and center</h2>
<p>People trust other customers more than they trust you. Show your Google rating and a few real reviews near the top of the page, not buried at the bottom.</p>

<h2>5. List your actual services</h2>
<p>Don't just say “plumbing services.” List what you do: drain cleaning, leak repair, water heater installation. Customers scan for their exact problem, and so does Google.</p>

<h2>6. Real photos over stock photos</h2>
<p>A photo of your team, your shop or your finished work builds more trust than the best stock photo. It doesn't need to be professional. It needs to be real.</p>

<h2>7. Fast and built for phones</h2>
<p>Most local searches happen on a phone, often while someone is out and about. If your site is slow or hard to use on a small screen, many of those visitors won't wait around.</p>

<h2>The quick test</h2>
<p>Open your website on your phone and pretend you're a new customer. Can you tell what the business does, see that it's trusted, and contact it within ten seconds? If not, start with the items above.</p>
""",
  },
  {
    "slug": "google-maps-profile",
    "kicker": "Google Maps",
    "title": "Why your Google Maps profile might matter more than your website",
    "summary": "Where local customers actually find you, and how to show up.",
    "minutes": 5,
    "body": """
<p>When someone searches “barber near me” or “dentist in Brooklyn,” the first thing they usually see isn't a list of websites. It's a map with a handful of businesses pinned on it. That's your Google Business Profile, and for many local businesses, it's where the customer decides.</p>

<h2>Many customers never reach your website</h2>
<p>From the map listing, people can call you, get directions, read reviews and see photos without ever clicking through to your site. If your profile is incomplete or out of date, you can lose customers before they even see your website.</p>

<h2>What makes a strong profile</h2>
<ul>
  <li><strong>The right primary category.</strong> It's one of the most important settings, and one of the most commonly wrong. A “Water heater installation service” and a general “Plumber” can show up for different searches.</li>
  <li><strong>Complete details.</strong> Accurate hours, phone number, address or service area, and a description that uses the words your customers search for.</li>
  <li><strong>Services listed.</strong> Add each service you offer so Google knows what you do.</li>
  <li><strong>Recent photos.</strong> Photos of your work, team and storefront, added regularly.</li>
  <li><strong>Reviews, and your replies.</strong> Both the number of reviews and how recent they are matter to customers. Replying to them shows you care.</li>
  <li><strong>Regular posts.</strong> Updates, offers and news keep your profile looking active.</li>
</ul>

<h2>Compare yourself with the top three</h2>
<p>Search for your main service in your area and look at the three businesses Google shows first. How many reviews do they have? How many photos? How complete are their profiles? That gap is usually your to-do list.</p>

<h2>Your website still matters</h2>
<p>Your profile and your website work together. Your profile gets you noticed, and your website is where customers go when they want to know more before they call. Both should say the same thing, with the same name, address, phone number and hours.</p>
""",
  },
  {
    "slug": "diy-agency-or-managed",
    "kicker": "Buying guide",
    "title": "DIY, agency or managed: which website is right for you?",
    "summary": "An honest look at the cost, time and trade-offs of each option.",
    "minutes": 6,
    "body": """
<p>There are three main ways a local business gets a website. Each one makes sense for someone. Here's an honest look at the trade-offs.</p>

<h2>Option 1: Build it yourself</h2>
<p>Website builders like Wix and Squarespace let you build a site yourself for a monthly fee, usually between $20 and $50.</p>
<ul>
  <li><strong>Good for:</strong> people who enjoy design, have spare time and want full control.</li>
  <li><strong>The catch:</strong> the real cost is your time. Building a good site takes many hours, and so does every update after that. Many DIY sites look fine on day one and then sit untouched for years.</li>
</ul>

<h2>Option 2: Hire an agency or freelancer</h2>
<p>A designer builds a custom site for a one-time fee, often in the thousands of dollars.</p>
<ul>
  <li><strong>Good for:</strong> businesses with complex needs, a larger budget and someone in-house to manage the site afterward.</li>
  <li><strong>The catch:</strong> the big bill comes upfront, and edits after launch usually cost extra. It's common to end up with a great site that slowly goes out of date because every change needs a new invoice.</li>
</ul>

<h2>Option 3: A managed website</h2>
<p>You pay a monthly fee, and a designer builds, hosts and maintains the site for you, including ongoing edits.</p>
<ul>
  <li><strong>Good for:</strong> busy owners who want a professional site without a large upfront cost or any technical work.</li>
  <li><strong>The catch:</strong> you're paying for a service, so you're usually not buying the site outright. Check what happens if you leave: who owns the domain, whether you get your content back, and whether there's a buyout option.</li>
</ul>

<h2>Questions to ask before you choose</h2>
<ol>
  <li>How much time can I realistically spend on my website each month?</li>
  <li>Can I afford a large upfront cost, or do I prefer a predictable monthly one?</li>
  <li>Who will update my hours, prices and photos when they change?</li>
  <li>If I stop paying or switch providers, what do I keep?</li>
</ol>
<p>There's no single right answer. The best choice is the one that keeps your website accurate and working for your business a year from now, not just on launch day.</p>
""",
  },
  {
    "slug": "get-more-google-reviews",
    "kicker": "Reviews",
    "title": "How to get more Google reviews (without being pushy)",
    "summary": "Simple habits that turn happy customers into reviews.",
    "minutes": 4,
    "body": """
<p>Reviews are one of the first things new customers look at. The good news is that most happy customers are willing to leave one. They just need to be asked at the right moment, in the easiest way possible.</p>

<h2>Ask at the right moment</h2>
<p>The best time to ask is right after a job goes well: when the customer thanks you, compliments your work or tells you they'll be back. A simple “Would you mind leaving us a quick Google review? It really helps a small business like ours” goes a long way.</p>

<h2>Make it one tap</h2>
<p>Google lets you create a direct link to your review form from your Business Profile. Use it everywhere:</p>
<ul>
  <li>A text or email after each appointment or job</li>
  <li>A QR code on your counter, receipts or business cards</li>
  <li>A link in your email signature</li>
</ul>

<h2>Reply to every review</h2>
<p>Thank people for positive reviews. For negative ones, respond calmly, acknowledge the problem and offer to make it right. Future customers read your replies, and a thoughtful response to a bad review can build as much trust as a good one.</p>

<h2>What not to do</h2>
<ul>
  <li><strong>Don't offer rewards for reviews.</strong> Discounts or freebies in exchange for reviews go against Google's policies.</li>
  <li><strong>Don't only ask happy customers.</strong> Filtering who gets asked based on whether they'll leave a positive review also goes against Google's policies.</li>
  <li><strong>Never write or buy reviews.</strong> Fake reviews can get your profile penalized or removed.</li>
</ul>

<h2>Make it a habit</h2>
<p>A steady stream of new reviews is better than a burst once a year. Build the ask into your routine after every job, and your review count will grow on its own.</p>
""",
  },
]

for a in ARTICLES:
    a.setdefault("group", "guides")
for a in EXTRA:
    a["group"] = "compare" if a["kicker"] == "Comparison" else "guides"
COMPARE = [{
    "slug": p["slug"], "kicker": "Comparison", "group": "compare",
    "title": f"Web Design Wife vs. {p['name']}: an honest comparison",
    "summary": p["summary"], "minutes": 5, "body": comparison_body(p),
} for p in PLATFORMS]
ALL = EXTRA[:1] + COMPARE + ARTICLES + EXTRA[1:]

HEAD = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex">
  <script>document.documentElement.classList.add("js");</script>
  <title>{title}</title>
  <meta name="description" content="{description}">
  <link rel="icon" href="../images/favicon.jpg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=DM+Mono:wght@400;500&family=Figtree:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../styles.css">
  <link rel="stylesheet" href="../themes/subway.css">
</head>
<body class="theme-subway">
  <header class="nav">
    <div class="wrap nav__inner">
      <a class="brand" href="../index.html" aria-label="Web Design Wife home"><img src="../images/logo.svg" alt="Web Design Wife" width="247" height="31"></a>
      <nav class="nav__links" id="nav-links" aria-label="Main">
        <a href="../index.html#examples">Examples</a>
        <a href="../index.html#how">How it works</a>
        <a href="../index.html#features">Features</a>
        <a href="../index.html#pricing">Pricing</a>
        <a href="../index.html#about">About</a>
        <a href="../index.html#faq">FAQ</a>
        <a href="index.html">Blog</a>
      </nav>
      <a class="btn btn--primary btn--sm nav__cta" href="../index.html#audit">Free website audit</a>
      <button class="nav__menu" type="button" aria-expanded="false" aria-controls="drawer" aria-label="Open menu"><span></span><span></span><span></span></button>
    </div>
  </header>

  <div class="drawer" id="drawer" aria-hidden="true">
    <div class="drawer__backdrop" data-close-drawer></div>
    <aside class="drawer__panel" role="dialog" aria-modal="true" aria-label="Menu">
      <div class="drawer__head">
        <span class="drawer__label">Menu</span>
        <button type="button" class="drawer__close" data-close-drawer aria-label="Close menu"><span></span><span></span></button>
      </div>
      <nav class="drawer__nav" aria-label="Menu">
        <div class="drawer__item">
          <a class="drawer__big" href="../index.html#examples">Examples</a>
          <p class="drawer__sub">Ten sample homepages for New York businesses</p>
        </div>
        <div class="drawer__item">
          <a class="drawer__big" href="../index.html#how">How it works</a>
          <p class="drawer__sub">From first call to launch in about two weeks</p>
        </div>
        <div class="drawer__item">
          <a class="drawer__big" href="../index.html#features">Features</a>
          <div class="drawer__links"><a href="../index.html#features">On every plan</a><a href="../index.html#maps">Google Maps</a><a href="../index.html#local">Local to NYC</a></div>
        </div>
        <div class="drawer__item">
          <a class="drawer__big" href="../index.html#pricing">Pricing</a>
          <p class="drawer__sub">From $99/month, with hosting and edits included</p>
          <div class="drawer__links"><a href="../index.html#pricing" data-open-finder-after>Help me choose a plan</a></div>
        </div>
        <div class="drawer__item">
          <a class="drawer__big" href="../index.html#about">About</a>
          <p class="drawer__sub">Meet Ben, and why we're called Web Design Wife</p>
        </div>
        <div class="drawer__item">
          <a class="drawer__big" href="../index.html#faq">FAQ</a>
        </div>
        <div class="drawer__item">
          <a class="drawer__big" href="index.html">Blog</a>
          <div class="drawer__links"><a href="index.html#compare">Compare website builders</a><a href="diy-website-guide.html">Build-it-yourself guide</a><a href="google-maps-profile.html">Google Maps guide</a></div>
        </div>
      </nav>
      <div class="drawer__foot">
        <a class="btn btn--primary btn--block" href="../index.html#audit">Get a free website audit</a>
        <a class="drawer__ben" href="../index.html#audit" data-tab="callback">Or speak to Ben →</a>
        <p>Based in New York, NY</p>
      </div>
    </aside>
  </div>

  <main>
"""

FOOT = """  </main>
  <footer class="footer">
    <div class="wrap footer__grid">
      <div class="footer__brand">
        <a class="brand" href="../index.html"><img src="../images/logo.svg" alt="Web Design Wife" width="247" height="31"></a>
        <p>Managed websites for New York local businesses. Your web partner, for the long haul.</p>
        <a class="btn btn--primary btn--sm" href="../index.html#audit">Free website audit</a>
      </div>
      <nav class="footer__col" aria-label="Explore">
        <h4>Explore</h4>
        <a href="../index.html#examples">Examples</a>
        <a href="../index.html#how">How it works</a>
        <a href="../index.html#features">Features</a>
        <a href="../index.html#pricing">Pricing</a>
        <a href="../index.html#about">About</a>
        <a href="../index.html#faq">FAQ</a>
      </nav>
      <nav class="footer__col" aria-label="Resources">
        <h4>Resources</h4>
        <a href="index.html">Blog</a>
        <a href="index.html#compare">Compare website builders</a>
        <a href="diy-website-guide.html">Build-it-yourself guide</a>
        <a href="google-maps-profile.html">Google Maps guide</a>
      </nav>
      <nav class="footer__col" aria-label="Get in touch">
        <h4>Get in touch</h4>
        <a href="../index.html#audit">Free website audit</a>
        <a href="../index.html#audit">Speak to Ben</a>
        <a href="../index.html#custom">Custom projects</a>
        <span>Based in New York, NY</span>
      </nav>
    </div>
    <div class="wrap footer__bottom">
      <p>© 2026 Web Design Wife</p>
      <nav aria-label="Legal">
        <a href="https://webdesignwife.com/privacy-policy">Privacy</a>
        <a href="https://webdesignwife.com/terms-of-use">Terms</a>
        <a href="../images/icons/LICENSE-fluent-emoji.txt">Icon credits</a>
      </nav>
    </div>
  </footer>
  <a class="mobilebar" href="../index.html#audit">Get a free website audit</a>
  <script src="../script.js"></script>
</body>
</html>
"""

def quickcheck(title, sub):
    return f"""
<form class="quickcheck" novalidate>
  <div class="quickcheck__step" data-step="url">
    <p class="quickcheck__title">{title}</p>
    <p class="quickcheck__sub">{sub}</p>
    <div class="quickcheck__row">
      <input name="url" type="text" inputmode="url" autocomplete="url" placeholder="yourbusiness.com" aria-label="Your website address">
      <button class="btn btn--primary" type="submit">Get our take</button>
    </div>
  </div>
  <div class="quickcheck__step" data-step="email" hidden>
    <p class="quickcheck__title"><span class="quickcheck__ok" aria-hidden="true">✓</span> <span class="qc-url"></span> is in our review queue</p>
    <p class="quickcheck__sub">Where should we send your notes? A real person reviews every site and replies within one business day.</p>
    <div class="quickcheck__row">
      <input name="email" type="email" autocomplete="email" placeholder="you@yourbusiness.com" aria-label="Your email">
      <button class="btn btn--primary" type="submit">Send my notes</button>
    </div>
  </div>
  <div class="quickcheck__step" data-step="done" hidden>
    <p class="quickcheck__title"><span class="quickcheck__ok" aria-hidden="true">✓</span> You're all set</p>
    <p class="quickcheck__sub">We'll email our notes on <span class="qc-url"></span> within one business day.</p>
  </div>
  <p class="quickcheck__msg" role="status" aria-live="polite"></p>
</form>
"""

MID_CHECK = quickcheck("Want our honest take on your website?", "Enter your web address and we'll look it over personally. Free, with no obligation.")
END_CHECK = quickcheck("Want a second opinion on your site?", "Tell us your web address and we'll send you a short, honest review of what to fix first.")

ICONS = {"Checklist": "clipboard", "Google Maps": "map", "Buying guide": "scale", "Reviews": "star", "Guide": "hammer", "Comparison": "scale"}
COVERS = ["#dfeaff", "#dcf2e3", "#fff4c2", "#ffe1dc", "#efe6ff", "#e0f4f7"]

def card(a, n=0):
    icon = ICONS.get(a["kicker"], "memo")
    return f"""        <a class="post-card post-card--article" href="{a['slug']}.html">
          <span class="post-card__cover" style="--cover:{COVERS[n % len(COVERS)]}"><img src="../images/icons/{icon}.png" alt="" width="88" height="88" loading="lazy"></span>
          <span class="post-card__body">
            <span class="post-card__kicker">{a['kicker']}</span>
            <h3>{html.escape(a['title'])}</h3>
            <p>{html.escape(a['summary'])}</p>
            <span class="post-card__meta"><img src="../images/favicon.jpg" alt="" width="22" height="22">Ben Sash · {a['minutes']} min read</span>
          </span>
        </a>
"""

index = HEAD.format(title="Blog — Web Design Wife", description="Practical advice for local business websites, Google Maps profiles and reviews.")
index += """    <section class="blog-hero">
      <div class="wrap">
        <p class="eyebrow">Blog</p>
        <h1>Practical advice for local business websites</h1>
        <p class="intro muted">Plain-English guides to getting found online and turning visitors into customers.</p>
      </div>
    </section>
    <section class="blog-list">
      <div class="wrap">
        <h2 class="blog-list__h" id="compare">Compare your options</h2>
        <p class="muted">Honest comparisons with every major way to get a website, including when another option is the better choice.</p>
        <div class="posts">
"""
index += "".join(card(a, n) for n, a in enumerate([a for a in ALL if a["group"] == "compare"]))
index += """        </div>
        <h2 class="blog-list__h">Guides</h2>
        <div class="posts">
"""
index += "".join(card(a, n + 2) for n, a in enumerate([a for a in ALL if a["group"] == "guides"]))
index += "        </div>\n      </div>\n    </section>\n" + FOOT
(HERE / "index.html").write_text(index)

for a in ALL:
    page = HEAD.format(title=f"{html.escape(a['title'])} — Web Design Wife", description=html.escape(a["summary"]))
    page += f"""    <article class="article">
      <div class="article__wrap">
        <a class="article__back" href="index.html">← All articles</a>
        <h1>{html.escape(a['title'])}</h1>
        <p class="article__meta">By Ben Sash · {a['minutes']} min read</p>
        <div class="article__body">{a['body'].replace("{{CHECK}}", MID_CHECK)}</div>
{END_CHECK}      </div>
    </article>
"""
    page += FOOT
    (HERE / f"{a['slug']}.html").write_text(page)

print("built", len(ALL), "articles")
