// src/lib/swaggerConfig.js
import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Videojuegos",
      version: "1.0.0",
      description: "Documentación de la API de videojuegos con Swagger",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
      },
    ],
  },
  apis: ["src/app/api/**/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
