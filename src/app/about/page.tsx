import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <AppShell>
      <PageHeader
        title={`About ${siteConfig.name}`}
        description="The AI-powered Smart Stadium Operating System for FIFA World Cup 2026"
      />

      <div className="prose prose-neutral dark:prose-invert max-w-3xl">
        <p>
          StadiumOS is a production-grade, GenAI-enabled command platform designed to transform
          stadium operations and the tournament experience for fans, organizers, volunteers, and
          venue staff during FIFA World Cup 2026.
        </p>

        <h2>Our Mission</h2>
        <p>
          Leverage Generative AI to improve stadium navigation, crowd management, accessibility,
          transportation, sustainability, multilingual assistance, operational intelligence, and
          real-time decision support — all from a single unified platform.
        </p>

        <h2>Built For</h2>
        <ul>
          <li><strong>Fans</strong> — AI navigation, seating help, food recommendations, match FAQs</li>
          <li><strong>Organizers</strong> — Live dashboards, analytics, and operational intelligence</li>
          <li><strong>Volunteers</strong> — AI-coordinated assignments and shift management</li>
          <li><strong>Stadium Staff</strong> — Crowd intelligence and gate optimization</li>
          <li><strong>Emergency Teams</strong> — AI-generated response plans and incident summaries</li>
          <li><strong>Security Teams</strong> — Real-time alerts and crisis coordination</li>
        </ul>

        <h2>Technology</h2>
        <p>
          Built with Next.js, TypeScript, Tailwind CSS, and OpenAI — engineered to WCAG 2.2 AA
          accessibility standards with enterprise-grade security, performance optimization, and
          test-ready architecture.
        </p>
      </div>
    </AppShell>
  );
}
