"use client";

import { useState } from "react";
import { Copy, Check, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workflowId: string;
};

export function StripeTriggerDialog({ open, onOpenChange, workflowId }: Props) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const webhookUrl = `${appUrl}/api/webhooks/stripe?workflowId=${workflowId}`;
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl);
      setCopied(true);
      toast.success("URL copied");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Clipboard not available");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Stripe Trigger</DialogTitle>
          <DialogDescription>
            Fires when Stripe sends an event to this URL. Event data lands in{" "}
            <code className="font-mono">{`{{stripe}}`}</code>.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div>
            <Label className="mb-2 block">Webhook URL</Label>
            <div className="flex gap-2">
              <Input readOnly value={webhookUrl} className="font-mono text-xs" />
              <Button variant="outline" size="icon" onClick={copy}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-muted-foreground mt-2 text-xs">
              Add this URL in Stripe Dashboard → Developers → Webhooks → Add endpoint.
              Pick which events you want delivered.
            </p>
          </div>

          <div className="border-destructive/40 bg-destructive/10 flex items-start gap-2 rounded-md border p-3 text-xs">
            <AlertTriangle className="text-destructive mt-0.5 h-4 w-4 shrink-0" />
            <p>
              <strong>Production warning:</strong> this endpoint does NOT verify
              Stripe signatures yet. For production use, add{" "}
              <code className="font-mono">stripe.webhooks.constructEvent()</code>{" "}
              with <code className="font-mono">STRIPE_WEBHOOK_SECRET</code>.
              Anyone who knows the URL can fake events.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
