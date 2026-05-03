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
import type { HttpRequestData } from "./executor";

const schema = z.object({
  variableName: z.string().min(1, "Variable name is required"),
  endpoint: z.string().min(1, "Endpoint URL is required"),
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  body: z.string().default(""),
});

type Values = z.infer<typeof schema>;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: Partial<HttpRequestData>;
  onSubmit: (values: Values) => void;
};

export function HttpRequestDialog({
  open,
  onOpenChange,
  defaultValues,
  onSubmit,
}: Props) {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      variableName: defaultValues?.variableName ?? "",
      endpoint: defaultValues?.endpoint ?? "",
      method: defaultValues?.method ?? "GET",
      body: defaultValues?.body ?? "",
    },
  });

  // Reset on open with current data — needed because the same component instance
  // is reused across opens.
  useEffect(() => {
    if (open) {
      form.reset({
        variableName: defaultValues?.variableName ?? "",
        endpoint: defaultValues?.endpoint ?? "",
        method: defaultValues?.method ?? "GET",
        body: defaultValues?.body ?? "",
      });
    }
  }, [open, defaultValues, form]);

  const method = form.watch("method");
  const showBody = method === "POST" || method === "PUT" || method === "PATCH";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>HTTP Request settings</DialogTitle>
          <DialogDescription>
            Calls any URL. Supports <code className="font-mono">{`{{varName.field}}`}</code> templating in URL and body from upstream node outputs.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            id="http-request-form"
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="variableName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variable name</FormLabel>
                  <FormControl>
                    <Input placeholder="apiResult" {...field} />
                  </FormControl>
                  <FormDescription>
                    Output is stored under this name. Reference it downstream as{" "}
                    <code className="font-mono">{`{{${field.value || "varName"}.httpResponse.data}}`}</code>.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3">
              <FormField
                control={form.control}
                name="method"
                render={({ field }) => (
                  <FormItem className="w-32">
                    <FormLabel>Method</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(["GET", "POST", "PUT", "PATCH", "DELETE"] as const).map(
                          (m) => (
                            <SelectItem key={m} value={m}>
                              {m}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endpoint"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Endpoint URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://api.example.com/users" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {showBody ? (
              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>JSON body</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={6}
                        placeholder='{ "key": "value" }'
                        className="font-mono text-xs"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}
          </form>
        </Form>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form="http-request-form">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
