import { NextResponse } from "next/server";

// Búsqueda de libros con dos fuentes.
//
// Google Books da la mejor metadata (sinopsis en español, conteo de páginas de
// la edición exacta), PERO sin API key se cae en la cuota anónima compartida de
// Google, que en la práctica vive agotada: devuelve 429 casi siempre.
// Por eso Open Library es el respaldo y no un lujo — es lo que hace que el
// buscador funcione hoy, sin configurar nada. Poniendo GOOGLE_BOOKS_API_KEY
// se usa Google y la calidad de los resultados sube.

const GOOGLE = "https://www.googleapis.com/books/v1/volumes";
const OPENLIB = "https://openlibrary.org/search.json";

// Google entrega las portadas por http:// y en `zoom=1` (miniatura chica).
// Sin https el navegador las bloquea por contenido mixto.
function portadaGoogle(imageLinks) {
  const url = imageLinks?.thumbnail || imageLinks?.smallThumbnail || "";
  if (!url) return "";
  return url.replace(/^http:\/\//, "https://").replace("zoom=1", "zoom=2");
}

function deGoogle(item) {
  const v = item.volumeInfo ?? {};
  return {
    googleId: item.id,
    titulo: v.title ?? "Sin título",
    autores: v.authors ?? [],
    portada: portadaGoogle(v.imageLinks),
    paginas: v.pageCount ?? 0,
    anio: (v.publishedDate ?? "").slice(0, 4),
    sinopsis: v.description ?? "",
    enlace: v.infoLink ?? "",
    fuente: "google",
  };
}

function deOpenLibrary(doc) {
  return {
    // Prefijo `ol:` para que un libro de Open Library nunca choque contra un id
    // de Google en el índice único de la colección.
    googleId: `ol:${doc.key}`,
    titulo: doc.title ?? "Sin título",
    autores: doc.author_name ?? [],
    // `number_of_pages_median` es la mediana entre todas las ediciones: no es
    // exacta para la que tengas en la mano, pero sirve para estimar.
    paginas: doc.number_of_pages_median ?? 0,
    portada: doc.cover_i
      ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
      : "",
    anio: doc.first_publish_year ? String(doc.first_publish_year) : "",
    // El endpoint de búsqueda no trae sinopsis; pedirla costaría un request por
    // resultado. Se queda vacía.
    sinopsis: "",
    enlace: `https://openlibrary.org${doc.key}`,
    fuente: "openlibrary",
  };
}

async function buscarEnGoogle(q) {
  const key = process.env.GOOGLE_BOOKS_API_KEY;
  if (!key) return null; // Sin key ni lo intentamos: sería un 429 seguro.

  const url = new URL(GOOGLE);
  url.searchParams.set("q", q);
  url.searchParams.set("maxResults", "20");
  url.searchParams.set("printType", "books");
  url.searchParams.set("country", "MX");
  url.searchParams.set("key", key);

  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return null;
  const data = await res.json();
  return (data.items ?? []).map(deGoogle);
}

async function buscarEnOpenLibrary(q) {
  const url = new URL(OPENLIB);
  url.searchParams.set("q", q);
  url.searchParams.set("limit", "20");
  url.searchParams.set(
    "fields",
    "key,title,author_name,first_publish_year,number_of_pages_median,cover_i"
  );

  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return null;
  const data = await res.json();
  return (data.docs ?? []).map(deOpenLibrary);
}

export async function GET(request) {
  const q = request.nextUrl.searchParams.get("q")?.trim();
  if (!q) return NextResponse.json({ resultados: [], fuente: null });

  try {
    // Un fallo de Google no debe tumbar la búsqueda: se degrada a Open Library.
    let resultados = await buscarEnGoogle(q).catch(() => null);
    let fuente = "google";

    if (!resultados || resultados.length === 0) {
      resultados = await buscarEnOpenLibrary(q).catch(() => null);
      fuente = "openlibrary";
    }

    if (!resultados) {
      return NextResponse.json(
        { error: "Ninguna de las dos fuentes respondió", resultados: [] },
        { status: 502 }
      );
    }

    return NextResponse.json({ resultados, fuente });
  } catch (e) {
    return NextResponse.json({ error: e.message, resultados: [] }, { status: 502 });
  }
}
