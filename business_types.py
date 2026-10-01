# Business types: what I'd do for each kind of business. build_home.py turns this into businesses.html (every
# type, large and clickable) and one page per type (websites-for-<slug>.html).
# Each type is written around what that business's customers actually need, not the same page with the name
# swapped. It's about what I'd do, never a claim about past clients.
#   label:  how it reads in the list (and on the homepage spinner)
#   blurb:  a few words under the label on the list (shown in some moods)
#   guides: related blog posts (their slugs in blog/posts.json)

TYPES = [
  {
    "slug": "plumbers", "blurb": "Emergency calls, service areas, licensing", "label": "Plumbers", "title": "Websites for plumbers",
    "intro": "When a pipe bursts, people call whoever they find first and trust fastest. Here's what I'd do for yours.",
    "points": [
      "Put your phone number and a big Call Now button at the top of every page, so an emergency is one tap away",
      "Spell out what you fix and install, like drains, leaks, water heaters and boilers, with a short page for each so you show up for those searches",
      "List the neighborhoods you cover, so Google knows to show you nearby",
      "Set up your Google Maps profile with your hours, services, service area and photos of real jobs",
      "Make your license and insurance easy to see, because people check",
      "Keep your hours, prices and services up to date whenever they change",
    ],
    "guides": ["google-maps-profile", "get-more-google-reviews", "local-business-website-checklist"],
  },
  {
    "slug": "salons", "blurb": "Booking, galleries, stylists and prices", "label": "Salons", "title": "Websites for salons",
    "intro": "People pick a salon with their eyes. Here's what I'd do for yours.",
    "points": [
      "Show off your work with a gallery that's easy to keep fresh",
      "Put booking front and center, linked to the booking app you already use",
      "List your services with clear prices, so nobody has to call to ask",
      "Give each stylist a short intro with their specialties",
      "Set up your Google Maps profile with photos, hours and a booking link",
      "Swap in new photos, prices and stylists whenever you send them",
    ],
    "guides": ["business-photos-guide", "google-maps-profile", "get-more-google-reviews"],
  },
  {
    "slug": "barbershops", "blurb": "Walk-ins, cuts, prices and reviews", "label": "Barbers", "title": "Websites for barbershops",
    "intro": "Most people find a barber nearby on their phone and decide in seconds. Here's what I'd do for yours.",
    "points": [
      "Make booking or walking in the first thing anyone sees, with today's hours right there",
      "List your cuts and prices clearly",
      "Show photos of real cuts, the shop and the barbers",
      "Set up your Google Maps profile so you show up when people search for a barber near them",
      "Help you ask happy customers for Google reviews",
      "Update hours, prices and barbers whenever anything changes",
    ],
    "guides": ["google-maps-profile", "get-more-google-reviews", "business-photos-guide"],
  },
  {
    "slug": "dentists", "blurb": "Insurance, treatments, booking and team", "label": "Dentists", "title": "Websites for dentists",
    "intro": "Choosing a dentist is a trust decision. Here's what I'd do for your practice.",
    "points": [
      "Make booking and calling easy from every page",
      "List the insurance plans you take, one of the first things people check",
      "Explain each treatment in plain language, with its own page so you show up for those searches",
      "Introduce the dentists and the team with real photos",
      "Set up your Google Maps profile with hours, services and photos of the office",
      "Keep hours, insurance and staff up to date as they change",
    ],
    "guides": ["local-business-website-checklist", "google-maps-profile", "get-more-google-reviews"],
  },
  {
    "slug": "restaurants", "blurb": "Menus, reservations, ordering and photos", "label": "Restaurants", "title": "Websites for restaurants",
    "intro": "People decide where to eat in about a minute. Here's what I'd do for yours.",
    "points": [
      "Put your menu right on the site, quick to load and easy to read on a phone, not a PDF",
      "Link reservations and ordering to the services you already use",
      "Show your hours, address and directions at the top",
      "Use great photos of the food and the room",
      "Set up your Google Maps profile with your menu, photos and hours",
      "Update specials, prices and holiday hours whenever you send them",
    ],
    "guides": ["business-photos-guide", "google-maps-profile", "get-more-google-reviews"],
  },
  {
    "slug": "contractors", "blurb": "Project galleries, quotes and licensing", "label": "Contractors", "title": "Websites for contractors",
    "intro": "People hire a contractor based on the work they can see. Here's what I'd do for yours.",
    "points": [
      "Build a project gallery with before-and-after photos",
      "Lay out what you do, like kitchens, baths and renovations, with a page for each",
      "Make your license and insurance easy to find",
      "Add a simple quote request form that sends straight to you",
      "Set up your Google Maps profile with your service area and project photos",
      "Add new projects to the gallery whenever you finish one",
    ],
    "guides": ["business-photos-guide", "google-maps-profile", "local-business-website-checklist"],
  },
  {
    "slug": "cleaning-services", "blurb": "What's included, pricing and booking", "label": "Cleaners", "title": "Websites for cleaning services",
    "intro": "People want to know what's included, what it costs and when you can come. Here's what I'd do for yours.",
    "points": [
      "Explain each service, like home, office, move-out and deep cleans, and what's included",
      "Show your pricing, or a simple way to get a quote",
      "Make booking or requesting a quote quick",
      "List the neighborhoods you cover",
      "Set up your Google Maps profile with services, hours and reviews",
      "Keep prices, services and availability up to date",
    ],
    "guides": ["google-maps-profile", "get-more-google-reviews", "local-business-website-checklist"],
  },
  {
    "slug": "gyms", "blurb": "Class schedules, memberships and trainers", "label": "Gyms", "title": "Websites for gyms",
    "intro": "People want to see the space, the schedule and the price before they come in. Here's what I'd do for yours.",
    "points": [
      "Put the class schedule on the site, easy to read on a phone",
      "Show memberships and prices clearly, with a free trial or first-class offer if you have one",
      "Introduce the trainers and what each one teaches",
      "Show real photos of the space and the equipment",
      "Set up your Google Maps profile with hours, photos and classes",
      "Update the schedule, prices and trainers whenever they change",
    ],
    "guides": ["business-photos-guide", "google-maps-profile", "get-more-google-reviews"],
  },
  {
    "slug": "accountants", "blurb": "Services, consultations and tax season", "label": "Accountants", "title": "Websites for accountants",
    "intro": "People look for an accountant who gets their situation and seems easy to work with. Here's what I'd do for your firm.",
    "points": [
      "Explain who you help, like individuals, small businesses and freelancers, and how",
      "Give each service its own page: tax prep, bookkeeping, payroll and planning",
      "Make booking a consultation simple",
      "Introduce yourself and your team, so it feels personal",
      "Set up your Google Maps profile with services and hours",
      "Update deadlines, hours and services for tax season and after",
    ],
    "guides": ["local-business-website-checklist", "google-maps-profile", "get-more-google-reviews"],
  },
  {
    "slug": "bakeries", "blurb": "Daily menu, custom orders and pickup", "label": "Bakeries", "title": "Websites for bakeries",
    "intro": "People come for what's fresh today. Here's what I'd do for yours.",
    "points": [
      "Show your menu and what's baked daily, with mouthwatering photos",
      "Make custom cake and catering orders easy to request",
      "Show hours and location right at the top",
      "Link to ordering or pickup if you offer it",
      "Set up your Google Maps profile with photos, hours and your menu",
      "Update seasonal items, specials and holiday hours whenever you send them",
    ],
    "guides": ["business-photos-guide", "google-maps-profile", "get-more-google-reviews"],
  },
  {
    "slug": "florists", "blurb": "Arrangements, delivery and events", "label": "Florists", "title": "Websites for florists",
    "intro": "Flowers are often last-minute and for a special day. Here's what I'd do for your shop.",
    "points": [
      "Show your arrangements beautifully, with prices or price ranges",
      "Make ordering and delivery details clear, including same-day cutoffs",
      "Give weddings and events their own page with a simple inquiry form",
      "List the neighborhoods you deliver to",
      "Set up your Google Maps profile with photos, hours and delivery info",
      "Get holiday pages ready ahead of Valentine's Day and Mother's Day",
    ],
    "guides": ["business-photos-guide", "google-maps-profile", "get-more-google-reviews"],
  },
  {
    "slug": "pharmacies", "blurb": "Refills, hours, services and insurance", "label": "Pharmacies", "title": "Websites for pharmacies",
    "intro": "People want to know you're open, you have what they need and you can fill it fast. Here's what I'd do for yours.",
    "points": [
      "Make refills easy, with a refill request form or a link to the system you already use",
      "Show store and pharmacist hours clearly, with holiday hours kept up to date",
      "List your services, like delivery, vaccines and compounding",
      "Show which insurance plans you take",
      "Set up your Google Maps profile with hours, services and photos",
      "Update hours, services and staff whenever anything changes",
    ],
    "guides": ["google-maps-profile", "get-more-google-reviews", "local-business-website-checklist"],
  },
  {
    "slug": "law-offices", "blurb": "Practice areas, attorneys and consultations", "label": "Law offices", "title": "Websites for law offices",
    "intro": "People choose a lawyer they trust with something serious. Here's what I'd do for your office.",
    "points": [
      "Give each practice area its own clear page, so you show up for those searches",
      "Introduce the attorneys with real photos and backgrounds",
      "Make booking a consultation simple, with a secure contact form",
      "Write it all in plain language, so people understand what you do",
      "Set up your Google Maps profile with practice areas and hours",
      "Keep attorneys, practice areas and hours up to date",
    ],
    "guides": ["local-business-website-checklist", "google-maps-profile", "get-more-google-reviews"],
  },
  {
    "slug": "auto-repair-shops", "blurb": "Services, appointments and warranties", "label": "Auto shops", "title": "Websites for auto repair shops",
    "intro": "When the car breaks, people want someone nearby they can trust. Here's what I'd do for your shop.",
    "points": [
      "List your services, like brakes, oil changes, inspections and diagnostics, with a page for each",
      "Make calling and booking an appointment easy from any page",
      "Show hours, location and the makes you work on",
      "Explain warranties and certifications clearly",
      "Set up your Google Maps profile with services, hours and photos of the shop",
      "Help you ask happy customers for Google reviews",
    ],
    "guides": ["google-maps-profile", "get-more-google-reviews", "local-business-website-checklist"],
  },
]
