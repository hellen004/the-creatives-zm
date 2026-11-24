"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { BRAND } from "@/lib/data";
import { useBooking } from "./booking-context";
import { buttonStyles, cn } from "./ui";

const LINKS = [
  { href: "/#about", label: "About Us" },
  { href: "/#services", label: "Services" },
  { href: "/#portfolio", label: "Portfolio" },
  { href: "/gallery", label: "Gallery" },
  { href: "/#pricing", label: "Pricing" },
  { href: "#contact", label: "Contact Us" }, // the contact footer is on every page
];

export function Navbar() {
  const { openBooking } = useBooking();
  const pathname = usePathname();
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
        <Link href="/" className="group flex items-center gap-2.5" aria-label={`${BRAND.name} — home`}>
          <Image
            src="/images/logo.jpg"
            alt=""
            width={40}
            height={40}
            preload
            className={cn(
              "size-9 rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105 lg:size-10",
              !solid && "ring-1 ring-white/30",
            )}
          />
          <span className={cn("whitespace-nowrap font-serif text-xl tracking-wide transition-colors", solid ? "text-plum-700" : "text-white")}>
            The Creatives <span className={cn("italic", solid ? "text-plum-500" : "text-plum-200")}>zm</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-7 lg:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={pathname === l.href ? "page" : undefined}
                className={cn(
                  "relative text-sm font-medium transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:transition-all hover:after:w-full",
                  pathname === l.href ? "after:w-full" : "after:w-0",
                  solid ? "text-gray-700 after:bg-plum-600 hover:text-plum-700" : "text-white/90 after:bg-white hover:text-white",
                )}
              >
                {l.label}
              </Link>
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
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                aria-current={pathname === l.href ? "page" : undefined}
                className={cn(
                  "block rounded-xl px-4 py-3 font-serif text-lg transition-colors hover:bg-plum-50 hover:text-plum-700",
                  pathname === l.href ? "bg-plum-50 text-plum-700" : "text-charcoal",
                )}
              >
                {l.label}
              </Link>
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
