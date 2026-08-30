"use client";

// Estrellas pixel. Sin `readOnly` es un input: se hace click para calificar.
export default function Estrellas({ valor = 0, onChange, tamano = "text-2xl" }) {
  const editable = typeof onChange === "function";

  return (
    <div className="flex items-center gap-1" role={editable ? "radiogroup" : undefined}>
      {[1, 2, 3, 4, 5].map((n) => {
        const activa = n <= valor;
        const contenido = (
          <span className={`${tamano} leading-none ${activa ? "text-gold" : "text-ink/25"}`}>
            {activa ? "★" : "☆"}
          </span>
        );

        if (!editable) {
          return (
            <span key={n} aria-hidden="true">
              {contenido}
            </span>
          );
        }

        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={valor === n}
            aria-label={`${n} de 5`}
            onClick={() => onChange(n)}
            className="cursor-pointer transition-transform hover:scale-125 active:scale-95"
          >
            {contenido}
          </button>
        );
      })}
    </div>
  );
}
