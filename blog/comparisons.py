# Honest comparison articles: Web Design Wife vs. each website option.
# Rendered by build.py. Keep claims general; builders change prices and features often.

PLATFORMS = [
  {
    "slug": "vs-wix", "name": "Wix",
    "summary": "Wix is a flexible do-it-yourself builder. Here's when it's the right call, and when a managed site makes more sense.",
    "short": "Wix is a great fit if you enjoy building things yourself and have the time to keep your site updated. If you'd rather never touch your website, a managed site is the better fit.",
    "good": ["A huge library of templates for almost every industry", "A drag-and-drop editor that lets you put anything anywhere", "An app market for bookings, online stores, forms and more", "Hosting and security handled for you"],
    "watch": ["All that freedom makes it easy to end up with a cluttered page or a messy phone layout", "You're the one making every update, from hours to holiday closures", "Apps and upgrades can add up to more than the base plan", "Wix sites can't be exported, so moving away later usually means rebuilding"],
    "them": "you like designing, have a few hours a month for updates and want full control.",
    "us": "you'd rather send a quick message and have changes done for you.",
    "tips": ["Start from a template made for your industry, then remove what you don't need", "Check every page in the mobile preview before you publish", "Connect your own domain name, registered in your name", "Add your hours, address and a clear “Call” or “Book” button near the top", "Link your Google Business Profile and ask customers for reviews"],
  },
  {
    "slug": "vs-squarespace", "name": "Squarespace",
    "summary": "Squarespace makes beautiful do-it-yourself sites. Here's an honest look at when it's the right choice.",
    "short": "Squarespace is one of the best options if you want a good-looking site and you're happy to build and update it yourself. If you want someone else to handle all of it, choose a managed site.",
    "good": ["Polished, designer-quality templates", "A clean editor that's easy to learn", "Built-in tools for scheduling, simple stores and email", "Hosting, security and SSL included"],
    "watch": ["Many sites use the same templates, so yours can look familiar", "Layouts are less flexible once you move beyond the template", "Every update is still yours to make", "Templates only look great with great photos, and demo photos need replacing"],
    "them": "you care about design, have good photos and enjoy tinkering.",
    "us": "you want a custom-feeling site and never want to log in to update it.",
    "tips": ["Replace every demo photo and every line of placeholder text", "Put your phone number, hours and location on the homepage", "Fill in the SEO title and description for each page", "Keep navigation to five items or fewer", "Test your contact form by sending yourself a message"],
  },
  {
    "slug": "vs-wordpress", "name": "WordPress",
    "summary": "WordPress can do almost anything, but it needs looking after. Here's who it's right for.",
    "short": "WordPress is incredibly flexible and powers a huge share of the web. It's a great choice if you have a developer or technical skills. Without one, the ongoing maintenance often becomes a burden for a small business.",
    "good": ["Extremely flexible, with thousands of themes and plugins", "You can own and move every part of the site", "Great for large sites with lots of content", "A huge community, so help is easy to find"],
    "watch": ["WordPress core, themes and plugins need regular updates", "Sites that fall behind on updates are a common target for hackers", "Plugins can conflict with each other and break things", "You need to arrange hosting, backups and security yourself"],
    "them": "you have a developer, or you're comfortable with the technical side.",
    "us": "you want a site that stays updated and secure without you thinking about it.",
    "tips": ["Choose a managed WordPress host that handles backups and updates", "Turn on automatic updates wherever you can", "Use as few plugins as possible, and only well-maintained ones", "Add a security plugin and use strong, unique passwords", "Check your site on your phone after every update"],
  },
  {
    "slug": "vs-webflow", "name": "Webflow",
    "summary": "Webflow gives designers amazing control. Here's whether it makes sense for a local business owner.",
    "short": "Webflow is a professional design tool, and we use it for many client sites ourselves. It's fantastic in a designer's hands, but it has a steep learning curve for a business owner building a site alone.",
    "good": ["Pixel-level design control without writing code", "Fast, clean, well-built sites", "A powerful CMS for blogs and listings", "An easy editor for text and photo updates once the site is built"],
    "watch": ["Building a site from scratch means learning web design concepts", "Plans and add-ons can be confusing to compare", "It's built for designers, not for quick do-it-yourself setups", "Big layout changes still need someone who knows Webflow"],
    "them": "you're a designer, or you have one on your team.",
    "us": "you want a professionally built site without learning a design tool.",
    "tips": ["Start from a well-reviewed template instead of a blank page", "Use the Editor for day-to-day text and photo changes", "Set up SEO titles and descriptions in each page's settings", "Test on phone and tablet sizes before publishing", "Keep class names organized so future changes are easier"],
  },
  {
    "slug": "vs-shopify", "name": "Shopify",
    "summary": "If you sell products online, Shopify is probably the right answer. Here's the honest breakdown.",
    "short": "If your main goal is selling products online, use Shopify. It's excellent at what it does. Our plans are for informational websites that bring in calls, bookings and visits, so we're not the right fit for an online store.",
    "good": ["Checkout, payments, inventory and shipping built in", "Thousands of apps for reviews, subscriptions and marketing", "A point-of-sale system if you also sell in person", "Reliable hosting that handles busy sales days"],
    "watch": ["It's more than you need if you don't sell products online", "Monthly fees, app subscriptions and transaction fees add up", "You'll still manage products, photos and orders yourself"],
    "them": "you sell physical or digital products online.",
    "us": "you run a service business and want customers to call, book or visit.",
    "tips": ["Start with a free theme and upgrade only if you need to", "Invest in clear product photos on a plain background", "Be upfront about shipping costs and delivery times", "Add real customer reviews to product pages", "Keep the number of apps small so your store stays fast"],
  },
  {
    "slug": "vs-godaddy", "name": "GoDaddy Website Builder",
    "summary": "GoDaddy's builder gets you online fast. Here's what you trade for that speed.",
    "short": "GoDaddy's website builder is one of the quickest ways to get something online, especially if you already bought your domain there. It's basic by design, so it works best as a starting point.",
    "good": ["Very fast setup, with AI help writing a first draft", "Domain, email and website in one place", "Simple enough for anyone to use", "Low cost to get started"],
    "watch": ["Limited design flexibility, so sites can look generic", "AI-written text tends to sound like everyone else's", "Frequent prompts to add paid extras", "You're still responsible for every update"],
    "them": "you need a simple site online today on a small budget.",
    "us": "you want a site that stands out from competitors and stays current.",
    "tips": ["Rewrite the AI draft in your own words", "Swap stock images for real photos of your work", "Add your services, service area and reviews", "Double-check your contact details on every page", "Review your renewal prices before your first year ends"],
  },
  {
    "slug": "vs-square-online", "name": "Square Online",
    "summary": "If you already use Square, its website tool can be handy. Here's when it's enough.",
    "short": "Square Online makes the most sense if you already run your business on Square, especially for online ordering or appointments. Many businesses combine a separate website with Square's ordering or booking pages.",
    "good": ["Connects directly to your Square payments and items", "Online ordering for pickup and delivery", "Works with Square Appointments for bookings", "Inexpensive to start"],
    "watch": ["Fewer design options than dedicated website builders", "Built around selling, so storytelling and services pages are limited", "Makes the most sense only if you already use Square"],
    "them": "you use Square and mainly need online ordering or booking.",
    "us": "you want a full website that tells your story. We can link it straight to your Square ordering or booking page.",
    "tips": ["Keep your item photos and descriptions up to date", "Mark items sold out quickly so customers aren't disappointed", "Add your hours and pickup instructions clearly", "Link your Square site from your Google Business Profile", "Use the same business name everywhere online"],
  },
  {
    "slug": "vs-framer", "name": "Framer",
    "summary": "Framer makes striking, animated sites. Here's whether that's what a local business needs.",
    "short": "Framer is a favorite of designers and startups for bold, animated websites. It's powerful, but it's aimed at design-savvy people, not busy business owners who want their site handled.",
    "good": ["Beautiful animations and modern layouts", "Fast to build if you already know design tools", "AI features for generating page layouts", "Hosting included"],
    "watch": ["Built for designers and startups, not local service businesses", "Easy to prioritize flashy effects over clear information", "You're still maintaining it yourself"],
    "them": "you're comfortable with design tools and want a striking portfolio or startup site.",
    "us": "you want a clear site that brings in local customers, without learning a design tool.",
    "tips": ["Make sure your phone number and hours are easy to find", "Use animation sparingly so the site stays fast", "Test on older phones, not just new ones", "Fill in page titles and descriptions for search", "Keep the most important action in the first screen"],
  },
  {
    "slug": "vs-carrd", "name": "Carrd",
    "summary": "Carrd makes simple one-page sites for very little money. Here's how it compares.",
    "short": "Carrd is one of the cheapest ways to get a simple one-page site, and it's great for what it is. The difference with our Simple Site plan is that we design it, write it and keep it updated for you.",
    "good": ["Very low cost", "Quick to build a clean one-page site", "Simple, focused editor", "Good for landing pages and link-in-bio pages"],
    "watch": ["One page per site, with limited features", "Design and writing are entirely up to you", "No help with Google Maps, reviews or updates"],
    "them": "you're on a tight budget and happy to build a simple page yourself.",
    "us": "you want a professional one-page site, written and kept current for you.",
    "tips": ["Lead with what you do and where you do it", "Add one clear button: call, book or get a quote", "Include a few real reviews", "Use your own domain name", "Keep the page short and scannable"],
  },
  {
    "slug": "vs-google-sites", "name": "Google Sites",
    "summary": "Google Sites is free and simple. Here's why it's rarely the best choice for a business website.",
    "short": "Google Sites is free and easy if you have a Google account, but it's built mainly for internal and team pages. For a customer-facing business website, it's usually too limited.",
    "good": ["Free with a Google account", "Very easy to use", "Works well for internal pages, wikis and simple project sites"],
    "watch": ["Very limited design options", "Few business features like reviews, booking or rich contact forms", "Can look less professional to new customers"],
    "them": "you need a free internal page or a temporary placeholder.",
    "us": "you want a professional site that turns visitors into customers.",
    "tips": ["Use a clean theme and a clear headline", "Connect your own domain name", "Add a Google Form for simple inquiries", "Keep your contact details on every page", "Plan to upgrade once the business grows"],
  },
  {
    "slug": "vs-hostinger", "name": "Hostinger Website Builder",
    "summary": "Hostinger's builder is budget-friendly with AI help. Here's the honest comparison.",
    "short": "Hostinger's website builder is an affordable do-it-yourself option with AI tools to speed things up. It's a reasonable choice on a tight budget if you're comfortable doing the work.",
    "good": ["Budget-friendly, with hosting included", "AI tools to generate layouts and text", "Simple drag-and-drop editing", "Domain and email options in one place"],
    "watch": ["Templates can feel basic", "AI-generated content needs real editing to sound like you", "Introductory prices often renew higher", "Every update is still your job"],
    "them": "you want a low-cost DIY site and don't mind doing the updates.",
    "us": "you want a professional site that stays current without your time.",
    "tips": ["Check the renewal price, not just the first-year price", "Edit AI text so it sounds like your business", "Add real photos and reviews", "Set up your Google Business Profile alongside the site", "Test your contact form after publishing"],
  },
]


EXTRA_INFO = {'vs-wix': ("Wix sites can't be exported to another platform. If you leave, you keep your domain name and your content, but the design has to be rebuilt somewhere else.", 'The base plan is only part of the picture. Many businesses add paid apps for bookings, reviews or forms, and the bigger cost is usually the hours you spend building and updating.'), 'vs-squarespace': ('Squarespace lets you export some content, like pages and blog posts, but the design itself stays behind. Moving usually means rebuilding the look elsewhere.', 'Plans are straightforward, but good photography is often the hidden cost. Templates look their best with professional-quality images.'), 'vs-wordpress': ('WordPress is the easiest to move: the whole site can be copied to a new host. That freedom is a real advantage if you have someone technical to help.', "The software is free, but hosting, premium themes, plugins, security and a developer's time for updates and fixes all add up."), 'vs-webflow': ('Webflow can export the code for a site, but not the content management (CMS) features like a blog. Many owners who leave rebuild on another platform.', 'Webflow has separate plans for the site and for the account, which can be confusing to compare. Budget for a designer if you want custom work.'), 'vs-shopify': ('Shopify lets you export products, customers and orders, which makes moving a store realistic. The theme and apps stay behind.', 'Beyond the monthly plan, budget for payment processing fees, paid apps and a premium theme if you want one.'), 'vs-godaddy': ('Sites made with the builder stay on GoDaddy. Your domain can be moved anywhere, but the site would need to be rebuilt.', 'Watch renewal prices and add-ons like email and extra security, which are often sold separately.'), 'vs-square-online': ('Your items and orders live in Square, so they stay with your Square account. The website design would need to be rebuilt elsewhere.', 'The website is inexpensive, but payment processing fees apply to every online order.'), 'vs-framer': ("Framer sites live on Framer. Moving means rebuilding the design somewhere else, since the site can't be exported as a whole.", "Plans scale with traffic and features. Budget for a designer's time if you want changes you can't make yourself."), 'vs-carrd': ('A Carrd site is small, so rebuilding it elsewhere is quick if you outgrow it.', "It's one of the lowest-cost options available. The real limit is what a single page can do."), 'vs-google-sites': ("Content can be copied out easily because there's so little of it, but the design can't be moved.", "It's free, but you'll likely want to upgrade to a proper website as your business grows."), 'vs-hostinger': ("Sites made with Hostinger's builder stay on Hostinger. Your domain can be moved, but the site would need rebuilding.", 'Introductory prices are low, but renewals are often higher. Check the full renewal price before committing.')}


def comparison_body(p):
    li = lambda items: "".join(f"<li>{x}</li>" for x in items)
    return f"""
<p class="lede-note"><strong>The short answer:</strong> {p['short']}</p>

<table class="vs-table">
  <thead><tr><th></th><th>{p['name']}</th><th>Web Design Wife</th></tr></thead>
  <tbody>
    <tr><th>Who builds the site</th><td>You</td><td>We do</td></tr>
    <tr><th>Who makes updates</th><td>You</td><td>We do. Just send a message.</td></tr>
    <tr><th>Google Maps help</th><td>Up to you</td><td>Included on Business and Full Suite</td></tr>
    <tr><th>Best for</th><td>{p['them'][0].upper() + p['them'][1:]}</td><td>Busy owners who want it handled</td></tr>
  </tbody>
</table>

<h2>What {p['name']} does well</h2>
<ul>{li(p['good'])}</ul>

<h2>Where it can fall short for a local business</h2>
<ul>{li(p['watch'])}</ul>

{{{{CHECK}}}}

<h2>Choose {p['name']} if…</h2>
<p>…{p['them']} That's a perfectly good reason, and plenty of local businesses do well with it.</p>

<h2>Choose a managed website if…</h2>
<p>…{p['us']}</p>

<h2>What it really costs</h2>
<p>{EXTRA_INFO[p['slug']][1]} With any do-it-yourself builder, the biggest cost is usually time. A few hours a month on updates, fixes and design tweaks adds up to several full days a year.</p>

<h2>If you want to switch later</h2>
<p>{EXTRA_INFO[p['slug']][0]} Whatever you choose, make sure your domain name is registered in your own name. That's what lets you move without losing your web address.</p>

<h2>Questions to ask yourself</h2>
<ul>
  <li>Do I enjoy working on my website, or do I put it off?</li>
  <li>When did I last update my hours, prices or photos?</li>
  <li>Do I need to sell online, or do I mainly need customers to call, book or visit?</li>
  <li>How much is an hour of my time worth to my business?</li>
</ul>

<h2>Going with {p['name']}? Our tips</h2>
<ol>{li(p['tips'])}</ol>

<h2>Still not sure?</h2>
<p>That's normal. Send us your current website, or tell us what you're considering, and we'll give you an honest recommendation, even if it isn't us.</p>
"""


EXTRA = [
  {
    "slug": "vs-agency", "kicker": "Comparison",
    "title": "Web Design Wife vs. hiring a web design agency",
    "summary": "Agencies are great for some projects. Here's when to hire one, and when a managed site is the smarter move.",
    "minutes": 5,
    "body": """
<p class="lede-note"><strong>The short answer:</strong> hire an agency for big, complex or highly custom projects with a budget to match. For a local business that needs a great informational site kept current, a managed site usually costs less and stays fresher.</p>

<h2>What agencies do well</h2>
<ul>
  <li>Deep brand strategy, research and custom design</li>
  <li>Complex builds: large e-commerce stores, custom software, integrations</li>
  <li>Teams of specialists for design, development, copy and marketing</li>
</ul>

<h2>Where agencies can fall short for small businesses</h2>
<ul>
  <li>A large upfront bill, often several thousand dollars or more</li>
  <li>Edits after launch are usually billed hourly or need a new quote</li>
  <li>Because every change costs money, sites often go out of date</li>
  <li>You may deal with account managers instead of the people doing the work</li>
</ul>

{{CHECK}}

<h2>Choose an agency if…</h2>
<p>…you need a large or highly custom project, like an online store with thousands of products or a web app. We take on custom projects like these too, quoted separately.</p>

<h2>Choose a managed website if…</h2>
<p>…you want a professional informational site for a predictable monthly price, with updates handled whenever you need them.</p>

<h2>Questions to ask any agency</h2>
<ol>
  <li>How much do edits cost after launch?</li>
  <li>Who owns the domain name and the website?</li>
  <li>Who hosts the site, and who fixes it if it goes down?</li>
  <li>Will I talk directly to the people doing the work?</li>
</ol>
""",
  },
  {
    "slug": "diy-website-guide", "kicker": "Guide",
    "title": "Building your own website? Here's how to do it right",
    "summary": "Doing it yourself is a perfectly good choice. Here's a practical plan to get it right the first time.",
    "minutes": 7,
    "body": """
<p class="lede-note"><strong>The short answer:</strong> plenty of local businesses build their own websites and do great. The key is keeping it simple, focusing on what customers need and keeping it up to date.</p>

<h2>1. Pick a builder that fits you</h2>
<p>If you enjoy design, look at <a href="vs-squarespace.html">Squarespace</a> or <a href="vs-wix.html">Wix</a>. If you use Square for payments, <a href="vs-square-online.html">Square Online</a> may be enough. If you sell products, go with <a href="vs-shopify.html">Shopify</a>.</p>

<h2>2. Register your domain in your own name</h2>
<p>Your domain (like yourbusiness.com) is your address online. Make sure the account is in your name and that you have the login, even if someone else helps you.</p>

<h2>3. Plan five pages, not fifteen</h2>
<p>Most local businesses need only a homepage, services, about, reviews and contact. Fewer pages means less to keep updated.</p>

<h2>4. Write for your customers</h2>
<ul>
  <li>Say what you do and where, in the first line</li>
  <li>Use the words customers search for, like “emergency plumber in Queens”</li>
  <li>Keep sentences short, and put your phone number everywhere</li>
</ul>

{{CHECK}}

<h2>5. Use real photos</h2>
<p>Your team, your space and your work build more trust than any stock photo. A recent phone camera is plenty.</p>

<h2>6. Set up your Google Business Profile</h2>
<p>For most local businesses, it brings in as many customers as the website. Read our guide on <a href="google-maps-profile.html">why your Google Maps profile matters</a>.</p>

<h2>7. Check it on your phone</h2>
<p>Most of your visitors will be on a phone. Tap every button and fill in your own contact form.</p>

<h2>8. Put updates on your calendar</h2>
<p>Set a monthly reminder to check hours, prices and photos. An outdated website quietly costs you customers.</p>
""",
  },
]
