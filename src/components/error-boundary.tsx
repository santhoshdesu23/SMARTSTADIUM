"use client";

import { unstable_catchError, type ErrorInfo } from "next/error";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { reportError } from "@/lib/observability";

function ErrorFallback(
  _props: object,
  { error, unstable_retry }: ErrorInfo
) {
  reportError(error, "ErrorBoundary");

  return (
    <div
      role="alert"
      className="flex min-h-[400px] flex-col items-center justify-center gap-4 p-8 text-center"
    >
      <AlertTriangle className="h-12 w-12 text-destructive" aria-hidden="true" />
      <h2 className="text-xl font-semibold">Something went wrong</h2>
      <p className="max-w-md text-muted-foreground">
        An unexpected error occurred. Please refresh the page or try again later.
      </p>
      <Button onClick={() => unstable_retry()}>Try again</Button>
    </div>
  );
}

export const ErrorBoundary = unstable_catchError(ErrorFallback);
