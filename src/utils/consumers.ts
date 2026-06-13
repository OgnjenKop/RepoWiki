import type { ModuleConsumer } from "../knowledge/moduleFocus.js";
import { code, list } from "./markdown.js";

export function splitConsumers(consumers: ModuleConsumer[]): { runtime: ModuleConsumer[]; tests: ModuleConsumer[] } {
  return {
    runtime: consumers.filter((consumer) => consumer.kind === "runtime"),
    tests: consumers.filter((consumer) => consumer.kind === "test")
  };
}

export function renderConsumerList(consumers: ModuleConsumer[], targetLabel: string, empty: string): string {
  return list(consumers.map((consumer) => `${code(consumer.path)} -> ${consumer.targets.slice(0, 4).map(code).join(", ")} (${consumer.count} imports into ${targetLabel})`), empty);
}
