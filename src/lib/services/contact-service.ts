import { contactFormSchema, type ContactFormInput } from "@/lib/validations/schemas";
import { logEvent } from "@/lib/observability";

import type { z } from "zod";

type FlattenedError = z.inferFlattenedErrors<typeof contactFormSchema>;

export type ContactFormResult =
  | { ok: true; message: string; data: ContactFormInput }
  | { ok: false; error: FlattenedError };

export async function submitContactForm(input: ContactFormInput): Promise<ContactFormResult> {
  const parsed = contactFormSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, error: parsed.error.flatten() };
  }

  // Log non-sensitive fields only
  logEvent("contact.submitted", {
    name: parsed.data.name,
    // Email is considered PII — redact it
    email: "REDACTED",
  });

  return {
    ok: true,
    message: "Message queued for review",
    data: parsed.data,
  };
}
