import type { Metadata } from "next";
import "./globals.css";
import { CursorWrapper } from "@/components/shared/CursorWrapper";

export const metadata: Metadata = {
  title: "Vista 3 — Design Exploration",
  description:
    "Three distinct creative directions for Vista 3 Architects. A design exploration for the website redesign.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&family=Josefin+Sans:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <CursorWrapper />
        {children}
      </body>
    </html>
  );
}
