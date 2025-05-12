
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  shimmer = true,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { shimmer?: boolean }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-secondary/80", 
        shimmer && "shine",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
