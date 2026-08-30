import "server-only";
import mongoose from "mongoose";
import { IDS_LECTORES, ESTADOS, PAGINAS_POR_DIA_DEFAULT } from "@/libs/club";

// Avance de UN lector en el libro. Va como subdocumento para que agregar un
// tercer lector algún día no requiera migrar campos con nombre propio.
const avanceSchema = new mongoose.Schema(
  {
    lector: { type: String, enum: IDS_LECTORES, required: true },
    pagina: { type: Number, default: 0, min: 0 },
    actualizadoEn: { type: Date, default: Date.now },
  },
  { _id: false }
);

const resenaSchema = new mongoose.Schema(
  {
    lector: { type: String, enum: IDS_LECTORES, required: true },
    estrellas: { type: Number, min: 1, max: 5, required: true },
    texto: { type: String, default: "", trim: true, maxlength: 2000 },
    creadaEn: { type: Date, default: Date.now },
  },
  { _id: false }
);

const libroSchema = new mongoose.Schema(
  {
    // Id de Google Books. Único para no agregar dos veces el mismo libro.
    googleId: { type: String, required: true, unique: true, trim: true },
    titulo: { type: String, required: true, trim: true },
    autores: { type: [String], default: [] },
    portada: { type: String, default: "" },
    paginas: { type: Number, default: 0, min: 0 },
    anio: { type: String, default: "" },
    sinopsis: { type: String, default: "" },
    enlace: { type: String, default: "" },
    // "google" | "openlibrary" — de dónde salió la ficha, por si algún dato se
    // ve raro y hay que saber a quién culpar.
    fuente: { type: String, default: "" },

    estado: { type: String, enum: ESTADOS, default: "backlog" },
    paginasPorDia: { type: Number, default: PAGINAS_POR_DIA_DEFAULT, min: 1 },

    agregadoPor: { type: String, enum: IDS_LECTORES, required: true },
    empezadoEn: { type: Date, default: null },
    terminadoEn: { type: Date, default: null },

    avances: { type: [avanceSchema], default: [] },
    resenas: { type: [resenaSchema], default: [] },
  },
  { timestamps: true }
);

const Libro = mongoose.models.Libro || mongoose.model("Libro", libroSchema);

export function toLibroDTO(doc) {
  return {
    id: String(doc._id),
    googleId: doc.googleId,
    titulo: doc.titulo,
    autores: doc.autores ?? [],
    portada: doc.portada ?? "",
    paginas: doc.paginas ?? 0,
    anio: doc.anio ?? "",
    sinopsis: doc.sinopsis ?? "",
    enlace: doc.enlace ?? "",
    fuente: doc.fuente ?? "",
    estado: doc.estado ?? "backlog",
    paginasPorDia: doc.paginasPorDia ?? PAGINAS_POR_DIA_DEFAULT,
    agregadoPor: doc.agregadoPor,
    empezadoEn: doc.empezadoEn ? new Date(doc.empezadoEn).toISOString() : null,
    terminadoEn: doc.terminadoEn ? new Date(doc.terminadoEn).toISOString() : null,
    avances: (doc.avances ?? []).map((a) => ({
      lector: a.lector,
      pagina: a.pagina ?? 0,
      actualizadoEn: a.actualizadoEn ? new Date(a.actualizadoEn).toISOString() : null,
    })),
    resenas: (doc.resenas ?? []).map((r) => ({
      lector: r.lector,
      estrellas: r.estrellas,
      texto: r.texto ?? "",
      creadaEn: r.creadaEn ? new Date(r.creadaEn).toISOString() : null,
    })),
    creadoEn: new Date(doc.createdAt).toISOString(),
  };
}

export default Libro;
