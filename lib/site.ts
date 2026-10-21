import type { CSSProperties } from "react";

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
  slug: string;
  role: string;
  status?: string;
  excerpt: string;
  index: string;
  title: string;
  href: string;
  summary: string;
  description: string;
  tech: string;
  images: string[];
}

export const projects: Project[] = [
  {
    slug: "noah",
    index: "01",
    title: "Noah",
    role: "Co-founder · Product engineering",
    excerpt: "A shared account for school classes, sports teams and clubs. I co-founded Noah and build its backend, web platform and native apps end-to-end.",
    href: "https://join-noah.de",
    summary: "The shared account for groups without a legal form.",
    description:
      "Banks usually only open an account in a group's name for registered associations. Noah is the joint account for everyone else — school classes, sports teams and clubs: the money belongs to the group, not to one member who is personally liable. I co-founded Noah in 2026 together with Fabian and build the product end-to-end: a Kotlin and Ktor backend, React Router for the web and admin apps, and native Android and iOS apps that share their domain logic and API contracts through Kotlin Multiplatform.",
    tech: "Kotlin · Ktor · React Router · Kotlin Multiplatform",
    images: [
      "/noah_landing_desktop.webp",
      "/noah_landing_mobile.webp",
    ],
  },
  {
    slug: "artwerk",
    index: "02",
    title: "artwerk studios",
    role: "Co-founder · Technical build",
    status: "Showcase · Sales discontinued",
    excerpt: "Personalized music posters, from a live preview to a premium print. I co-founded artwerk with two friends and focused on the technical build; the site remains online as a showcase.",
    href: "https://artwerk.store",
    summary: "Turn your favorite songs into personalized posters.",
    description:
      "artwerk is a passion project I co-founded with two friends: turn a favorite song into a personalized poster, watch the live preview build in seconds, get it printed on premium paper in an environmentally friendly process. Built on Next.js with Medusa as the headless commerce backend. As a co-founder I leaned hardest into the technical build, but all three of us were hands-on across the whole thing — product, design, business, no strict lanes. Sales have since been discontinued; the site stays online as a showcase of what we built.",
    tech: "Next.js · Medusa · TypeScript",
    images: [
      "/macbook_artwerk_landing_light.webp",
      "/iphone_artwerk_landing.webp",
      "/curved_3_artwerk_poster.webp",
      "/curved_1_artwerk_poster.webp",
      "/curved_2_artwerk_poster.webp",
    ],
  },
  {
    slug: "kirchmaier",
    index: "03",
    title: "Kirchmaier & Staudacher",
    role: "Design collaboration · Development",
    excerpt: "A digital presence for a property developer. Design developed with the client; frontend and deployment built by me.",
    href: "https://www.kirchmaier-staudacher.de/",
    summary: "Digital presence for a property developer.",
    description:
      "Kirchmaier & Staudacher is a property developer that builds and holds its own real estate. I built their digital presence solo, on Svelte — design worked out closely with the client, frontend and deployment entirely my own.",
    tech: "Svelte · TypeScript",
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
  slug: string;
  title: string;
  /** Public link (usually GitHub). Omit for private projects. */
  href?: string;
  /** Shown instead of a link when there is no public repository. */
  note?: string;
  tagline: string;
  description: string;
  tech: string;
  icon: string;
  images?: string[];
  /** Shown in the lab teaser on the home page. */
  featured?: boolean;
}

export const sideProjects: SideProject[] = [
  {
    slug: "trailscape",
    title: "Trailscape",
    href: "https://github.com/robinrehbein/trailscape",
    tagline: "Tells you what to ride today — and builds the loop for it.",
    description:
      "A training companion for gravel and road bikes. Your watch's resting heart rate, HRV and sleep become a daily readiness score, the plan says what's due, and Trailscape builds a matching loop from your front door. Crash-safe GPS recording, Bluetooth sensors, offline maps — local-first, no account, no subscription.",
    tech: "Kotlin · Jetpack Compose · MapLibre · MIT",
    icon: "/lab_trailscape.webp",
    images: ["/trailscape_tours.webp", "/trailscape_training.webp"],
    featured: true,
  },
  {
    slug: "drops",
    title: "Drops.",
    href: "https://github.com/robinrehbein/drops.",
    tagline: "A bean memory with dial-in helper for home espresso.",
    description:
      "Bought a bean again after a year? The recipe and grind setting are right there. Drops keeps your beans with roast date and freshness, logs dial-in attempts and saves the good one as the bean's recipe. A Kotlin Multiplatform app with an optional Ktor sync server — fully offline without an account.",
    tech: "Kotlin Multiplatform · Compose · SQLDelight · Ktor",
    icon: "/lab_drops.webp",
    images: ["/drops_library.webp", "/drops_bean.webp"],
  },
  {
    slug: "dottie",
    title: "Dottie.",
    href: "https://github.com/robinrehbein/dottie.",
    tagline: "A retro pixel reaction game — one tap decides.",
    description:
      "A dot circles a track; tap while it crosses the green zone, hit the bright center for PERFECT streaks. Rising scores unlock twists like pulsing, drifting and chained zones. Daily challenge, unlockable skins, a Wear OS companion — everything drawn in code, no assets.",
    tech: "Kotlin · Jetpack Compose · Wear OS",
    icon: "/lab_dottie.webp",
    images: ["/dottie_gameplay.webp", "/dottie_skins.webp"],
  },
  {
    slug: "pocketpi",
    title: "PocketPi",
    href: "https://github.com/robinrehbein/pocketpi",
    tagline: "Your coding agent's sessions, in your pocket.",
    description:
      "A native Android remote for pi, the coding agent on my Mac. Pair by QR code, follow sessions and subagents live, reply with text, voice, photos or files, and get a push when the agent finishes or has a question. A Wear OS app brings it to the wrist; everything is end-to-end encrypted.",
    tech: "Kotlin · Jetpack Compose · Wear OS",
    icon: "/lab_pocketpi.webp",
    images: ["/pocketpi_sessions.webp", "/pocketpi_chat.webp"],
    featured: true,
  },
  {
    slug: "mephi",
    title: "Mephi the Daemon",
    href: "https://github.com/robinrehbein/bevel-devil",
    tagline: "A troll platformer where the devil deals the traps.",
    description:
      "Bevel, a tiny data packet, just wants to reach the door, and Mephi, the croupier of hell, deals a trap card against him at every step. 144 levels descend from a hellish basement through a data center down to the circuit board. Hell-CRT pixel look, synthesized sound, an 80 KB APK.",
    tech: "Kotlin · Custom pixel renderer · Android",
    icon: "/lab_mephi.webp",
    images: ["/mephi_title.webp", "/mephi_trap.webp"],
    featured: true,
  },
  {
    slug: "birdy",
    title: "Birdy",
    href: "https://github.com/robinrehbein/birdy",
    tagline: "Tap. Dodge. Fly through — a one-finger arcade flyer in 3D.",
    description:
      "A low-poly 3D arcade flyer: tap to flap, swipe to switch between three lanes, each with its own gap in the pipes. Gaps shrink and move, cacti pop out in time with the music, zones change as you go. Kotlin Multiplatform with a hand-written OpenGL ES renderer.",
    tech: "Kotlin Multiplatform · Compose · OpenGL ES",
    icon: "/lab_birdy.webp",
    images: ["/birdy_lanes.webp", "/birdy_shop.webp"],
  },
  {
    slug: "mini-networks",
    title: "Mini Networks",
    href: "https://github.com/robinrehbein/mini-networks",
    tagline: "Mini Metro, but you're wiring the internet.",
    description:
      "Devices request services, you lay the cables, from ISDN to fiber, and keep bandwidth and ping in check while excavators cut your lines and servers overload. Five sceneries from the late '90s to 2030 on an isometric map, rendered in Kotlin with OpenGL ES, no game engine.",
    tech: "Kotlin · OpenGL ES · Android",
    icon: "/lab_mininetworks.webp",
    images: ["/mininetworks_town.webp", "/mininetworks_wireless.webp"],
    featured: true,
  },
];

export interface Position {
  role: string;
  company: string;
  companyUrl: string;
  period: string;
  current: boolean;
  description: string;
  /** Brand color for the company's wavy underline. */
  brandColor: string;
  /** Darker hover text color, for brand colors too light to read as text. */
  brandText?: string;
}

/** The wavy underline in a given colour, as the SVG background .link-wavy draws. */
export function waveImage(color: string) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='11' height='7' viewBox='0 0 11 7'><path d='M-5.5 3.5Q-2.75 7.5 0 3.5T5.5 3.5T11 3.5T16.5 3.5' fill='none' stroke='${color}' stroke-width='2.2'/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

/** CSS variables consumed by .link-wavy-brand. */
export function brandStyle(color: string, text?: string) {
  return { "--wave-img": waveImage(color), "--brand-text": text ?? color } as CSSProperties;
}

export const positions: Position[] = [
  {
    role: "Co-Founder",
    company: "Noah",
    companyUrl: "https://join-noah.de",
    period: "2026 — today",
    current: true,
    brandColor: "#fc4c00",
    description:
      "I'm responsible for product engineering and architecture at Noah, building the platform end-to-end — Kotlin and Ktor on the backend, React Router on the web, native Android and iOS apps on a shared Kotlin Multiplatform core — from data model to the last pixel, alongside co-founder Fabian.",
  },
  {
    role: "Senior Software Engineer",
    company: "mimacom",
    companyUrl: "https://mimacom.com",
    period: "01/2026 — today",
    current: true,
    brandColor: "#ff0651",
    description:
      "At mimacom, a software and consulting company, I design and build software for client projects as a senior engineer — from architecture decisions to shipping code.",
  },
  {
    role: "Co-Founder",
    company: "artwerk studios",
    companyUrl: "https://artwerk.store",
    period: "03/2023 — 2026",
    current: false,
    brandColor: "#5a776d",
    description:
      "Co-founded artwerk with two friends — an online shop where customers personalized posters from their favorite songs, built on Next.js with Medusa as the commerce backend. I leaned hardest into the technical build, but all three of us stayed hands-on across product, design and business. Sales have been discontinued; the site remains online as a showcase.",
  },
  {
    role: "Senior Developer",
    company: "neosfer",
    companyUrl: "https://neosfer.de",
    period: "11/2022 — 12/2025",
    current: false,
    brandColor: "#00ffc2",
    brandText: "#00805f",
    description:
      "neosfer is a subsidiary of Commerzbank AG and deals with innovative technologies of the future. I built web platforms that create impact, among them projects around impact-festival.earth.",
  },
  {
    role: "Senior Consultant",
    company: "MHP — A Porsche Company",
    companyUrl: "https://mhp.com",
    period: "08/2019 — 12/2021",
    current: false,
    brandColor: "#1d4ed8",
    description:
      "At MHP I initially worked as a consultant, developing a custom application for Porsche AG using Java and Spring. Later, as a senior consultant, I transitioned to a fully AWS-based project, where I was part of a team that developed two IoT applications to automate logistics and monitoring for manufacturers.",
  },
  {
    role: "IT Architect",
    company: "T-Systems / Deutsche Telekom",
    companyUrl: "https://t-systems.com",
    period: "10/2015 — 07/2019",
    current: false,
    brandColor: "#e20074",
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
