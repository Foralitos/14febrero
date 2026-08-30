"use client";

import { porcentaje } from "@/libs/club";

// Barra de progreso en bloques, para que combine con el pixel art del resto.
const BLOQUES = 20;

export default function BarraAvance({ pagina, paginas, color = "bg-pink" }) {
  const pct = porcentaje(pagina, paginas);
  const llenos = Math.round((pct / 100) * BLOQUES);

  return (
    <div
      className="flex gap-[2px] border-2 border-ink bg-paper p-[3px]"
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {Array.from({ length: BLOQUES }, (_, i) => (
        <span
          key={i}
          className={`h-3 flex-1 ${i < llenos ? color : "bg-ink/10"}`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
