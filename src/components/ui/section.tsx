import * as React from "react"
import { cn } from "@/lib/utils"

export type SectionProps = React.HTMLAttributes<HTMLElement>;

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, ...props }, ref) => (
    <section
      ref={ref}
      className={cn("flex flex-col gap-4 py-4", className)}
      {...props}
    />
  )
)
Section.displayName = "Section"
