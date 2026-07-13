import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info" | "outline";
}

const variants: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-primary/15 text-primary border-primary/30",
  success: "bg-success/15 text-success border-success/30",
  warning: "bg-warning/15 text-warning border-warning/30",
  danger:  "bg-destructive/15 text-destructive border-destructive/30",
  info:    "bg-info/15 text-info border-info/30",
  outline: "bg-transparent text-muted-foreground border-border",
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

const STATUS_VARIANT_MAP: Record<string, BadgeProps["variant"]> = {
  normal:       "success",
  open:         "success",
  resolved:     "success",
  completed:    "success",
  low:          "success",
  busy:         "warning",
  restricted:   "warning",
  "in-progress":"warning",
  medium:       "warning",
  active:       "info",
  assigned:     "outline",
  critical:     "danger",
  closed:       "danger",
  high:         "danger",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant={STATUS_VARIANT_MAP[status] ?? "default"}>
      {status.replace(/-/g, " ")}
    </Badge>
  );
}
