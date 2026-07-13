import type { NavItem } from "@/types";

export const siteConfig = {
  name: "StadiumOS",
  tagline: "AI-Powered Smart Stadium Operating System",
  description:
    "GenAI-enabled command platform for FIFA World Cup 2026 — stadium navigation, crowd intelligence, accessibility, transportation, sustainability, and real-time operations.",
  url: "https://stadiumos.fifa2026.com",
  stadium: "MetLife Stadium",
  match: "USA vs Mexico — Group Stage",
  capacity: 82500,
  version: "1.0.0",
};

export const mainNav: NavItem[] = [
  { label: "Command Center", href: "/command-center", icon: "LayoutDashboard", description: "Live operations overview" },
  { label: "Crowd Intelligence", href: "/crowd", icon: "Users", description: "AI crowd analytics" },
  { label: "Navigation", href: "/navigation", icon: "Map", description: "Smart stadium routing" },
  { label: "Accessibility", href: "/accessibility", icon: "Accessibility", description: "Inclusive fan experience" },
  { label: "Transportation", href: "/transportation", icon: "Bus", description: "Eco-friendly transit hub" },
  { label: "Volunteer Portal", href: "/volunteer", icon: "HeartHandshake", description: "Staff coordination" },
  { label: "Emergency Center", href: "/emergency", icon: "Siren", description: "Crisis response command" },
  { label: "Sustainability", href: "/sustainability", icon: "Leaf", description: "Green operations dashboard" },
  { label: "Analytics", href: "/analytics", icon: "BarChart3", description: "Tournament insights" },
  { label: "AI Assistant", href: "/chat", icon: "Bot", description: "Multilingual AI help" },
];

export const footerNav = [
  { label: "Features", href: "/features" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
];

export const supportedLanguages = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "pt", label: "Português" },
  { code: "ar", label: "العربية" },
  { code: "zh", label: "中文" },
  { code: "ja", label: "日本語" },
];
