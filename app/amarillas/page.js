"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Amarillas() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-amber-50 flex items-center justify-center">
      <AnimatePresence>
        {/* Flores - aparecen cuando se abre la carta */}
        {isOpen && (
          <motion.div
            key="flores"
            initial={{ scale: 0.2, opacity: 0, borderRadius: "50%" }}
            animate={{ scale: 1, opacity: 1, borderRadius: "0%" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 z-30"
          >
            <Image
              src="/floresAmarillas.png"
              alt="Flores amarillas"
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Carta cerrada */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            key="carta"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -40 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 cursor-pointer select-none"
            onClick={() => setIsOpen(true)}
          >
            {/* Sombra exterior */}
            <div className="drop-shadow-2xl">
              {/* Cuerpo del sobre */}
              <div className="relative w-80 md:w-96 bg-amber-100 border-2 border-amber-300 rounded-b-lg overflow-visible">

                {/* Solapa superior del sobre - animada */}
                <motion.div
                  className="absolute -top-[90px] left-0 w-full h-[90px] origin-bottom z-20"
                  animate={{ rotateX: 0 }}
                  whileHover={{ rotateX: -30 }}
                  transition={{ duration: 0.4 }}
                  style={{ perspective: "600px", transformStyle: "preserve-3d" }}
                >
                  {/* Triángulo de solapa */}
                  <div
                    className="w-full h-full"
                    style={{
                      background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
                      clipPath: "polygon(0 100%, 50% 0, 100% 100%)",
                      borderTop: "2px solid #d97706",
                    }}
                  />
                </motion.div>

                {/* Triángulos laterales del sobre */}
                <div
                  className="absolute top-0 left-0 w-1/2 h-16"
                  style={{
                    background: "linear-gradient(to bottom right, #fde68a, transparent)",
                    clipPath: "polygon(0 0, 100% 0, 0 100%)",
                  }}
                />
                <div
                  className="absolute top-0 right-0 w-1/2 h-16"
                  style={{
                    background: "linear-gradient(to bottom left, #fde68a, transparent)",
                    clipPath: "polygon(0 0, 100% 0, 100% 100%)",
                  }}
                />

                {/* Interior de la carta visible */}
                <div className="relative z-10 pt-6 pb-8 px-6 flex flex-col items-center gap-4 min-h-[200px]">
                  {/* Sello decorativo */}
                  <div className="absolute top-3 right-4 w-10 h-12 border-2 border-amber-400 flex items-center justify-center text-xl bg-white rounded-sm shadow-sm">
                    🌻
                  </div>

                  {/* Línea decorativa */}
                  <div className="w-full flex items-center gap-2 mt-2">
                    <div className="flex-1 h-px bg-amber-300" />
                    <span className="text-amber-500 text-sm">✦</span>
                    <div className="flex-1 h-px bg-amber-300" />
                  </div>

                  {/* Texto de la carta */}
                  <div className="text-center space-y-3 font-serif">
                    <p className="text-amber-800 text-lg font-semibold leading-relaxed">
                      Para ti,
                    </p>
                    <p className="text-amber-700 text-sm leading-relaxed">
                      con todo mi cariño
                    </p>
                    <p className="text-3xl">💛</p>
                  </div>

                  {/* Línea decorativa inferior */}
                  <div className="w-full flex items-center gap-2">
                    <div className="flex-1 h-px bg-amber-300" />
                    <span className="text-amber-500 text-sm">✦</span>
                    <div className="flex-1 h-px bg-amber-300" />
                  </div>
                </div>

                {/* Fondo triangular inferior del sobre */}
                <div
                  className="h-16"
                  style={{
                    background: "linear-gradient(to top, #f59e0b, #fde68a)",
                    clipPath: "polygon(0 0, 50% 100%, 100% 0)",
                  }}
                />
              </div>
            </div>

            {/* Hint de interacción */}
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-center text-amber-600 text-sm mt-6 font-medium tracking-wide"
            >
              Toca para abrir ✉️
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Partículas decorativas de fondo */}
      {!isOpen && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {["🌼", "🌻", "💛", "✨", "🌼", "🌻"].map((emoji, i) => (
            <motion.span
              key={i}
              className="absolute text-2xl opacity-30"
              style={{
                top: `${[15, 75, 25, 85, 60, 40][i]}%`,
                left: `${[10, 15, 85, 80, 5, 92][i]}%`,
              }}
              animate={{
                y: [0, -12, 0],
                rotate: [0, 10, -10, 0],
                opacity: [0.2, 0.4, 0.2],
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
