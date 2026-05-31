"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getMonth } from "../app/months";
import FebreroContent from "./months/FebreroContent";
import MarzoContent from "./months/MarzoContent";
import MayoContent from "./months/MayoContent";

function MonthContent({ id }) {
  switch (id) {
    case "febrero":
      return <FebreroContent />;
    case "marzo":
      return <MarzoContent />;
    case "mayo":
      return <MayoContent />;
    default:
      return null;
  }
}

export default function MonthModal({ monthId, onClose }) {
  const month = monthId ? getMonth(monthId) : null;

  useEffect(() => {
    if (!month) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [month, onClose]);

  return (
    <AnimatePresence>
      {month && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <motion.div
            key="panel"
            initial={{ scale: 0.92, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={month.name}
            className="relative w-full max-w-3xl border-[3px] border-ink bg-polaroid pixel-shadow-lg"
          >
            <header className="flex items-center justify-between border-b-[3px] border-ink bg-polaroid px-4 py-2 font-pixel">
              <div className="flex items-baseline gap-3">
                <span className="text-gold text-lg leading-none">{month.number}</span>
                <h2 className="text-2xl leading-none tracking-[0.15em] text-ink">{month.name}</h2>
                <span className="hidden text-base text-ink/70 sm:inline">— {month.flower}</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar"
                className="flex h-8 w-8 items-center justify-center border-2 border-ink bg-polaroid text-xl leading-none text-ink transition-transform hover:scale-110 active:scale-95"
              >
                ×
              </button>
            </header>

            <div className="relative max-h-[80vh] overflow-y-auto p-4 sm:p-6">
              <MonthContent id={month.id} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
