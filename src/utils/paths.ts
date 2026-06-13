import path from "node:path";

export function toPosixPath(filePath: string): string {
  return filePath.split(path.sep).join("/");
}

export function normalizeRelative(rootDir: string, filePath: string): string {
  return toPosixPath(path.relative(rootDir, filePath));
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "project";
}
