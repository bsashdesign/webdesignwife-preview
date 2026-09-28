import re
# Builds the homepage in each design direction from home.template.html.
#   python3 build_home.py
# index.html uses the default direction; design-*.html are side-by-side previews.
import pathlib, time

VERSION = str(int(time.time()))

HERE = pathlib.Path(__file__).parent
TEMPLATE = (HERE / "home.template.html").read_text()

DIRECTIONS = {
    "refined": {
        "label": "Modern",
        "file": "design-a.html",
        "fonts": "",
        "css": "",
    },
    "subway": {
        "label": "Metro",
        "file": "design-b.html",
        "fonts": '<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">',
        "css": '<link rel="stylesheet" href="themes/subway.css">',
    },
    "blocks": {
        "label": "Tangy",
        "file": "design-c.html",
        "fonts": '<link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@600;700;800&display=swap" rel="stylesheet">',
        "css": '<link rel="stylesheet" href="themes/blocks.css">',
    },
    "wedding": {
        "label": "Magazine",
        "file": "design-d.html",
        "fonts": '<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600&display=swap" rel="stylesheet">',
        "css": '<link rel="stylesheet" href="themes/wedding.css">',
        # Copy that leans into the theme
        "copy": {
            '<p class="eyebrow">Our promises</p>': '<p class="eyebrow">Our vows</p>',
            "<h2>What every client can count on</h2>": "<h2>Our vows to every client</h2>",
            '<p class="eyebrow eyebrow--light">Free website audit</p>': '<p class="eyebrow eyebrow--light">RSVP · Free website audit</p>',
            "<h2>From first call to live site in about two weeks</h2>": "<h2>From first date to launch day in about two weeks</h2>",
            "<h3>A quick call</h3>": "<h3>A first date</h3>",
            "Fifteen minutes about your business,": "A quick 15-minute call about your business,",
        },
    },
}
DEFAULT = "subway"


def switcher(current):
    current_attr = ' aria-current="page"'
    links = "".join(
        '<a href="{}"{}>{}</a>'.format(d["file"], current_attr if key == current else "", d["label"])
        for key, d in DIRECTIONS.items()
    )
    return f'<nav class="switcher" aria-label="Design directions"><span>Style</span>{links}</nav>'


def render(key, with_switcher):
    d = DIRECTIONS[key]
    return (TEMPLATE
            .replace("{{FONTS}}", d["fonts"])
            .replace("{{THEME_CSS}}", d["css"])
            .replace("{{BODY_CLASS}}", f"theme-{key}")
            .replace("{{SWITCHER}}", switcher(key) if with_switcher else "")
            .replace("{{HOME}}", d["file"] if with_switcher else "index.html"))


def with_copy(html, key):
    for old, new in DIRECTIONS[key].get("copy", {}).items():
        html = html.replace(old, new)
    return html


def bust(html):
    # Version asset links so browsers pick up new styles after each publish.
    html = re.sub(r'(href="(?:styles|themes/[a-z]+)\.css)(\?v=\d+)?"', r'\1?v=' + VERSION + '"', html)
    return re.sub(r'(src="script\.js)(\?v=\d+)?"', r'\1?v=' + VERSION + '"', html)


for key, d in DIRECTIONS.items():
    (HERE / d["file"]).write_text(bust(with_copy(render(key, True), key)))
(HERE / "index.html").write_text(bust(with_copy(render(DEFAULT, True), DEFAULT)))
print("built", ", ".join(d["file"] for d in DIRECTIONS.values()), "+ index.html")
