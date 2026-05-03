"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CredentialType } from "@prisma/client";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ── Schema ────────────────────────────────────────────

const baseSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  type: z.nativeEnum(CredentialType),
});

const createSchema = baseSchema.extend({
  value: z.string().min(1, "API key is required"),
});

const updateSchema = baseSchema.extend({
  // Empty string in update mode means "keep existing key"
  value: z.string().optional(),
});

export type CredentialCreateValues = z.infer<typeof createSchema>;
export type CredentialUpdateValues = z.infer<typeof updateSchema>;

// ── Component ─────────────────────────────────────────

type Props =
  | {
      mode: "create";
      onSubmit: (values: CredentialCreateValues) => void | Promise<void>;
      defaultValues?: Partial<CredentialCreateValues>;
      submitLabel?: string;
    }
  | {
      mode: "update";
      onSubmit: (values: CredentialUpdateValues) => void | Promise<void>;
      defaultValues?: Partial<CredentialUpdateValues>;
      submitLabel?: string;
    };

const TYPE_OPTIONS: { value: CredentialType; label: string }[] = [
  { value: "OPENAI", label: "OpenAI" },
  { value: "ANTHROPIC", label: "Anthropic" },
  { value: "GEMINI", label: "Google Gemini" },
];

export function CredentialForm(props: Props) {
  const isCreate = props.mode === "create";

  // We use a discriminated union on the schema, but React Hook Form needs a single
  // generic. The shape is identical at the field level (name/type/value), so we
  // type the form against the wider update schema and let create-mode submit
  // re-validate against createSchema in `onSubmit`.
  const form = useForm<CredentialUpdateValues>({
    resolver: zodResolver(isCreate ? createSchema : updateSchema),
    defaultValues: {
      name: "",
      type: CredentialType.OPENAI,
      value: "",
      ...props.defaultValues,
    },
  });

  const handleSubmit = async (values: CredentialUpdateValues) => {
    if (isCreate) {
      await props.onSubmit(values as CredentialCreateValues);
    } else {
      await props.onSubmit(values);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex max-w-md flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="My OpenAI key" {...field} />
              </FormControl>
              <FormDescription>A label for your reference.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Provider</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>API key</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder={isCreate ? "sk-..." : "Leave empty to keep existing key"}
                  autoComplete="off"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {isCreate
                  ? "Encrypted at rest. Never transmitted in cleartext after this submit."
                  : "Enter a new key only if you want to replace the existing one."}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="self-start"
        >
          {form.formState.isSubmitting
            ? "Saving..."
            : (props.submitLabel ?? (isCreate ? "Create credential" : "Save"))}
        </Button>
      </form>
    </Form>
  );
}
