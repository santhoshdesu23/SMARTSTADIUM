"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { getCurrentUser, canAccessDashboard } from "@/lib/auth/session";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    try {
      const user = getCurrentUser();
      const allowed = canAccessDashboard(user, pathname || "/");
      if (!allowed) {
        router.replace("/");
      }
    } catch {
      router.replace("/");
    }
  }, [pathname, router]);

  return <AppShell>{children}</AppShell>;
}
