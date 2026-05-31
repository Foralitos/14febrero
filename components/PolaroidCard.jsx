"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";

export default function PolaroidCard({ month, onOpen }) {
  const [shaking, setShaking] = useState(false);

  const handleClick = () => {
    if (month.locked) {
      setShaking(true);
      setTimeout(() => setShaking(false), 360);
      return;
    }
    onOpen(month.id);
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      whileHover={month.locked ? {} : { y: -4, rotate: -1 }}
      whileTap={month.locked ? {} : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 320, damping: 20 }}
      aria-label={month.locked ? `${month.name} bloqueado` : `Abrir ${month.name}`}
      className={`group relative flex w-full flex-col items-stretch bg-polaroid pixel-shadow border-[3px] border-ink p-3 pb-5 text-left ${
        month.locked ? "cursor-not-allowed" : "cursor-pointer"
      } ${shaking ? "shake" : ""}`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-2 top-2 font-pixel text-xl leading-none text-gold"
        style={{ letterSpacing: "0.05em" }}
      >
        {month.number}
      </span>

      <span aria-hidden="true" className="absolute left-1.5 top-1.5 h-1.5 w-1.5 bg-ink" />
      <span aria-hidden="true" className="absolute right-1.5 top-1.5 h-1.5 w-1.5 bg-ink" />
      <span aria-hidden="true" className="absolute bottom-9 left-1.5 h-1.5 w-1.5 bg-ink" />
      <span aria-hidden="true" className="absolute bottom-9 right-1.5 h-1.5 w-1.5 bg-ink" />

      <div className="relative aspect-square w-full overflow-hidden border-2 border-ink">
        {month.locked ? (
          <div className="locked-stripes flex h-full w-full items-center justify-center">
            <span className="text-4xl drop-shadow-[2px_2px_0_rgba(0,0,0,0.4)] sm:text-5xl">🔒</span>
          </div>
        ) : (
          <Image
            src={month.image}
            alt={`${month.name} - ${month.flower}`}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-cover"
            priority={month.number === "02"}
          />
        )}
      </div>

      <div className="mt-3 flex flex-col items-center gap-1 text-center font-pixel">
        <span className="text-xl leading-none tracking-[0.15em] text-ink">{month.name}</span>
        <span className="text-base leading-none text-ink/80">{month.flower}</span>
        {!month.locked && (
          <span className="mt-1 text-base leading-none text-pink">
            <span aria-hidden="true">♥ </span>abrir
          </span>
        )}
      </div>
    </motion.button>
  );
}
