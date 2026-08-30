"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import SelectorLector from "./SelectorLector";
import BuscadorLibros from "./BuscadorLibros";
import TarjetaLibro from "./TarjetaLibro";
import DetalleLibro from "./DetalleLibro";
import { ESTADOS, ETIQUETA_ESTADO, nombreLector } from "@/libs/club";
import { useLector, useHidratado, guardarLector } from "@/libs/lectorGuardado";

// Orden de las pestañas y del listado: lo que se está leyendo va primero.
const ORDEN_ESTADO = { leyendo: 0, backlog: 1, terminado: 2 };

export default function ClubDeLectura({ librosIniciales, errorInicial }) {
  const [libros, setLibros] = useState(librosIniciales);
  const lector = useLector();
  const hidratado = useHidratado();
  const [filtro, setFiltro] = useState("todos");
  const [buscadorAbierto, setBuscadorAbierto] = useState(false);
  const [abiertoId, setAbiertoId] = useState(null);
  const [aviso, setAviso] = useState(errorInicial ? `Error de conexión: ${errorInicial}` : "");

  const agregar = async (libro) => {
    const res = await fetch("/api/club/libros", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...libro, agregadoPor: lector }),
    });
    const data = await res.json();
    if (!res.ok) {
      setAviso(data.error ?? "No se pudo agregar");
      return;
    }
    setLibros((prev) => [data.libro, ...prev]);
    setAviso(`"${data.libro.titulo}" va a la lista`);
  };

  // Las tres mutaciones devuelven el libro ya actualizado: lo cambiamos en su
  // lugar en vez de recargar toda la lista.
  const reemplazar = (actualizado) =>
    setLibros((prev) => prev.map((l) => (l.id === actualizado.id ? actualizado : l)));

  const actualizar = async (id, cambios) => {
    const res = await fetch(`/api/club/libros/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cambios),
    });
    const data = await res.json();
    if (!res.ok) {
      setAviso(data.error ?? "No se pudo guardar");
      return;
    }
    reemplazar(data.libro);
    setAviso("Guardado");
  };

  const resenar = async (id, resena) => {
    const res = await fetch(`/api/club/libros/${id}/resena`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(resena),
    });
    const data = await res.json();
    if (!res.ok) {
      setAviso(data.error ?? "No se pudo guardar la reseña");
      return;
    }
    reemplazar(data.libro);
    setAviso("Reseña guardada");
  };

  const borrar = async (id) => {
    const res = await fetch(`/api/club/libros/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setAviso("No se pudo quitar");
      return;
    }
    setLibros((prev) => prev.filter((l) => l.id !== id));
    setAbiertoId(null);
    setAviso("Fuera de la lista");
  };

  const ordenados = useMemo(
    () =>
      [...libros].sort(
        (a, b) => (ORDEN_ESTADO[a.estado] ?? 9) - (ORDEN_ESTADO[b.estado] ?? 9)
      ),
    [libros]
  );

  const visibles = useMemo(
    () => (filtro === "todos" ? ordenados : ordenados.filter((l) => l.estado === filtro)),
    [ordenados, filtro]
  );

  const abierto = libros.find((l) => l.id === abiertoId) ?? null;
  const yaEnLista = libros.map((l) => l.googleId);

  const conteos = useMemo(() => {
    const base = { todos: libros.length };
    ESTADOS.forEach((e) => {
      base[e] = libros.filter((l) => l.estado === e).length;
    });
    return base;
  }, [libros]);

  // El aviso se borra solo: es un mensaje de "listo", no algo que haya que cerrar.
  useEffect(() => {
    if (!aviso) return;
    const t = setTimeout(() => setAviso(""), 3500);
    return () => clearTimeout(t);
  }, [aviso]);

  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-8 sm:py-14">
      <header className="mx-auto mb-8 max-w-6xl text-center">
        <Link
          href="/"
          className="font-pixel text-lg text-ink/60 underline underline-offset-4 hover:text-pink"
        >
          ← volver a las flores
        </Link>
        <h1 className="mt-3 font-pixel text-5xl leading-none tracking-[0.06em] text-ink sm:text-7xl [text-shadow:3px_3px_0_rgba(0,0,0,0.18)]">
          <span className="inline-block">Club de</span>{" "}
          <span className="inline-block text-pink">lectura</span>
        </h1>
        <p className="mt-4 font-pixel text-xl text-ink/85 sm:text-2xl">
          Lo que estamos leyendo <span className="text-pink">♥</span>
        </p>
        {lector && (
          <button
            type="button"
            onClick={() => guardarLector(null)}
            className="mt-4 inline-block cursor-pointer border-2 border-ink bg-polaroid px-3 py-1 font-pixel text-base text-ink hover:bg-pink hover:text-polaroid"
          >
            leyendo como {nombreLector(lector)} · cambiar
          </button>
        )}
      </header>

      <div className="mx-auto mb-6 flex max-w-6xl flex-wrap items-center justify-center gap-2">
        {["todos", ...ESTADOS].map((e) => (
          <button
            key={e}
            type="button"
            onClick={() => setFiltro(e)}
            className={`cursor-pointer border-2 border-ink px-3 py-1 font-pixel text-lg tracking-[0.08em] transition-colors ${
              filtro === e ? "bg-ink text-polaroid" : "bg-polaroid text-ink hover:bg-ink/10"
            }`}
          >
            {e === "todos" ? "TODOS" : ETIQUETA_ESTADO[e]} ({conteos[e] ?? 0})
          </button>
        ))}
        <button
          type="button"
          onClick={() => setBuscadorAbierto(true)}
          disabled={!lector}
          className="cursor-pointer border-[3px] border-ink bg-pink px-4 py-1 font-pixel text-lg tracking-[0.08em] text-polaroid pixel-shadow-sm transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
        >
          + LIBRO
        </button>
      </div>

      {aviso && (
        <p
          role="status"
          className="mx-auto mb-6 w-fit border-2 border-ink bg-polaroid px-4 py-2 font-pixel text-lg text-ink pixel-shadow-sm"
        >
          {aviso}
        </p>
      )}

      {visibles.length === 0 ? (
        <div className="mx-auto max-w-md border-[3px] border-ink bg-polaroid p-8 text-center pixel-shadow">
          <p className="font-pixel text-2xl text-ink">
            {libros.length === 0 ? "Todavía no hay libros" : "Nada en esta pestaña"}
          </p>
          <p className="mt-2 font-pixel text-lg text-ink/70">
            {libros.length === 0
              ? "Dale a + LIBRO y busca el primero."
              : "Prueba con otro filtro."}
          </p>
        </div>
      ) : (
        <section className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 md:grid-cols-3 lg:grid-cols-4">
          {visibles.map((libro) => (
            <TarjetaLibro key={libro.id} libro={libro} onAbrir={setAbiertoId} />
          ))}
        </section>
      )}

      {hidratado && !lector && <SelectorLector onElegir={guardarLector} />}

      <AnimatePresence>
        {buscadorAbierto && (
          <BuscadorLibros
            key="buscador"
            onAgregar={agregar}
            onCerrar={() => setBuscadorAbierto(false)}
            yaEnLista={yaEnLista}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {abierto && lector && (
          <DetalleLibro
            key={abierto.id}
            libro={abierto}
            lector={lector}
            onActualizar={actualizar}
            onResenar={resenar}
            onBorrar={borrar}
            onCerrar={() => setAbiertoId(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
