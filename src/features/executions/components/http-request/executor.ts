import { NonRetriableError } from "inngest";
import ky from "ky";
import { type NodeExecutor } from "../../types";
import { renderTemplate } from "@/lib/handlebars";

export type HttpRequestData = {
  variableName?: string;
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string;
};

const METHODS_WITH_BODY = new Set(["POST", "PUT", "PATCH"]);

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  data,
  context,
  step,
}) => {
  return await step.run("http-request", async () => {
    if (!data.variableName) {
      throw new NonRetriableError("Variable name is required");
    }
    if (!data.endpoint) {
      throw new NonRetriableError("Endpoint URL is required");
    }
    const method = data.method ?? "GET";

    const endpoint = renderTemplate(data.endpoint, context);

    const options: Parameters<typeof ky>[1] = {
      method,
      // Don't throw on non-2xx — we want to surface the response in context.
      throwHttpErrors: false,
      timeout: 30_000,
    };

    if (METHODS_WITH_BODY.has(method)) {
      const rawBody = renderTemplate(data.body ?? "{}", context);
      try {
        // Validate JSON syntax up front so user gets a clear error before the network call.
        JSON.parse(rawBody);
      } catch (err) {
        throw new NonRetriableError(
          `Body is not valid JSON: ${(err as Error).message}`,
        );
      }
      options.body = rawBody;
      options.headers = { "Content-Type": "application/json" };
    }

    const response = await ky(endpoint, options);
    const contentType = response.headers.get("content-type") ?? "";
    const responseData = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    return {
      ...context,
      [data.variableName]: {
        httpResponse: {
          status: response.status,
          statusText: response.statusText,
          data: responseData,
        },
      },
    };
  });
};
