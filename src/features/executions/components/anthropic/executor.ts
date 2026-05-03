import { NonRetriableError } from "inngest";
import { generateText } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import prisma from "@/lib/db";
import { decrypt } from "@/lib/encryption";
import { renderTemplate } from "@/lib/handlebars";
import { type NodeExecutor } from "../../types";

export type AnthropicData = {
  variableName?: string;
  credentialId?: string;
  model?: string;
  systemPrompt?: string;
  userPrompt?: string;
};

export const anthropicExecutor: NodeExecutor<AnthropicData> = async ({
  data,
  userId,
  context,
  step,
}) => {
  if (!data.variableName) throw new NonRetriableError("Variable name is required");
  if (!data.credentialId) throw new NonRetriableError("Credential is required");
  if (!data.userPrompt) throw new NonRetriableError("User prompt is required");

  const credential = await step.run("get-credential", async () => {
    const c = await prisma.credential.findFirst({
      where: { id: data.credentialId, userId, type: "ANTHROPIC" },
    });
    if (!c) throw new NonRetriableError("Anthropic credential not found");
    return c;
  });

  const systemPrompt = data.systemPrompt
    ? renderTemplate(data.systemPrompt, context)
    : "You are a helpful assistant.";
  const userPrompt = renderTemplate(data.userPrompt, context);

  const text = await step.run("anthropic-generate-text", async () => {
    const anthropic = createAnthropic({ apiKey: decrypt(credential.value) });
    const result = await generateText({
      model: anthropic(data.model ?? "claude-3-5-sonnet-latest"),
      system: systemPrompt,
      prompt: userPrompt,
    });
    return result.text;
  });

  return {
    ...context,
    [data.variableName]: { text },
  };
};
