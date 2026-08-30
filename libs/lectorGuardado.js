"use client";

import { useSyncExternalStore } from "react";
import { IDS_LECTORES } from "./club";

// Quién eres vive en localStorage. React 19 / Next 16 prohíben leerlo con un
// `useEffect` que haga setState (el compilador lo marca como error: dispara
// renders en cascada). El patrón correcto es tratar a localStorage como lo que
// es —un sistema externo— y suscribirse a él con `useSyncExternalStore`.

const CLAVE = "club-lector";

const suscriptores = new Set();

function suscribir(callback) {
  suscriptores.add(callback);
  // `storage` avisa de cambios hechos en OTRA pestaña; los de esta los emitimos
  // nosotros en `guardarLector`.
  window.addEventListener("storage", callback);
  return () => {
    suscriptores.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function leer() {
  const valor = localStorage.getItem(CLAVE);
  return valor && IDS_LECTORES.includes(valor) ? valor : null;
}

// En el servidor no hay localStorage: nadie está identificado todavía.
const leerEnServidor = () => null;

export function guardarLector(id) {
  if (id) localStorage.setItem(CLAVE, id);
  else localStorage.removeItem(CLAVE);
  suscriptores.forEach((cb) => cb());
}

export function useLector() {
  return useSyncExternalStore(suscribir, leer, leerEnServidor);
}

// El HTML del servidor no puede saber quién eres, así que el selector no debe
// pintarse hasta que el navegador tome el control. Sin esto, aparecería un
// instante en cada carga aunque ya estuvieras identificado.
const sinCambios = () => () => {};

export function useHidratado() {
  return useSyncExternalStore(
    sinCambios,
    () => true,
    () => false
  );
}
