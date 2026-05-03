"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CredentialType } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCredentialsByType } from "@/features/credentials/hooks/use-credentials";
import type { AnthropicData } from "./executor";

const ANTHROPIC_MODELS = [
  "claude-3-5-sonnet-latest",
  "claude-3-5-haiku-latest",
  "claude-3-opus-latest",
] as const;

const schema = z.object({
  variableName: z.string().min(1, "Variable name is required"),
  credentialId: z.string().min(1, "Credential is required"),
  model: z.string().min(1).default("claude-3-5-sonnet-latest"),
  systemPrompt: z.string().default(""),
  userPrompt: z.string().min(1, "User prompt is required"),
});

type Values = z.infer<typeof schema>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: Partial<AnthropicData>;
  onSubmit: (values: Values) => void;
};

export function AnthropicDialog({
  open,
  onOpenChange,
  defaultValues,
  onSubmit,
}: Props) {
  const credentials = useCredentialsByType(CredentialType.ANTHROPIC);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      variableName: defaultValues?.variableName ?? "",
      credentialId: defaultValues?.credentialId ?? "",
      model: defaultValues?.model ?? "claude-3-5-sonnet-latest",
      systemPrompt: defaultValues?.systemPrompt ?? "",
      userPrompt: defaultValues?.userPrompt ?? "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        variableName: defaultValues?.variableName ?? "",
        credentialId: defaultValues?.credentialId ?? "",
        model: defaultValues?.model ?? "claude-3-5-sonnet-latest",
        systemPrompt: defaultValues?.systemPrompt ?? "",
        userPrompt: defaultValues?.userPrompt ?? "",
      });
    }
  }, [open, defaultValues, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Anthropic settings</DialogTitle>
          <DialogDescription>
            Generate text via Anthropic Claude. Prompts support{" "}
            <code className="font-mono">{`{{varName.field}}`}</code> templating.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="anthropic-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="variableName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variable name</FormLabel>
                  <FormControl>
                    <Input placeholder="claudeResponse" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3">
              <FormField
                control={form.control}
                name="credentialId"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Credential</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              credentials.isLoading
                                ? "Loading..."
                                : credentials.data?.length === 0
                                  ? "No Anthropic credentials"
                                  : "Pick a credential"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {credentials.data?.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {credentials.data?.length === 0 ? (
                      <FormDescription>
                        Add one at <code>/credentials/new</code>.
                      </FormDescription>
                    ) : null}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem className="w-56">
                    <FormLabel>Model</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ANTHROPIC_MODELS.map((m) => (
                          <SelectItem key={m} value={m}>
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="systemPrompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>System prompt (optional)</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder="You are a helpful assistant." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="userPrompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User prompt</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={5}
                      placeholder="Summarize {{json googleForm.responses}}"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form="anthropic-form">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
