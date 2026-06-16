import type { ContextPack, SummaryProvider } from "./types.js";
import { buildSummaryMessages } from "./prompt.js";
import { extractJson, parseSummaryDraft, renderSummaryMarkdown } from "./summaryFormat.js";

export type OpenAICompatibleProviderConfig = {
  baseUrl: string;
  model: string;
  apiKey: string;
  maxTokens?: number;
  timeoutMs?: number;
};

export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export class OpenAICompatibleSummaryProvider implements SummaryProvider {
  constructor(private readonly config: OpenAICompatibleProviderConfig) {}

  async summarize(pack: ContextPack): Promise<string> {
    const messages = buildSummaryMessages(pack);
    const content = await this.chat(messages, "summary", { jsonMode: true });
    const draft = parseSummaryDraft(content);
    return renderSummaryMarkdown(draft);
  }

  async chat(messages: ChatMessage[], purpose: string, options: { jsonMode?: boolean } = {}): Promise<string> {
    const endpoint = `${this.config.baseUrl.replace(/\/$/, "")}/chat/completions`;
    const maxTokens = this.config.maxTokens ?? 12000;
    const timeoutMs = this.config.timeoutMs ?? 180_000;
    const jsonMode = options.jsonMode ?? false;

    let response: Response;
    try {
      const body: Record<string, unknown> = {
        model: this.config.model,
        max_tokens: maxTokens,
        messages
      };
      if (jsonMode) body.response_format = { type: "json_object" };
      response = await fetch(endpoint, {
        method: "POST",
        signal: AbortSignal.timeout(timeoutMs),
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify(body)
      });
    } catch (error) {
      throw new Error(`AI request failed for ${purpose} with model ${this.config.model} at ${endpoint}: ${error instanceof Error ? error.message : String(error)}`);
    }

    if (!response.ok) {
      const body = await readErrorBody(response);
      throw new Error(`AI request failed for ${purpose} with model ${this.config.model} at ${endpoint} with HTTP ${response.status}${body ? `: ${body}` : ""}`);
    }

    const data = (await response.json()) as unknown;
    const choice = extractChoice(data);

    if (!choice) {
      const preview = JSON.stringify(data).slice(0, 500);
      throw new Error(`AI response for ${purpose} did not contain choices. Response preview: ${preview}`);
    }

    let content = choice.content;

    if (!content && choice.reasoning) {
      try {
        content = extractJson(choice.reasoning);
      } catch {
        content = undefined;
      }
    }

    if (!content) {
      const reason = choice.finishReason ?? "unknown";
      const preview = JSON.stringify(data).slice(0, 800);
      if (reason === "length") {
        throw new Error(`AI response for ${purpose} was empty because it hit the token limit. Response preview: ${preview}`);
      }
      throw new Error(`AI response for ${purpose} did not contain content (finish_reason: ${reason}). Response preview: ${preview}`);
    }

    return content;
  }
}

type ChoiceInfo = {
  content: string | undefined;
  reasoning: string | undefined;
  finishReason: string | undefined;
};

function extractChoice(data: unknown): ChoiceInfo | undefined {
  if (!data || typeof data !== "object") return undefined;
  const choices = (data as { choices?: unknown }).choices;
  if (!Array.isArray(choices) || choices.length === 0) return undefined;
  const first = choices[0];
  if (!first || typeof first !== "object") return undefined;

  const finishReason = (first as { finish_reason?: unknown }).finish_reason;
  const finishReasonStr = typeof finishReason === "string" ? finishReason : undefined;

  const message = (first as { message?: unknown; delta?: unknown }).message ?? (first as { message?: unknown; delta?: unknown }).delta;

  let content: string | undefined;
  let reasoning: string | undefined;

  if (message && typeof message === "object") {
    content = extractString((message as { content?: unknown }).content);
    reasoning = extractString((message as { reasoning?: unknown }).reasoning);
    if (!reasoning) {
      reasoning = extractString((message as { reasoning_content?: unknown }).reasoning_content);
    }
  }

  if (!reasoning) {
    reasoning = extractString((first as { reasoning?: unknown }).reasoning);
  }

  return { content, reasoning, finishReason: finishReasonStr };
}

function extractString(value: unknown): string | undefined {
  if (typeof value === "string") {
    return value.trim() || undefined;
  }
  if (Array.isArray(value)) {
    const parts: string[] = [];
    for (const item of value) {
      const text = extractString(item);
      if (text) parts.push(text);
    }
    return parts.length ? parts.join("\n") : undefined;
  }
  if (value && typeof value === "object") {
    const candidates = [
      (value as { text?: unknown }).text,
      (value as { content?: unknown }).content,
      (value as { reasoning?: unknown }).reasoning
    ];
    for (const candidate of candidates) {
      const text = extractString(candidate);
      if (text) return text;
    }
  }
  return undefined;
}

async function readErrorBody(response: Response): Promise<string> {
  try {
    const body = await response.text();
    return body.trim().slice(0, 500);
  } catch {
    return "";
  }
}
