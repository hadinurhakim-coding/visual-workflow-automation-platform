import { EventSchemas, Inngest } from "inngest";
import { realtimeMiddleware } from "@inngest/realtime/middleware";

// Typed event schema — keeps `inngest.send()` & function handlers type-safe.
type Events = {
  "workflows/execute.workflow": {
    data: {
      workflowId: string;
      initialData?: Record<string, unknown>;
    };
  };
};

export const inngest = new Inngest({
  id: "nodebase",
  schemas: new EventSchemas().fromRecord<Events>(),
  middleware: [realtimeMiddleware()],
});
