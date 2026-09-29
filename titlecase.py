# Title Case for headings and button labels, applied at build time.
import re

SMALL = {"a", "an", "and", "as", "at", "but", "by", "for", "in", "of", "on", "or", "the", "to", "vs", "vs.", "with", "via"}


def _word(w, first, last):
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
    return html
