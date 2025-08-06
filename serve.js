// server.js
const express = require("express");
const next = require("next");
const setupSwagger = require("./swagger");

const port = 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Configurar Swagger
  setupSwagger(server);

  // Resto de rutas Next.js
  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, () => {
    console.log(`> Servidor listo en http://localhost:${port}`);
    console.log(`> Swagger en http://localhost:${port}/document`);
  });
});
