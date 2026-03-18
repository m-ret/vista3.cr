"use client";

import { useState, useCallback } from "react";

export function useTheme(defaultMode: "light" | "dark" = "light") {
  const [mode, setMode] = useState<"light" | "dark">(defaultMode);

  const toggle = useCallback(() => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const isDark = mode === "dark";

  return { mode, toggle, isDark };
}
