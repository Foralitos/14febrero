import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Libro, { toLibroDTO } from "@/models/Libro";
import { IDS_LECTORES, ESTADOS } from "@/libs/club";

export const dynamic = "force-dynamic";

export async function PATCH(request, { params }) {
  try {
    // En Next 16 `params` es una promesa.
    const { id } = await params;
    const body = await request.json();

    await connectMongo();
    const libro = await Libro.findById(id);
    if (!libro) {
      return NextResponse.json({ error: "No existe ese libro" }, { status: 404 });
    }

    // --- Avance de un lector ---
    if (body.avance) {
      const { lector, pagina } = body.avance;
      if (!IDS_LECTORES.includes(lector)) {
        return NextResponse.json({ error: "Lector inválido" }, { status: 400 });
      }
      // Se topa en el total de páginas: marcar 900 en un libro de 300 rompería
      // los porcentajes y las estimaciones.
      const tope = libro.paginas || Number.MAX_SAFE_INTEGER;
      const limpia = Math.min(Math.max(Number(pagina) || 0, 0), tope);

      const existente = libro.avances.find((a) => a.lector === lector);
      if (existente) {
        existente.pagina = limpia;
        existente.actualizadoEn = new Date();
      } else {
        libro.avances.push({ lector, pagina: limpia });
      }

      // Marcar avance en un libro que seguía en backlog lo pone "leyendo" solo.
      if (limpia > 0 && libro.estado === "backlog") {
        libro.estado = "leyendo";
        libro.empezadoEn = libro.empezadoEn ?? new Date();
      }
    }

    // --- Estado ---
    if (body.estado) {
      if (!ESTADOS.includes(body.estado)) {
        return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
      }
      libro.estado = body.estado;
      if (body.estado === "leyendo" && !libro.empezadoEn) {
        libro.empezadoEn = new Date();
      }
      if (body.estado === "terminado") {
        libro.terminadoEn = libro.terminadoEn ?? new Date();
        // Terminar el libro empareja a los dos en la última página: si no, la
        // barra se queda a medias en un libro que ya está cerrado.
        if (libro.paginas) {
          libro.avances.forEach((a) => {
            a.pagina = libro.paginas;
          });
        }
      } else {
        libro.terminadoEn = null;
      }
    }

    // --- Ritmo y páginas totales (se corrigen a mano cuando Google no las trae) ---
    if (body.paginasPorDia !== undefined) {
      libro.paginasPorDia = Math.max(Number(body.paginasPorDia) || 1, 1);
    }
    if (body.paginas !== undefined) {
      libro.paginas = Math.max(Number(body.paginas) || 0, 0);
    }

    await libro.save();
    return NextResponse.json({ libro: toLibroDTO(libro) });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await connectMongo();
    const borrado = await Libro.findByIdAndDelete(id);
    if (!borrado) {
      return NextResponse.json({ error: "No existe ese libro" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
