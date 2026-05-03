"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { SlackData } from "./executor";

const schema = z.object({
  variableName: z.string().min(1, "Variable name is required"),
  webhookUrl: z.string().url("Must be a valid URL"),
  text: z.string().min(1, "Message text is required"),
});

type Values = z.infer<typeof schema>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: Partial<SlackData>;
  onSubmit: (values: Values) => void;
};

export function SlackDialog({
  open,
  onOpenChange,
  defaultValues,
  onSubmit,
}: Props) {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      variableName: defaultValues?.variableName ?? "",
      webhookUrl: defaultValues?.webhookUrl ?? "",
      text: defaultValues?.text ?? "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        variableName: defaultValues?.variableName ?? "",
        webhookUrl: defaultValues?.webhookUrl ?? "",
        text: defaultValues?.text ?? "",
      });
    }
  }, [open, defaultValues, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Slack settings</DialogTitle>
          <DialogDescription>
            Posts to a Slack incoming webhook URL.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id="slack-form"
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
                    <Input placeholder="slackPost" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="webhookUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Webhook URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://hooks.slack.com/services/..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message text</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={5}
                      placeholder="New entry: {{aiResponse.text}}"
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
          <Button type="submit" form="slack-form">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
