"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import BarraAvance from "./BarraAvance";
import Estrellas from "./Estrellas";
import {
  LECTORES,
  ESTADOS,
  ETIQUETA_ESTADO,
  nombreLector,
  estimar,
  textoSemanas,
  porcentaje,
  formatearFecha,
} from "@/libs/club";

const COLOR_LECTOR = { fora: "bg-blue", nat: "bg-pink" };

export default function DetalleLibro({ libro, lector, onActualizar, onResenar, onBorrar, onCerrar }) {
  const miAvance = libro.avances.find((a) => a.lector === lector)?.pagina ?? 0;
  const miResena = libro.resenas.find((r) => r.lector === lector);

  const [pagina, setPagina] = useState(String(miAvance));
  const [ritmo, setRitmo] = useState(String(libro.paginasPorDia));
  const [totalPaginas, setTotalPaginas] = useState(String(libro.paginas));
  const [estrellas, setEstrellas] = useState(miResena?.estrellas ?? 0);
  const [textoResena, setTextoResena] = useState(miResena?.texto ?? "");
  const [ocupado, setOcupado] = useState(false);
  const [confirmarBorrado, setConfirmarBorrado] = useState(false);

  useEffect(() => {
    const cerrarConEsc = (e) => {
      if (e.key === "Escape") onCerrar();
    };
    document.addEventListener("keydown", cerrarConEsc);
    const anterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", cerrarConEsc);
      document.body.style.overflow = anterior;
    };
  }, [onCerrar]);

  // La estimación se recalcula con lo que el usuario está TECLEANDO, no con lo
  // guardado: así ve el efecto de cambiar el ritmo antes de darle guardar.
  const paginasVista = Number(totalPaginas) || 0;
  const ritmoVista = Number(ritmo) || 0;

  const mia = estimar({
    paginas: paginasVista,
    paginasPorDia: ritmoVista,
    desdePagina: Number(pagina) || 0,
  });

  const paginaMasAtrasada = Math.min(
    ...LECTORES.map((l) =>
      l.id === lector ? Number(pagina) || 0 : (libro.avances.find((a) => a.lector === l.id)?.pagina ?? 0)
    )
  );
  const delClub = estimar({
    paginas: paginasVista,
    paginasPorDia: ritmoVista,
    desdePagina: paginaMasAtrasada,
  });

  const conOcupado = async (fn) => {
    setOcupado(true);
    try {
      await fn();
    } finally {
      setOcupado(false);
    }
  };

  const guardarAvance = () =>
    conOcupado(() =>
      onActualizar(libro.id, {
        avance: { lector, pagina: Number(pagina) || 0 },
        paginasPorDia: Number(ritmo) || 1,
        paginas: Number(totalPaginas) || 0,
      })
    );

  const cambiarEstado = (estado) => conOcupado(() => onActualizar(libro.id, { estado }));

  const guardarResena = () =>
    conOcupado(() => onResenar(libro.id, { lector, estrellas, texto: textoResena }));

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
        aria-label={libro.titulo}
        className="w-full max-w-3xl border-[3px] border-ink bg-polaroid pixel-shadow-lg"
      >
        <header className="flex items-start justify-between gap-3 border-b-[3px] border-ink px-4 py-3">
          <div className="min-w-0">
            <h2 className="font-pixel text-2xl leading-tight text-ink">{libro.titulo}</h2>
            <p className="font-pixel text-lg text-ink/70">
              {libro.autores.join(", ") || "Autor desconocido"}
              {libro.anio && ` · ${libro.anio}`}
            </p>
          </div>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center border-2 border-ink bg-polaroid text-xl leading-none text-ink transition-transform hover:scale-110 active:scale-95"
          >
            ×
          </button>
        </header>

        <div className="max-h-[78vh] overflow-y-auto p-4 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row">
            <div className="mx-auto h-56 w-38 shrink-0 overflow-hidden border-[3px] border-ink bg-ink/10 sm:mx-0">
              {libro.portada ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={libro.portada} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-pixel text-base text-ink/50">
                  SIN PORTADA
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              {/* --- Estado --- */}
              <div className="flex flex-wrap gap-2">
                {ESTADOS.map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => cambiarEstado(e)}
                    disabled={ocupado}
                    className={`cursor-pointer border-2 border-ink px-3 py-1 font-pixel text-base tracking-[0.08em] transition-colors disabled:cursor-wait ${
                      libro.estado === e
                        ? "bg-ink text-polaroid"
                        : "bg-paper text-ink hover:bg-ink/10"
                    }`}
                  >
                    {ETIQUETA_ESTADO[e]}
                  </button>
                ))}
              </div>

              {/* --- Avance de los dos --- */}
              <div className="mt-5 space-y-3">
                {LECTORES.map((l) => {
                  const p =
                    l.id === lector
                      ? Number(pagina) || 0
                      : (libro.avances.find((a) => a.lector === l.id)?.pagina ?? 0);
                  return (
                    <div key={l.id}>
                      <div className="flex items-baseline justify-between font-pixel text-base text-ink/80">
                        <span>
                          {l.nombre}
                          {l.id === lector && <span className="text-pink"> (tú)</span>}
                        </span>
                        <span>
                          pág. {p}
                          {paginasVista ? ` / ${paginasVista}` : ""} ·{" "}
                          {porcentaje(p, paginasVista)}%
                        </span>
                      </div>
                      <BarraAvance pagina={p} paginas={paginasVista} color={COLOR_LECTOR[l.id]} />
                    </div>
                  );
                })}
              </div>

              {/* --- Controles --- */}
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <label className="font-pixel text-base text-ink">
                  ¿En qué página vas?
                  <input
                    type="number"
                    min="0"
                    value={pagina}
                    onChange={(e) => setPagina(e.target.value)}
                    className="no-spinner mt-1 w-full border-2 border-ink bg-paper px-2 py-1 text-xl text-ink outline-none focus:bg-polaroid"
                  />
                </label>
                <label className="font-pixel text-base text-ink">
                  Páginas al día
                  <input
                    type="number"
                    min="1"
                    value={ritmo}
                    onChange={(e) => setRitmo(e.target.value)}
                    className="no-spinner mt-1 w-full border-2 border-ink bg-paper px-2 py-1 text-xl text-ink outline-none focus:bg-polaroid"
                  />
                </label>
                <label className="font-pixel text-base text-ink">
                  Páginas del libro
                  <input
                    type="number"
                    min="0"
                    value={totalPaginas}
                    onChange={(e) => setTotalPaginas(e.target.value)}
                    className="no-spinner mt-1 w-full border-2 border-ink bg-paper px-2 py-1 text-xl text-ink outline-none focus:bg-polaroid"
                  />
                </label>
              </div>

              <button
                type="button"
                onClick={guardarAvance}
                disabled={ocupado}
                className="mt-3 w-full cursor-pointer border-[3px] border-ink bg-pink px-4 py-2 font-pixel text-xl tracking-[0.1em] text-polaroid pixel-shadow-sm transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-wait disabled:opacity-60"
              >
                {ocupado ? "GUARDANDO..." : "GUARDAR AVANCE"}
              </button>
            </div>
          </div>

          {/* --- Calculadora de semanas --- */}
          <section className="mt-6 border-[3px] border-ink bg-paper p-4">
            <h3 className="font-pixel text-xl tracking-[0.1em] text-ink">CUÁNTO FALTA</h3>
            {paginasVista && ritmoVista > 0 ? (
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="border-2 border-ink bg-polaroid p-3">
                  <p className="font-pixel text-base text-ink/70">A ti te faltan</p>
                  <p className="font-pixel text-2xl text-ink">
                    {mia.restantes} páginas · {textoSemanas(mia.semanas, mia.dias)}
                  </p>
                  <p className="font-pixel text-base text-ink/70">
                    acabarías el {formatearFecha(mia.fechaFin)}
                  </p>
                </div>
                <div className="border-2 border-ink bg-polaroid p-3">
                  <p className="font-pixel text-base text-ink/70">
                    El club lo cierra cuando acaban los dos
                  </p>
                  <p className="font-pixel text-2xl text-pink">
                    {textoSemanas(delClub.semanas, delClub.dias)}
                  </p>
                  <p className="font-pixel text-base text-ink/70">
                    o sea el {formatearFecha(delClub.fechaFin)}
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-2 font-pixel text-lg text-ink/60">
                Pon cuántas páginas tiene el libro y cuántas leen al día para calcular.
              </p>
            )}
            <p className="mt-3 font-pixel text-base text-ink/60">
              A {ritmoVista || 0} páginas diarias, leyendo todos los días.
            </p>
          </section>

          {/* --- Sinopsis --- */}
          {libro.sinopsis && (
            <section className="mt-6">
              <h3 className="font-pixel text-xl tracking-[0.1em] text-ink">DE QUÉ VA</h3>
              <p className="mt-2 font-pixel text-lg leading-relaxed text-ink/80">
                {libro.sinopsis}
              </p>
            </section>
          )}

          {/* --- Reseñas --- */}
          <section className="mt-6 border-t-[3px] border-ink pt-5">
            <h3 className="font-pixel text-xl tracking-[0.1em] text-ink">QUÉ NOS PARECIÓ</h3>

            <div className="mt-3 space-y-3">
              {libro.resenas.length === 0 && (
                <p className="font-pixel text-lg text-ink/60">Todavía nadie ha opinado.</p>
              )}
              {libro.resenas.map((r) => (
                <div key={r.lector} className="border-2 border-ink bg-paper p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-pixel text-lg text-ink">{nombreLector(r.lector)}</span>
                    <Estrellas valor={r.estrellas} tamano="text-xl" />
                  </div>
                  {r.texto && (
                    <p className="mt-2 font-pixel text-lg leading-relaxed text-ink/80">
                      {r.texto}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 border-[3px] border-ink bg-polaroid p-3">
              <p className="font-pixel text-lg text-ink">
                Tu nota{miResena && <span className="text-ink/60"> (ya opinaste, puedes cambiarla)</span>}
              </p>
              <div className="mt-2">
                <Estrellas valor={estrellas} onChange={setEstrellas} />
              </div>
              <textarea
                value={textoResena}
                onChange={(e) => setTextoResena(e.target.value)}
                rows={3}
                placeholder="¿Qué te pareció?"
                className="mt-3 w-full resize-y border-2 border-ink bg-paper px-2 py-1 font-pixel text-lg text-ink outline-none placeholder:text-ink/40 focus:bg-polaroid"
              />
              <button
                type="button"
                onClick={guardarResena}
                disabled={ocupado || estrellas === 0}
                className="mt-2 cursor-pointer border-2 border-ink bg-gold px-4 py-1 font-pixel text-lg tracking-[0.08em] text-ink transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {estrellas === 0 ? "PON ESTRELLAS" : "GUARDAR RESEÑA"}
              </button>
            </div>
          </section>

          {/* --- Zona peligrosa --- */}
          <footer className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t-2 border-ink/20 pt-4">
            <p className="font-pixel text-base text-ink/60">
              Lo agregó {nombreLector(libro.agregadoPor)}
              {libro.terminadoEn && ` · terminado el ${formatearFecha(libro.terminadoEn)}`}
            </p>
            {confirmarBorrado ? (
              <span className="flex items-center gap-2">
                <span className="font-pixel text-base text-ink">¿Seguro?</span>
                <button
                  type="button"
                  onClick={() => conOcupado(() => onBorrar(libro.id))}
                  disabled={ocupado}
                  className="cursor-pointer border-2 border-ink bg-pink px-3 py-1 font-pixel text-base text-polaroid disabled:cursor-wait"
                >
                  SÍ, QUITAR
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmarBorrado(false)}
                  className="cursor-pointer border-2 border-ink bg-paper px-3 py-1 font-pixel text-base text-ink"
                >
                  NO
                </button>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmarBorrado(true)}
                className="cursor-pointer font-pixel text-base text-ink/50 underline underline-offset-4 hover:text-pink"
              >
                quitar de la lista
              </button>
            )}
          </footer>
        </div>
      </motion.div>
    </div>
  );
}
