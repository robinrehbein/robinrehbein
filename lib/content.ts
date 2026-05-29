export type Post = {
  slug: string;
  title: string;
  date: string;
  tag: string;
  excerpt: string;
  readTime: string;
  body: string[];
};

export const navItems = [
  { href: "/shop", label: "Shop" },
  { href: "/printauftrag", label: "Druckauftrag" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

export const posts: Post[] = [
  {
    slug: "fresh-2-und-kleine-teams",
    title: "Fresh 2 fuer kleine, schnelle Produktteams",
    date: "2026-05-18",
    tag: "Web",
    excerpt:
      "Warum ich Web-Stacks mag, die Serverlogik, Inseln und Web Standards ohne grosses Theater zusammenbringen.",
    readTime: "4 min",
    body: [
      "Fresh 2 fuehlt sich fuer kleine Produktteams angenehm direkt an: Routen sind Dateien, interaktive Teile bleiben Inseln und der Server bleibt nah an den Web Standards.",
      "Das reduziert die Stellen, an denen Architektur nur noch aus Gewohnheit existiert. Gerade fuer Portfolios, Commerce-Prototypen und interne Tools ist diese Klarheit ein echter Vorteil.",
      "Der wichtigste Designpunkt ist fuer mich: Nur das hydrieren, was wirklich Interaktion braucht. Alles andere darf schnelles, stabiles HTML bleiben.",
    ],
  },
  {
    slug: "3d-druck-als-produktwerkstatt",
    title: "Vom Modell zum kleinen Produkt",
    date: "2026-05-12",
    tag: "3D Print",
    excerpt:
      "Notizen aus der Werkstatt: Materialwahl, Oberflaechen, Toleranzen und warum gute Druckauftraege schon beim Briefing beginnen.",
    readTime: "5 min",
    body: [
      "Ein guter Druckauftrag startet nicht am Drucker, sondern mit der Frage, was das Teil spaeter leisten muss: dekorativ, mechanisch, hitzestabil oder einfach schoen auf dem Schreibtisch.",
      "STL-Dateien sind schnell, STEP-Dateien sind fuer Anpassungen oft besser. Deshalb sollte ein Anfrageformular beides akzeptieren und direkt nach Material, Farbe und Einsatzzweck fragen.",
      "Fuer den Shop lohnt sich ein klares Datenmodell mit SKU, Materialvarianten und Marketplace-IDs. Dann bleibt der eigene Shop die Quelle der Wahrheit, waehrend Etsy und Co. Vertriebskanaele werden.",
    ],
  },
  {
    slug: "ideen-in-code-seit-2015",
    title: "Turning people's ideas into code seit 2015",
    date: "2026-04-28",
    tag: "Portfolio",
    excerpt:
      "Ein kurzer Blick auf die Verbindung aus Architektur, Produktdenken und der Lust, Dinge wirklich benutzbar zu machen.",
    readTime: "3 min",
    body: [
      "Softwareentwicklung ist fuer mich am spannendsten, wenn Idee, Architektur und Nutzungserlebnis sichtbar zusammenarbeiten.",
      "Aus Rollen bei Telekom, MHP, neosfer, mimacom und artwerk nehme ich mit: Gute Produkte brauchen technische Klarheit, aber auch ein Gefuehl fuer Timing, Sprache und kleine Details.",
      "Diese Seite fuehrt deshalb Portfolio, Blog und 3D Print Studio zusammen. Sie ist nicht nur Visitenkarte, sondern Werkbank.",
    ],
  },
];

export const materials = [
  "PLA Matte",
  "PETG",
  "PETG Transparent",
  "ABS/ASA",
  "Woodfill",
  "TPU Flex",
];
