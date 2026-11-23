"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_SELECTION, normalizeSelection, type Selection } from "@/lib/pricing";
import { BookingModal } from "./booking-modal";

interface BookingContextValue {
  openBooking: (selection?: Partial<Selection>) => void;
  /** Selection currently shown in the pricing calculator. */
  calculator: Selection;
  setCalculator: (selection: Partial<Selection>) => void;
  /** Loads a package into the calculator and scrolls to it. */
  customize: (selection: Partial<Selection>) => void;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<{ id: number; selection: Selection } | null>(null);

  const openBooking = useCallback((selection?: Partial<Selection>) => {
    setSession((prev) => ({
      id: (prev?.id ?? 0) + 1,
      selection: normalizeSelection({ ...DEFAULT_SELECTION, ...selection }),
    }));
  }, []);

  const [calculator, setCalcState] = useState<Selection>(DEFAULT_SELECTION);
  const setCalculator = useCallback(
    (selection: Partial<Selection>) => setCalcState((prev) => normalizeSelection({ ...prev, ...selection })),
    [],
  );
  const customize = useCallback(
    (selection: Partial<Selection>) => {
      setCalcState(normalizeSelection({ hours: 1, addOns: [], ...selection }));
      document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
    },
    [],
  );

  const value = useMemo(
    () => ({ openBooking, calculator, setCalculator, customize }),
    [openBooking, calculator, setCalculator, customize],
  );

  return (
    <BookingContext.Provider value={value}>
      {children}
      {session && (
        <BookingModal key={session.id} initialSelection={session.selection} onClose={() => setSession(null)} />
      )}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside <BookingProvider>");
  return ctx;
}
