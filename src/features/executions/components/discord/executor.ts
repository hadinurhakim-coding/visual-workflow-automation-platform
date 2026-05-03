import { NonRetriableError } from "inngest";
import ky from "ky";
import { decode } from "html-entities";
import { renderTemplateRaw } from "@/lib/handlebars";
import { type NodeExecutor } from "../../types";

export type DiscordData = {
  variableName?: string;
  webhookUrl?: string;
  username?: string;
  content?: string;
};

const DISCORD_MAX_CONTENT = 2000;

export const discordExecutor: NodeExecutor<DiscordData> = async ({
  data,
  context,
  step,
}) => {
  return await step.run("discord-post", async () => {
    if (!data.variableName) {
      throw new NonRetriableError("Variable name is required");
    }
    if (!data.webhookUrl) {
      throw new NonRetriableError("Webhook URL is required");
    }
    if (!data.content) {
      throw new NonRetriableError("Message content is required");
    }

    const rendered = decode(renderTemplateRaw(data.content, context));
    const content = rendered.slice(0, DISCORD_MAX_CONTENT);

    await ky.post(data.webhookUrl, {
      json: {
        content,
        ...(data.username ? { username: data.username } : {}),
      },
      timeout: 15_000,
    });

    return {
      ...context,
      [data.variableName]: {
        discordMessage: { content, sent: true },
      },
    };
  });
};
