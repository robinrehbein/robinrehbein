export interface ProjectData {
  title: string;
  description: string;
  href: string;
  images: string[];
}

export const projects: ProjectData[] = [
  {
    title: "Venn",
    description:
      "Venn is a shared expense management app for roommates, travel groups, and teams. It helps users track expenses and income, split costs fairly, handle recurring transactions, settle debts, manage shared lists, and monitor balances and statistics in one place.",
    href: "https://myvenn.de",
    images: [
      "/logo.svg",
      "/logo.svg",
      "/logo.svg",
      "/logo.svg",
      "/logo.svg",
    ],
  },
  {
    title: "artwerk studios",
    description:
      "artwerk is a passion project that I co-founded with two friends. Our mission is to transform your favorite songs into personalized posters, capturing the essence of music and memory in unique visual art. In just seconds, you can create your custom poster and see a preview. We prioritize high-quality printing and use only premium paper. Sustainability is also important to us, so our products are produced in an environmentally friendly manner. artwerk is the perfect blend of personal taste and design—a tribute to the tunes that move you. Dive into the art of music with artwerk.",
    href: "https://artwerk.store",
    images: [
      "/macbook_artwerk_landing_light.webp",
      "/iphone_artwerk_landing.webp",
      "/curved_3_artwerk_poster.webp",
      "/curved_1_artwerk_poster.webp",
      "/curved_2_artwerk_poster.webp",
    ],
  },
  {
    title: "Kirchmaier & Staudacher",
    description:
      "Kirchmaier & Staudacher is a premier project management company co-founded by a team dedicated to excellence in construction and real estate development. Their passion drives them to deliver personalized project solutions with precision and efficiency. They offer a seamless experience, providing instant previews of project plans and ensuring top-tier quality with every execution. Sustainability is at the core of their operations, as they strive to implement environmentally friendly practices in all their projects. Discover the perfect synergy of expertise and innovation with Kirchmaier & Staudacher, where your vision is their blueprint for success.",
    href: "https://www.kirchmaier-staudacher.de/",
    images: [
      "/macbook_kirchmaier_landing_1.webp",
      "/iphone_kirchmaier_landing_1.webp",
      "/macbook_kirchmaier_landing_2.webp",
      "/iphone_kirchmaier_landing_2.webp",
      "/macbook_kirchmaier_landing_3.webp",
    ],
  },
];
