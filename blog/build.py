# Generates the blog index and article pages from one template.
# Edit the ARTICLES list below, then run: python3 blog/build.py
import pathlib, html, re
from comparisons import PLATFORMS, EXTRA, comparison_body
from local import BOROUGHS, borough_body
import sys
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent.parent))
import mood_parts as MP
import titlecase

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
  {
    "slug": "business-photos-guide",
    "kicker": "Guide",
    "title": "Photos for your business website: what to shoot, and how to use AI honestly",
    "summary": "Real photos build trust. Here's what to shoot with your phone, what to do if you'd rather not be pictured, and how to clean photos up with AI without misleading anyone.",
    "minutes": 6,
    "body": """
<p class="lede-note"><strong>The short answer:</strong> real photos of your team, your space and your work build more trust than any stock photo, and a recent phone camera is plenty. Good light and a clean background matter far more than equipment.</p>

<h2>What to photograph</h2>
<ul>
  <li><strong>Your storefront</strong>, so people recognize it when they arrive.</li>
  <li><strong>People doing the work.</strong> A barber mid-cut beats an empty chair.</li>
  <li><strong>Your space</strong>: the counter, the chairs, the kitchen, the van.</li>
  <li><strong>Your best work</strong>: finished jobs, plated dishes, a before and after if your work allows it.</li>
  <li><strong>You or your team</strong>, for your About section. People want to know who they'll be dealing with.</li>
</ul>

<h2>How to take a good photo with your phone</h2>
<ul>
  <li><strong>Use natural light.</strong> Shoot near a window or outside in open shade. Turn off the flash.</li>
  <li><strong>Clear the background.</strong> Move clutter, cords and trash out of the frame.</li>
  <li><strong>Wipe the lens.</strong> A smudged lens is the most common reason phone photos look soft.</li>
  <li><strong>Shoot landscape (sideways)</strong> for the top of your site. Vertical photos get cropped awkwardly.</li>
  <li><strong>Take a lot.</strong> Take twenty and keep the best three.</li>
</ul>

<h2>If you'd rather not be in the photos</h2>
<p>That's completely fine. You can still make your site feel personal:</p>
<ul>
  <li>Show your <strong>hands at work</strong>: tools, ingredients, scissors, a keyboard.</li>
  <li>Show your <strong>team</strong> instead, with their permission.</li>
  <li>Show <strong>your space and your work</strong>, and write your About section in your own voice.</li>
  <li>A friendly <strong>illustrated portrait</strong> can work too, as long as it's clearly an illustration.</li>
</ul>

<h2>Cleaning up photos with AI, honestly</h2>
<p>AI tools like ChatGPT can fix lighting and color in a phone photo in seconds. The rule: improve the photo, never change what it shows. A customer should walk in and see exactly what was on your website. Upload your photo and use a prompt like this:</p>
<blockquote class="prompt"><p>Improve the lighting, color and sharpness of this photo so it looks professionally shot, with soft, even, natural-looking light. Do not change, add or remove anything in the image: keep every person's face, body and expression exactly as they are, and keep the space, products, food and work exactly as they are. Do not add or remove objects, text or people. Only correct exposure, white balance, color, sharpness and noise, and gently straighten the horizon if it's tilted.</p></blockquote>
<div class="callout callout--warn"><strong>Always compare with the original.</strong> If anything changed, like a different face, extra objects, or food that looks better than what you actually serve, use the original instead. Misleading photos cost you trust the moment a customer walks in.</div>

<h2>Before you upload</h2>
<ul>
  <li><strong>Shrink large photos</strong> so your site stays fast. Most builders do this for you; if not, a free tool like <a href="https://squoosh.app/" target="_blank" rel="noopener">Squoosh</a> works well.</li>
  <li><strong>Get permission</strong> from anyone recognizable in your photos, including staff and customers.</li>
  <li><strong>Add a short description</strong> (alt text) to each photo in your builder, like "Barber giving a fade haircut." It helps people using screen readers, and it helps Google.</li>
</ul>
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
LOCALS = [{
    "slug": b["slug"], "kicker": "Borough guide", "group": "local",
    "title": f"Websites for businesses in {b.get('in', b['name'])}",
    "summary": b["summary"], "minutes": 4, "body": borough_body(b),
} for b in BOROUGHS]
ALL = EXTRA[:1] + COMPARE + LOCALS + ARTICLES + EXTRA[1:]
for a in ALL:
    a["title"] = titlecase.title(a["title"])
    words = len(re.sub(r"<[^>]+>", " ", a["body"]).split()) + 120  # plus the review box copy
    a["minutes"] = max(2, round(words / 230))

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
  <link rel="stylesheet" href="../styles.css?v={{V}}">
  {{MOOD_FONTS}}
  {{MOOD_CSS}}
  {{MOOD_BOOT}}
</head>
<body>
  {{MOOD_SWITCHER}}
  <header class="nav">
    <div class="wrap nav__inner">
      <a class="brand" href="../index.html" aria-label="Web Design Wife home"><img src="../images/logo.svg" alt="Web Design Wife" width="247" height="31"></a>
      <nav class="nav__links" id="nav-links" aria-label="Main">
        <a href="../pricing.html">Pricing</a>
        <a href="../features.html">Features</a>
        <a href="../contact.html">Contact</a>
        <a href="index.html">Blog</a>
      </nav>
      <a class="btn btn--ghost btn--sm nav__start" href="../start.html">Get started</a>
      <a class="btn btn--primary btn--sm nav__cta" href="../index.html#audit">Free website audit</a>
      <button class="nav__menu" type="button" aria-expanded="false" aria-controls="drawer" aria-label="Open menu"><span></span><span></span><span></span></button>
    </div>
  </header>

  <div class="drawer" id="drawer" aria-hidden="true">
    <div class="drawer__backdrop" data-close-drawer></div>
    <aside class="drawer__panel" role="dialog" aria-modal="true" aria-label="Menu">
      <div class="drawer__head">
        <a class="brand drawer__brand" href="../index.html" aria-label="Web Design Wife home"><img src="../images/logo.svg" alt="Web Design Wife" width="247" height="31"></a>
        <button type="button" class="drawer__close" data-close-drawer aria-label="Close menu"><span></span><span></span></button>
      </div>
      <nav class="drawer__nav" aria-label="Menu">
        <a class="drawer__big" href="../pricing.html"><span>Pricing</span><small>Plans from $99/month and FAQs</small></a>
        <a class="drawer__big" href="../features.html"><span>Features</span><small>What’s in each plan</small></a>
        <a class="drawer__big" href="../contact.html"><span>Contact</span><small>Write me a note or request a callback</small></a>
        <a class="drawer__big" href="index.html"><span>Blog</span><small>Honest guides and website builder comparisons</small></a>
      </nav>
      <div class="drawer__cta">
        <a class="btn btn--ghost btn--block" href="../start.html">Get started</a>
        <a class="btn btn--primary btn--block" href="../index.html#audit">Get a free website + Maps audit</a>
      </div>
      <div class="drawer__more">
        <p class="drawer__label">Helpful links</p>
        <a href="../index.html#how">How it works</a>
        <a href="../index.html#work">My work: New Age Pharmacy</a>
        <a href="../index.html#maps">Google Maps management</a>
        <a href="../pricing.html#faq">FAQ</a>
        <a href="index.html#compare">Compare website builders</a>
        <a href="diy-website-guide.html">Do-it-yourself guide</a>
      </div>
      <p class="drawer__where">Based in Brooklyn, NY</p>
    </aside>
  </div>

  <main>
"""

def fill(page):
    # Mood styles, switcher and asset versions, shared with the homepage.
    css = MP.THEME_CSS.replace('href="themes/', 'href="../themes/').replace('.css"', ".css?v=" + MP.VERSION + '"')
    return (page.replace("{MOOD_FONTS}", MP.FONTS).replace("{MOOD_CSS}", css).replace("{MOOD_BOOT}", MP.BOOT)
            .replace("{MOOD_SWITCHER}", MP.SWITCHER).replace("{MOOD_NEWS}", MP.NEWSLETTER).replace("{V}", MP.VERSION))


def finish(page):
    # Article subheadings (h3) are titles too, so they get Title Case as well.
    page = re.sub(r"(<h3[^>]*>)(.*?)(</h3>)", lambda m: m.group(1) + titlecase._inner(m.group(2)) + m.group(3), page, flags=re.S)
    return titlecase.apply(fill(page))

FOOT = """  </main>
  <footer class="footer">
    {MOOD_NEWS}
    <div class="wrap footer__grid">
      <div class="footer__brand">
        <a class="brand" href="../index.html"><img src="../images/logo.svg" alt="Web Design Wife" width="247" height="31"></a>
        <p>Managed websites for New York local businesses. Your web partner, for the long haul.</p>
        <a class="btn btn--primary btn--sm" href="../index.html#audit">Free website + Maps audit</a>
      </div>
      <nav class="footer__col" aria-label="Pages">
        <h4>Pages</h4>
        <a href="../pricing.html">Pricing</a>
        <a href="../features.html">Features</a>
        <a href="../contact.html">Contact</a>
        <a href="index.html">Blog</a>
        <a href="../start.html">Get started</a>
        <a href="../index.html#audit">Free website audit</a>
      </nav>
      <nav class="footer__col" aria-label="On the homepage">
        <h4>On the homepage</h4>
        <a href="../index.html#work">My work</a>
        <a href="../index.html#how">How it works</a>
        <a href="../index.html#maps">Google Maps</a>
        <a href="../index.html#local">Local to New York</a>
        <a href="../index.html#about">About me</a>
        <a href="../index.html#faq">FAQ</a>
      </nav>
      <nav class="footer__col" aria-label="Resources">
        <h4>Resources</h4>
        <a href="index.html#compare">Compare website builders</a>
        <a href="diy-website-guide.html">Do-it-yourself guide</a>
        <a href="google-maps-profile.html">Google Maps guide</a>
        <a href="../pricing.html#custom">Custom projects</a>
        <a href="../privacy.html">Privacy policy</a>
        <a href="../terms.html">Terms</a>
        <span>Based in Brooklyn, NY</span>
      </nav>
    </div>
    <div class="wrap footer__bottom">
      <p>© 2026 Web Design Wife</p>
      <nav aria-label="Legal">
        <a href="../privacy.html">Privacy</a>
        <a href="../terms.html">Terms</a>
        <a href="../images/CREDITS.txt">Icon credits</a>
      </nav>
    </div>
  </footer>
  <a class="mobilebar" href="../index.html#audit">Get a free website audit</a>
  <script src="../script.js?v={V}"></script>
</body>
</html>
"""

def quickcheck(title, sub):
    return f"""
<form class="quickcheck" novalidate>
  <div class="quickcheck__step" data-step="url">
    <p class="quickcheck__title tc">{title}</p>
    <p class="quickcheck__sub">{sub}</p>
    <div class="quickcheck__row">
      <input name="url" type="text" inputmode="url" autocomplete="url" placeholder="yourbusiness.com" aria-label="Your website address">
      <button class="btn btn--primary" type="submit">Get my take</button>
    </div>
  </div>
  <div class="quickcheck__step" data-step="email" hidden>
    <p class="quickcheck__title"><span class="quickcheck__ok" aria-hidden="true">✓</span> <span class="qc-url"></span> is in my review queue</p>
    <p class="quickcheck__sub">Where should I send your notes? I review every site personally and reply within one business day.</p>
    <div class="quickcheck__row">
      <input name="email" type="email" autocomplete="email" placeholder="you@yourbusiness.com" aria-label="Your email">
      <button class="btn btn--primary" type="submit">Send my notes</button>
    </div>
  </div>
  <div class="quickcheck__step" data-step="done" hidden>
    <p class="quickcheck__title"><span class="quickcheck__ok" aria-hidden="true">✓</span> You're all set</p>
    <p class="quickcheck__sub">I'll email my notes on <span class="qc-url"></span> within one business day.</p>
  </div>
  <p class="quickcheck__msg" role="status" aria-live="polite"></p>
</form>
"""

MID_CHECK = quickcheck("Want my honest take on your website?", "Enter your web address and I'll look it over personally. Free, with no obligation.")
END_CHECK = quickcheck("Want a second opinion on your site?", "Tell me your web address and I'll send you a short, honest review of what to fix first.")

ICONS = {"Borough guide": "map-pin", "Checklist": "clipboard-text", "Google Maps": "map-trifold", "Buying guide": "scales", "Reviews": "star", "Guide": "hammer", "Comparison": "scales"}
COVERS = [("#dfeaff", "#a9c4f2"), ("#dcf2e3", "#9fd7b2"), ("#fff4c2", "#f0d86b"), ("#ffe1dc", "#f3aa9d"), ("#efe6ff", "#c4acf2"), ("#e0f4f7", "#97d4de")]
TONES = ["blue", "green", "yellow", "red", "purple", "teal"]

BRANDS = {"vs-wix": ("wix", "#0C6EFC"), "vs-squarespace": ("squarespace", "#111111"), "vs-wordpress": ("wordpress", "#21759B"), "vs-webflow": ("webflow", "#146EF5"), "vs-shopify": ("shopify", "#5E8E3E"), "vs-godaddy": ("godaddy", "#111111"), "vs-square-online": ("square", "#3E4348"), "vs-framer": ("framer", "#0055FF"), "vs-carrd": ("carrd", "#596CAF"), "vs-google-sites": ("google", "#4285F4"), "vs-hostinger": ("hostinger", "#673DE6")}
BOROUGH_ART = {"websites-manhattan": "manhattan", "websites-brooklyn": "brooklyn", "websites-queens": "queens", "websites-bronx": "bronx", "websites-staten-island": "staten-island"}

def brand_svg(name, color):
    s = (HERE.parent / "images" / "brands" / f"{name}.svg").read_text()
    s = re.sub(r"<title>.*?</title>", "", s)
    return s.replace("<svg ", f'<svg aria-hidden="true" fill="{color}" ', 1)

def cover(a):
    if a["slug"] in BRANDS:
        name, color = BRANDS[a["slug"]]
        return f"""<span class="post-card__cover post-card__cover--vs"><span class="vs-logo vs-logo--us"><img src="../images/favicon.jpg" alt=""></span><span class="vs-x">vs</span><span class="vs-logo">{brand_svg(name, color)}</span></span>"""
    if a["slug"] == "vs-agency":
        return """<span class="post-card__cover post-card__cover--vs"><span class="vs-logo vs-logo--us"><img src="../images/favicon.jpg" alt=""></span><span class="vs-x">vs</span><span class="vs-logo"><i class="pi pi--buildings" aria-hidden="true"></i></span></span>"""
    if a["slug"] in BOROUGH_ART:
        return f"""<span class="post-card__cover post-card__cover--art"><img src="../images/boroughs/{BOROUGH_ART[a['slug']]}.svg" alt=""></span>"""
    icon = ICONS.get(a["kicker"], "note-pencil")
    return f"""<span class="post-card__cover"><i class="pi pi--{icon}" aria-hidden="true"></i></span>"""

def card(a, n=0):
    return f"""        <a class="post-card post-card--article" href="{a['slug']}.html" data-group="{a['group']}" data-tone="{TONES[n % len(TONES)]}" style="--cover:{COVERS[n % len(COVERS)][0]};--cover-dark:{COVERS[n % len(COVERS)][1]}">
          {cover(a)}
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
    <section class="must-reads">
      <div class="wrap">
        <div class="carousel-head"><h2 class="must-reads__h">Must-read guides</h2><div data-nav-slot></div></div>
        <div class="posts must-reads__list">
""" + "".join(card(next(x for x in ALL if x["slug"] == slug), n) for n, slug in enumerate(["diy-website-guide", "local-business-website-checklist", "google-maps-profile", "business-photos-guide", "get-more-google-reviews"])) + """        </div>
      </div>
    </section>
    <section class="blog-boroughs" id="boroughs">
      <div class="wrap">
        <div class="carousel-head"><h2 class="must-reads__h">Around New York</h2><div data-nav-slot></div></div>
        <p class="muted blog-boroughs__lede">Each borough searches a little differently. Here's how I build for the neighborhoods your customers live in.</p>
        <div class="boroughs">
          <a class="borough" href="websites-manhattan.html"><strong>Manhattan</strong><span>Midtown · UWS · Harlem · Chelsea <b class="borough__more">+ 17 more</b></span><em>How I build for Manhattan <svg class="i-arrow" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9.5M8.5 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></em></a>
          <a class="borough" href="websites-brooklyn.html"><strong>Brooklyn</strong><span>Park Slope · Williamsburg · Flatbush · Bay Ridge <b class="borough__more">+ 27 more</b></span><em>How I build for Brooklyn <svg class="i-arrow" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9.5M8.5 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></em></a>
          <a class="borough" href="websites-queens.html"><strong>Queens</strong><span>Astoria · Flushing · Forest Hills <b class="borough__more">+ 19 more</b></span><em>How I build for Queens <svg class="i-arrow" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9.5M8.5 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></em></a>
          <a class="borough" href="websites-bronx.html"><strong>The Bronx</strong><span>Belmont · Riverdale · Fordham <b class="borough__more">+ 14 more</b></span><em>How I build for the Bronx <svg class="i-arrow" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9.5M8.5 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></em></a>
          <a class="borough" href="websites-staten-island.html"><strong>Staten Island</strong><span>St. George · Great Kills · Tottenville <b class="borough__more">+ 10 more</b></span><em>How I build for Staten Island <svg class="i-arrow" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9.5M8.5 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></em></a>
        </div>
      </div>
    </section>
    <section class="blog-list">
      <div class="wrap">
        <h2 class="blog-list__h">All articles</h2>
        <div class="blog-tools">
        <div class="filters" role="toolbar" aria-label="Filter articles">
          <button type="button" class="filter" data-filter="all" aria-pressed="true">All <span>""" + str(len(ALL)) + """</span></button>
          <button type="button" class="filter" data-filter="compare" aria-pressed="false">Comparisons <span>""" + str(sum(a["group"] == "compare" for a in ALL)) + """</span></button>
          <button type="button" class="filter" data-filter="local" aria-pressed="false">NYC boroughs <span>""" + str(sum(a["group"] == "local" for a in ALL)) + """</span></button>
          <button type="button" class="filter" data-filter="guides" aria-pressed="false">Tips &amp; how-tos <span>""" + str(sum(a["group"] == "guides" for a in ALL)) + """</span></button>
        </div>
        <label class="blog-search"><span class="blog-search__label">Search articles</span><input type="search" placeholder="Search, like Wix or Brooklyn" data-blog-search autocomplete="off"></label>
        </div>
        <p class="blog-search__empty" hidden>No articles match that. Try a different word, or <a href="../contact.html">ask me directly</a>.</p>
        <div class="posts posts--index">
"""
order = [a for a in ALL if a["group"] == "guides"][:2] + [a for a in ALL if a["group"] == "compare"] + [a for a in ALL if a["group"] == "local"] + [a for a in ALL if a["group"] == "guides"][2:]
index += "".join(card(a, n) for n, a in enumerate(order))
index += "        </div>\n      </div>\n    </section>\n" + FOOT
(HERE / "index.html").write_text(finish(index))

# Links to other articles become reference chips (like source chips): the linked words stay as plain
# text, and a small chip naming the article is added at the end of the sentence or bullet.
TITLES = {x["slug"]: x["title"] for x in ALL}
SHORT = {x["slug"]: (x["title"].split(": ")[0].replace("Web Design Wife ", "") if x["group"] == "compare" else x["title"].split(": ")[0]) for x in ALL}

def chip(slug):
    return (f'<a class="ref-chip" href="{slug}.html" data-slug="{slug}" aria-label="Article: {html.escape(TITLES[slug])}">'
            f'<i class="pi pi--lines" aria-hidden="true"></i><span>{html.escape(SHORT[slug])}</span></a>')

def references(body):
    link = re.compile(r'<a (?:class="tc" )?href="([a-z0-9-]+)\.html">(.*?)</a>', re.S)
    def block(m):
        open_tag, inner, close_tag = m.group(1), m.group(2), m.group(3)
        chips = []
        def swap(l):
            slug, text = l.group(1), l.group(2)
            if slug not in TITLES:
                return l.group(0)
            plain = re.sub(r"<[^>]+>", "", text).strip()
            if plain.lower() == TITLES[slug].lower() or plain.lower() == re.sub(r"<[^>]+>", "", inner).strip().lower():
                return chip(slug)            # the link is the title (or the whole item): the chip replaces it
            if slug not in chips:
                chips.append(slug)
            return text
        inner = link.sub(swap, inner)
        if chips:
            inner = re.sub(r"\s*$", "", inner) + " " + "".join(chip(c) for c in chips)
        return open_tag + inner + close_tag
    return re.sub(r"(<(?:p|li)(?: [^>]*)?>)(.*?)(</(?:p|li)>)", block, body, flags=re.S)

for a in ALL:
    a["body"] = references(a["body"])

for a in ALL:
    page = HEAD.format(title=f"{html.escape(a['title'])} — Web Design Wife", description=html.escape(a["summary"]))
    page += f"""    <article class="article">
      <div class="article__wrap">
        <a class="article__back" href="index.html"><svg class="i-arrow" viewBox="0 0 16 16" aria-hidden="true"><path d="M13 8H3.5M7.5 4l-4 4 4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg> All articles</a>
        <h1>{html.escape(a['title'])}</h1>
        <p class="article__meta">By Ben Sash · {a['minutes']} min read</p>
        <div class="article__body">{a['body'].replace("{{CHECK}}", MID_CHECK if len(re.sub(r"<[^>]+>", " ", a["body"]).split()) > 900 else "")}</div>
{END_CHECK}        <section class="related" data-slug="{a['slug']}" data-group="{a['group']}" aria-label="Related articles" hidden>
          <h2 class="related__h">Keep reading</h2>
          <div class="related__list"></div>
        </section>
      </div>
    </article>
"""
    page += FOOT
    (HERE / f"{a['slug']}.html").write_text(finish(page))

# Article index for the related-posts widget (script.js). New articles are picked up automatically.
import json
(HERE / "posts.json").write_text(json.dumps([
    {"slug": a["slug"], "title": a["title"], "summary": a["summary"], "group": a["group"],
     "kicker": a["kicker"], "minutes": a["minutes"], "cover": cover(a)}
    for a in ALL
], ensure_ascii=False))
print("built", len(ALL), "articles")
