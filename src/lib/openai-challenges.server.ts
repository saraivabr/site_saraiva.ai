import "server-only";

const OPENAI_URL = "https://api.openai.com/v1/responses";
const DEFAULT_MODEL = "gpt-5.4-mini";

type JsonSchema = Record<string, unknown>;

type OpenAIResponse = {
  output_text?: string;
  output?: Array<{
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  }>;
};

export class ChallengeAIError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

export async function generateStructured<T>({
  instructions,
  input,
  name,
  schema,
}: {
  instructions: string;
  input: string;
  name: string;
  schema: JsonSchema;
}): Promise<T> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new ChallengeAIError("A inteligência da Saraiva.AI ainda não foi configurada.", 503);

  const response = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || DEFAULT_MODEL,
      instructions,
      input,
      store: false,
      max_output_tokens: 1800,
      text: {
        format: {
          type: "json_schema",
          name,
          strict: true,
          schema,
        },
      },
    }),
    signal: AbortSignal.timeout(45_000),
  });

  if (!response.ok) {
    const status = response.status === 429 ? 429 : 502;
    throw new ChallengeAIError(
      response.status === 429
        ? "Muita gente está resolvendo desafios agora. Tente novamente em instantes."
        : "Não consegui pensar neste desafio agora. Tente novamente.",
      status,
    );
  }

  const payload = (await response.json()) as OpenAIResponse;
  const text = extractOutputText(payload);
  if (!text) throw new ChallengeAIError("A resposta chegou incompleta. Tente novamente.", 502);

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new ChallengeAIError("A resposta chegou em um formato inesperado. Tente novamente.", 502);
  }
}

function extractOutputText(payload: OpenAIResponse) {
  if (payload.output_text) return payload.output_text;
  return payload.output
    ?.flatMap((item) => item.content ?? [])
    .filter((content) => content.type === "output_text" && typeof content.text === "string")
    .map((content) => content.text)
    .join("");
}
