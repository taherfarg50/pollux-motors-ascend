import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  errorMessage?: string;
  icon?: React.ReactNode;
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, errorMessage, icon, label, id, ...props }, ref) => {
    // Always call useId first, then use id prop if provided
    const generatedId = React.useId();
    const inputId = id || generatedId;
    
    return (
      <div className="relative w-full">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium mb-2"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              {icon}
            </div>
          )}
          
          <input
            id={inputId}
            type={type}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              icon && "pl-10",
              error && "border-red-500 focus-visible:ring-red-500",
              className
            )}
            ref={ref}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error && errorMessage ? `${inputId}-error` : undefined}
            {...props}
          />
        </div>
        
        {error && errorMessage && (
          <div 
            id={`${inputId}-error`}
            className="text-red-500 text-xs mt-1"
            aria-live="polite"
          >
            {errorMessage}
          </div>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
