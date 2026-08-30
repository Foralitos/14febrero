"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function BuscadorLibros({ onAgregar, onCerrar, yaEnLista }) {
  const [consulta, setConsulta] = useState("");
  const [resultados, setResultados] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const [error, setError] = useState("");
  const [buscado, setBuscado] = useState(false);
  const [fuente, setFuente] = useState(null);
  // Id del libro que se está guardando, para deshabilitar solo ese botón.
  const [guardando, setGuardando] = useState(null);

  const buscar = async (e) => {
    e.preventDefault();
    const q = consulta.trim();
    if (!q) return;

    setBuscando(true);
    setError("");
    try {
      const res = await fetch(`/api/club/buscar?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Falló la búsqueda");
      setResultados(data.resultados);
      setFuente(data.fuente);
    } catch (err) {
      setError(err.message);
      setResultados([]);
    } finally {
      setBuscando(false);
      setBuscado(true);
    }
  };

  const agregar = async (libro) => {
    setGuardando(libro.googleId);
    try {
      await onAgregar(libro);
    } finally {
      setGuardando(null);
    }
  };

  return (
    <div
      onClick={onCerrar}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm sm:p-8"
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Buscar libros"
        className="w-full max-w-3xl border-[3px] border-ink bg-polaroid pixel-shadow-lg"
      >
        <header className="flex items-center justify-between border-b-[3px] border-ink px-4 py-2">
          <h2 className="font-pixel text-2xl tracking-[0.12em] text-ink">BUSCAR LIBRO</h2>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="flex h-8 w-8 cursor-pointer items-center justify-center border-2 border-ink bg-polaroid text-xl leading-none text-ink transition-transform hover:scale-110 active:scale-95"
          >
            ×
          </button>
        </header>

        <div className="p-4 sm:p-6">
          <form onSubmit={buscar} className="flex gap-2">
            <input
              type="text"
              value={consulta}
              onChange={(e) => setConsulta(e.target.value)}
              placeholder="Título, autor..."
              aria-label="Qué libro buscas"
              className="min-w-0 flex-1 border-[3px] border-ink bg-paper px-3 py-2 font-pixel text-xl text-ink outline-none placeholder:text-ink/40 focus:bg-polaroid"
            />
            <button
              type="submit"
              disabled={buscando}
              className="shrink-0 cursor-pointer border-[3px] border-ink bg-pink px-4 py-2 font-pixel text-xl tracking-[0.1em] text-polaroid pixel-shadow-sm transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-wait disabled:opacity-60"
            >
              {buscando ? "..." : "BUSCAR"}
            </button>
          </form>

          {error && (
            <p className="mt-4 border-2 border-ink bg-pink/15 px-3 py-2 font-pixel text-lg text-ink">
              {error}
            </p>
          )}

          {fuente === "openlibrary" && resultados.length > 0 && (
            <p className="mt-4 border-2 border-ink bg-gold/20 px-3 py-2 font-pixel text-base text-ink">
              Resultados de Open Library. Las páginas son una mediana entre
              ediciones — si tu ejemplar trae otra cifra, corrígela al abrir el libro.
            </p>
          )}

          {buscado && !buscando && resultados.length === 0 && !error && (
            <p className="mt-6 text-center font-pixel text-xl text-ink/60">
              Nada por aquí. Prueba con otras palabras.
            </p>
          )}

          <div className="mt-5 max-h-[55vh] space-y-3 overflow-y-auto pr-1">
            {resultados.map((libro) => {
              const dentro = yaEnLista.includes(libro.googleId);
              return (
                <div
                  key={libro.googleId}
                  className="flex gap-3 border-2 border-ink bg-paper p-3"
                >
                  <div className="h-28 w-20 shrink-0 overflow-hidden border-2 border-ink bg-ink/10">
                    {libro.portada ? (
                      // next/image no aporta aquí: son miniaturas ya optimizadas
                      // de un dominio externo, y si una falla preferimos un
                      // hueco antes que reventar el optimizador.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={libro.portada}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center font-pixel text-xs text-ink/50">
                        SIN
                        <br />
                        PORTADA
                      </div>
                    )}
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div>
                      <h3 className="font-pixel text-xl leading-tight text-ink">
                        {libro.titulo}
                      </h3>
                      <p className="font-pixel text-base text-ink/70">
                        {libro.autores.join(", ") || "Autor desconocido"}
                        {libro.anio && ` · ${libro.anio}`}
                      </p>
                      <p className="font-pixel text-base text-ink/60">
                        {libro.paginas ? `${libro.paginas} páginas` : "páginas: no dice"}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => agregar(libro)}
                      disabled={dentro || guardando === libro.googleId}
                      className="mt-2 w-fit cursor-pointer border-2 border-ink bg-polaroid px-3 py-1 font-pixel text-lg text-ink transition-colors hover:bg-pink hover:text-polaroid disabled:cursor-default disabled:bg-ink/10 disabled:text-ink/50 disabled:hover:bg-ink/10 disabled:hover:text-ink/50"
                    >
                      {dentro
                        ? "YA ESTÁ"
                        : guardando === libro.googleId
                          ? "AGREGANDO..."
                          : "+ AGREGAR"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
