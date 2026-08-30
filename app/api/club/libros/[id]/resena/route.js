import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Libro, { toLibroDTO } from "@/models/Libro";
import { IDS_LECTORES } from "@/libs/club";

export const dynamic = "force-dynamic";

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const { lector, estrellas, texto } = await request.json();

    if (!IDS_LECTORES.includes(lector)) {
      return NextResponse.json({ error: "Lector inválido" }, { status: 400 });
    }
    const nota = Number(estrellas);
    if (!Number.isInteger(nota) || nota < 1 || nota > 5) {
      return NextResponse.json({ error: "La nota va de 1 a 5" }, { status: 400 });
    }

    await connectMongo();
    const libro = await Libro.findById(id);
    if (!libro) {
      return NextResponse.json({ error: "No existe ese libro" }, { status: 404 });
    }

    // Una reseña por lector: volver a mandarla edita la anterior en vez de
    // acumular duplicados.
    const existente = libro.resenas.find((r) => r.lector === lector);
    if (existente) {
      existente.estrellas = nota;
      existente.texto = (texto ?? "").slice(0, 2000);
      existente.creadaEn = new Date();
    } else {
      libro.resenas.push({
        lector,
        estrellas: nota,
        texto: (texto ?? "").slice(0, 2000),
      });
    }

    await libro.save();
    return NextResponse.json({ libro: toLibroDTO(libro) });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
