import connectMongo from "@/libs/mongoose";
import Libro, { toLibroDTO } from "@/models/Libro";
import ClubDeLectura from "@/components/club/ClubDeLectura";

// El avance cambia constantemente: nada de caché estática.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Club de lectura",
  description: "Lo que estamos leyendo",
};

async function cargarLibros() {
  // Si Atlas no responde (o falta MONGODB_URI) la página igual pinta, con la
  // lista vacía y el aviso de error. Mejor eso que un 500 en blanco.
  try {
    await connectMongo();
    const docs = await Libro.find({}).sort({ createdAt: -1 }).lean();
    return { libros: docs.map(toLibroDTO), error: null };
  } catch (e) {
    return { libros: [], error: e.message };
  }
}

export default async function ClubPage() {
  const { libros, error } = await cargarLibros();
  return <ClubDeLectura librosIniciales={libros} errorInicial={error} />;
}
