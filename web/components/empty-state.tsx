import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  className?: string;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "animate-fade-up rounded-2xl border border-dashed border-border/70 bg-card/70 p-10 text-center shadow-sm backdrop-blur-sm",
        className,
      )}
    >
      <div className="from-primary/15 text-primary mx-auto flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br to-fuchsia-500/10 ring-1 ring-border/60">
        <Icon className="size-7" />
      </div>
      <h3 className="mt-5 text-lg font-semibold tracking-tight">{title}</h3>
      {description ? (
        <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm leading-relaxed">
          {description}
        </p>
      ) : null}
    </div>
  );
}
