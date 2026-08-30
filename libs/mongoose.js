import mongoose from "mongoose";

// Conexión única a MongoDB Atlas, cacheada en `globalThis`. En serverless cada
// invocación puede reusar el mismo proceso: sin este caché se abriría una
// conexión nueva por request hasta tumbar el cluster.
//
// La URI se lee DENTRO de la función: si se leyera al importar, un módulo
// cargado antes de que la plataforma inyecte las variables se quedaría con
// `undefined` congelado. Por lo mismo el error se lanza aquí y no en el scope
// del módulo — un throw al importar rompe el build de Next.

const TIMEOUT_SELECCION_MS = 8000;

let cached = globalThis._mongoose;
if (!cached) cached = globalThis._mongoose = { conn: null, promise: null };

export default async function connectMongo() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error("Falta la variable de entorno MONGODB_URI");
  }
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
        serverSelectionTimeoutMS: TIMEOUT_SELECCION_MS,
      })
      // Sin este catch, una promesa RECHAZADA se quedaría cacheada para siempre
      // y todo request posterior moriría aunque Atlas ya se hubiera recuperado.
      .catch((e) => {
        cached.promise = null;
        throw e;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
