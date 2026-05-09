import type { LucideIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
};

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardHeader className="flex flex-col items-center gap-3 text-center">
        <Icon className="text-muted-foreground size-10" />
        <CardTitle className="text-base">{title}</CardTitle>
        {description ? (
          <CardDescription className="max-w-md">{description}</CardDescription>
        ) : null}
      </CardHeader>
      <CardContent />
    </Card>
  );
}
