import { createOpenAI } from "@ai-sdk/openai";

const RUN_ID_HEADER = "X-Lovable-AIG-Run-ID";

export function createYatriAiProvider(apiKey: string, initialRunId: string | null) {
  let runId = initialRunId;

  const runIdFetch: typeof fetch = async (input, init) => {
    const headers = new Headers(init?.headers);
    if (runId) headers.set(RUN_ID_HEADER, runId);

    const response = await fetch(input, { ...init, headers });
    runId = response.headers.get(RUN_ID_HEADER) ?? runId;
    return response;
  };

  return {
    provider: createOpenAI({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey,
      headers: {
        "Lovable-API-Key": apiKey,
        "X-Lovable-AIG-SDK": "vercel-ai-sdk",
      },
      fetch: runIdFetch,
    }),
    getRunId: () => runId,
  };
}

export function getIncomingRunId(request: Request) {
  return request.headers.get(RUN_ID_HEADER);
}
