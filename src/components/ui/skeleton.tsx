import { cn } from "@/lib/utils"

interface SkeletonProps {
  /**
   * Custom CSS classes to apply to the skeleton
   */
  className?: string;
  
  /**
   * The width of the skeleton
   */
  width?: string | number;
  
  /**
   * The height of the skeleton
   */
  height?: string | number;
  
  /**
   * Border radius of the skeleton
   */
  radius?: string | number;
  
  /**
   * Whether to show a shimmer effect
   */
  shimmer?: boolean;
  
  /**
   * Whether to use a glass effect
   */
  glass?: boolean;
  
  /**
   * The color variant of the skeleton
   */
  variant?: "default" | "dark" | "light" | "blue";
}

/**
 * Skeleton component for loading states
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <Skeleton height={200} />
 * 
 * // With shimmer effect
 * <Skeleton height={200} shimmer />
 * 
 * // With custom styling
 * <Skeleton height={200} width="100%" radius={8} className="my-4" />
 * ```
 */
export function Skeleton({
  className,
  width,
  height,
  radius = "0.5rem",
  shimmer = true,
  glass = false,
  variant = "default",
  ...props
}: SkeletonProps & React.HTMLAttributes<HTMLDivElement>) {
  // Determine the background color based on variant
  const getVariantClasses = () => {
    switch (variant) {
      case "dark":
        return "bg-gray-800";
      case "light":
        return "bg-gray-200 dark:bg-gray-700";
      case "blue":
        return "bg-pollux-blue/10";
      default:
        return "bg-gray-200/20 dark:bg-gray-700/20";
    }
  };
  
  return (
    <div
      className={cn(
        "relative overflow-hidden",
        shimmer && "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
        glass && "backdrop-blur-sm border border-white/10",
        getVariantClasses(),
        className
      )}
      style={{
        width: width,
        height: height,
        borderRadius: radius,
      }}
      {...props}
      aria-hidden="true"
      role="presentation"
    />
  );
}

/**
 * Skeleton for text content
 */
export function TextSkeleton({
  lines = 1,
  lastLineWidth = "100%",
  lineHeight = "1rem",
  gap = "0.5rem",
  className,
  ...props
}: {
  lines?: number;
  lastLineWidth?: string | number;
  lineHeight?: string | number;
  gap?: string | number;
} & SkeletonProps) {
  return (
    <div className={cn("flex flex-col", className)} style={{ gap }} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={lineHeight}
          width={i === lines - 1 && lines > 1 ? lastLineWidth : "100%"}
          className="rounded-md"
          {...props}
        />
      ))}
    </div>
  );
}

/**
 * Skeleton for card content
 */
export function CardSkeleton({
  className,
  imageHeight = "200px",
  ...props
}: {
  imageHeight?: string | number;
} & SkeletonProps) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      <Skeleton height={imageHeight} className="w-full rounded-lg" {...props} />
      <TextSkeleton lines={1} {...props} />
      <TextSkeleton lines={2} lastLineWidth="60%" {...props} />
    </div>
  );
}

/**
 * Skeleton for avatar or circular content
 */
export function AvatarSkeleton({
  size = "3rem",
  className,
  ...props
}: {
  size?: string | number;
} & SkeletonProps) {
  return (
    <Skeleton
      width={size}
      height={size}
      className={cn("rounded-full", className)}
      {...props}
    />
  );
}

/**
 * Skeleton for a button
 */
export function ButtonSkeleton({
  width = "8rem",
  height = "2.5rem",
  className,
  ...props
}: SkeletonProps) {
  return (
    <Skeleton
      width={width}
      height={height}
      className={cn("rounded-md", className)}
      {...props}
    />
  );
}
