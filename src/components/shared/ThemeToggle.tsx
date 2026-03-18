"use client";

interface ThemeToggleProps {
  isDark: boolean;
  toggle: () => void;
}

export function ThemeToggle({ isDark, toggle }: ThemeToggleProps) {
  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="group flex cursor-pointer items-center gap-1.5"
    >
      {/* Sun */}
      <svg
        className={`h-3.5 w-3.5 text-white transition-opacity duration-300 ${isDark ? "opacity-40" : "opacity-100"}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      </svg>

      {/* Track */}
      <span className="relative flex h-[18px] w-8 items-center rounded-full bg-white/25 p-[2px] transition-colors duration-300">
        <span
          className={`h-[14px] w-[14px] rounded-full bg-white shadow-sm transition-transform duration-300 ${
            isDark ? "translate-x-[14px]" : "translate-x-0"
          }`}
        />
      </span>

      {/* Moon */}
      <svg
        className={`h-3.5 w-3.5 text-white transition-opacity duration-300 ${isDark ? "opacity-100" : "opacity-40"}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
      </svg>
    </button>
  );
}
