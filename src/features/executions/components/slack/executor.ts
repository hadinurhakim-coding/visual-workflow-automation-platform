import { NonRetriableError } from "inngest";
import ky from "ky";
import { decode } from "html-entities";
import { renderTemplateRaw } from "@/lib/handlebars";
import { type NodeExecutor } from "../../types";

export type SlackData = {
  variableName?: string;
  webhookUrl?: string;
  text?: string;
};

export const slackExecutor: NodeExecutor<SlackData> = async ({
  data,
  context,
  step,
}) => {
  return await step.run("slack-post", async () => {
    if (!data.variableName) {
      throw new NonRetriableError("Variable name is required");
    }
    if (!data.webhookUrl) {
      throw new NonRetriableError("Webhook URL is required");
    }
    if (!data.text) {
      throw new NonRetriableError("Message text is required");
    }

    const text = decode(renderTemplateRaw(data.text, context));

    await ky.post(data.webhookUrl, {
      json: { text },
      timeout: 15_000,
    });

    return {
      ...context,
      [data.variableName]: {
        slackMessage: { text, sent: true },
      },
    };
  });
};
