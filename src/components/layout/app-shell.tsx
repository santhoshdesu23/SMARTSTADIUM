import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { Footer } from "./footer";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to main content
      </a>
      <Sidebar />
      <div className="md:pl-64">
        <Header />
        <main id="main-content" tabIndex={-1} className="min-h-[calc(100vh-8rem)] p-4 md:p-8">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
