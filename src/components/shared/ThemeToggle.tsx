"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a placeholder or null on the server/initial client render
    return (
      <Button
        variant="ghost"
        size="sm"
        disabled
        className="w-full justify-start"
        aria-label="Toggle theme"
      >
        <Sun className="h-5 w-5" />
        <span className="group-data-[collapsible=icon]:hidden ml-2">
          Loading Theme...
        </span>
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-full justify-start"
      onClick={toggleTheme}
      aria-label={
        theme === "light" ? "Switch to dark mode" : "Switch to light mode"
      }
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
      <span className="group-data-[collapsible=icon]:hidden ml-2">
        {theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
      </span>
    </Button>
  );
}
