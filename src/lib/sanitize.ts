import DOMPurify from "isomorphic-dompurify";

const ALLOWED_TAGS = ["b", "i", "em", "strong", "p", "br", "ul", "ol", "li", "code"];

export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR: ["href", "src", "alt", "title"],
    FORBID_ATTR: ["style", "onerror", "onclick", "onload"],
  });
}

export function sanitizeText(input: string): string {
  return input
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .trim()
    .slice(0, 10000);
}

export function sanitizeAiOutput(output: string): string {
  const cleaned = sanitizeText(output);
  return cleaned.replace(/\b(system|assistant|user):\s*/gi, "");
}
