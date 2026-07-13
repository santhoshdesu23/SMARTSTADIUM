import { z } from "zod";

export const aiChatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant", "system"]),
        content: z.string().trim().min(1).max(4000),
      })
    )
    .min(1)
    .max(50),
  assistantType: z.enum([
    "stadium",
    "crowd",
    "sustainability",
    "accessibility",
    "operations",
  ]),
  language: z.string().max(10).optional(),
});

export const contactFormSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(254),
  role: z.enum(["fan", "organizer", "volunteer", "staff", "other"]),
  message: z.string().min(10).max(2000),
});

export type AiChatInput = z.infer<typeof aiChatSchema>;
export type ContactFormInput = z.infer<typeof contactFormSchema>;
