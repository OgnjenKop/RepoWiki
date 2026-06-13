import type { ChangeTarget } from "../types/index.js";

export function formatChangeTargetSymbols(target: ChangeTarget): string | undefined {
  if (!target.symbols?.length) return undefined;
  return target.symbols
    .map((symbol) => symbol.line ? `${symbol.name}@${symbol.line}` : symbol.name)
    .join(", ");
}
