export type SymbolKind =
  | "function"
  | "class"
  | "interface"
  | "type"
  | "component"
  | "constant"
  | "unknown";

export type SymbolRecord = {
  name: string;
  kind: SymbolKind;
  exported: boolean;
  line?: number;
};

export type FileRecord = {
  path: string;
  language: string;
  size: number;
  hash: string;
  imports: string[];
  exports: string[];
  symbols: SymbolRecord[];
};

export type GraphEdge = {
  from: string;
  to: string;
  type: "import";
};

export type ModuleRecord = {
  id: string;
  name: string;
  rootPath: string;
  files: string[];
  purpose?: string;
};

export type ModuleAreaRecord = {
  id: string;
  name: string;
  modules: string[];
  rootPaths: string[];
  files: string[];
  purpose?: string;
};

export type RouteRecord = {
  method?: string;
  path?: string;
  file: string;
  handler?: string;
  line?: number;
  controller?: string;
  confidence?: "direct" | "inferred";
};

export type EnvVarRecord = {
  name: string;
  sourceFile: string;
  line?: number;
};

export type TestRecord = {
  path: string;
  line?: number;
  testedFile?: string;
  testedFiles?: string[];
  coverageConfidence?: "direct" | "inferred" | "fallback";
};

export type CodeGraph = {
  files: FileRecord[];
  imports: GraphEdge[];
  modules: ModuleRecord[];
  areas: ModuleAreaRecord[];
  routes: RouteRecord[];
  envVars: EnvVarRecord[];
  tests: TestRecord[];
};

export type ProjectInfo = {
  name: string;
  type: string;
  packageManager: string;
  scripts: Record<string, string>;
  dependencies: string[];
  devDependencies: string[];
  configFiles: string[];
  cliOptions?: string[];
  cliCommands?: string[];
};

export type RepoScan = {
  rootDir: string;
  project: ProjectInfo;
  graph: CodeGraph;
  knowledge?: RepoKnowledge;
  summaries?: RepoSummaries;
};

export type PathAlias = {
  pattern: string;
  targets: string[];
};

export type EvidenceRef = {
  file: string;
  reason: string;
  lines?: [number, number];
};

export type ChangeTarget = {
  path: string;
  reason: string;
  caution?: string;
  line?: number;
  symbols?: ChangeTargetSymbol[];
};

export type ChangeTargetSymbol = {
  name: string;
  line?: number;
};

export type KnowledgeKind = "project" | "area" | "module" | "route" | "env" | "test" | "config" | "dependency";

export type KnowledgeItem = {
  id: string;
  kind: KnowledgeKind;
  title: string;
  files: string[];
  summary: string;
  evidence: EvidenceRef[];
};

export type RepoKnowledge = {
  items: KnowledgeItem[];
};

export type SummaryProvider = "deterministic" | "ai";

export type SummaryRecord = {
  provider: SummaryProvider;
  model?: string;
  content: string;
  sources: string[];
  updatedAt?: string;
};

export type RepoSummaries = {
  project?: SummaryRecord;
  areas?: Record<string, SummaryRecord>;
  modules: Record<string, SummaryRecord>;
  routes?: Record<string, SummaryRecord>;
};

export type FileHashes = Record<string, string>;

export type ChangeSet = {
  changed: string[];
  added: string[];
  deleted: string[];
};

export type RepoWikiIndex = {
  schemaVersion: 2;
  generator: "repowiki";
  project: ProjectInfo;
  docs: string[];
  fileModules: Record<string, string>;
  areaFiles: Record<string, string[]>;
  areaContextFiles: Record<string, string>;
  moduleContextFiles: Record<string, string>;
  routeContextFiles: Record<string, string>;
};
