import type { RouteRecord } from "../types/index.js";
import { stripComments, lineNumberAtIndex } from "../utils/sourceText.js";

export function detectRoutes(filePath: string, content: string): RouteRecord[] {
  const routes: RouteRecord[] = [];
  const source = stripComments(content);

  routes.push(...detectExpressRoutes(filePath, source));
  routes.push(...detectNestRoutes(filePath, source));

  const nextRoute = detectNextRoute(filePath);
  if (nextRoute) routes.push({ ...nextRoute, file: filePath, line: 1, confidence: "inferred" });

  return uniqueRoutes(routes).sort((a, b) => `${a.file}:${a.method ?? ""}:${a.path ?? ""}`.localeCompare(`${b.file}:${b.method ?? ""}:${b.path ?? ""}`));
}

function detectExpressRoutes(filePath: string, source: string): RouteRecord[] {
  const routes: RouteRecord[] = [];
  for (const match of source.matchAll(/\b(?:app|router|server|expressApp)\.(get|post|put|patch|delete)\(["'`]([^"'`]+)["'`]\s*,?\s*([A-Za-z_$][\w$]*)?/g)) {
    routes.push({
      method: match[1].toUpperCase(),
      path: match[2],
      file: filePath,
      handler: match[3],
      line: match.index !== undefined ? lineNumberAtIndex(source, match.index) : undefined,
      confidence: "direct"
    });
  }
  return routes;
}

function detectNestRoutes(filePath: string, source: string): RouteRecord[] {
  const routes: RouteRecord[] = [];
  const controllerPattern = /@Controller(?:\(\s*(?:(["'`])([^"'`)]*)\1)?\s*\))?\s*(?:export\s+)?class\s+([A-Za-z_$][\w$]*)\s*\{/g;

  for (const match of source.matchAll(controllerPattern)) {
    const decoratorPath = match[2] ?? "";
    const controller = match[3];
    const bodyStart = match.index !== undefined ? source.indexOf("{", match.index + match[0].length - 1) : -1;
    if (bodyStart === -1) continue;
    const bodyEnd = findMatchingBrace(source, bodyStart);
    if (bodyEnd === -1) continue;
    const body = source.slice(bodyStart + 1, bodyEnd);

    const methodPattern = /@(Get|Post|Put|Patch|Delete)(?:\(\s*(?:(["'`])([^"'`)]*)\2)?\s*\))?\s*(?:public|private|protected|static|async|\s)*([A-Za-z_$][\w$]*)\s*\(/g;
    for (const methodMatch of body.matchAll(methodPattern)) {
      const method = methodMatch[1].toUpperCase();
      const methodPath = methodMatch[3] ?? "";
      const handler = methodMatch[4];
      const line = bodyStart !== undefined && methodMatch.index !== undefined ? lineNumberAtIndex(source, bodyStart + 1 + methodMatch.index) : undefined;
      routes.push({
        method,
        path: joinRouteParts(decoratorPath, methodPath),
        file: filePath,
        handler,
        controller,
        line,
        confidence: "direct"
      });
    }
  }

  return routes;
}

function detectNextRoute(filePath: string): Pick<RouteRecord, "path"> | undefined {
  const normalized = filePath.replace(/\\/g, "/");
  if (normalized.startsWith("app/")) {
    const parts = normalized.split("/").slice(1);
    const last = parts[parts.length - 1] ?? "";
    if (!/^(page|route)\.(tsx?|jsx?)$/.test(last)) return undefined;
    const routeParts = parts.slice(0, -1).filter((part) => !isRouteGroup(part)).map(normalizeRouteSegment);
    return { path: buildRoutePath(routeParts) };
  }
  if (normalized.startsWith("pages/")) {
    const parts = normalized.split("/").slice(1);
    if (!parts.length) return undefined;
    if (parts.some((part, index) => index === 0 && part.startsWith("_"))) return undefined;
    const routeParts = parts.map((part, index) => normalizePagesSegment(part, index === parts.length - 1));
    if (!routeParts.length) return undefined;
    return { path: buildRoutePath(routeParts) };
  }
  return undefined;
}

function normalizeRouteSegment(segment: string): string {
  if (isRouteGroup(segment)) return "";
  const stripped = stripExtension(segment);
  if (stripped === "page" || stripped === "route" || stripped === "index") return "";
  return normalizeDynamicSegment(stripped);
}

function normalizePagesSegment(segment: string, isLast: boolean): string {
  const stripped = stripExtension(segment);
  if (stripped === "index" && isLast) return "";
  return normalizeDynamicSegment(stripped);
}

function normalizeDynamicSegment(segment: string): string {
  if (/^\[\[\.\.\.(.+)\]\]$/.test(segment)) return `:${segment.slice(5, -2)}*`;
  if (/^\[\.\.\.(.+)\]$/.test(segment)) return `:${segment.slice(4, -1)}*`;
  if (/^\[(.+)\]$/.test(segment)) return `:${segment.slice(1, -1)}`;
  return segment;
}

function buildRoutePath(parts: string[]): string {
  const filtered = parts.filter(Boolean);
  return filtered.length ? `/${filtered.join("/")}`.replace(/\/+/g, "/") : "/";
}

function joinRouteParts(prefix: string, methodPath: string): string {
  const prefixParts = splitRouteParts(prefix);
  const methodParts = splitRouteParts(methodPath);
  return buildRoutePath([...prefixParts, ...methodParts]);
}

function splitRouteParts(value: string): string[] {
  return value
    .split("/")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => normalizeDynamicSegment(part));
}

function stripExtension(segment: string): string {
  return segment.replace(/\.(tsx?|jsx?|js|ts)$/, "");
}

function isRouteGroup(segment: string): boolean {
  return /^\(.+\)$/.test(segment);
}

function findMatchingBrace(source: string, openIndex: number): number {
  let depth = 0;
  for (let index = openIndex; index < source.length; index += 1) {
    const char = source[index];
    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) return index;
    }
  }
  return -1;
}

function uniqueRoutes(routes: RouteRecord[]): RouteRecord[] {
  const seen = new Set<string>();
  const unique: RouteRecord[] = [];
  for (const route of routes) {
    const key = `${route.file}:${route.method ?? "ANY"}:${route.path ?? "unknown"}:${route.handler ?? ""}:${route.controller ?? ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(route);
  }
  return unique;
}
