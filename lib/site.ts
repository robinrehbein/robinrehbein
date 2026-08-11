export const site = {
  name: "Robin Rehbein",
  role: "Software Engineer & Web Architect",
  location: "Stuttgart, Germany",
  email: "hello@robinrehbein.de",
  github: "https://github.com/robinrehbein",
  url: "https://robinrehbein.de",
  codingSince: 2015,
};

export interface Project {
  index: string;
  title: string;
  href: string;
  summary: string;
  description: string;
  images: string[];
}

export const projects: Project[] = [
  {
    index: "01",
    title: "Noah",
    href: "https://join-noah.de",
    summary: "The shared account for groups without a legal form.",
    description:
      "Banks usually only open an account in a group's name for registered associations. Noah is the joint account for everyone else — school classes, sports teams and clubs: the money belongs to the group, not to one member who is personally liable. I co-founded Noah in 2026 together with Fabian and Luis and build the product as CTO — from architecture to the last pixel, on the same Deno Fresh stack as this site.",
    images: [
      "/noah_landing_desktop.webp",
      "/noah_landing_mobile.webp",
    ],
  },
  {
    index: "02",
    title: "artwerk studios",
    href: "https://artwerk.store",
    summary: "Turn your favorite songs into personalized posters.",
    description:
      "artwerk is a passion project I co-founded with two friends. Our mission was to transform your favorite songs into personalized posters, capturing the essence of music and memory in unique visual art. In just seconds, you could create your custom poster and see a live preview — printed on premium paper, produced in an environmentally friendly manner. Sales have since been discontinued; the site stays online as a showcase of what we built.",
    images: [
      "/macbook_artwerk_landing_light.webp",
      "/iphone_artwerk_landing.webp",
      "/curved_3_artwerk_poster.webp",
      "/curved_1_artwerk_poster.webp",
      "/curved_2_artwerk_poster.webp",
    ],
  },
  {
    index: "03",
    title: "Kirchmaier & Staudacher",
    href: "https://www.kirchmaier-staudacher.de/",
    summary: "Digital presence for a construction project management company.",
    description:
      "Kirchmaier & Staudacher is a project management company dedicated to excellence in construction and real estate development. They deliver personalized project solutions with precision and efficiency, with sustainability at the core of their operations. I designed and built their digital presence — a synergy of expertise and innovation where your vision is their blueprint for success.",
    images: [
      "/macbook_kirchmaier_landing_1.webp",
      "/iphone_kirchmaier_landing_1.webp",
      "/macbook_kirchmaier_landing_2.webp",
      "/iphone_kirchmaier_landing_2.webp",
      "/macbook_kirchmaier_landing_3.webp",
    ],
  },
];

export interface SideProject {
  title: string;
  href: string;
  tagline: string;
  description: string;
  tech: string;
  icon: string;
  images?: string[];
}

export const sideProjects: SideProject[] = [
  {
    title: "Trailscape",
    href: "https://github.com/robinrehbein/trailscape",
    tagline: "Local-first GPS tracking & route planning for Android.",
    description:
      "A free, open-source alternative to Strava and Komoot, built natively with Kotlin and Jetpack Compose. Records your rides with crash-safe background GPS tracking, plans routes via BRouter with bike-type profiles, navigates with off-route warnings, imports and exports GPX and works with fully offline MapLibre maps. Reads heart rate, HRV and sleep from Health Connect and turns everything into training plans and a daily readiness score — all local-first: your data stays on your device, no accounts, no cloud, optional self-hosted sync.",
    tech: "Kotlin · Jetpack Compose · MapLibre · MIT",
    icon: "/lab_trailscape.webp",
    images: ["/trailscape_tours.webp", "/trailscape_training.webp"],
  },
  {
    title: "Drops.",
    href: "https://github.com/robinrehbein/Drops.",
    tagline: "A bean memory with dial-in helper for home espresso.",
    description:
      "Bought a bean again after a year? Open the app, search, and the recipe and grind setting are right there. Drops keeps a bean library with roaster, roast date and freshness, logs your dial-in attempts (grind size, dose in/out, shot time, sour/bitter/good) and freezes the good one as the bean's recipe — complete with a rotary grind dial like the ring on your grinder. Native Android, local and offline: no account, no sync, no cloud.",
    tech: "Kotlin · Jetpack Compose · Room",
    icon: "/lab_drops.webp",
    images: ["/drops_library.webp", "/drops_bean.webp"],
  },
  {
    title: "Punkt.",
    href: "https://github.com/robinrehbein/punkt.",
    tagline: "A retro pixel reaction game — one tap decides.",
    description:
      "A dot circles a track on its own; tap while it crosses the green zone — the bright center counts as PERFECT and builds a bonus streak. With a rising score the game unlocks twists that remix every round: pulsing zones, drifting zones, a ghosting dot, decoy traps and chained zones. Daily challenge with a shared seed, local highscores, spiteful game-over quips, haptic feedback — everything drawn in code, no assets, built natively with Kotlin and Jetpack Compose.",
    tech: "Kotlin · Jetpack Compose",
    icon: "/lab_punkt.webp",
    images: ["/punkt_gameplay.webp", "/punkt_daily.webp"],
  },
];

export interface Position {
  role: string;
  company: string;
  companyUrl: string;
  period: string;
  current: boolean;
  description: string;
}

export const positions: Position[] = [
  {
    role: "CTO & Co-Founder",
    company: "Noah",
    companyUrl: "https://join-noah.de",
    period: "2026 — today",
    current: true,
    description:
      "Together with Fabian and Luis, I co-founded Noah in 2026 — the shared account for groups without a legal form. Banks usually only open group accounts for registered associations; Noah serves everyone else: school classes, sports teams and clubs. As CTO I am responsible for product engineering and architecture.",
  },
  {
    role: "Senior Software Engineer",
    company: "mimacom",
    companyUrl: "https://mimacom.com",
    period: "01/2026 — today",
    current: true,
    description:
      "I started a new journey at mimacom in the beginning of 2026. mimacom is a software and consulting company dedicated to digital progress. By combining cutting-edge technology and market expertise with individual talent, I help drive our team's passion and ensure our customers' long-term success.",
  },
  {
    role: "Co-Founder",
    company: "artwerk studios",
    companyUrl: "https://artwerk.store",
    period: "03/2023 — 2026",
    current: false,
    description:
      "As a founding member of a startup, I played a pivotal role in the development of a groundbreaking product and took on responsibilities in areas such as marketing and project management. Our venture was an online shop where customers could personalize their posters in unique and captivating ways. Sales have been discontinued; the site remains online as a showcase.",
  },
  {
    role: "Senior Developer",
    company: "neosfer",
    companyUrl: "https://neosfer.de",
    period: "11/2022 — 12/2025",
    current: false,
    description:
      "neosfer is a subsidiary of Commerzbank AG and deals with innovative technologies of the future. I built web platforms that create impact, among them projects around impact-festival.earth.",
  },
  {
    role: "Senior Consultant",
    company: "MHP — A Porsche Company",
    companyUrl: "https://mhp.com",
    period: "08/2019 — 12/2021",
    current: false,
    description:
      "At MHP I initially worked as a consultant, developing a custom application for Porsche AG using Java and Spring. Later, as a senior consultant, I transitioned to a fully AWS-based project, where I was part of a team that developed two IoT applications to automate logistics and monitoring for manufacturers.",
  },
  {
    role: "IT Architect",
    company: "T-Systems / Deutsche Telekom",
    companyUrl: "https://t-systems.com",
    period: "10/2015 — 07/2021",
    current: false,
    description:
      "At Deutsche Telekom I planned and built network solutions for large customers, focusing on LAN and WLAN with Cisco and Meraki. At T-Systems International I contributed to a digital-twin concept, built an anomaly detection system using SVM and neural network techniques, and created and evaluated architecture prototypes for PLM software in C#.",
  },
];

export interface Certification {
  title: string;
  issuer?: string;
  year?: string;
  href?: string;
}

export const certifications: Certification[] = [
  {
    title: "Claude Certification — AI-Assisted Engineering",
    issuer: "Anthropic",
    year: "2026",
    href:
      "https://www.credly.com/badges/a95d77a3-7acc-4f00-aa8e-178f778e2b86/public_url",
  },
  {
    title: "CPSA-F — Software Architecture Foundation",
    issuer: "iSAQB",
    year: "2025",
  },
  {
    title: "Professional Scrum Master I",
    issuer: "Scrum.org",
    year: "2023",
  },
  {
    title: "Professional Scrum Product Owner I",
    issuer: "Scrum.org",
    year: "2023",
  },
  {
    title: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services",
    year: "2020",
  },
];

export const likes = [
  "Coffee!",
  "Plants.",
  "Biking.",
  "Custom Keyboards.",
];
