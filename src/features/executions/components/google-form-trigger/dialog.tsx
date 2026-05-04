"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { generateGoogleFormScript } from "./utils";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workflowId: string;
};

export function GoogleFormTriggerDialog({ open, onOpenChange, workflowId }: Props) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const webhookUrl = `${appUrl}/api/webhooks/google-form?workflowId=${workflowId}`;
  const script = generateGoogleFormScript(webhookUrl);

  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  const copy = async (text: string, setter: (v: boolean) => void, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setter(true);
      toast.success(`${label} copied`);
      setTimeout(() => setter(false), 1500);
    } catch {
      toast.error("Clipboard not available");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Google Form Trigger</DialogTitle>
          <DialogDescription>
            Posts a payload to your workflow whenever someone submits the form.
            Form responses land in <code className="font-mono">{`{{googleForm.responses}}`}</code>.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5">
          <div>
            <Label className="mb-2 block">Webhook URL</Label>
            <div className="flex gap-2">
              <Input readOnly value={webhookUrl} className="font-mono text-xs" />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copy(webhookUrl, setCopiedUrl, "URL")}
              >
                {copiedUrl ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div>
            <Label className="mb-2 block">Google Apps Script</Label>
            <p className="text-muted-foreground mb-2 text-xs">
              Paste this in your form&apos;s Apps Script editor (Tools → Script editor),
              save, then add an installable <code>onFormSubmit</code> trigger.
            </p>
            <Textarea
              readOnly
              value={script}
              rows={12}
              className="font-mono text-xs"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => copy(script, setCopiedScript, "Script")}
            >
              {copiedScript ? (
                <Check className="mr-1 h-4 w-4" />
              ) : (
                <Copy className="mr-1 h-4 w-4" />
              )}
              Copy script
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
