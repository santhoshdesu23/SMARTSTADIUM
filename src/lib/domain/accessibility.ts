export interface AccessibilityService {
  title: string;
  desc: string;
  status: string;
}

export function getAccessibilityServices(): AccessibilityService[] {
  return [
    { title: "Wheelchair Routes", desc: "Elevator-accessible paths to all sections", status: "Available" },
    { title: "Audio Description", desc: "Live commentary at Sections 112, 214, 318", status: "Active" },
    { title: "Visual Assistance", desc: "High-contrast mode and screen reader optimized", status: "Enabled" },
    { title: "Sign Language", desc: "Interpreter services at Accessibility Desk", status: "On Request" },
    { title: "Speech-to-Text", desc: "Live captioning for announcements", status: "Active" },
    { title: "Text-to-Speech", desc: "AI reads navigation and match info aloud", status: "Available" },
  ];
}

export function getAccessibleSeatingMap(): string[] {
  return [
    "Section 112 — Rows 1-4 (Companion)",
    "Section 214 — Rows 1-4 (Wheelchair)",
    "Section 318 — Rows 1-6 (Mixed)",
    "VIP Lounge — Full Access",
  ];
}
