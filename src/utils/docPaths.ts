export function sanitizeDocFragment(value: string): string {
  return value.replace(/[^A-Za-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "doc";
}

export function areaDocFileName(areaId: string): string {
  return `${sanitizeDocFragment(areaId)}.md`;
}
