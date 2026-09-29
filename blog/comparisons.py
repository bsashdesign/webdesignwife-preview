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
    "short": "Webflow is a professional design tool, and I use it for many client sites myself. It's fantastic in a designer's hands, but it has a steep learning curve for a business owner building a site alone.",
    "good": ["Pixel-level design control without writing code", "Fast, clean, well-built sites", "A powerful CMS for blogs and listings", "An easy editor for text and photo updates once the site is built"],
    "watch": ["Building a site from scratch means learning web design concepts", "Plans and add-ons can be confusing to compare", "It's built for designers, not for quick do-it-yourself setups", "Big layout changes still need someone who knows Webflow"],
    "them": "you're a designer, or you have one on your team.",
    "us": "you want a professionally built site without learning a design tool.",
    "tips": ["Start from a well-reviewed template instead of a blank page", "Use the Editor for day-to-day text and photo changes", "Set up SEO titles and descriptions in each page's settings", "Test on phone and tablet sizes before publishing", "Keep class names organized so future changes are easier"],
  },
  {
    "slug": "vs-shopify", "name": "Shopify",
    "summary": "If you sell products online, Shopify is probably the right answer. Here's the honest breakdown.",
    "short": "If your main goal is selling products online, use Shopify. It's excellent at what it does. My plans are for informational websites that bring in calls, bookings and visits, so I'm not the right fit for an online store.",
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
    "us": "you want a full website that tells your story. I can link it straight to your Square ordering or booking page.",
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
    "short": "Carrd is one of the cheapest ways to get a simple one-page site, and it's great for what it is. The difference with my Essentials plan is that I design it, write it and keep it updated for you.",
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
    <tr><th>Who builds the site</th><td>You</td><td>I do</td></tr>
    <tr><th>Who makes updates</th><td>You</td><td>I do. Just send a message.</td></tr>
    <tr><th>Google Maps help</th><td>Up to you</td><td>Kept up to date on every plan; growth on Business and Full Suite</td></tr>
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

<h2>Going with {p['name']}? My tips</h2>
<ol>{li(p['tips'])}</ol>

<h2>Still not sure?</h2>
<p>That's normal. Send me your current website, or tell me what you're considering, and I'll give you an honest recommendation, even if it isn't me.</p>
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
<p>…you need a large or highly custom project, like an online store with thousands of products or a web app. I take on custom projects like these too, quoted separately.</p>

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
<p class="lede-note"><strong>The short answer:</strong> plenty of local businesses build their own websites and do great. The key is keeping it simple, focusing on what customers need, and keeping it up to date. Here's the plan I'd follow, step by step.</p>

<h2>1. Pick a builder that fits you</h2>
<p>If you enjoy design, look at <a class="tc" href="vs-squarespace.html">Squarespace</a> or <a class="tc" href="vs-wix.html">Wix</a>. If you already take payments with Square, <a class="tc" href="vs-square-online.html">Square Online</a> may be enough. If you mainly sell products, go with <a class="tc" href="vs-shopify.html">Shopify</a>. Pick one and commit: moving a site between builders later usually means rebuilding it.</p>

<h2>2. Get the right domain, in your own name</h2>
<p>Your domain (like yourbusiness.com) is your address online, and it's the one part of your website you should never let someone else own. Register it with an account in your name, with your email and your login, even if someone else builds the site.</p>

<h3>Where to buy it</h3>
<p>Any of the big registrars are fine: <strong>Cloudflare Registrar</strong> (sells domains at cost), <strong>Namecheap</strong>, <strong>Porkbun</strong> or <strong>Squarespace Domains</strong> (which took over Google Domains). A .com usually costs about $10 to $20 a year. Watch for a cheap first year followed by a much higher renewal price, and turn on auto-renew so it never lapses.</p>

<h3>Check whether it's taken</h3>
<ul>
  <li>Search the name on any registrar. If it's available, you'll see a price.</li>
  <li>If it's taken, type the address into your browser to see whether it's an active business or just parked. <strong>ICANN Lookup</strong> (lookup.icann.org) shows when it was registered and when it expires.</li>
  <li>Before you commit to a name, search the <strong>USPTO trademark database</strong> so you don't build on a name someone else has protected.</li>
</ul>

<h3>If the .com you want is taken</h3>
<p>You can usually still get a .com by adding a word that keeps the essence of your name:</p>
<ul>
  <li><strong>Add your location:</strong> rosebakerybrooklyn.com, kingscutbronx.com</li>
  <li><strong>Add what you do:</strong> rivera<em>plumbing</em>.com, juniper<em>hairstudio</em>.com</li>
  <li><strong>Add a short prefix or suffix:</strong> <em>get</em>, <em>try</em>, <em>hello</em>, <em>shop</em> or <em>studio</em>, like hellojuniper.com</li>
  <li><strong>Use your full legal name</strong> if your short name is taken: caldwelltaxandaccounting.com</li>
</ul>
<p>Avoid hyphens and numbers. They're hard to say out loud and easy to mistype.</p>

<h3>Alternatives to .com</h3>
<p>If your business grows by word of mouth, people will type ".com" out of habit, so it's worth the effort to get one. If most customers find you on Google Maps or Instagram, the ending matters less. Good options:</p>
<ul>
  <li><strong>.nyc:</strong> the official New York City ending. You need an address in the city to register one, which makes it a nice local signal.</li>
  <li><strong>.co:</strong> short and professional, but people sometimes add the "m" by mistake.</li>
  <li><strong>Industry endings</strong> like .salon, .dental, .studio or .shop: memorable, but less familiar to older customers.</li>
</ul>

<h2>3. Start with one page</h2>
<p>Most local businesses don't need a big website. They need one page that answers a customer's questions in the right order. You can always add pages later, and every extra page is one more thing to keep updated.</p>

<h3>One page is enough if you're…</h3>
<p>A barber, cleaner, food truck, handyman, solo therapist or trainer, or any business with a short list of services. Organize the page top to bottom like this:</p>
<ol>
  <li><strong>What you do and where</strong>, with one clear button: "Call now," "Book online" or "Get a quote"</li>
  <li><strong>Your services</strong>, with prices or starting prices if you can</li>
  <li><strong>Reviews</strong>: your Google rating and three to five real reviews</li>
  <li><strong>About you</strong>, with a real photo of you or your team</li>
  <li><strong>Hours, address and a map</strong></li>
  <li><strong>Contact</strong>: phone, text, email or a short form, repeated at the bottom</li>
</ol>

<h3>Three pages make sense if you're…</h3>
<ul>
  <li><strong>A restaurant or café:</strong> Home, Menu, Visit (hours, location, reservations)</li>
  <li><strong>A salon or spa:</strong> Home, Services and prices, Book</li>
  <li><strong>A dentist, clinic or law office:</strong> Home, Services, About the team</li>
  <li><strong>A contractor:</strong> Home, Services, Past projects</li>
</ul>
<p>Add a separate <strong>Contact</strong> page when you have a longer form, several locations or a booking tool. Keep contact details on every page anyway.</p>

<h2>4. Write for your customers, not about yourself</h2>
<p>Visitors skim. They're looking for their exact problem, a sign they can trust you, and the fastest way to reach you. Write every section with that in mind.</p>
<ul>
  <li><strong>Lead with what you do and where.</strong> "Emergency plumbing in Queens, same-day service" beats "Welcome to our website." Someone should know they're in the right place in three seconds.</li>
  <li><strong>Name your services the way customers do.</strong> Not "plumbing solutions," but "drain cleaning," "leak repair" and "water heater installation." That's also what Google matches against.</li>
  <li><strong>Talk about their problem, then your fix.</strong> "Water heater out? I can usually replace it the same day." Short and concrete.</li>
  <li><strong>Show proof.</strong> Reviews, years in business, licenses, insurance, "family-run since 1987." Proof does more than adjectives.</li>
  <li><strong>Give prices, or at least a range.</strong> "Haircuts from $35" gets more calls than no price at all, because people assume the worst.</li>
  <li><strong>Mention your neighborhood.</strong> Cross streets, nearby landmarks and the areas you serve help locals and help Google.</li>
  <li><strong>One button per section.</strong> Every section should end with a clear next step, and your phone number should be one tap away on a phone.</li>
  <li><strong>Answer the questions you hear every day</strong> in a short FAQ: parking, payment, walk-ins, how long it takes.</li>
</ul>

{{CHECK}}

<h2>5. Use real photos, and make them look their best</h2>
<p>Your team, your space and your work build more trust than any stock photo, and a recent phone camera is plenty. What makes a good photo for a website:</p>
<ul>
  <li><strong>Natural light.</strong> Shoot near a window or outside in the shade. Turn off the flash.</li>
  <li><strong>A clean background.</strong> Move the clutter out of the frame.</li>
  <li><strong>People doing the work.</strong> A barber mid-cut beats an empty chair.</li>
  <li><strong>Your storefront</strong>, so people recognize it when they arrive.</li>
  <li><strong>Before and after</strong>, if your work allows it.</li>
  <li><strong>Landscape (sideways)</strong> photos for the top of the page. Vertical photos get cropped awkwardly.</li>
</ul>
<h3>Cleaning up photos with AI, honestly</h3>
<p>AI tools like ChatGPT can fix lighting and color in a phone photo in seconds. The rule: improve the photo, never change what it shows. A customer should walk in and see exactly what was on your website. Upload your photo and use a prompt like this:</p>
<blockquote class="prompt"><p>Improve the lighting, color and sharpness of this photo so it looks professionally shot, with soft, even, natural-looking light. Do not change, add or remove anything in the image: keep every person's face, body and expression exactly as they are, and keep the space, products, food and work exactly as they are. Do not add or remove objects, text or people. Only correct exposure, white balance, color, sharpness and noise, and gently straighten the horizon if it's tilted.</p></blockquote>
<p>Always compare the result to the original before you use it. If anything looks different, like a changed face, extra objects or food that looks better than what you serve, use the original instead.</p>

<h2>6. Set up your Google Business Profile</h2>
<p>For most local businesses, the Google Maps listing brings in as many customers as the website, often more. Before you finish your site, make sure your profile is working for you:</p>
<ul>
  <li><strong>Claim and verify it</strong> at business.google.com, using an account you own.</li>
  <li><strong>Pick the most specific main category</strong>, like "Emergency plumber" rather than "Plumber," then add a few secondary ones.</li>
  <li><strong>Keep hours exact</strong>, including holiday hours, and match them to your website.</li>
  <li><strong>Add real photos</strong> of your storefront, your team and your work, and keep adding new ones.</li>
  <li><strong>List your services</strong> with the same names you use on your website.</li>
  <li><strong>Link to your website</strong> and your booking page.</li>
  <li><strong>Ask for reviews</strong> after every good job, and reply to every review, good or bad.</li>
</ul>
<p>More detail in my guide: <a class="tc" href="google-maps-profile.html">Why your Google Maps profile might matter more than your website</a>.</p>

<h2>7. Test it properly before you share it</h2>
<p>Most of your visitors will be on a phone, so test there first, then on a computer.</p>
<ul>
  <li><strong>Tap every button and link.</strong> Do the call button, directions and booking links go to the right place?</li>
  <li><strong>Send yourself a message</strong> through your own contact form, and confirm it arrives in your inbox, not spam.</li>
  <li><strong>Check the speed</strong> with Google's free PageSpeed Insights. Large photos are the usual culprit, so shrink them before you upload.</li>
  <li><strong>Proofread</strong> your phone number, address, hours and prices twice. These are the mistakes that cost calls.</li>
  <li><strong>Ask a friend</strong> to find your hours and contact you, without your help. Watch where they get stuck.</li>
</ul>

<h2>8. Keep it current</h2>
<p>An outdated website quietly costs you customers: wrong hours send people away, and old prices start arguments. Put a monthly reminder on your calendar to check hours (including upcoming holidays), prices, services, photos and your Google profile. It takes fifteen minutes, and it's the difference between a website that works and one that just exists.</p>
""",
  },
]
