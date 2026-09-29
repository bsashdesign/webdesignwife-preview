# Builds index.html from home.template.html.
#   python3 build_home.py
# Every mood's styles ship with the page; script.js switches moods in place
# (saved per visitor, or forced with ?mood=calm|transit|tangy|sophisticated).
import pathlib
import re
import time

import titlecase

VERSION = str(int(time.time()))

HERE = pathlib.Path(__file__).parent
TEMPLATE = (HERE / "home.template.html").read_text()

# key: URL value. cls: the theme class the stylesheets are scoped to.
MOODS = [
    {"key": "calm", "cls": "theme-refined", "label": "Calm", "note": "Soft, quiet and easy on the eyes.", "sw": ["#ffffff", "#5b3df5", "#ece8ff"]},
    {"key": "transit", "cls": "theme-subway", "label": "Transit", "note": "Bold and direct, inspired by New York subway signs.", "sw": ["#111111", "#fccc0a", "#0b5cd6"]},
    {"key": "tangy", "cls": "theme-blocks", "label": "Tangy", "note": "Bright, bouncy and a little loud.", "sw": ["#d4ff4f", "#ff6a1a", "#3355ff"]},
    {"key": "sophisticated", "cls": "theme-wedding", "label": "Sophisticated", "note": "Elegant and refined, inspired by wedding stationery.", "sw": ["#f4ecdb", "#b8955a", "#1f2336"]},
]
DEFAULT = "transit"

FONTS = (
    '<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;700;800&family=Inter:wght@400;500;600;700'
    '&family=Unbounded:wght@600;700;800&family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600&display=swap" rel="stylesheet">'
)
THEME_CSS = "\n  ".join(f'<link rel="stylesheet" href="themes/{n}.css">' for n in ("subway", "blocks", "wedding"))

# Copy that changes with a mood: (mood class, current text, mood text)
ALT_COPY = [
    ("theme-wedding", "Get in touch", "RSVP"),
    ("theme-wedding", "From first call to live site in about two weeks", "From first date to launch day in about two weeks"),
    ("theme-wedding", "A quick call", "A first date"),
]

SPARKLE = ('<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5c.5 4.6 2.4 6.5 7 7-4.6.5-6.5 2.4-7 7-.5-4.6-2.4-6.5-7-7 '
           '4.6-.5 6.5-2.4 7-7Z" fill="currentColor"/><path d="M19 15.5c.2 1.8 1 2.6 2.8 2.8-1.8.2-2.6 1-2.8 2.8-.2-1.8-1-2.6-2.8-2.8 '
           '1.8-.2 2.6-1 2.8-2.8Z" fill="currentColor" opacity=".6"/></svg>')


def dots(m):
    # The mood's little "Aa" tile, set in its own colors and typeface.
    return f'<span class="moodicon moodicon--{m["key"]}" aria-hidden="true">Aa</span>'


def switcher():
    opts = "".join(
        f'<button type="button" class="mood__opt" data-mood="{m["key"]}" aria-pressed="false">{dots(m)}<span><strong>{m["label"]}</strong><small>{m["note"]}</small></span></button>'
        for m in MOODS
    )
    return f'''<div class="mood" id="mood">
    <button type="button" class="mood__btn" aria-expanded="false" aria-controls="mood-panel" aria-label="Choose your mood">{dots(MOODS[1])}</button>
    <div class="mood__panel" id="mood-panel" role="group" aria-label="Choose your mood"><button type="button" class="mood__close" aria-label="Close"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button><p class="mood__title">Choose your mood</p><p class="mood__intro">See this website in four different styles. Same content, a different feel.</p>{opts}</div>
  </div>'''


def newsletter():
    # TODO: connect to an email service (Mailchimp, ConvertKit, Buttondown...). Front-end only for now.
    return ('<div class="wrap"><div class="news">'
            '<div class="news__copy"><h4>Local business notes, once a month.</h4>'
            '<p>What\'s actually working for small businesses in New York: maps, reviews, and the questions clients ask me most. No pitches.</p></div>'
            '<form class="news__form" novalidate data-error="Enter a valid email address." data-success="You\'re on the list! Your first note arrives next month.">'
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
            f'document.documentElement.classList.add(M[k]);document.documentElement.dataset.mood=k}})();</script>')


def add_alt_copy(html):
    for cls, old, new in ALT_COPY:
        html = html.replace(f">{old}<", f'><span data-alt-{cls}="{titlecase.title(new)}">{old}</span><', 1)
    return html


def bust(html):
    # Version asset links so browsers pick up new styles after each publish.
    html = re.sub(r'(href="(?:\.\./)?(?:styles|themes/[a-z]+)\.css)(\?v=\d+)?"', r'\1?v=' + VERSION + '"', html)
    return re.sub(r'(src="(?:\.\./)?script\.js)(\?v=\d+)?"', r'\1?v=' + VERSION + '"', html)


page = (TEMPLATE
        .replace("{{FONTS}}", FONTS)
        .replace("{{THEME_CSS}}", THEME_CSS + "\n  " + mood_boot())
        .replace(' class="{{BODY_CLASS}}"', "")
        .replace("{{SWITCHER}}", switcher())
        .replace("{{MOODS}}", footer_moods())
        .replace("{{NEWSLETTER}}", newsletter())
        .replace("{{HOME}}", "index.html"))
(HERE / "index.html").write_text(bust(titlecase.apply(add_alt_copy(page))))

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
