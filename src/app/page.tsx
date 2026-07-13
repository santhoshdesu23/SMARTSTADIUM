"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Globe,
  Map,
  Shield,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

const features = [
  {
    icon: Bot,
    title: "AI Stadium Assistant",
    description: "Natural language help with navigation, seating, food, and real-time match updates in 8 languages.",
  },
  {
    icon: Users,
    title: "Crowd Intelligence",
    description: "AI-powered congestion prediction, safer route suggestions, and gate optimization for venue staff.",
  },
  {
    icon: Map,
    title: "Smart Navigation",
    description: "Context-aware routing with accessibility-first paths and real-time gate wait times.",
  },
  {
    icon: Shield,
    title: "Emergency Command",
    description: "AI-generated response plans, incident summarization, and real-time crisis coordination.",
  },
  {
    icon: Globe,
    title: "Multilingual Support",
    description: "GenAI responses in English, Spanish, French, German, Portuguese, Arabic, Chinese, and Japanese.",
  },
  {
    icon: Zap,
    title: "Real-Time Operations",
    description: "Live stadium status, volunteer coordination, and operational intelligence dashboards.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to main content
      </a>

      <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-panel px-0">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
              SO
            </div>
            <span className="text-lg font-semibold">{siteConfig.name}</span>
          </Link>
          <nav aria-label="Landing navigation" className="hidden items-center gap-6 md:flex">
            <Link href="/features" className="text-sm text-muted-foreground hover:text-foreground">
              Features
            </Link>
            <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
              About
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/chat">AI Chat</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/command-center">
                Launch Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main id="main-content" tabIndex={-1}>
        {/* Hero */}
        <section className="relative flex min-h-screen items-center justify-center px-4 pt-16">
          {/* Decorative blobs — pointer-events-none, z-0 */}
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
            <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-purple-500/15 blur-3xl" />
          </div>

          {/* Hero content — z-10, CSS fade-in so content is never stuck at opacity:0 */}
          <div className="hero-content relative z-10 mx-auto max-w-5xl text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/40 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-400">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              FIFA World Cup 2026 — GenAI Powered
            </div>

            {/* Headline */}
            <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
              The Smart Stadium
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-sky-300 bg-clip-text text-transparent">
                Operating System
              </span>
            </h1>

            {/* Subheadline */}
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 md:text-xl">
              {siteConfig.description}
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/command-center">
                  Open Command Center
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/chat">Talk to AI Assistant</Link>
              </Button>
            </div>

            {/* Stats row */}
            <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { label: "Stadium Capacity", value: "82,500" },
                { label: "AI Assistants", value: "5" },
                { label: "Languages", value: "8+" },
                { label: "Live Zones", value: "7" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                >
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="mt-1 text-xs text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-24 md:px-8" aria-labelledby="features-heading">
          <div className="mx-auto max-w-7xl">
            <h2 id="features-heading" className="text-center text-3xl font-bold md:text-4xl">
              GenAI-Powered Stadium Operations
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
              Every feature designed to enhance stadium operations and the tournament experience
              for fans, organizers, volunteers, and venue staff.
            </p>

            <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass group rounded-2xl border border-border/50 p-6 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                    <feature.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-24 md:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold">Ready for Match Day?</h2>
            <p className="mt-4 text-muted-foreground">
              Join the next generation of stadium operations powered by Generative AI.
            </p>
            <Button size="lg" className="mt-8" asChild>
              <Link href="/command-center">
                Enter Command Center
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/50 px-4 py-8 text-center text-sm text-muted-foreground">
        <p>{siteConfig.name} — FIFA World Cup 2026 Smart Stadium Platform</p>
      </footer>
    </div>
  );
}
