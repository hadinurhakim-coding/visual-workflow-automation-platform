import { NonRetriableError } from "inngest";
import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import prisma from "@/lib/db";
import { decrypt } from "@/lib/encryption";
import { renderTemplate } from "@/lib/handlebars";
import { type NodeExecutor } from "../../types";

export type OpenAiData = {
  variableName?: string;
  credentialId?: string;
  model?: string;
  systemPrompt?: string;
  userPrompt?: string;
};

export const openAiExecutor: NodeExecutor<OpenAiData> = async ({
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
      where: { id: data.credentialId, userId, type: "OPENAI" },
    });
    if (!c) throw new NonRetriableError("OpenAI credential not found");
    return c;
  });

  const systemPrompt = data.systemPrompt
    ? renderTemplate(data.systemPrompt, context)
    : "You are a helpful assistant.";
  const userPrompt = renderTemplate(data.userPrompt, context);

  const text = await step.run("openai-generate-text", async () => {
    const openai = createOpenAI({ apiKey: decrypt(credential.value) });
    const result = await generateText({
      model: openai(data.model ?? "gpt-4o-mini"),
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
