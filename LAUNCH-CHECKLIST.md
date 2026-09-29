# Going live on webdesignwife.com

The preview (bsashdesign.github.io/webdesignwife-preview) is deliberately hidden from search engines.
These are the steps for when the site moves to webdesignwife.com.

## 1. Open the site to search and AI search
- Remove `<meta name="robots" content="noindex">` from `home.template.html`, `start.template.html`,
  `contact.template.html`, `welcome.template.html`, `blog/build.py`, `privacy.html` and `terms.html`
  (keep it on `welcome.html`, the after-checkout page).
- `robots.txt` is ready: it explicitly allows OAI-SearchBot (ChatGPT Search) and points to the sitemap.
- `sitemap.xml` is regenerated on every build with today's date.

## 2. Register with the search engines
- **Google Search Console:** add the domain, verify it, submit `https://webdesignwife.com/sitemap.xml`.
- **Bing Webmaster Tools:** import from Search Console, submit the sitemap. Bing's index feeds ChatGPT Search and Copilot.
- **IndexNow:** generate a key in Bing Webmaster Tools, save it as `/<key>.txt`, and ping IndexNow after each publish
  (it can be added to the build/publish step).

## 3. Make the business unambiguous
- Structured data on the homepage already ties together: Web Design Wife → Benjamin Sash → Brooklyn, NY →
  managed websites for NYC small businesses → plans and prices → FAQ.
- Add profile links to `sameAs` (in `home.template.html`) as they exist: LinkedIn, Google Business Profile,
  Instagram, Yelp, Clutch, etc.
- Keep the same name, description, location and prices everywhere on the web.

## 4. Evidence elsewhere on the web
- Google Business Profile for Web Design Wife (with the Brooklyn service area).
- LinkedIn (personal + company page), and directory listings where small-business owners look.
- Real client case studies and reviews (New Age Pharmacy first).

## 5. Content that answers real questions
Question-led pages with specific numbers, comparisons, screenshots and first-hand experience, for example:
website cost in NYC, website maintenance cost, Wix vs hiring a web designer, improving Google Maps presence,
best website builders for small businesses, and Brooklyn/NYC web design pages.
Fewer, genuinely useful pages beat many thin ones.

## 6. Payments and scheduling (before accepting money)
- Stripe Checkout: setup fee today + subscription starting 14 days after the first call.
- Cal.com: set `CAL_LINK` in `welcome.template.html`.
- Have a lawyer review `terms.html` and `privacy.html` (drafts, updated to match the offer).
