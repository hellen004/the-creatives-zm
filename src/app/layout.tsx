import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

/** Metropolis — the brand typeface used in the 2026 price guide (SIL OFL / Unlicense). */
const metropolis = localFont({
  variable: "--font-metropolis",
  display: "swap",
  src: [
    { path: "../fonts/metropolis/metropolis-latin-300-normal.woff2", weight: "300", style: "normal" },
    { path: "../fonts/metropolis/metropolis-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/metropolis/metropolis-latin-400-italic.woff2", weight: "400", style: "italic" },
    { path: "../fonts/metropolis/metropolis-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../fonts/metropolis/metropolis-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../fonts/metropolis/metropolis-latin-600-italic.woff2", weight: "600", style: "italic" },
    { path: "../fonts/metropolis/metropolis-latin-700-normal.woff2", weight: "700", style: "normal" },
    { path: "../fonts/metropolis/metropolis-latin-700-italic.woff2", weight: "700", style: "italic" },
    { path: "../fonts/metropolis/metropolis-latin-800-normal.woff2", weight: "800", style: "normal" },
  ],
});

export const metadata: Metadata = {
  title: "The Creatives zm — Photography in Lusaka, Zambia",
  description:
    "Class | Style | Elegance. Wedding, traditional ceremony, graduation, birthday and studio photography in Lusaka. View the 2026 packages and book online.",
};

export const viewport: Viewport = {
  themeColor: "#581268",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${metropolis.variable} antialiased`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
