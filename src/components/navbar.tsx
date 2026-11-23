"use client";

import { Camera, Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { BRAND } from "@/lib/data";
import { useBooking } from "./booking-context";
import { buttonStyles, cn } from "./ui";

const LINKS = [
  { href: "#about", label: "About Us" },
  { href: "#services", label: "Services" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#pricing", label: "Pricing" },
  { href: "#contact", label: "Contact Us" },
];

export function Navbar() {
  const { openBooking } = useBooking();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const solid = scrolled || open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-300",
        solid ? "bg-white/90 shadow-sm backdrop-blur-md" : "bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8">
        <a href="#top" className="group flex items-center gap-2.5" aria-label={`${BRAND.name} — home`}>
          <span
            className={cn(
              "grid size-9 place-items-center rounded-full border transition-colors",
              solid ? "border-plum-200 bg-plum-600 text-white" : "border-white/40 bg-white/10 text-white",
            )}
          >
            <Camera className="size-4" aria-hidden />
          </span>
          <span className={cn("whitespace-nowrap font-serif text-xl tracking-wide transition-colors", solid ? "text-plum-700" : "text-white")}>
            The Creatives <span className="italic text-gold-500">zm</span>
          </span>
        </a>

        <ul className="hidden items-center gap-8 lg:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className={cn(
                  "relative text-sm font-medium transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-gold-500 after:transition-all hover:after:w-full",
                  solid ? "text-gray-700 hover:text-plum-700" : "text-white/90 hover:text-white",
                )}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <button onClick={() => openBooking()} className={cn(buttonStyles.primary, "px-5 py-2.5")}>
              Book Now
            </button>
          </div>
          <button
            onClick={() => setOpen((o) => !o)}
            className={cn(
              "grid size-10 place-items-center rounded-full transition-colors lg:hidden",
              solid ? "text-plum-700 hover:bg-plum-50" : "text-white hover:bg-white/10",
            )}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 top-16 z-30 bg-plum-950/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setOpen(false)}
        aria-hidden
      />
      <div
        id="mobile-menu"
        className={cn(
          "fixed right-0 top-16 z-40 flex h-[calc(100dvh-4rem)] w-[min(20rem,85vw)] flex-col bg-white shadow-2xl transition-transform duration-300 lg:hidden",
          open ? "translate-x-0" : "translate-x-full",
        )}
        inert={!open}
      >
        <ul className="flex flex-col gap-1 p-4">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-4 py-3 font-serif text-lg text-charcoal transition-colors hover:bg-plum-50 hover:text-plum-700"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-auto space-y-3 border-t border-gray-100 p-4">
          <button
            onClick={() => {
              setOpen(false);
              openBooking();
            }}
            className={cn(buttonStyles.primary, "w-full")}
          >
            Book Now
          </button>
          <a href={`tel:${BRAND.phoneE164}`} className={cn(buttonStyles.secondary, "w-full")}>
            <Phone className="size-4" aria-hidden /> {BRAND.phoneDisplay}
          </a>
        </div>
      </div>
    </header>
  );
}
