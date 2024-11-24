type Project = {
  slug: string;
  title: string;
  publishedAt: Date;
  content: string;
  snippet: string;
};

type Point = { x: number; y: number };

export type { Point, Project };
