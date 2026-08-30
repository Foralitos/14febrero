import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Libro, { toLibroDTO } from "@/models/Libro";
import { IDS_LECTORES, PAGINAS_POR_DIA_DEFAULT } from "@/libs/club";

// La lista cambia cada vez que alguien marca avance: nunca se cachea.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectMongo();
    // Los que se están leyendo primero, luego backlog, al final terminados.
    const libros = await Libro.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ libros: libros.map(toLibroDTO) });
  } catch (e) {
    return NextResponse.json({ error: e.message, libros: [] }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { googleId, titulo, agregadoPor } = body;

    if (!googleId || !titulo) {
      return NextResponse.json({ error: "Falta el libro" }, { status: 400 });
    }
    if (!IDS_LECTORES.includes(agregadoPor)) {
      return NextResponse.json({ error: "Lector inválido" }, { status: 400 });
    }

    await connectMongo();

    const yaEsta = await Libro.findOne({ googleId }).lean();
    if (yaEsta) {
      return NextResponse.json(
        { error: "Ese libro ya está en la lista", libro: toLibroDTO(yaEsta) },
        { status: 409 }
      );
    }

    const libro = await Libro.create({
      googleId,
      titulo,
      autores: Array.isArray(body.autores) ? body.autores : [],
      portada: body.portada ?? "",
      paginas: Number(body.paginas) || 0,
      anio: body.anio ?? "",
      sinopsis: body.sinopsis ?? "",
      enlace: body.enlace ?? "",
      fuente: body.fuente ?? "",
      estado: "backlog",
      paginasPorDia: Number(body.paginasPorDia) || PAGINAS_POR_DIA_DEFAULT,
      agregadoPor,
      // Arrancamos a los dos en cero para que las barras existan desde el día uno.
      avances: IDS_LECTORES.map((lector) => ({ lector, pagina: 0 })),
    });

    return NextResponse.json({ libro: toLibroDTO(libro) }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
