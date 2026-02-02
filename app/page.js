"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [accepted, setAccepted] = useState(false);
  const [noButtonPosition, setNoButtonPosition] = useState({
    top: "50%",
    left: "50%",
  });
  const [attempts, setAttempts] = useState(0);

  const messages = [
    "¿Estás segura?",
    "Piénsalo bien...",
    "No puedes escapar del amor 💕",
    "Dale que sí, no seas así",
    "Última oportunidad...",
    "Sabes que quieres decir que sí 😊",
  ];

  const handleNo = (e) => {
    e.preventDefault();
    setAttempts((prev) => prev + 1);

    // Mover el botón a una posición aleatoria
    const newTop = Math.random() * 80 + 10; // 10% a 90%
    const newLeft = Math.random() * 80 + 10; // 10% a 90%

    setNoButtonPosition({
      top: `${newTop}%`,
      left: `${newLeft}%`,
    });
  };

  const handleYes = () => {
    setAccepted(true);
  };

  return (
    <AnimatePresence mode="wait">
      {accepted ? (
        <motion.div
          key="success"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="relative h-screen w-screen overflow-hidden bg-white"
        >
          {/* Success Image */}
          <Image
            src="/Siimg.png"
            alt="Felicidades"
            fill
            className="object-cover"
            priority
          />

          {/* Success Message */}
          <div className="relative z-10 h-full flex flex-col items-center justify-end pb-12 px-4">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
              className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 max-w-2xl text-center shadow-2xl"
            >
              <motion.h1
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.8,
                  duration: 0.5,
                  type: "spring",
                  bounce: 0.5,
                }}
                className="text-4xl md:text-6xl font-bold text-pink-600 mb-4"
              >
                ¡Felicidades! 🎉
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="text-2xl md:text-3xl text-gray-800 font-semibold"
              >
                Pasarás un San Valentín muy bonito 💕
              </motion.p>
            </motion.div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="question"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="relative h-screen w-screen overflow-hidden bg-white"
        >
          {/* Background Image */}
          <Image
            src="/hero-img.png"
            alt="Hero background"
            fill
            className="object-cover"
            priority
          />

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col items-center justify-end md:justify-center gap-6 px-4 pb-16 md:pb-0">
            <motion.h1
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-3xl md:text-5xl font-bold text-white text-center drop-shadow-2xl"
            >
              ¿Quieres ser mi San Valentín?
            </motion.h1>

            {/* Warning message when trying to click No */}
            <AnimatePresence mode="wait">
              {attempts > 0 && (
                <motion.p
                  key={attempts}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.4 }}
                  className="text-xl md:text-2xl text-white font-semibold drop-shadow-lg"
                >
                  {messages[Math.min(attempts - 1, messages.length - 1)]}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="relative w-full max-w-md h-32"
            >
              {/* Yes Button - stays in place */}
              <motion.button
                onClick={handleYes}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="absolute left-1/2 top-1/2 -translate-x-32 -translate-y-1/2 px-8 py-3 bg-pink-500 hover:bg-pink-600 text-white text-lg font-bold rounded-full shadow-lg transition-colors"
              >
                Sí
              </motion.button>

              {/* No Button - moves around */}
              <motion.button
                onMouseEnter={handleNo}
                onClick={handleNo}
                animate={{
                  top: noButtonPosition.top,
                  left: noButtonPosition.left,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                whileHover={{ scale: 1.05 }}
                className="absolute px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 text-lg font-bold rounded-full shadow-lg"
                style={{
                  transform: "translate(-50%, -50%)",
                }}
              >
                No
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
