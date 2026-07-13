import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";

export const metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <AppShell>
      <PageHeader
        title="Privacy Policy"
        description="How StadiumOS protects your data"
      />

      <div className="prose prose-neutral dark:prose-invert max-w-3xl">
        <h2>Data Collection</h2>
        <p>
          StadiumOS collects minimal data necessary for stadium operations. AI chat interactions
          are processed securely and are not stored beyond the active session unless explicitly
          consented.
        </p>

        <h2>Security</h2>
        <p>
          All API endpoints use input validation, output sanitization, and rate limiting.
          No secrets are exposed to the client. AI outputs are sanitized before display.
        </p>

        <h2>Third-Party Services</h2>
        <p>
          When configured, OpenAI API is used for AI responses. API keys are stored exclusively
          in server-side environment variables and never transmitted to the browser.
        </p>

        <h2>Contact</h2>
        <p>
          For privacy inquiries, contact us through the Contact page.
        </p>
      </div>
    </AppShell>
  );
}
