# Builds index.html from home.template.html.
#   python3 build_home.py
# Every mood's styles ship with the page; script.js switches moods in place
# (saved per visitor, or forced with ?mood=calm|transit|tangy|sophisticated).
import json
import pathlib
import re
import time

import titlecase

VERSION = str(int(time.time()))

HERE = pathlib.Path(__file__).parent
TEMPLATE = (HERE / "home.template.html").read_text()

# key: URL value. cls: the theme class the stylesheets are scoped to.
MOODS = [
    {"key": "tangy", "cls": "theme-blocks", "label": "Tangy", "note": "Bright, bouncy and a little loud.", "sw": ["#d4ff4f", "#ff6a1a", "#3355ff"]},
    {"key": "calm", "cls": "theme-refined", "label": "Calm", "note": "Soft, quiet and easy on the eyes.", "sw": ["#ffffff", "#5b3df5", "#ece8ff"]},
    {"key": "transit", "cls": "theme-subway", "label": "Transit", "note": "Bold and direct, inspired by New York subway signs.", "sw": ["#111111", "#fccc0a", "#0b5cd6"]},
    {"key": "sophisticated", "cls": "theme-wedding", "label": "Sophisticated", "note": "Elegant and refined, inspired by wedding stationery.", "sw": ["#f4ecdb", "#b8955a", "#1f2336"]},
]
DEFAULT = "tangy"

# Founding 5 launch offer: the first five new clients pay $1 setup instead of $199/$399/$599.
# The plan price itself is never discounted.
#   left: None shows no count; a number shows "N of 5 spots left". Only ever set it to the real number.
#   on:   set to False once all five spots are taken. Every mention disappears from the built pages
#         (also remove the "Founding 5" paragraph in terms.html by hand).
FOUNDING = {"on": True, "left": None, "setup": 1}

# Cal.com scheduling. Two separate event types; availability, buffers and daily limits live in Cal.com.
#   call:       the 15-minute scheduled callback for prospects ("Request a callback"); location: Ben calls the attendee's phone.
#   onboarding: the kickoff call new clients book on welcome.html after they sign up.
# Use the event's path, e.g. "webdesignwife/phone-call". Empty shows a placeholder instead of the calendar.
CAL = {"call": "", "onboarding": ""}

FONTS = (
    '<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;700;800&family=Inter:wght@400;500;600;700'
    '&family=Unbounded:wght@600;700;800&family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600&display=swap" rel="stylesheet">'
)
THEME_CSS = "\n  ".join(f'<link rel="stylesheet" href="themes/{n}.css">' for n in ("subway", "blocks", "wedding"))

# Copy that changes with a mood: (mood class, current text, mood text)
ALT_COPY = [
    ("theme-wedding", "Get in touch", "RSVP"),
    ("theme-wedding", "From first call to live site in 14 days", "From first date to launch day in 14 days"),
    ("theme-wedding", "A quick call", "A first date"),
]

SPARKLE = ('<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5c.5 4.6 2.4 6.5 7 7-4.6.5-6.5 2.4-7 7-.5-4.6-2.4-6.5-7-7 '
           '4.6-.5 6.5-2.4 7-7Z" fill="currentColor"/><path d="M19 15.5c.2 1.8 1 2.6 2.8 2.8-1.8.2-2.6 1-2.8 2.8-.2-1.8-1-2.6-2.8-2.8 '
           '1.8-.2 2.6-1 2.8-2.8Z" fill="currentColor" opacity=".6"/></svg>')


def dots(m):
    # The mood's little tile: that mood's own face, in its own colors.
    return f'<span class="moodicon moodicon--{m["key"]}" aria-hidden="true"><i class="mi"></i></span>'


def switcher():
    opts = "".join(
        f'<button type="button" class="mood__opt" data-mood="{m["key"]}" aria-pressed="false">{dots(m)}<span><strong>{m["label"]}</strong><small>{m["note"]}</small></span></button>'
        for m in MOODS
    )
    return f'''<div class="mood" id="mood">
    <button type="button" class="mood__btn" aria-expanded="false" aria-controls="mood-panel" aria-label="Choose your mood">{dots(MOODS[0])}</button>
    <div class="mood__panel" id="mood-panel" role="group" aria-label="Choose your mood"><button type="button" class="mood__close" aria-label="Close"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button><p class="mood__title">Choose your mood</p><p class="mood__intro">See this website in four different styles. Same content, a different feel.</p>{opts}</div>
  </div>'''


def newsletter():
    # TODO: connect to an email service (Mailchimp, ConvertKit, Buttondown...). Front-end only for now.
    return ('<div class="wrap"><div class="news">'
            '<div class="news__copy"><h2 class="news__title">Get tips, news and deals by email</h2>'
            '<p>About once a month: practical tips for your website and Google Maps, New York small business news, and deals on my plans. Unsubscribe anytime.</p></div>'
            '<form class="news__form" novalidate data-error="Enter a valid email address." data-success="You\'re subscribed! Watch your inbox.">'
            '<div class="news__row"><input type="email" name="email" required autocomplete="email" placeholder="you@example.com" aria-label="Email address">'
            '<button class="btn btn--primary" type="submit">Subscribe</button></div>'
            '<p class="form__msg" role="status" aria-live="polite"></p></form></div></div>')


def footer_moods():
    return '<div class="moods" role="group" aria-label="Choose your mood">' + "".join(
        f'<button type="button" class="moods__card" data-mood="{m["key"]}" aria-pressed="false">{dots(m)}<span>{m["label"]}</span></button>'
        for m in MOODS
    ) + "</div>"


def mood_boot():
    table = ",".join(f'"{m["key"]}":"{m["cls"]}"' for m in MOODS)
    return (f'<script>(function(){{var M={{{table}}},k=new URLSearchParams(location.search).get("mood");'
            f'try{{if(!M[k])k=localStorage.getItem("wdw-mood")}}catch(e){{}}if(!M[k])k="{DEFAULT}";'
            f'document.documentElement.classList.add(M[k]);document.documentElement.dataset.mood=k}})();'
            f'window.WDW_FOUNDING={json.dumps(FOUNDING if FOUNDING["on"] else None)};window.WDW_CAL={json.dumps(CAL)};</script>')


def add_alt_copy(html):
    for cls, old, new in ALT_COPY:
        html = html.replace(f">{old}<", f'><span data-alt-{cls}="{titlecase.title(new)}">{old}</span><', 1)
    return html


def founding(html):
    """Fill in (or remove) every Founding 5 mention."""
    on = FOUNDING["on"]
    html = re.sub(r"<!-- FOUNDING:START -->(.*?)<!-- FOUNDING:END -->", (lambda m: m.group(1)) if on else "", html, flags=re.S)
    left = FOUNDING["left"]
    banner = ('<div class="founding">'
              '<div class="founding__emblem" aria-hidden="true"><i class="pi pi--crown-fill"></i><span>Founding</span><b>5</b></div>'
              '<div class="founding__body">'
              '<h2 class="founding__title">The Founding <span class="founding__num">5</span></h2>'
              '<p class="founding__text">The managed service is new, so I\'m opening it to five businesses first. '
              'Your setup is <strong>$1</strong> instead of $199 to $599, and your plan is the normal price. '
              'When the five spots are gone, so is the offer.</p>'
              + (f'<p class="founding__left">{left} of 5 spots left</p>' if left is not None else "")
              + "</div></div>") if on else ""
    return (html.replace("{{FOUNDING_BANNER}}", banner)
                .replace("{{HERO_LABEL}}", "Now open: five founding spots · Brooklyn, NY" if on else "Based in Brooklyn, New York"))


def work_visual():
    """New Age before/after slider once the old-site screenshot is in images/, else the current site alone."""
    after = '<img src="images/New-Age-Pharmacy-image.jpg" alt="The New Age Pharmacy website I designed" width="1809" height="1031" loading="lazy">'
    before = HERE / "images" / "new-age-before.jpg"
    # A quiet text link under the preview; the preview itself isn't a link.
    live = ('<p class="work-feature__live"><a href="https://newagepharm.com/" target="_blank" rel="noopener">'
            'Visit the live site <svg class="i-arrow" viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></a></p>')
    if not before.exists():
        return f'<div class="work-feature__visual"><div class="work-feature__shot">{after}</div>{live}</div>'
    return ('<div class="work-feature__visual"><figure class="ba" style="--pos:50%">'
            '<div class="ba__frame">'
            f'{after.replace("<img ", "<img class=\"ba__after\" ")}'
            '<img class="ba__before" src="images/new-age-before.jpg" alt="The old New Age page, built on a pharmacy-network template" loading="lazy">'
            '<span class="ba__tag ba__tag--before">Before</span><span class="ba__tag ba__tag--after">After</span>'
            '<span class="ba__handle" aria-hidden="true"></span>'
            '<input class="ba__range" type="range" min="0" max="100" value="50" aria-label="Slide to compare the old and new New Age Pharmacy websites">'
            '</div>'
            '<figcaption>Before: a generic pharmacy-network page. After: built around New Age and its customers.</figcaption>'
            '</figure>' + live + '</div>')


def bust(html):
    # Version asset links so browsers pick up new styles after each publish.
    html = re.sub(r'(href="(?:\.\./)?(?:styles|themes/[a-z]+)\.css)(\?v=\d+)?"', r'\1?v=' + VERSION + '"', html)
    return re.sub(r'(src="(?:\.\./)?(?:script|start)\.js)(\?v=\d+)?"', r'\1?v=' + VERSION + '"', html)


page = (TEMPLATE
        .replace("{{FONTS}}", FONTS)
        .replace("{{THEME_CSS}}", THEME_CSS + "\n  " + mood_boot())
        .replace(' class="{{BODY_CLASS}}"', "")
        .replace("{{SWITCHER}}", switcher())
        .replace("{{WORK_VISUAL}}", work_visual())
        .replace("{{MOODS}}", footer_moods())
        .replace("{{NEWSLETTER}}", newsletter())
        .replace("{{HOME}}", "index.html"))
# FAQ as structured data, generated from the visible FAQ so the two never disagree.
def faq_schema(html):
    import html as H, json
    items = re.findall(r"<details[^>]*>\s*<summary>(.*?)</summary>(.*?)</details>", html, re.S)
    clean = lambda t: H.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", t))).strip().replace(" ,", ",").replace(" .", ".")
    data = {"@context": "https://schema.org", "@type": "FAQPage",
            "mainEntity": [{"@type": "Question", "name": clean(q), "acceptedAnswer": {"@type": "Answer", "text": clean(a)}} for q, a in items]}
    return '<script type="application/ld+json">' + json.dumps(data, ensure_ascii=False) + "</script>"

page = founding(page)
page = page.replace("{{FAQ_SCHEMA}}", faq_schema(page))
(HERE / "index.html").write_text(bust(titlecase.apply(add_alt_copy(page))))

# The Get started page shares the moods and switcher.
start = ((HERE / "start.template.html").read_text()
         .replace("{{FONTS}}", FONTS)
         .replace("{{THEME_CSS}}", THEME_CSS + "\n  " + mood_boot())
         .replace("{{SWITCHER}}", switcher()))
(HERE / "start.html").write_text(bust(titlecase.apply(founding(start))))
welcome = ((HERE / "welcome.template.html").read_text()
           .replace("{{FONTS}}", FONTS)
           .replace("{{THEME_CSS}}", THEME_CSS + "\n  " + mood_boot())
           .replace("{{SWITCHER}}", switcher()))
(HERE / "welcome.html").write_text(bust(titlecase.apply(welcome)))
# Pieces shared with the other full pages (Pricing, Contact), taken from the finished homepage
# so the header, menu and footer never drift apart.
def between(html, start, end_tag):
    i = html.index(start)
    return html[i:html.index(end_tag, i) + len(end_tag)]

def block(html, start):
    """The element that starts at `start`, through its matching closing tag."""
    i = html.index(start)
    tag = re.match(r"<(\w+)", start).group(1)
    depth = 0
    for m in re.finditer(rf"<{tag}\b|</{tag}>", html[i:]):
        depth += 1 if not m.group(0).startswith("</") else -1
        if depth == 0:
            return html[i:i + m.end()]

def away(html):
    # On other pages, homepage anchors point back to the homepage (the audit pop-up stays local).
    return re.sub(r'href="#(?!audit"|main")', 'href="index.html#', html)

PARTS = {
    "{{NAV}}": away(block(page, '<header class="nav">')),
    "{{DRAWER}}": away(block(page, '<div class="drawer" id="drawer"')),
    "{{FOOTER}}": away(block(page, '<footer class="footer">')),
    "{{MOBILEBAR}}": block(page, '<a class="mobilebar"'),
    "{{FINDER}}": block(page, '<dialog class="finder-dialog"'),
}
AUDIT_SECTION = block(page, '<section class="section section--violet" id="audit">')
AUDIT_DIALOG = block(page, '<dialog class="audit-dialog')
# Pages without the audit section carry their own copy of the form inside the pop-up.
AUDIT_DIALOG_STANDALONE = AUDIT_DIALOG.replace("<div data-audit-slot></div>", "<div data-audit-slot>" + block(AUDIT_SECTION, '<div class="formcard">') + "</div>")

def full_page(template):
    html = template.replace("{{FONTS}}", FONTS).replace("{{THEME_CSS}}", THEME_CSS + "\n  " + mood_boot()).replace("{{SWITCHER}}", switcher())
    for k, v in PARTS.items():
        html = html.replace(k, v)
    return html

contact = full_page((HERE / "contact.template.html").read_text()).replace("{{AUDIT_DIALOG}}", AUDIT_DIALOG_STANDALONE)
(HERE / "contact.html").write_text(bust(titlecase.apply(add_alt_copy(contact))))

# Pricing page: the money page. It shares only the plans with the homepage (as the page's h1);
# setup, billing, the guarantee, edits, ownership and the full FAQ live in pricing.template.html.
PLANS_SECTION = block(page, '<section class="section" id="pricing">')
PLANS_SECTION = re.sub(r"<!-- PRICING-MORE:START -->.*?<!-- PRICING-MORE:END -->", "", PLANS_SECTION, flags=re.S)
PLANS_SECTION = re.sub(r"<h2>(.*?)</h2>", r"<h1>\1</h1>", PLANS_SECTION, count=1)
pricing = full_page((HERE / "pricing.template.html").read_text())
pricing = founding(pricing.replace("{{PLANS_SECTION}}", PLANS_SECTION).replace("{{AUDIT_SECTION}}", AUDIT_SECTION).replace("{{AUDIT_DIALOG}}", AUDIT_DIALOG))
pricing = pricing.replace("{{FAQ_SCHEMA}}", faq_schema(pricing))
(HERE / "pricing.html").write_text(bust(titlecase.apply(add_alt_copy(pricing))))
features = full_page((HERE / "features.template.html").read_text()).replace("{{AUDIT_DIALOG}}", AUDIT_DIALOG_STANDALONE)
(HERE / "features.html").write_text(bust(titlecase.apply(add_alt_copy(features))))

# Old per-style URLs now open the homepage in that mood.
for old, key in (("design-a", "calm"), ("design-b", "transit"), ("design-c", "tangy"), ("design-d", "sophisticated")):
    (HERE / f"{old}.html").write_text(
        f'<!DOCTYPE html><meta charset="utf-8"><meta name="robots" content="noindex">'
        f'<meta http-equiv="refresh" content="0;url=index.html?mood={key}"><a href="index.html?mood={key}">Continue</a>')

# Shared pieces for the blog and legal pages, so moods work on every page.
(HERE / "mood_parts.py").write_text(
    "# Generated by build_home.py. Do not edit by hand.\n"
    f"FONTS = {FONTS!r}\n"
    f"THEME_CSS = {THEME_CSS!r}\n"
    f"BOOT = {mood_boot()!r}\n"
    f"SWITCHER = {switcher()!r}\n"
    f"FOOTER_MOODS = {footer_moods()!r}\n"
    f"NEWSLETTER = {newsletter()!r}\n"
    f"VERSION = {VERSION!r}\n")
print("built index.html (moods: " + ", ".join(m["label"] for m in MOODS) + ")")

# Sitemap for the live domain (webdesignwife.com). Regenerated on every build.
SITE = "https://webdesignwife.com/"
pages = ["", "pricing.html", "features.html", "contact.html", "start.html", "blog/"] + sorted(
    "blog/" + f.name for f in (HERE / "blog").glob("*.html") if f.name != "index.html")
today = time.strftime("%Y-%m-%d")
(HERE / "sitemap.xml").write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + "".join(f"  <url><loc>{SITE}{p}</loc><lastmod>{today}</lastmod></url>\n" for p in pages) + "</urlset>\n")
