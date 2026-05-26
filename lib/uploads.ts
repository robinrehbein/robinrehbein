const UPLOAD_DIR = "static/uploads";

/** Build a safe, unique upload filename from the original name + slug + time. */
export function uploadFileName(
  originalName: string,
  slug: string,
  now: number,
): string {
  const dot = originalName.lastIndexOf(".");
  const rawExt = dot >= 0 ? originalName.slice(dot + 1) : "";
  const ext = rawExt.toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
  return `${slug}-${now}.${ext}`;
}

/** Persist an uploaded file into static/uploads and return its public path. */
export async function saveUpload(file: File, slug: string): Promise<string> {
  const name = uploadFileName(file.name, slug, Date.now());
  await Deno.mkdir(UPLOAD_DIR, { recursive: true });
  await Deno.writeFile(
    `${UPLOAD_DIR}/${name}`,
    new Uint8Array(await file.arrayBuffer()),
  );
  return `/uploads/${name}`;
}
