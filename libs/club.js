// Constantes compartidas del club de lectura. Este archivo lo importan tanto el
// servidor como el cliente, así que NO puede tocar la base de datos ni `server-only`.

export const LECTORES = [
  { id: "fora", nombre: "Fora" },
  { id: "nat", nombre: "Nat" },
];

export const IDS_LECTORES = LECTORES.map((l) => l.id);

export function nombreLector(id) {
  return LECTORES.find((l) => l.id === id)?.nombre ?? id;
}

export const ESTADOS = ["backlog", "leyendo", "terminado"];

export const ETIQUETA_ESTADO = {
  backlog: "POR LEER",
  leyendo: "LEYENDO",
  terminado: "TERMINADO",
};

// Ritmo por defecto cuando se agrega un libro: páginas que se leen al día.
export const PAGINAS_POR_DIA_DEFAULT = 20;

// Cuántas semanas toma un libro a cierto ritmo, y en qué fecha se acaba.
// `desdePagina` permite estimar lo que FALTA, no el libro completo.
export function estimar({ paginas, paginasPorDia, desdePagina = 0 }) {
  const total = Number(paginas) || 0;
  const ritmo = Number(paginasPorDia) || 0;
  const leidas = Math.min(Math.max(Number(desdePagina) || 0, 0), total);
  const restantes = Math.max(total - leidas, 0);

  if (!total || ritmo <= 0) {
    return { dias: null, semanas: null, fechaFin: null, restantes };
  }

  const dias = Math.ceil(restantes / ritmo);
  const semanas = Math.ceil(dias / 7);
  const fechaFin = new Date();
  fechaFin.setHours(0, 0, 0, 0);
  fechaFin.setDate(fechaFin.getDate() + dias);

  return { dias, semanas, fechaFin: fechaFin.toISOString(), restantes };
}

// "3 semanas" / "1 semana" / "menos de una semana"
export function textoSemanas(semanas, dias) {
  if (semanas === null) return "sin datos";
  if (dias !== null && dias <= 6) return "menos de una semana";
  return semanas === 1 ? "1 semana" : `${semanas} semanas`;
}

export function porcentaje(pagina, paginas) {
  const total = Number(paginas) || 0;
  if (!total) return 0;
  return Math.min(Math.round((Number(pagina) / total) * 100), 100);
}

export function formatearFecha(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
