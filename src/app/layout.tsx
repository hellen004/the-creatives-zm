import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "The Creatives zm — Photography in Lusaka, Zambia",
  description:
    "Class | Style | Elegance. Wedding, traditional ceremony, graduation, birthday and mobile studio photography in Lusaka. View the 2026 packages and book online.",
};

export const viewport: Viewport = {
  themeColor: "#4a154b",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} antialiased`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
