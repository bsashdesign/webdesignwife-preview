# Borough guides: how I approach a website for businesses in each borough.
# Each one is written around what's genuinely different about that borough,
# not the same page with the name swapped.

BOROUGHS = [
  {
    "slug": "websites-manhattan", "name": "Manhattan",
    "summary": "Dense blocks, busy customers and lots of competition. Here's how I build websites for Manhattan businesses.",
    "intro": "In Manhattan, your competitor is often on the same block. Customers are usually on foot, on their phone and deciding in seconds, so your website and Google Maps listing have to answer their questions instantly.",
    "different": [
      "People search by neighborhood and even by street, like “Midtown lunch” or “dentist near Columbus Circle”",
      "Many customers are office workers or visitors, so hours and holiday closures need to be exactly right",
      "Walk-in decisions happen on a phone screen in a few seconds",
      "Competition is dense, so reviews and photos often decide who gets the visit",
    ],
    "build": [
      "Your cross streets and nearest subway stops, right next to your address",
      "A map pin placed on your actual entrance, not the middle of the building",
      "Hours that are easy to update for holidays and special events",
      "Tap-to-call and directions as the first things people see on mobile",
      "Neighborhood names in your copy, so you show up for the searches people actually make",
    ],
    "hoods": "Midtown, Hell's Kitchen, Murray Hill, the Upper West Side, the Upper East Side, Harlem, East Harlem, Washington Heights, Inwood, Chelsea, the Flatiron District, Gramercy, the West Village, Greenwich Village, the East Village, SoHo, Tribeca, Chinatown, the Lower East Side, Battery Park City and the Financial District",
  },
  {
    "slug": "websites-brooklyn", "name": "Brooklyn",
    "summary": "Brooklyn customers are loyal to their neighborhood. Here's how I build websites that feel local.",
    "intro": "Brooklyn is a borough of neighborhoods, and people identify with theirs. A business that feels like part of Park Slope, Bay Ridge or Williamsburg earns a kind of loyalty that no ad can buy.",
    "different": [
      "People search with neighborhood names, like “coffee in Greenpoint” or “plumber Bay Ridge”",
      "Customers want to know the people behind the business, not just the services",
      "Long-time residents and newcomers often find businesses in different ways",
      "Word of mouth and reviews carry a lot of weight on every block",
    ],
    "build": [
      "Your neighborhood name in your headline and service descriptions",
      "Real photos of your storefront, team and street, not stock images",
      "A short story about who you are and how long you've been there",
      "Reviews from local customers, featured front and center",
      "Clear service areas if you work across several neighborhoods",
    ],
    "hoods": "Park Slope, Williamsburg, Greenpoint, Bushwick, Bed-Stuy, Crown Heights, Prospect Heights, Flatbush, Ditmas Park, Kensington, Windsor Terrace, Carroll Gardens, Cobble Hill, Boerum Hill, Brooklyn Heights, DUMBO, Fort Greene, Clinton Hill, Red Hook, Gowanus, Sunset Park, Bay Ridge, Dyker Heights, Bensonhurst, Borough Park, Midwood, Sheepshead Bay, Brighton Beach, Coney Island, Canarsie and East New York",
  },
  {
    "slug": "websites-queens", "name": "Queens",
    "summary": "Queens is one of the most diverse places anywhere. Here's how I build websites that welcome every customer.",
    "intro": "Queens is famously diverse, with neighborhoods where you'll hear dozens of languages on a single street. The businesses that do best online make every customer feel like the site was made for them.",
    "different": [
      "Many customers are more comfortable reading in a language other than English",
      "Neighborhoods are spread out, so service-area businesses need to be clear about where they go",
      "People search by neighborhood, like “Astoria” or “Flushing,” more than by “Queens”",
      "Family recommendations and reviews often drive the first visit",
    ],
    "build": [
      "Key information in a second language when your customers need it",
      "A clear list of the neighborhoods you serve, for plumbers, cleaners and other visiting services",
      "Nearby subway and train stops for walk-in businesses",
      "Photos that show the people and the place behind the business",
      "Simple, fast pages that work well on any phone",
    ],
    "hoods": "Astoria, Long Island City, Sunnyside, Woodside, Jackson Heights, Elmhurst, Corona, Flushing, Forest Hills, Rego Park, Kew Gardens, Bayside, Whitestone, Ridgewood, Maspeth, Middle Village, Richmond Hill, Ozone Park, Howard Beach, Jamaica, Fresh Meadows and the Rockaways",
  },
  {
    "slug": "websites-bronx", "name": "The Bronx", "in": "the Bronx",
    "summary": "Family-run businesses, strong neighborhoods and loyal customers. Here's how I build websites for the Bronx.",
    "intro": "The Bronx is full of family-run businesses with deep roots, from Arthur Avenue to City Island. Your website should carry that same warmth and make it easy for new customers to become regulars.",
    "different": [
      "Many customers prefer Spanish, so bilingual information can make a real difference",
      "Customers value clear, upfront prices and easy ways to call",
      "People search by neighborhood, like “Belmont” or “Riverdale”",
      "Most visitors will find you on a phone, often on the go",
    ],
    "build": [
      "Bilingual English and Spanish content where it helps your customers",
      "Prices or starting prices on the page, so there are no surprises",
      "A tap-to-call button that's always one thumb away",
      "Your story and how long you've served the neighborhood",
      "Google reviews shown on your site to build trust quickly",
    ],
    "hoods": "Belmont and Arthur Avenue, Riverdale, Kingsbridge, Fordham, Bedford Park, Norwood, Mott Haven, Port Morris, Hunts Point, Concourse, Morris Park, Pelham Bay, Parkchester, Throgs Neck, Co-op City and City Island",
  },
  {
    "slug": "websites-staten-island", "name": "Staten Island",
    "summary": "More driving, more home services and a lot of word of mouth. Here's how I build websites for Staten Island.",
    "intro": "Staten Island works a little differently from the rest of the city. More customers drive, more businesses serve people at home, and a good reputation travels fast across the island.",
    "different": [
      "Customers often drive, so parking and directions matter",
      "Contractors, landscapers and other home services cover the whole island",
      "Recommendations from neighbors carry a lot of weight",
      "People compare a few local options carefully before calling",
    ],
    "build": [
      "Parking information and directions right next to your address",
      "A clear map or list of the areas you serve",
      "Project photos and before-and-after pictures for home services",
      "A simple quote or estimate form",
      "Your license, insurance and years in business, easy to find",
    ],
    "hoods": "St. George, Tompkinsville, Stapleton, Port Richmond, West Brighton, Westerleigh, Todt Hill, New Springville, New Dorp, Great Kills, Eltingville, Annadale and Tottenville",
  },
]


MISTAKES = {'websites-manhattan': ['Listing only the building address, without cross streets or the nearest subway', "Hours that don't reflect early closings for holidays and events", 'A homepage that loads slowly on a phone, where most people are searching'], 'websites-brooklyn': ['Using stock photos that could be anywhere instead of your actual block', 'Leaving out the neighborhood name, so you miss searches like “Park Slope”', "A generic About page that doesn't say who's behind the business"], 'websites-queens': ['Important details only in English when many customers prefer another language', 'Saying “Queens” when customers search for “Astoria” or “Flushing”', 'Not listing which neighborhoods a service business actually travels to'], 'websites-bronx': ['No prices anywhere, which sends cautious customers to a competitor', "A phone number that's hard to tap on a small screen", 'Missing Spanish information when a large share of customers would prefer it'], 'websites-staten-island': ['No mention of parking, which matters when most customers drive', 'Project photos that are years old, or missing entirely', 'Leaving out license and insurance details for home services']}


# Neighborhood guides that exist so far (slug per neighborhood). Tiles link to them; the rest are listed plainly.
HOOD_ARTICLES = {}


def hood_names(b):
    import re
    return [x.strip() for x in re.split(r",| and ", b["hoods"]) if x.strip()]


def hood_tiles(b):
    tiles = []
    for name in hood_names(b):
        slug = HOOD_ARTICLES.get(name)
        tiles.append(f'<li><a href="{slug}.html">{name}</a></li>' if slug else f"<li>{name}</li>")
    return "".join(tiles)


def borough_body(b):
    li = lambda items: "".join(f"<li>{x}</li>" for x in items)
    where = b.get("in", b["name"])
    return f"""
<p class="lede-note">{b['intro']}</p>

<h2>What's different about {where}</h2>
<ul>{li(b['different'])}</ul>

<h2>What I put on every website in {where}</h2>
<ul>{li(b['build'])}</ul>

{{{{CHECK}}}}

<h2>Common mistakes I see</h2>
<ul>{li(MISTAKES[b['slug']])}</ul>

<h2>Don't forget Google Maps</h2>
<p>In a city this dense, the Google Maps listing is often the first thing a customer sees, before they ever reach your website. Make sure your categories, hours, photos and neighborhood details there match your site exactly, and ask happy customers for reviews regularly.</p>

<h2 id="neighborhoods">Neighborhoods I work with</h2>
<p>I work with businesses in every corner of {where}. Each neighborhood searches a little differently, and I'm writing a guide for each one. Don't see yours? I'd still love to hear from you.</p>
<ul class="hoods">{hood_tiles(b)}</ul>

<h2>Everything else is handled</h2>
<p>Every plan includes hosting, security, unlimited minor edits and a real person to talk to. Every plan also keeps your Google Maps profile up to date, which matters as much as your website for most local businesses. Business and Full Suite go further, with ongoing optimization and a review routine.</p>
"""
