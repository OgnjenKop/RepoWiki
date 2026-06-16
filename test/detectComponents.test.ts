import { describe, expect, it } from "vitest";
import { detectComponents, inferFramework } from "../src/scanner/detectComponents.js";

describe("detectComponents", () => {
  it("detects React function components", () => {
    const content = `
      import React from "react";
      export function Button({ onClick, label }: ButtonProps) {
        return <button onClick={onClick}>{label}</button>;
      }
    `;
    const components = detectComponents("src/components/Button.tsx", content);
    expect(components).toHaveLength(1);
    expect(components[0].name).toBe("Button");
    expect(components[0].framework).toBe("react");
    expect(components[0].exported).toBe(true);
    expect(components[0].props).toContain("onClick");
    expect(components[0].props).toContain("label");
  });

  it("detects React arrow function components", () => {
    const content = `
      import React from "react";
      export const Card = ({ title, body }: CardProps) => {
        return <div><h1>{title}</h1><p>{body}</p></div>;
      };
    `;
    const components = detectComponents("src/components/Card.tsx", content);
    expect(components).toHaveLength(1);
    expect(components[0].name).toBe("Card");
    expect(components[0].framework).toBe("react");
  });

  it("detects React class components", () => {
    const content = `
      import React from "react";
      export class Modal extends React.Component {
        render() {
          return <div>Modal</div>;
        }
      }
    `;
    const components = detectComponents("src/components/Modal.tsx", content);
    expect(components).toHaveLength(1);
    expect(components[0].name).toBe("Modal");
    expect(components[0].framework).toBe("react");
  });

  it("detects React.memo components", () => {
    const content = `
      import React from "react";
      export const ListItem = React.memo(({ item }) => {
        return <li>{item.name}</li>;
      });
    `;
    const components = detectComponents("src/components/ListItem.tsx", content);
    expect(components).toHaveLength(1);
    expect(components[0].name).toBe("ListItem");
  });

  it("ignores non-component PascalCase functions", () => {
    const content = `
      export function Helper(value: string) {
        return value.toUpperCase();
      }
    `;
    const components = detectComponents("src/utils/string.ts", content);
    expect(components).toHaveLength(0);
  });

  it("detects Vue components from name property", () => {
    const content = `
      <script>
      export default {
        name: "UserCard",
        props: ["user"]
      };
      </script>
    `;
    const components = detectComponents("src/components/UserCard.vue", content);
    expect(components).toHaveLength(1);
    expect(components[0].name).toBe("UserCard");
    expect(components[0].framework).toBe("vue");
  });

  it("detects Svelte components from filename", () => {
    const content = `
      <script lang="ts">
        export let title: string;
      </script>
      <h1>{title}</h1>
    `;
    const components = detectComponents("src/components/Header.svelte", content);
    expect(components).toHaveLength(1);
    expect(components[0].name).toBe("Header");
    expect(components[0].framework).toBe("svelte");
  });

  it("detects Angular components", () => {
    const content = `
      import { Component } from "@angular/core";
      @Component({
        selector: "app-user",
        template: "<div>{{name}}</div>"
      })
      export class UserComponent {
        name = "John";
      }
    `;
    const components = detectComponents("src/app/user.component.ts", content);
    expect(components).toHaveLength(1);
    expect(components[0].name).toBe("UserComponent");
    expect(components[0].framework).toBe("angular");
  });

  it("detects Storybook stories", () => {
    const content = `
      import { Button } from "./Button";
      export default {
        title: "Components/Button",
        component: Button
      };
      export const Primary = () => <Button label="Click" />;
    `;
    const components = detectComponents("src/components/Button.stories.tsx", content);
    expect(components.length).toBeGreaterThan(0);
    const story = components.find((c) => c.isStory);
    expect(story).toBeDefined();
    expect(story?.name).toBe("Button");
  });

  it("returns empty for non-component files", () => {
    const components = detectComponents("src/utils/helpers.ts", "export const value = 1;");
    expect(components).toHaveLength(0);
  });
});

describe("inferFramework", () => {
  it("infers react from JSX", () => {
    const framework = inferFramework("src/Button.tsx", "export const Button = () => <button />;");
    expect(framework).toBe("react");
  });

  it("infers vue from file extension", () => {
    const framework = inferFramework("src/Card.vue", "<template></template>");
    expect(framework).toBe("vue");
  });

  it("infers svelte from file extension", () => {
    const framework = inferFramework("src/Item.svelte", "<div></div>");
    expect(framework).toBe("svelte");
  });

  it("infers angular from @Component decorator", () => {
    const framework = inferFramework("src/app/user.ts", '@Component({}) export class UserComponent {}');
    expect(framework).toBe("angular");
  });

  it("returns undefined for plain files", () => {
    const framework = inferFramework("src/utils/helpers.ts", "export const value = 1;");
    expect(framework).toBeUndefined();
  });
});
