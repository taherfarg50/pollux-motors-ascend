
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  shimmer = true,
  pulse = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { shimmer?: boolean, pulse?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-md bg-secondary/80", 
        shimmer && "shine",
        pulse && "animate-pulse",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
