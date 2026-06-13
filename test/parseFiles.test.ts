import { describe, expect, it } from "vitest";
import { parseExports, parseImports, parseSymbols } from "../src/scanner/parseFiles.js";

describe("parseFiles", () => {
  it("parses imports", () => {
    const imports = parseImports(`
      import fs from "node:fs";
      import { thing } from "./thing";
      export { value } from "./value";
      const x = require("pkg");
    `);
    expect(imports).toEqual(["./thing", "./value", "node:fs", "pkg"]);
  });

  it("parses exports", () => {
    const exports = parseExports(`
      export function run() {}
      export class Worker {}
      export type Thing = string;
      export { local as publicName };
    `);
    expect(exports).toEqual(["Thing", "Worker", "local", "run"]);
  });

  it("parses common default and multiline export forms", () => {
    const exports = parseExports(`
      export default function Main() {}
      export default class App {}
      export async function* stream() {}
      export enum Status { Ready }
      export let mutable = 1;
      export {
        first,
        second as renamed
      };
    `);
    expect(exports).toEqual(["App", "Main", "Status", "first", "mutable", "second", "stream"]);
  });

  it("ignores imports and exports in comments and strings", () => {
    const content = `
      // import fake from "fake";
      /* export const hidden = true; */
      const text = "export function Nope() {}";
      export const real = true;
    `;
    expect(parseImports(content)).toEqual([]);
    expect(parseExports(content)).toEqual(["real"]);
  });

  it("parses symbol line numbers", () => {
    const symbols = parseSymbols(`
      export function run() {}
      export class Worker {}
      const helper = () => {};
    `);
    expect(symbols).toEqual([
      { name: "helper", kind: "constant", exported: false, line: 4 },
      { name: "run", kind: "function", exported: true, line: 2 },
      { name: "Worker", kind: "class", exported: true, line: 3 },
    ]);
  });

  it("classifies exported arrow functions and function expressions", () => {
    const symbols = parseSymbols(`export const Banner = () => {};
export const build = async () => {};
const helper = function namedHelper() {};
`);
    expect(symbols).toEqual([
      { name: "Banner", kind: "component", exported: true, line: 1 },
      { name: "build", kind: "function", exported: true, line: 2 },
      { name: "helper", kind: "function", exported: false, line: 3 },
    ]);
  });
});
