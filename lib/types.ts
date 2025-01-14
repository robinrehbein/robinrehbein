type Project = {
  slug: string;
  title: string;
  content: Array<{ description: string; image: string }>;
  url: string;
};

type TimetableItem = {
  id?: number;
  job_title: string;
  position: string;
  description: string;
  started_at: Date;
  quit_at: Date;
  location: string;
  tech_stack_id: number;
  company: string;
};

type Point = { x: number; y: number };

export type { Point, Project, TimetableItem };
