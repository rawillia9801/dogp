const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";

export async function generateStructuredAiResponse<T>({
  instructions,
  input,
  schemaName,
  schema,
}: {
  instructions: string;
  input: string;
  schemaName: string;
  schema: Record<string, unknown>;
}) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-5",
      instructions,
      input,
      text: {
        format: {
          type: "json_schema",
          name: schemaName,
          schema,
          strict: true,
        },
      },
    }),
  });

  const payload = (await response.json().catch(() => ({}))) as Record<string, unknown>;

  if (!response.ok) {
    const message =
      typeof payload.error === "object" &&
      payload.error !== null &&
      "message" in payload.error &&
      typeof payload.error.message === "string"
        ? payload.error.message
        : "AI generation failed.";

    throw new Error(message);
  }

  const outputText = extractOutputText(payload);

  if (!outputText) {
    throw new Error("AI response did not contain structured output.");
  }

  return JSON.parse(outputText) as T;
}

function extractOutputText(payload: Record<string, unknown>) {
  if (typeof payload.output_text === "string" && payload.output_text.trim().length > 0) {
    return payload.output_text;
  }

  if (!Array.isArray(payload.output)) {
    return null;
  }

  for (const item of payload.output) {
    if (typeof item !== "object" || item === null || !("content" in item) || !Array.isArray(item.content)) {
      continue;
    }

    for (const content of item.content) {
      if (typeof content !== "object" || content === null) {
        continue;
      }

      if ("text" in content && typeof content.text === "string" && content.text.trim().length > 0) {
        return content.text;
      }
    }
  }

  return null;
}
