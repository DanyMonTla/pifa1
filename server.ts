// server.ts
import { createServer } from "node:http";
import next from "next";

// Determina si estamos en modo desarrollo o producción
const dev = process.env.NODE_ENV !== "production";

// Instancia la aplicación Next.js
const app = next({ dev });
const handle = app.getRequestHandler();

// Define el puerto que quieras usar
const PORT = 3000;

app.prepare().then(() => {
  // Crea un servidor HTTP normal
  createServer((req, res) => {
    // Next.js se encarga de manejar las rutas y respuestas
    return handle(req, res);
  }).listen(PORT, (err?: Error) => {
    if (err) {
      console.error("Error al iniciar el servidor:", err);
      process.exit(1);
    }
    // Mensaje de confirmación en consola
    console.log(`¡Felicidades! Servidor Next.js + TS escuchando en http://localhost:${PORT}`);
  });
});
