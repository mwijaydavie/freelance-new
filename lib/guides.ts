export type Guide = {
  slug: string
  title: string
  kicker: string
  excerpt: string
  date: string
  readTime: string
  image: string
  productSlugs: string[]
  sections: { heading: string; body: string[] }[]
}

export const guides: Guide[] = [
  {
    slug: "the-desk-reset",
    title: "The desk reset",
    kicker: "Field notes",
    excerpt:
      "Four things decide whether a desk makes you better at your job. Three of them cost less than a takeaway dinner.",
    date: "2026-11-12",
    readTime: "9 min",
    image: "/products/monolith-keyboard.jpg",
    productSlugs: ["monolith", "perch", "halo"],
    sections: [
      {
        heading: "Start with the thing you touch most",
        body: [
          "A desk is not a mood board. It is a workstation that you sit at for a third of your waking life, and the objects on it either reduce friction or add it. After a year of swapping gear in and out of three different setups — a home office, a rented desk in town, and a kitchen table that does double duty — the pattern is boringly consistent: the items you touch every few minutes matter far more than the ones you look at.",
          "That means the keyboard first, the screen height second, the light third, and everything decorative last. If you have $300 and a sore neck, spend it in that order. You will feel the difference by Thursday.",
        ],
      },
      {
        heading: "Height beats hardware",
        body: [
          "The single most common mistake we see is a laptop on a beautiful stand with no external keyboard. Raising a screen to eye level is correct; typing on a raised deck is not. If you are going to lift the laptop, budget for a keyboard the same week — otherwise you have simply moved the problem from your neck to your wrists.",
          "Aim for the top third of the screen at eye level, elbows at roughly ninety degrees, and the keyboard close enough that your shoulders stay down. It takes ten minutes to set up and it is the only ergonomic advice that has ever survived contact with a busy week.",
        ],
      },
      {
        heading: "Light is a tool, not a vibe",
        body: [
          "Overhead light casts your own shadow onto the desk. A single task lamp placed to the side of your dominant hand removes it, and a wide, diffused pool of light at around 4000K keeps paper and screens in the same visual register. Warm light after 7pm, cooler light before noon — a dial is worth more than an app here, because you will actually use it.",
        ],
      },
      {
        heading: "Buy once, keep the box for a week",
        body: [
          "Every product on this site is bought at retail, used for at least a month, and returned if it does not earn its place. We keep the packaging for the first week precisely because the honest test of a desk object is whether you miss it when it is gone. If you would not notice it leaving, it should not have arrived.",
        ],
      },
    ],
  },
  {
    slug: "headphones-under-400",
    title: "Every headphone under $400, ranked",
    kicker: "Ranked",
    excerpt:
      "We bought eleven pairs, wore them for six weeks, and then argued about the top three for a fortnight. Here is where it landed.",
    date: "2026-11-08",
    readTime: "12 min",
    image: "/products/aura-one.jpg",
    productSlugs: ["aura-one", "drift-pro", "pebble"],
    sections: [
      {
        heading: "How we ranked them",
        body: [
          "Eleven pairs, all bought at full price, all used for at least twelve hours a week across an office, a commuter line and two flights. We scored sound, comfort, build, noise cancelling and value, then weighted comfort slightly higher than reviewers usually do — because a headphone you take off after ninety minutes is a headphone you will stop using.",
          "Two pairs were returned immediately: one had a channel imbalance, one had clamping force that left marks. Neither problem shows up in a spec sheet, which is the entire argument for testing in the real world.",
        ],
      },
      {
        heading: "The winner, and why it is boring",
        body: [
          "The Aura One does not win any single category. It is not the quietest, not the lightest, and not the most detailed. It wins because there is nothing you have to forgive. Vocals sit forward without shout, the low end has shape rather than weight, and after six hours the only thing you notice is that you forgot you were reviewing them.",
          "If you want the last word in noise cancelling, the class leader is still better on a plane. If you want to enjoy music for three years, this is the pair.",
        ],
      },
      {
        heading: "The value pick is genuinely better for most people",
        body: [
          "The Drift Pro is $179 and gets you 85% of the experience in a case you can lose in a coat pocket. Call quality is better than several flagship buds. The only real compromise is battery: seven hours per charge is fine for a commute and not fine for a transatlantic flight.",
          "If your listening is mostly walking, talking and working in coffee shops, buy the Drift Pro and put the difference into a speaker you will use at home.",
        ],
      },
      {
        heading: "What we would skip",
        body: [
          "Anything with a proprietary cable, a mandatory app for basic controls, or a battery you cannot replace. Those three things turn a $300 purchase into an eighteen-month rental. We would rather recommend a cheaper pair that outlives its warranty.",
        ],
      },
    ],
  },
  {
    slug: "good-coffee-small-kitchen",
    title: "Good coffee on 60 cm of counter",
    kicker: "Small rooms",
    excerpt: "You do not need a second appliance. You need a kettle with a good spout and something that holds heat.",
    date: "2026-11-01",
    readTime: "7 min",
    image: "/products/ember-kettle.jpg",
    productSlugs: ["ember", "fold"],
    sections: [
      {
        heading: "The two-object setup",
        body: [
          "In a small kitchen, every object has a rent: it must justify the space it takes from you every single day. A grinder earns its rent. A scale earns its rent. A second espresso machine usually does not — and neither does the glass pour-over that looks beautiful on a shelf and goes cold halfway through a two-cup brew.",
          "Our recommendation for a 60 cm counter is deliberately unglamorous: one kettle with real pour control, one ceramic dripper that holds heat, and a hand grinder that lives in a drawer. That's it. Everything else is technique.",
        ],
      },
      {
        heading: "Heat is the whole game",
        body: [
          "Ceramic retains heat far better than glass, and a pre-heated stoneware dripper keeps your brew bed in the right range for the entire pour. That single change fixes the thin, sour cups most people blame on their beans. Rinse the dripper with hot water before you start, and do not skip it.",
        ],
      },
      {
        heading: "A kettle worth the space",
        body: [
          "The Ember is on this list because its spout gives you a slow, steady stream with no drip at the end — which means you can actually control extraction instead of guessing. Hold 93°C, pour in circles, finish around three minutes. After two weeks you will stop measuring and start tasting.",
        ],
      },
    ],
  },
]

export function getGuide(slug: string) {
  return guides.find((g) => g.slug === slug)
}

export const guideDate = (iso: string) =>
  new Date(iso + "T12:00:00Z").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
