"use client";

import { motion } from "framer-motion";
import BarraAvance from "./BarraAvance";
import { LECTORES, ETIQUETA_ESTADO, estimar, textoSemanas, porcentaje } from "@/libs/club";

const COLOR_ESTADO = {
  backlog: "bg-ink/15 text-ink",
  leyendo: "bg-pink text-polaroid",
  terminado: "bg-green text-polaroid",
};

const COLOR_LECTOR = { fora: "bg-blue", nat: "bg-pink" };

export default function TarjetaLibro({ libro, onAbrir }) {
  // La estimación se hace sobre quien va MÁS ATRÁS: el club termina el libro
  // cuando lo terminan los dos, no cuando lo termina el más rápido.
  const paginaMasAtrasada = Math.min(
    ...LECTORES.map((l) => libro.avances.find((a) => a.lector === l.id)?.pagina ?? 0)
  );
  const { semanas, dias } = estimar({
    paginas: libro.paginas,
    paginasPorDia: libro.paginasPorDia,
    desdePagina: paginaMasAtrasada,
  });

  return (
    <motion.button
      type="button"
      onClick={() => onAbrir(libro.id)}
      whileHover={{ y: -4, rotate: -0.6 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 320, damping: 20 }}
      aria-label={`Abrir ${libro.titulo}`}
      className="group relative flex w-full cursor-pointer flex-col border-[3px] border-ink bg-polaroid p-3 pb-4 text-left pixel-shadow"
    >
      <span
        className={`absolute -top-2 left-3 z-10 border-2 border-ink px-2 py-0.5 font-pixel text-sm tracking-[0.1em] ${COLOR_ESTADO[libro.estado]}`}
      >
        {ETIQUETA_ESTADO[libro.estado]}
      </span>

      <div className="relative mt-2 aspect-[2/3] w-full overflow-hidden border-2 border-ink bg-ink/10">
        {libro.portada ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={libro.portada}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center p-2 text-center font-pixel text-base text-ink/50">
            SIN PORTADA
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-1 flex-col">
        <h3 className="font-pixel text-xl leading-tight text-ink line-clamp-2">
          {libro.titulo}
        </h3>
        <p className="font-pixel text-base text-ink/70 line-clamp-1">
          {libro.autores.join(", ") || "Autor desconocido"}
        </p>

        <div className="mt-3 space-y-1.5">
          {LECTORES.map((lector) => {
            const pagina = libro.avances.find((a) => a.lector === lector.id)?.pagina ?? 0;
            return (
              <div key={lector.id}>
                <div className="flex items-baseline justify-between font-pixel text-sm text-ink/75">
                  <span>{lector.nombre}</span>
                  <span>{porcentaje(pagina, libro.paginas)}%</span>
                </div>
                <BarraAvance
                  pagina={pagina}
                  paginas={libro.paginas}
                  color={COLOR_LECTOR[lector.id]}
                />
              </div>
            );
          })}
        </div>

        <p className="mt-3 font-pixel text-base text-ink/70">
          {libro.estado === "terminado"
            ? "♥ terminado"
            : libro.paginas
              ? `faltan ${textoSemanas(semanas, dias)}`
              : "sin páginas"}
        </p>
      </div>
    </motion.button>
  );
}
