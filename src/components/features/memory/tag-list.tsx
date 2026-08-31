import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TagListProps extends React.HTMLAttributes<HTMLDivElement> {
  tags: string[];
}

export function TagList({ tags, className, ...props }: TagListProps) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-2", className)} {...props}>
      {tags.map((tag) => (
        <Badge key={tag} variant="secondary" className="px-3 py-1 font-normal bg-secondary/15 text-secondary-foreground hover:bg-secondary/25 transition-colors">
          #{tag}
        </Badge>
      ))}
    </div>
  );
}
