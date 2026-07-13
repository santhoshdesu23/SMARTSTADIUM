import Link from "next/link";
import { footerNav, siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-border bg-panel px-4 py-8 md:px-8 md:pl-72">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold">{siteConfig.name}</p>
          <p className="text-sm text-muted-foreground">
            FIFA World Cup 2026 — Smart Stadium Operating System
          </p>
        </div>
        <nav aria-label="Footer navigation">
          <ul className="flex flex-wrap gap-4">
            {footerNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="text-xs text-muted-foreground">v{siteConfig.version}</p>
      </div>
    </footer>
  );
}
