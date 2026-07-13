import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-lg bg-muted/50", className)}
      aria-hidden="true"
      {...props}
    />
  );
}

export { Skeleton };
