"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function MayoContent() {
  return (
    <div className="relative flex min-h-[460px] w-full items-center justify-center overflow-hidden bg-[#fdeef3] border-2 border-ink">
      <Image
        src="/tulipanes.png"
        alt="Tulipanes"
        fill
        className="object-cover"
        priority
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="absolute bottom-4 left-1/2 z-10 w-[90%] max-w-md -translate-x-1/2 border-2 border-ink bg-polaroid/95 px-4 py-3 text-center pixel-shadow-sm"
      >
        <p className="font-pixel text-xl leading-none text-ink">
          Tulipanes para ti <span aria-hidden="true">🌷</span>
        </p>
        <p className="font-pixel text-base leading-tight text-ink/80 mt-1">
          porque mayo huele a primavera
        </p>
      </motion.div>
    </div>
  );
}
