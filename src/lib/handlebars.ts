import Handlebars from "handlebars";

// `{{json someValue}}` → JSON.stringify(someValue) — useful for embedding objects
// from upstream node outputs into prompts/HTTP bodies.
Handlebars.registerHelper("json", (value: unknown) => {
  if (value === undefined) return "";
  return new Handlebars.SafeString(JSON.stringify(value));
});

/**
 * Compile a Handlebars template once and render against `context`.
 * Used by every action node to resolve `{{varName.field}}` placeholders
 * in user-authored prompts, URLs, and JSON bodies.
 */
export function renderTemplate(
  template: string,
  context: Record<string, unknown>,
): string {
  return Handlebars.compile(template, { noEscape: false })(context);
}

/**
 * Like `renderTemplate` but bypasses HTML entity escaping.
 * Discord and Slack want raw UTF-8, not `&quot;` / `&amp;`.
 */
export function renderTemplateRaw(
  template: string,
  context: Record<string, unknown>,
): string {
  return Handlebars.compile(template, { noEscape: true })(context);
}
