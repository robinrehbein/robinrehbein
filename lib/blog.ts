import { relative, resolve } from "@std/path";
import { kv } from "@/lib/kv.ts";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string; // Either the actual content or the path to the markdown file
  isFilePath?: boolean; // Whether 'content' is a file path
  excerpt: string;
  createdAt: number;
  updatedAt: number;
  published: boolean;
}

const BLOG_POSTS_KEY = "blog_posts";
const BLOG_POSTS_BY_SLUG_KEY = "blog_posts_by_slug";
const ALLOWED_POSTS_DIR = resolve("posts");

/**
 * Loads post content. When isFilePath is set, reads from the filesystem but
 * only allows paths within the "posts/" directory to prevent path traversal.
 */
async function loadContent(post: BlogPost): Promise<string> {
  if (post.isFilePath) {
    const abs = resolve(post.content);
    const rel = relative(ALLOWED_POSTS_DIR, abs);
    if (rel.startsWith("..") || rel.startsWith("/")) {
      console.error(
        `[SECURITY] Blocked file read outside allowed directory: ${post.content}`,
      );
      return "Content unavailable.";
    }
    try {
      return await Deno.readTextFile(abs);
    } catch (e) {
      console.error(`Error reading blog file ${abs}:`, e);
      return "Content could not be loaded.";
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
  // First try the index for O(1) lookup
  const idRes = await kv.get<string>([BLOG_POSTS_BY_SLUG_KEY, slug]);
  if (idRes.value) {
    const post = await getPostById(idRes.value);
    return post;
  }

  // Fallback to iteration for backwards compatibility with old data
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

export async function getPostById(
  id: string,
  raw = false,
): Promise<BlogPost | null> {
  const res = await kv.get<BlogPost>([BLOG_POSTS_KEY, id]);
  if (!res.value) return null;
  const post = res.value;
  if (!raw) {
    post.content = await loadContent(post);
  }
  return post;
}

export async function savePost(post: BlogPost): Promise<void> {
  // Save the post
  await kv.set([BLOG_POSTS_KEY, post.id], post);
  // Update slug index for fast lookups
  await kv.set([BLOG_POSTS_BY_SLUG_KEY, post.slug], post.id);
}

export async function deletePost(id: string): Promise<void> {
  // Get the post first to find its slug for index cleanup
  const post = await getPostById(id, true);
  if (post) {
    // Remove from slug index
    await kv.delete([BLOG_POSTS_BY_SLUG_KEY, post.slug]);
  }
  // Delete the post
  await kv.delete([BLOG_POSTS_KEY, id]);
}
