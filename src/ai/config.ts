import type { AiRuntimeOptions } from "./types.js";

export const DEFAULT_AI_BASE_URL = "https://openrouter.ai/api/v1";
export const DEFAULT_AI_MODEL = "deepseek/deepseek-chat-v3.1";

export function resolveAiModel(options?: AiRuntimeOptions): string {
  return (
    options?.model ??
    process.env.REPOWIKI_AI_MODEL ??
    process.env.OPENAI_MODEL ??
    DEFAULT_AI_MODEL
  );
}

export function resolveAiBaseUrl(options?: AiRuntimeOptions): string {
  return (
    options?.baseUrl ??
    process.env.REPOWIKI_AI_BASE_URL ??
    process.env.OPENAI_BASE_URL ??
    DEFAULT_AI_BASE_URL
  );
}

export function resolveAiApiKey(options?: AiRuntimeOptions): string {
  return (
    options?.apiKey ??
    process.env.REPOWIKI_AI_API_KEY ??
    process.env.OPENAI_API_KEY ??
    ""
  );
}
