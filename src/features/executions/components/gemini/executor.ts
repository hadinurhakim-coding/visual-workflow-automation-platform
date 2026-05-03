import { NonRetriableError } from "inngest";
import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import prisma from "@/lib/db";
import { decrypt } from "@/lib/encryption";
import { renderTemplate } from "@/lib/handlebars";
import { type NodeExecutor } from "../../types";

export type GeminiData = {
  variableName?: string;
  credentialId?: string;
  model?: string;
  systemPrompt?: string;
  userPrompt?: string;
};

export const geminiExecutor: NodeExecutor<GeminiData> = async ({
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
      where: { id: data.credentialId, userId, type: "GEMINI" },
    });
    if (!c) throw new NonRetriableError("Gemini credential not found");
    return c;
  });

  const systemPrompt = data.systemPrompt
    ? renderTemplate(data.systemPrompt, context)
    : "You are a helpful assistant.";
  const userPrompt = renderTemplate(data.userPrompt, context);

  const text = await step.run("gemini-generate-text", async () => {
    const google = createGoogleGenerativeAI({ apiKey: decrypt(credential.value) });
    const result = await generateText({
      model: google(data.model ?? "gemini-2.0-flash"),
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
