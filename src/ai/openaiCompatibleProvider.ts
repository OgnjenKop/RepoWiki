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
    const response = await fetch(`${this.config.baseUrl.replace(/\/$/, "")}/chat/completions`, {
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

    if (!response.ok) {
      throw new Error(`AI summary request failed with HTTP ${response.status}`);
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
