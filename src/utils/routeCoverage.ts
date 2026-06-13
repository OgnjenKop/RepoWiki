import type { RouteRecord } from "../types/index.js";

type RouteCoverageLike = Pick<RouteRecord, "confidence">;

export function routeCoverageLabel(route: RouteCoverageLike): string {
  return route.confidence === "inferred" ? "inferred" : "direct";
}

export function routeCoverageDescriptor(route: RouteCoverageLike): string {
  return route.confidence === "inferred" ? "Inferred route" : "Direct route";
}
