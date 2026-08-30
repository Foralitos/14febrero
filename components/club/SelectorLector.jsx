"use client";

import { motion } from "framer-motion";
import { LECTORES } from "@/libs/club";

// No hay contraseñas: el club es de dos personas y un login mataría la vibra.
// Solo hace falta saber a quién le pertenece el avance que se está marcando.
export default function SelectorLector({ onElegir }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
        className="w-full max-w-md border-[3px] border-ink bg-polaroid p-6 pixel-shadow-lg text-center"
      >
        <h2 className="font-pixel text-3xl tracking-[0.1em] text-ink">¿QUIÉN ERES?</h2>
        <p className="mt-2 font-pixel text-lg text-ink/70">
          Para saber de quién es el avance
        </p>

        <div className="mt-6 grid grid-cols-2 gap-4">
          {LECTORES.map((lector) => (
            <button
              key={lector.id}
              type="button"
              onClick={() => onElegir(lector.id)}
              className="cursor-pointer border-[3px] border-ink bg-paper px-4 py-6 font-pixel text-2xl tracking-[0.1em] text-ink pixel-shadow transition-transform hover:-translate-y-1 hover:bg-pink hover:text-polaroid active:translate-y-0"
            >
              {lector.nombre}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
