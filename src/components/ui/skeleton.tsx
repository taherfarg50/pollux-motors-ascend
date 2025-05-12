
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
        shimmer && "shine will-change-opacity",
        pulse && "animate-pulse",
        className
      )}
      style={{ 
        backfaceVisibility: 'hidden', // Performance optimization
        perspective: '1000px',
        transform: 'translateZ(0)' // Force GPU acceleration
      }}
      {...props}
    />
  )
}

export { Skeleton }
