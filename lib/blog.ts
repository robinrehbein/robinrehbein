export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string; // Entweder der eigentliche Content oder der Pfad zur Markdown-Datei
  isFilePath?: boolean; // Kennzeichnet, ob 'content' ein Dateipfad ist
  excerpt: string;
  createdAt: number;
  updatedAt: number;
  published: boolean;
}

const kv = await Deno.openKv();

const BLOG_POSTS_KEY = "blog_posts";

/**
 * Lädt den Inhalt eines Posts. Wenn es eine Datei ist, wird sie vom Dateisystem gelesen.
 */
async function loadContent(post: BlogPost): Promise<string> {
  if (post.isFilePath) {
    try {
      return await Deno.readTextFile(post.content);
    } catch (e) {
      console.error(`Fehler beim Lesen der Blog-Datei ${post.content}:`, e);
      return "Inhalt konnte nicht geladen werden.";
    }
  }
  return post.content;
}

export async function getPosts(): Promise<BlogPost[]> {
  const iter = kv.list<BlogPost>({ prefix: [BLOG_POSTS_KEY] });
  const posts: BlogPost[] = [];
  for await (const res of iter) {
    posts.push(res.value);
  }
  return posts.sort((a, b) => b.createdAt - a.createdAt);
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const posts = await getPosts();
  return posts.filter((p) => p.published);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const iter = kv.list<BlogPost>({ prefix: [BLOG_POSTS_KEY] });
  for await (const res of iter) {
    if (res.value.slug === slug) {
      const post = res.value;
      post.content = await loadContent(post);
      return post;
    }
  }
  return null;
}

export async function getPostById(id: string, raw = false): Promise<BlogPost | null> {
  const res = await kv.get<BlogPost>([BLOG_POSTS_KEY, id]);
  if (!res.value) return null;
  const post = res.value;
  if (!raw) {
    post.content = await loadContent(post);
  }
  return post;
}

export async function savePost(post: BlogPost): Promise<void> {
  await kv.set([BLOG_POSTS_KEY, post.id], post);
}

export async function deletePost(id: string): Promise<void> {
  await kv.delete([BLOG_POSTS_KEY, id]);
}
