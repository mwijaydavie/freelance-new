export type CollectionId = "audio" | "desk" | "home"

export type Retailer = {
  name: string
  price: number
  url: string
  note?: string
}

export type Product = {
  slug: string
  /** Shown on the public site. Unpublished picks stay in the admin only. */
  published?: boolean
  /** Promoted on the home page and the shortlist. */
  featured?: boolean
  name: string
  maker: string
  collection: CollectionId
  price: number
  score: number
  badge?: "editor's pick" | "best value" | "quiet luxury"
  verdict: string
  bestFor: string
  summary: string
  image: string
  testedHours: number
  updated: string
  pros: string[]
  cons: string[]
  specs: { label: string; value: string }[]
  scores: { label: string; value: number }[]
  retailers: Retailer[]
}

export type Collection = {
  id: CollectionId
  slug: string
  title: string
  kicker: string
  blurb: string
  intro: string
  image: string
  productSlugs: string[]
}

export const collections: Collection[] = [
  {
    id: "audio",
    slug: "audio",
    title: "Audio",
    kicker: "01 — Listening",
    blurb: "Headphones, buds and speakers that make the rest of the market sound like a compromise.",
    intro:
      "We listen in a treated room for two weeks minimum, then again on a commuter train, a flight and a kitchen. What survives is the short list: gear with honest tuning, a battery that behaves, and controls you can use with cold hands.",
    image: "/products/aura-one.jpg",
    productSlugs: ["aura-one", "drift-pro", "pebble"],
  },
  {
    id: "desk",
    slug: "desk",
    title: "Desk",
    kicker: "02 — Working",
    blurb: "The five things on your desk that decide whether a Tuesday feels long.",
    intro:
      "A desk is a tool, not a mood board. We keep only what earns its footprint — boards that feel good at 3pm, light that doesn't fight your eyes, stands that stop the neck ache. Every pick is used for a full working month before it is listed.",
    image: "/products/monolith-keyboard.jpg",
    productSlugs: ["monolith", "halo", "perch"],
  },
  {
    id: "home",
    slug: "home",
    title: "Home",
    kicker: "03 — Living",
    blurb: "Quiet objects for a smaller kitchen, a warmer room and a better morning.",
    intro:
      "Home is where affiliate sites usually go to die in a pile of plastic gadgets. We take the opposite approach: fewer objects, better materials, nothing that needs an app. These are the pieces we have kept in our own homes for a season or more.",
    image: "/products/lune-lamp.jpg",
    productSlugs: ["ember", "lune", "fold"],
  },
]

export const products: Product[] = [
  {
    slug: "aura-one",
    name: "Aura One",
    maker: "Norr Audio",
    collection: "audio",
    price: 349,
    score: 94,
    featured: true,
    badge: "editor's pick",
    verdict: "The first over-ear in years that gets tuning, comfort and price in the same room.",
    bestFor: "Working through a noisy day",
    summary:
      "Two weeks of testing, one conclusion: the Aura One is the most listenable headphone under $400. The tuning is warm without being muddy, the mids hold a vocal exactly where you left it, and the clamp force is gentle enough to forget you're wearing them. Noise cancelling is not class-leading, but it removes the office, the train and the neighbour's renovation — which is what it's for.",
    image: "/products/aura-one.jpg",
    testedHours: 128,
    updated: "2026-11-14",
    pros: [
      "Tuning that flatters almost every genre",
      "Six hours of wear without ear fatigue",
      "Physical controls, no app required",
      "Replaceable pads and headband",
    ],
    cons: [
      "ANC is a step behind the class leader",
      "Case is bigger than it needs to be",
    ],
    specs: [
      { label: "Battery", value: "38 h (ANC on)" },
      { label: "Weight", value: "268 g" },
      { label: "Drivers", value: "40 mm dynamic" },
      { label: "Codecs", value: "AAC, LDAC" },
      { label: "Warranty", value: "3 years" },
    ],
    scores: [
      { label: "Sound", value: 95 },
      { label: "Comfort", value: 94 },
      { label: "Build", value: 90 },
      { label: "ANC", value: 84 },
      { label: "Value", value: 92 },
    ],
    retailers: [
      { name: "Amazon", price: 349, url: "https://www.amazon.com/s?k=norr+audio+aura+one+headphones", note: "Ships in 2 days" },
      { name: "Brand direct", price: 349, url: "https://www.amazon.com/s?k=over+ear+noise+cancelling+headphones", note: "Free pad swap" },
    ],
  },
  {
    slug: "drift-pro",
    name: "Drift Pro",
    maker: "Kestrel",
    collection: "audio",
    price: 179,
    score: 89,
    badge: "best value",
    verdict: "Half the money, most of the experience. The buds we recommend to everyone who asks.",
    bestFor: "Pockets, commutes and calls",
    summary:
      "The Drift Pro is what happens when a small brand refuses to pad a spec sheet. The case is ceramic-coated and pocket-safe, the buds seal without pressure, and the app is optional. Call quality is genuinely better than buds twice the price, which is why they live in our bag rather than the drawer.",
    image: "/products/drift-pro.jpg",
    testedHours: 96,
    updated: "2026-11-09",
    pros: [
      "Natural mids on calls",
      "Case smaller than a matchbox",
      "Three-device switching that works",
      "Good passive seal",
    ],
    cons: [
      "No wireless charging",
      "No spatial audio mode",
    ],
    specs: [
      { label: "Battery", value: "7 h + 21 h case" },
      { label: "Weight", value: "4.6 g per bud" },
      { label: "IP rating", value: "IPX5" },
      { label: "Codecs", value: "AAC, SBC" },
      { label: "Warranty", value: "2 years" },
    ],
    scores: [
      { label: "Sound", value: 88 },
      { label: "Comfort", value: 92 },
      { label: "Build", value: 86 },
      { label: "Calls", value: 91 },
      { label: "Value", value: 95 },
    ],
    retailers: [
      { name: "Amazon", price: 179, url: "https://www.amazon.com/s?k=kestrel+drift+pro+earbuds" },
      { name: "Best Buy", price: 189, url: "https://www.bestbuy.com/site/searchpage.jsp?st=wireless+earbuds" },
    ],
  },
  {
    slug: "pebble",
    name: "Pebble",
    maker: "Norr Audio",
    collection: "audio",
    price: 129,
    score: 84,
    verdict: "The small speaker that fills a room honestly — and survives a balcony.",
    bestFor: "Kitchens, balconies, low-key hosting",
    summary:
      "Most speakers this size fake bass with a hump around 90Hz. Pebble doesn't. It goes lower than it should for its footprint, keeps voices intact, and gets loud enough for a dinner without turning brittle. It is not a party speaker. It is the speaker you actually use.",
    image: "/products/pebble-speaker.jpg",
    testedHours: 64,
    updated: "2026-10-28",
    pros: [
      "Balanced tuning at low volumes",
      "Real 14-hour battery",
      "USB-C charging and line-in",
      "Recycled aluminium body",
    ],
    cons: [
      "Not waterproof enough for a pool",
      "No stereo pairing with older units",
    ],
    specs: [
      { label: "Battery", value: "14 h" },
      { label: "Weight", value: "540 g" },
      { label: "IP rating", value: "IP67" },
      { label: "Inputs", value: "USB-C, 3.5 mm" },
      { label: "Warranty", value: "2 years" },
    ],
    scores: [
      { label: "Sound", value: 85 },
      { label: "Build", value: 88 },
      { label: "Volume", value: 80 },
      { label: "Portability", value: 90 },
      { label: "Value", value: 87 },
    ],
    retailers: [
      { name: "Amazon", price: 129, url: "https://www.amazon.com/s?k=norr+audio+pebble+speaker" },
      { name: "Brand direct", price: 129, url: "https://www.amazon.com/s?k=portable+bluetooth+speaker" },
    ],
  },
  {
    slug: "monolith",
    name: "Monolith 75",
    maker: "Typworks",
    collection: "desk",
    price: 189,
    score: 92,
    featured: true,
    badge: "editor's pick",
    verdict: "A keyboard you stop thinking about, which is the highest compliment a keyboard can get.",
    bestFor: "Eight-hour typing days",
    summary:
      "The Monolith arrives assembled, sounds like a well-made wooden drawer, and needs no software to be useful. The 75% layout keeps arrows and a knob without eating your mouse space. After a month of daily use there is no rattle, no shine on the caps, and no reason to look at anything else under $250.",
    image: "/products/monolith-keyboard.jpg",
    testedHours: 312,
    updated: "2026-11-16",
    pros: [
      "Gasket mount with a genuinely soft typing feel",
      "Hot-swap sockets, no soldering",
      "Bluetooth and USB-C, switches in a second",
      "PBT caps that stay matte",
    ],
    cons: [
      "No wrist rest included",
      "Software is Windows-only",
    ],
    specs: [
      { label: "Layout", value: "75%, 82 keys" },
      { label: "Switches", value: "Linear, 45 g" },
      { label: "Mount", value: "Gasket" },
      { label: "Connectivity", value: "BT 5.2, USB-C" },
      { label: "Battery", value: "4,000 mAh" },
    ],
    scores: [
      { label: "Typing", value: 95 },
      { label: "Build", value: 93 },
      { label: "Sound", value: 91 },
      { label: "Software", value: 82 },
      { label: "Value", value: 90 },
    ],
    retailers: [
      { name: "Amazon", price: 189, url: "https://www.amazon.com/s?k=typworks+monolith+75+keyboard" },
      { name: "Brand direct", price: 179, url: "https://www.amazon.com/s?k=75+percent+mechanical+keyboard" },
    ],
  },
  {
    slug: "halo",
    name: "Halo Arc",
    maker: "Lumen Studio",
    collection: "desk",
    price: 229,
    score: 88,
    verdict: "Light that reads like daylight without making your desk look like an operating theatre.",
    bestFor: "Late shifts and small rooms",
    summary:
      "The Halo Arc puts a wide, even pool of light exactly where your hands are and almost nowhere else. Colour temperature is set with a single knurled dial, there is no app, and the arm holds position after months of use. It is expensive for a lamp; it is also the object you touch every day.",
    image: "/products/halo-lamp.jpg",
    testedHours: 240,
    updated: "2026-11-02",
    pros: [
      "Excellent glare control",
      "Dial-only controls",
      "Stable at every angle",
      "Warm 2700K to 5000K range",
    ],
    cons: [
      "No smart-home integration",
      "Heavy base needs 12 cm of depth",
    ],
    specs: [
      { label: "Output", value: "820 lm" },
      { label: "Colour temp", value: "2700–5000 K" },
      { label: "CRI", value: "95" },
      { label: "Power", value: "12 W" },
      { label: "Warranty", value: "5 years" },
    ],
    scores: [
      { label: "Light quality", value: 93 },
      { label: "Build", value: 89 },
      { label: "Controls", value: 91 },
      { label: "Footprint", value: 78 },
      { label: "Value", value: 84 },
    ],
    retailers: [
      { name: "Amazon", price: 229, url: "https://www.amazon.com/s?k=lumen+studio+halo+arc+desk+lamp" },
      { name: "Brand direct", price: 219, url: "https://www.amazon.com/s?k=architect+desk+lamp" },
    ],
  },
  {
    slug: "perch",
    name: "Perch",
    maker: "Form & Field",
    collection: "desk",
    price: 89,
    score: 86,
    badge: "best value",
    verdict: "The cheapest fix for a neck that hurts by Thursday.",
    bestFor: "Laptops, small desks, travel",
    summary:
      "Perch lifts a laptop to eye level in one movement and folds flat enough for a tote. It doesn't wobble, it doesn't scratch, and it costs less than a replacement charging cable habit. If you work on a laptop for more than four hours a day, buy this before anything else on this list.",
    image: "/products/perch-stand.jpg",
    testedHours: 400,
    updated: "2026-10-21",
    pros: [
      "Six height positions, all stable",
      "Folds to 12 mm",
      "Silicone pads that actually grip",
      "Handles up to 17 inches",
    ],
    cons: [
      "Needs an external keyboard to be useful",
      "No cable routing",
    ],
    specs: [
      { label: "Material", value: "Anodised aluminium" },
      { label: "Folded", value: "12 mm" },
      { label: "Capacity", value: "Up to 5 kg" },
      { label: "Fits", value: "11–17 in" },
      { label: "Warranty", value: "Lifetime" },
    ],
    scores: [
      { label: "Stability", value: 90 },
      { label: "Portability", value: 93 },
      { label: "Build", value: 87 },
      { label: "Ergonomics", value: 85 },
      { label: "Value", value: 94 },
    ],
    retailers: [
      { name: "Amazon", price: 89, url: "https://www.amazon.com/s?k=form+field+perch+laptop+stand" },
      { name: "Best Buy", price: 95, url: "https://www.bestbuy.com/site/searchpage.jsp?st=laptop+stand" },
    ],
  },
  {
    slug: "ember",
    name: "Ember",
    maker: "Stovetop Co.",
    collection: "home",
    price: 129,
    score: 93,
    featured: true,
    badge: "editor's pick",
    verdict: "A kettle that pours like it costs three times as much, and looks like it knows it.",
    bestFor: "Pour-over mornings",
    summary:
      "The Ember's spout is the whole story: a slow, controllable stream with no drip after the pour. The walnut handle stays cool, the base heats 500 ml in under three minutes, and the matte finish has not marked after a full season of daily use. It is the one appliance on our counter that earns its space.",
    image: "/products/ember-kettle.jpg",
    testedHours: 180,
    updated: "2026-11-11",
    pros: [
      "Best-in-class pour control",
      "Walnut handle stays cool",
      "Hold temperature to the degree",
      "Quiet boil",
    ],
    cons: [
      "Hand wash only",
      "No app or presets",
    ],
    specs: [
      { label: "Capacity", value: "900 ml" },
      { label: "Power", value: "1,200 W" },
      { label: "Temp range", value: "40–100 °C" },
      { label: "Body", value: "304 stainless steel" },
      { label: "Warranty", value: "2 years" },
    ],
    scores: [
      { label: "Pour", value: 96 },
      { label: "Speed", value: 90 },
      { label: "Build", value: 92 },
      { label: "Looks", value: 94 },
      { label: "Value", value: 88 },
    ],
    retailers: [
      { name: "Amazon", price: 129, url: "https://www.amazon.com/s?k=stovetop+co+ember+gooseneck+kettle" },
      { name: "Brand direct", price: 125, url: "https://www.amazon.com/s?k=gooseneck+electric+kettle" },
    ],
  },
  {
    slug: "lune",
    name: "Lune",
    maker: "Atelier Nord",
    collection: "home",
    price: 168,
    score: 90,
    badge: "quiet luxury",
    verdict: "Warm, sculptural light for the corner of a room that never felt finished.",
    bestFor: "Bedside, sideboard, small rental rooms",
    summary:
      "Lune is a small lamp with a large personality and a very specific job: making 25 square centimetres of a room feel considered. The linen shade is diffused enough to read by, the ceramic base is heavy enough to stay put, and the inline switch is where your hand expects it.",
    image: "/products/lune-lamp.jpg",
    testedHours: 220,
    updated: "2026-10-30",
    pros: [
      "Soft, even glow with no hotspot",
      "Weighted ceramic base",
      "Inline switch, no app",
      "Bulb included, standard E14",
    ],
    cons: [
      "Not dimmable out of the box",
      "Shade is hand-wash spot clean only",
    ],
    specs: [
      { label: "Height", value: "32 cm" },
      { label: "Bulb", value: "E14, 4 W LED included" },
      { label: "Base", value: "Glazed stoneware" },
      { label: "Cord", value: "1.8 m fabric" },
      { label: "Warranty", value: "3 years" },
    ],
    scores: [
      { label: "Light quality", value: 92 },
      { label: "Materials", value: 91 },
      { label: "Build", value: 90 },
      { label: "Controls", value: 82 },
      { label: "Value", value: 86 },
    ],
    retailers: [
      { name: "Amazon", price: 168, url: "https://www.amazon.com/s?k=atelier+nord+lune+table+lamp" },
      { name: "Brand direct", price: 168, url: "https://www.amazon.com/s?k=ceramic+table+lamp+linen+shade" },
    ],
  },
  {
    slug: "fold",
    name: "Fold",
    maker: "Clay House",
    collection: "home",
    price: 74,
    score: 87,
    verdict: "A hand-thrown pour-over set that makes average beans taste like a good decision.",
    bestFor: "Small kitchens and slow mornings",
    summary:
      "Fold pairs a speckled stoneware dripper with a carafe that doubles as a serving jug. The thick walls hold heat noticeably better than glass, the ribbing produces an even extraction, and the whole thing stacks into a footprint smaller than a toaster. At this price it's the easiest recommendation on the site.",
    image: "/products/fold-set.jpg",
    testedHours: 140,
    updated: "2026-11-05",
    pros: [
      "Holds heat far better than glass",
      "Stacks into a small footprint",
      "Dishwasher safe",
      "Each piece is visibly hand-finished",
    ],
    cons: [
      "No paper filters included",
      "Slight variation between sets",
    ],
    specs: [
      { label: "Capacity", value: "600 ml carafe" },
      { label: "Material", value: "Speckled stoneware" },
      { label: "Filter", value: "Standard #02 cone" },
      { label: "Dishwasher", value: "Yes" },
      { label: "Made", value: "Small batch, Portugal" },
    ],
    scores: [
      { label: "Extraction", value: 88 },
      { label: "Heat", value: 90 },
      { label: "Build", value: 89 },
      { label: "Looks", value: 92 },
      { label: "Value", value: 93 },
    ],
    retailers: [
      { name: "Amazon", price: 74, url: "https://www.amazon.com/s?k=clay+house+fold+pour+over+set" },
      { name: "Brand direct", price: 74, url: "https://www.amazon.com/s?k=ceramic+pour+over+coffee+dripper" },
    ],
  },
]

/** Lightweight list for selects and filters (safe in client components). */
export const collectionOptions = collections.map((c) => ({ id: c.id, title: c.title }))

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug)
}

export function getCollection(id: CollectionId) {
  return collections.find((c) => c.id === id)!
}

export function getCollectionBySlug(slug: string) {
  return collections.find((c) => c.slug === slug)
}

export function productsIn(collection: CollectionId) {
  return products.filter((p) => p.collection === collection)
}

export const featured = ["aura-one", "monolith", "ember"].map((slug) => getProduct(slug)!)

export const money = (n: number) => `$${n.toLocaleString("en-US")}`

export const updatedLabel = (iso: string) =>
  new Date(iso + "T12:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
