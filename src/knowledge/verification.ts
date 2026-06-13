import type { RepoScan } from "../types/index.js";
import { scriptCommand } from "../utils/packageManager.js";

export type VerificationHint = {
  task: string;
  files: string[];
  note: string;
  evidence: string[];
  command?: string;
};

export function selectProjectVerificationHints(scan: RepoScan): VerificationHint[] {
  const hints: VerificationHint[] = [];
  const buildCommand = scan.project.scripts.build ? scriptCommand(scan.project.packageManager, "build") : undefined;
  if (buildCommand) {
    hints.push({
      task: "Run the project build",
      files: ["package.json"],
      note: "Use the build script to catch type and bundling issues.",
      evidence: ["package.json"],
      command: buildCommand
    });
  }
  const testCommand = scan.project.scripts.test ? scriptCommand(scan.project.packageManager, "test") : undefined;
  if (testCommand) {
    hints.push({
      task: "Run the project test suite",
      files: ["package.json"],
      note: "Use the package test script to verify repository-wide changes.",
      evidence: ["package.json"],
      command: testCommand
    });
  }
  if (scan.graph.tests.length) {
    const sampleTests = scan.graph.tests.slice(0, 3).map((test) => test.line ? `${test.path}:${test.line}` : test.path);
    if (sampleTests.length) {
      hints.push({
        task: "Review representative tests",
        files: sampleTests,
        note: "These tests show the expected behavior at the repo level.",
        evidence: sampleTests
      });
    }
  }
  return uniqueHints(hints);
}

export function selectModuleVerificationHints(scan: RepoScan, moduleFiles: string[]): VerificationHint[] {
  const relatedTests = relatedModuleTests(scan, moduleFiles);
  const hints: VerificationHint[] = [];
  const buildCommand = scan.project.scripts.build ? scriptCommand(scan.project.packageManager, "build") : undefined;
  if (buildCommand) {
    hints.push({
      task: "Run the repository build command",
      files: ["package.json"],
      note: "Use the build script after changing the module.",
      evidence: ["package.json"],
      command: buildCommand
    });
  }
  if (relatedTests.length) {
    const files = relatedTests.slice(0, 3).map((test) => test.line ? `${test.path}:${test.line}` : test.path);
    hints.push({
      task: "Inspect related tests",
      files,
      note: "These tests exercise module behavior or its direct targets.",
      evidence: files
    });
  }
  const testCommand = scan.project.scripts.test ? scriptCommand(scan.project.packageManager, "test") : undefined;
  if (testCommand) {
    hints.push({
      task: "Run the repository test command",
      files: ["package.json"],
      note: "Use the project test script after changing the module.",
      evidence: ["package.json"],
      command: testCommand
    });
  }
  return uniqueHints(hints);
}

export function selectRouteVerificationHints(scan: RepoScan, routeFile: string): VerificationHint[] {
  const route = scan.graph.routes.find((entry) => entry.file === routeFile);
  const relatedTests = relatedRouteTests(scan, routeFile);
  const hints: VerificationHint[] = [];
  const buildCommand = scan.project.scripts.build ? scriptCommand(scan.project.packageManager, "build") : undefined;
  if (buildCommand) {
    hints.push({
      task: "Run the repository build command",
      files: ["package.json"],
      note: "Use the build script after changing the route.",
      evidence: ["package.json"],
      command: buildCommand
    });
  }
  if (route?.method || route?.path) {
    hints.push({
      task: "Exercise the route",
      files: [routeFile],
      note: `${route.method ?? "ANY"} ${route.path ?? "(unknown path)"}.`,
      evidence: [routeFile]
    });
  }
  if (relatedTests.length) {
    const files = relatedTests.slice(0, 3).map((test) => test.line ? `${test.path}:${test.line}` : test.path);
    hints.push({
      task: "Inspect related tests",
      files,
      note: "These tests show the expected route behavior.",
      evidence: files
    });
  }
  const testCommand = scan.project.scripts.test ? scriptCommand(scan.project.packageManager, "test") : undefined;
  if (testCommand) {
    hints.push({
      task: "Run the repository test command",
      files: ["package.json"],
      note: "Use the project test script after changing the route.",
      evidence: ["package.json"],
      command: testCommand
    });
  }
  return uniqueHints(hints);
}

export function selectAreaVerificationHints(scan: RepoScan, areaFiles: string[]): VerificationHint[] {
  const candidateSet = new Set(areaFiles);
  const relatedTests = scan.graph.tests.filter((test) =>
    candidateSet.has(test.path) ||
    (test.testedFile ? candidateSet.has(test.testedFile) : false) ||
    (test.testedFiles ? test.testedFiles.some((file) => candidateSet.has(file)) : false)
  );
  const relatedRoutes = scan.graph.routes.filter((route) => candidateSet.has(route.file));
  const hints: VerificationHint[] = [];
  const buildCommand = scan.project.scripts.build ? scriptCommand(scan.project.packageManager, "build") : undefined;
  if (buildCommand) {
    hints.push({
      task: "Run the project build",
      files: ["package.json"],
      note: "Use the build script after changing the area.",
      evidence: ["package.json"],
      command: buildCommand
    });
  }
  const testCommand = scan.project.scripts.test ? scriptCommand(scan.project.packageManager, "test") : undefined;
  if (testCommand) {
    hints.push({
      task: "Run the project test suite",
      files: ["package.json"],
      note: "Use the package test script after changing the area.",
      evidence: ["package.json"],
      command: testCommand
    });
  }
  if (relatedTests.length) {
    const files = relatedTests.slice(0, 3).map((test) => test.line ? `${test.path}:${test.line}` : test.path);
    hints.push({
      task: "Inspect related tests",
      files,
      note: "These tests cover files in the area.",
      evidence: files
    });
  }
  if (relatedRoutes.length) {
    const files = relatedRoutes.slice(0, 3).map((route) => route.line ? `${route.file}:${route.line}` : route.file);
    hints.push({
      task: "Exercise related routes",
      files,
      note: "These routes are owned by files in the area.",
      evidence: files
    });
  }
  return uniqueHints(hints);
}

export function formatVerificationHint(hint: VerificationHint): string {
  const files = hint.files.length ? hint.files.join(", ") : "_none_";
  const evidence = hint.evidence.length ? ` (evidence: ${hint.evidence.join(", ")})` : "";
  const command = hint.command ? ` Command: ${hint.command}.` : "";
  return `${hint.task}: ${files} - ${hint.note}${command}${evidence}`;
}

function relatedModuleTests(scan: RepoScan, moduleFiles: string[]) {
  return scan.graph.tests.filter((test) =>
    moduleFiles.includes(test.path) ||
    (test.testedFile ? moduleFiles.includes(test.testedFile) : false) ||
    (test.testedFiles ? test.testedFiles.some((file) => moduleFiles.includes(file)) : false)
  );
}

function relatedRouteTests(scan: RepoScan, routeFile: string) {
  const module = scan.graph.modules.find((candidate) => candidate.files.includes(routeFile));
  const moduleFiles = module?.files ?? [];
  return scan.graph.tests.filter((test) =>
    test.path.includes(routeFile.split("/").slice(0, -1).join("/")) ||
    (test.testedFile ? moduleFiles.includes(test.testedFile) : false) ||
    (test.testedFiles ? test.testedFiles.some((file) => moduleFiles.includes(file)) : false)
  );
}

function uniqueHints(hints: VerificationHint[]): VerificationHint[] {
  const seen = new Set<string>();
  const unique: VerificationHint[] = [];
  for (const hint of hints) {
    const key = `${hint.task}|${hint.files.join(",")}|${hint.note}|${hint.command ?? ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(hint);
  }
  return unique;
}
