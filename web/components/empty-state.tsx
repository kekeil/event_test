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
        "animate-fade-up rounded-xl border border-dashed p-10 text-center",
        className,
      )}
    >
      <div className="bg-muted text-muted-foreground mx-auto flex size-12 items-center justify-center rounded-lg">
        <Icon className="size-6" />
      </div>
      <h3 className="mt-4 text-base font-semibold">{title}</h3>
      {description ? (
        <p className="text-muted-foreground mx-auto mt-1.5 max-w-md text-sm">
          {description}
        </p>
      ) : null}
    </div>
  );
}
