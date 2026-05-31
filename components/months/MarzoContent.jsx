"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function MarzoContent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative flex min-h-[460px] w-full items-center justify-center overflow-hidden bg-[#fbe7ef] border-2 border-ink">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="ramo"
            initial={{ scale: 0.2, opacity: 0, borderRadius: "50%" }}
            animate={{ scale: 1, opacity: 1, borderRadius: "0%" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 z-30"
          >
            <Image
              src="/floresAmarillas.png"
              alt="Flores silvestres"
              fill
              className="object-cover"
              priority
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-md border-2 border-ink bg-polaroid/95 px-4 py-3 text-center pixel-shadow-sm"
            >
              <p className="font-pixel text-xl leading-none text-ink">
                Marzo trae color al campo <span aria-hidden="true">🌸</span>
              </p>
              <p className="font-pixel text-base leading-tight text-ink/80 mt-1">
                como tú a mis días
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isOpen && (
          <motion.div
            key="paquete"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -40 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 cursor-pointer select-none"
            onClick={() => setIsOpen(true)}
          >
            <div className="relative w-72 sm:w-80 md:w-96 border-[3px] border-ink bg-[#fff5fa] pixel-shadow">
              <div className="absolute left-0 right-0 top-1/2 h-3 -translate-y-1/2 bg-pink" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl">
                <span aria-hidden="true">🎀</span>
              </div>

              <div className="flex flex-col items-center gap-3 px-6 pt-8 pb-10">
                <p className="font-pixel text-2xl leading-none tracking-[0.15em] text-ink">
                  PARA TI
                </p>
                <p className="font-pixel text-base leading-tight text-ink/70">
                  marzo florece contigo
                </p>
                <div className="mt-2 flex gap-2 text-xl">
                  <span aria-hidden="true">🌸</span>
                  <span aria-hidden="true">🌷</span>
                  <span aria-hidden="true">🌼</span>
                </div>
              </div>
            </div>

            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="font-pixel text-center text-pink text-base mt-6 tracking-wide"
            >
              Toca para abrir 🎁
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {["🌸", "🌷", "🌼", "✨", "🌸", "🌷"].map((emoji, i) => (
            <motion.span
              key={i}
              className="absolute text-2xl opacity-30"
              style={{
                top: `${[18, 72, 28, 82, 58, 42][i]}%`,
                left: `${[12, 18, 82, 78, 6, 90][i]}%`,
              }}
              animate={{
                y: [0, -12, 0],
                rotate: [0, 10, -10, 0],
                opacity: [0.2, 0.45, 0.2],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.4,
              }}
            >
              {emoji}
            </motion.span>
          ))}
        </div>
      )}
    </div>
  );
}
