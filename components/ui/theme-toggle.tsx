"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

export interface ThemeToggleProps extends React.HTMLAttributes<HTMLButtonElement> {
  /** Size variant: 'default' for desktop (h-9 w-9), 'mobile' for mobile (h-11 w-11) */
  size?: "default" | "mobile"
}

export function ThemeToggle({ className, size = "default", ...props }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Prevent hydration mismatch by only rendering after client mount
  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Show nothing during SSR/hydration to prevent flash
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "transition-colors",
          size === "mobile" ? "h-11 w-11" : "h-9 w-9",
          className
        )}
        disabled
        aria-label="Loading theme toggle"
      >
        <span className="h-6 w-6" />
      </Button>
    )
  }

  const isLight = theme === "light"
  const toggleTheme = () => {
    setTheme(isLight ? "dark" : "light")
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={cn(
        "transition-colors hover:text-emerald-600",
        size === "mobile" ? "h-11 w-11" : "h-9 w-9",
        className
      )}
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      {...props}
    >
      {isLight ? (
        <Moon className="h-6 w-6" aria-hidden="true" />
      ) : (
        <Sun className="h-6 w-6" aria-hidden="true" />
      )}
    </Button>
  )
}
