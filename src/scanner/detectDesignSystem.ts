import type { ComponentFramework, ComponentRecord, DesignSystemRecord, DesignTokenRecord } from "../types/index.js";

const componentLibraries: Record<string, string[]> = {
  react: ["@mui/material", "@chakra-ui/react", "antd", "@mantine/core", "@radix-ui/react", "react-bootstrap", "@nextui-org/react", "@heroui/react", "shadcn", "@fluentui/react", "semantic-ui-react"],
  vue: ["vuetify", "element-plus", "naive-ui", "primevue", "quasar", "@nuxt/ui", "bootstrap-vue"],
  svelte: ["svelte-material-ui", "carbon-components-svelte", "smelte", "attractions"],
  angular: ["@angular/material", "ng-zorro-antd", "@ng-bootstrap/ng-bootstrap", "primeng"]
};

export function buildDesignSystem(
  components: ComponentRecord[],
  tokens: DesignTokenRecord[],
  projectFiles: string[]
): DesignSystemRecord | undefined {
  if (components.length === 0 && tokens.length === 0) {
    const hasTailwind = projectFiles.some((file) => /tailwind\.config\.(js|ts|cjs|mjs)$/i.test(file));
    if (!hasTailwind) return undefined;
  }

  const framework = inferPrimaryFramework(components);
  const detectedLibraries = inferComponentLibraries(projectFiles, framework);
  const componentFiles = [...new Set(components.filter((c) => !c.isStory).map((c) => c.file))].sort();
  const storyFiles = [...new Set(components.filter((c) => c.isStory).map((c) => c.file))].sort();
  const tokenFiles = [...new Set(tokens.map((t) => t.file))].sort();
  const hasStorybook = projectFiles.some((file) => /\.storybook\//.test(file)) || storyFiles.length > 0;

  return {
    framework: framework ?? "unknown",
    componentLibraries: detectedLibraries,
    tokenFiles,
    componentFiles,
    storyFiles,
    hasStorybook
  };
}

function inferPrimaryFramework(components: ComponentRecord[]): ComponentFramework | undefined {
  if (components.length === 0) return undefined;
  const counts = new Map<ComponentFramework, number>();
  for (const component of components) {
    if (component.isStory) continue;
    counts.set(component.framework, (counts.get(component.framework) ?? 0) + 1);
  }
  let best: ComponentFramework | undefined;
  let bestCount = 0;
  for (const [framework, count] of counts) {
    if (count > bestCount) {
      best = framework;
      bestCount = count;
    }
  }
  return best;
}

function inferComponentLibraries(projectFiles: string[], framework: ComponentFramework | undefined): string[] {
  if (!framework) return [];
  const candidates = componentLibraries[framework] ?? [];
  const matches: string[] = [];
  const packageJson = projectFiles.find((file) => file === "package.json");
  if (!packageJson) return [];
  for (const candidate of candidates) {
    const prefix = candidate.replace(/[^a-z0-9]/gi, "").toLowerCase();
    if (projectFiles.some((file) => file.toLowerCase().includes(prefix.toLowerCase()))) {
      matches.push(candidate);
    }
  }
  return matches;
}
