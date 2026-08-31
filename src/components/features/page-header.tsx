import * as React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, action, className, ...props }: PageHeaderProps) {
  return (
    <header 
      className={cn("px-6 pt-12 pb-4 sticky top-0 bg-background/80 backdrop-blur-md z-10 flex items-end justify-between", className)}
      {...props}
    >
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        {subtitle && (
          <p className="text-muted-foreground mt-1 text-sm font-medium">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </header>
  );
}
