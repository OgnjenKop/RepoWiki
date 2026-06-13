import type { ContextPack, SummaryProvider } from "./types.js";
import { buildSummaryMessages } from "./prompt.js";
import { parseSummaryDraft, renderSummaryMarkdown } from "./summaryFormat.js";

export class OpenAICompatibleSummaryProvider implements SummaryProvider {
  constructor(
    private readonly config: {
      baseUrl: string;
      model: string;
      apiKey: string;
    }
  ) {}

  async summarize(pack: ContextPack): Promise<string> {
    const messages = buildSummaryMessages(pack);
    const endpoint = `${this.config.baseUrl.replace(/\/$/, "")}/chat/completions`;
    let response: Response;
    try {
      response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          model: this.config.model,
          temperature: 0.2,
          messages
        })
      });
    } catch (error) {
      throw new Error(`AI summary request failed for model ${this.config.model} at ${endpoint}: ${error instanceof Error ? error.message : String(error)}`);
    }

    if (!response.ok) {
      const body = await readErrorBody(response);
      throw new Error(`AI summary request failed for model ${this.config.model} at ${endpoint} with HTTP ${response.status}${body ? `: ${body}` : ""}`);
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) {
      throw new Error("AI summary response did not contain content");
    }
    const draft = parseSummaryDraft(content);
    return renderSummaryMarkdown(draft);
  }
}

async function readErrorBody(response: Response): Promise<string> {
  try {
    const body = await response.text();
    return body.trim().slice(0, 500);
  } catch {
    return "";
  }
}
