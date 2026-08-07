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
    title: "artwerk studios",
    href: "https://artwerk.store",
    summary: "Turn your favorite songs into personalized posters.",
    description:
      "artwerk is a passion project I co-founded with two friends. Our mission is to transform your favorite songs into personalized posters, capturing the essence of music and memory in unique visual art. In just seconds, you can create your custom poster and see a live preview. We prioritize high-quality printing on premium paper, produced in an environmentally friendly manner. artwerk is the perfect blend of personal taste and design — a tribute to the tunes that move you.",
    images: [
      "/macbook_artwerk_landing_light.webp",
      "/iphone_artwerk_landing.webp",
      "/curved_3_artwerk_poster.webp",
      "/curved_1_artwerk_poster.webp",
      "/curved_2_artwerk_poster.webp",
    ],
  },
  {
    index: "02",
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
}

export const sideProjects: SideProject[] = [
  {
    title: "Trailscape",
    href: "https://github.com/robinrehbein/trailscape",
    tagline: "Local-first GPS tracking & route planning for Android.",
    description:
      "A free, open-source alternative to Strava and Komoot. Records your rides with background GPS tracking, plans routes with multiple profiles via BRouter, imports and exports GPX, works with fully offline maps and even generates personalized training plans — all local-first: your data stays on your device, no accounts, no cloud.",
    tech: "Flutter · OpenStreetMap · MIT",
  },
  {
    title: "Punkt.",
    href: "https://github.com/robinrehbein/punkt.",
    tagline: "A minimalist pixel-style reaction game for Android.",
    description:
      "One dot, your reflexes, two game modes: FLIP lets you invert gravity to dodge obstacles, STOPP is all about freezing time at exactly the right moment. Local highscores per mode, pixel aesthetics, haptic feedback — built natively with Kotlin and Jetpack Compose.",
    tech: "Kotlin · Jetpack Compose",
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
      "Together with Fabian and Luis, I co-founded Noah in 2026. As CTO I am responsible for product engineering and architecture. We are still early — more on this soon.",
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
    period: "03/2023 — today",
    current: true,
    description:
      "As a founding member of a startup, I played a pivotal role in the development of a groundbreaking product and took on responsibilities in areas such as marketing and project management. Our venture is an online shop where customers can unleash their creativity and personalize their posters in unique and captivating ways.",
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
  issuer: string;
  year: string;
}

export const certifications: Certification[] = [
  {
    title: "Claude Code — AI-Assisted Engineering",
    issuer: "Anthropic",
    year: "2026",
  },
];

export const likes = [
  "Coffee!",
  "Plants.",
  "Biking.",
  "Custom Keyboards.",
];
