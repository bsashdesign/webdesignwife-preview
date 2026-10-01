# Title Case for headings and button labels, applied at build time.
import re

SMALL = {"a", "an", "and", "as", "at", "but", "by", "for", "in", "of", "on", "or", "the", "to", "vs", "vs.", "with", "via"}


def _word(w, first, last):
    if re.match(r"^\.[a-z]", w):  # domain endings like .com or .nyc stay lowercase
        return w
    core = re.sub(r"^[^\w$]+|[^\w%]+$", "", w)
    if not core or re.search(r"[\d$]", core) or (core.isupper() and len(core) > 1):
        return w
    if core.lower() in SMALL and not first and not last:
        return w.replace(core, core.lower(), 1)
    fixed = "-".join(p[:1].upper() + p[1:] for p in core.split("-"))
    return w.replace(core, fixed, 1)


def title(text):
    words = text.split(" ")
    idx = [i for i, w in enumerate(words) if re.search(r"\w", w)]
    out = []
    for i, w in enumerate(words):
        if not re.search(r"\w", w):
            out.append(w)
            continue
        first = i == idx[0] or (i > 0 and re.search(r"[.:?!]$", words[i - 1] or ""))
        out.append(_word(w, first, i == idx[-1]))
    return " ".join(out)


def _inner(html):
    # Title-case only the text between tags; leave tags and entities alone.
    # Descriptions in <small> stay in sentence case.
    parts = re.split(r"(<[^>]+>|&[a-z]+;)", html)
    out, small = [], False
    for p in parts:
        if p.startswith("<small"):
            small = True
        elif p.startswith("</small"):
            small = False
        out.append(p if (p.startswith("<") or p.startswith("&") or small) else title(p))
    return "".join(out)


def apply(html):
    html = re.sub(r"(<h[12][^>]*>)(.*?)(</h[12]>)", lambda m: m.group(1) + _inner(m.group(2)) + m.group(3), html, flags=re.S)
    html = re.sub(r'(<a [^>]*class="[^"]*\bbtn\b[^"]*"[^>]*>)(.*?)(</a>)', lambda m: m.group(1) + _inner(m.group(2)) + m.group(3), html, flags=re.S)
    html = re.sub(r"(<button\b[^>]*>)(.*?)(</button>)", lambda m: m.group(1) + _inner(m.group(2)) + m.group(3), html, flags=re.S)
    # Anything else marked class="tc" (titles set as a link or paragraph) gets Title Case too.
    html = re.sub(r'(<(a|p|span)\b[^>]*class="(?:[^"]*\s)?tc(?:\s[^"]*)?"[^>]*>)(.*?)(</\2>)', lambda m: m.group(1) + _inner(m.group(3)) + m.group(4), html, flags=re.S)
    return arrows(html)


# A text arrow ending a link or label ("… →") becomes the same drawn arrow the buttons use, so it looks right in every font.
ARROW = ('<svg class="i-arrow" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9.5M8.5 4l4 4-4 4" fill="none" '
         'stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>')


HEART = ('<svg class="i-heart" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 13.6S1.8 9.9 1.8 5.8A3.2 3.2 0 0 1 8 4.6a3.2 3.2 0 0 1 6.2 1.2C14.2 9.9 8 13.6 8 13.6Z" '
         'fill="currentColor"/></svg>')


BACK = ('<svg class="i-arrow i-arrow--back" viewBox="0 0 16 16" aria-hidden="true"><path d="M13 8H3.5M7.5 4l-4 4 4 4" fill="none" '
        'stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>')

def arrows(html):
    html = re.sub(r"\s*→\s*</(a|span)>", lambda m: ARROW + "</" + m.group(1) + ">", html)
    # "← Back" links get the same drawn arrow, pointing left (the text glyph looks odd in some fonts)
    html = re.sub(r"(<(?:a|button)\b[^>]*>)\s*←\s*", lambda m: m.group(1) + BACK + " ", html)
    # A heart ending a button or tab label is drawn too (the text glyph turns into an emoji in some fonts).
    return re.sub(r"\s*♥\s*</(button|span)>", lambda m: " " + HEART + "</" + m.group(1) + ">", html)
