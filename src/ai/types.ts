import type { KnowledgeItem, SummaryRecord } from "../types/index.js";
import type { ChangeTarget, FileRecord, ModuleRecord, RepoScan } from "../types/index.js";
import type { ContextChangePath } from "../knowledge/moduleFocus.js";
import type { VerificationHint } from "../knowledge/verification.js";

export type AiRuntimeOptions = {
  enabled?: boolean;
  required?: boolean;
  baseUrl?: string;
  model?: string;
  apiKey?: string;
};

export type ContextFile = Pick<FileRecord, "path" | "language" | "imports" | "exports" | "symbols"> & {
  snippet: string;
};

export type ContextRelation = {
  title: string;
  files: string[];
  note: string;
};

export type ContextFlow = {
  title: string;
  steps: string[];
  files: string[];
  note: string;
};

export type ContextPack = {
  scope: "project" | "area" | "module" | "route";
  title: string;
  summaryHint: string;
  files: ContextFile[];
  knowledge: KnowledgeItem[];
  relations: ContextRelation[];
  flows: ContextFlow[];
  verificationHints: VerificationHint[];
  changePaths: ContextChangePath[];
  changeTargets: ChangeTarget[];
};

export type SummaryProvider = {
  summarize(pack: ContextPack): Promise<string>;
};

export type SummaryMap = {
  project?: SummaryRecord;
  modules: Record<string, SummaryRecord>;
  routes?: Record<string, SummaryRecord>;
};

export type SummaryBuildInput = {
  scan: RepoScan;
  options?: AiRuntimeOptions;
};

export type ModuleContextInput = {
  scan: RepoScan;
  module: ModuleRecord;
};

export type AreaContextInput = {
  scan: RepoScan;
  area: import("../types/index.js").ModuleAreaRecord;
};

export type RouteContextInput = {
  scan: RepoScan;
  route: import("../types/index.js").RouteRecord;
};
