"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { contactFormSchema, type ContactFormInput } from "@/lib/validations/schemas";
import { useState } from "react";
import { submitContactForm } from "@/lib/services/contact-service";
import { logEvent, reportError } from "@/lib/observability";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { role: "fan" },
  });

  const onSubmit = async (data: ContactFormInput) => {
    try {
      const result = await submitContactForm(data);
      if (!result.ok) {
        reportError(result.error, "contact-form");
        return;
      }
      logEvent("contact_form_submitted", { role: data.role });
      setSubmitted(true);
      reset();
    } catch (error) {
      reportError(error, "contact-form");
    }
  };

  return (
    <AppShell>
      <PageHeader
        title="Contact Us"
        description="Get in touch with the StadiumOS team"
      />

      <div className="mx-auto max-w-lg">
        {submitted ? (
          <div
            role="status"
            className="rounded-2xl border border-success/30 bg-success/10 p-6 text-center"
          >
            <p className="font-semibold text-success">Message sent successfully!</p>
            <p className="mt-2 text-sm text-muted-foreground">
              We&apos;ll get back to you within 24 hours.
            </p>
            <Button className="mt-4" variant="outline" onClick={() => setSubmitted(false)}>
              Send another message
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                {...register("name")}
                aria-invalid={!!errors.name}
                aria-required="true"
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && (
                <p id="name-error" className="mt-1 text-sm text-destructive" role="alert">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                aria-invalid={!!errors.email}
                aria-required="true"
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-sm text-destructive" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="role" className="mb-1.5 block text-sm font-medium">
                Role
              </label>
              <select
                id="role"
                {...register("role")}
                aria-required="true"
                className="flex h-10 w-full rounded-lg border border-border bg-background/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="fan">Fan</option>
                <option value="organizer">Organizer</option>
                <option value="volunteer">Volunteer</option>
                <option value="staff">Staff</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
                Message
              </label>
              <Textarea
                id="message"
                rows={5}
                {...register("message")}
                aria-invalid={!!errors.message}
                aria-required="true"
                aria-describedby={errors.message ? "message-error" : undefined}
              />
              {errors.message && (
                <p id="message-error" className="mt-1 text-sm text-destructive" role="alert">
                  {errors.message.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </form>
        )}
      </div>
    </AppShell>
  );
}
