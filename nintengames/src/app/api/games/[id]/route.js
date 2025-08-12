import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma.js";
import { verifyToken } from "../../../../utils/jwt.js";

// Middleware para verificar el token JWT
const checkAuth = (request) => {
  const token = request.headers.get("authorization")?.split(" ")[1];
  if (!token) throw new Error("Token no enviado");

  const payload = verifyToken(token);
  if (!payload) throw new Error("Acceso no autorizado");
};

/**
 * @swagger
 * /api/games/{id}:
 *   get:
 *     summary: Obtener un videojuego por ID
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del videojuego
 *     responses:
 *       200:
 *         description: Videojuego obtenido correctamente
 *       401:
 *         description: Error de autenticación
 */
export async function GET(request, context) {
  try {
    checkAuth(request);

    const params = await context.params;
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID must be a valid number" },
        { status: 400 }
      );
    }

    const game = await prisma.games.findUnique({
      where: { id },
    });

    return NextResponse.json(game);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}

/**
 * @swagger
 * /api/games/{id}:
 *   delete:
 *     summary: Eliminar un videojuego por ID
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del videojuego
 *     responses:
 *       200:
 *         description: Videojuego eliminado correctamente
 *       401:
 *         description: Error de autenticación
 */
export async function DELETE(request, { params }) {
  try {
    checkAuth(request);
    const id = parseInt(params.id);
    const game = await prisma.games.delete({ where: { id } });
    return NextResponse.json(game);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}

/**
 * @swagger
 * /api/games/{id}:
 *   put:
 *     summary: Actualizar un videojuego por ID
 *     tags: [Games]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del videojuego
 *       - in: formData
 *         name: title
 *         type: string
 *         required: true
 *         description: Título del videojuego
 *       - in: formData
 *         name: platform_id
 *         type: integer
 *         required: true
 *         description: ID de la plataforma
 *       - in: formData
 *         name: category_id
 *         type: integer
 *         required: true
 *         description: ID de la categoría
 *       - in: formData
 *         name: year
 *         type: string
 *         format: date
 *         required: true
 *         description: Año de lanzamiento
 *       - in: formData
 *         name: cover
 *         type: file
 *         required: false
 *         description: Imagen de portada del videojuego
 *     responses:
 *       200:
 *         description: Videojuego actualizado correctamente
 *       401:
 *         description: Error de autenticación
 */
export async function PUT(request, context) {
  try {
    checkAuth(request);

    const { params } = context;
    const id = parseInt(params.id);

    const formData = await request.formData();

    const title = formData.get("title");
    const platform_id = parseInt(formData.get("platform_id"));
    const category_id = parseInt(formData.get("category_id"));
    const yearNum = parseInt(formData.get("year"));
    const year = yearNum ? new Date(yearNum, 0, 1) : null; // 1 de enero del año dado
    const file = formData.get("cover");

    const dataToUpdate = {
      title,
      platform_id,
      category_id,
      year,
    };

    if (file && file.name) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${file.name}`;
      const path = require("path");
      const fs = require("fs");
      const filePath = path.join(process.cwd(), "public/uploads", filename);
      fs.writeFileSync(filePath, buffer);
      dataToUpdate.cover = `/uploads/${filename}`;
    }

    const game = await prisma.games.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json(game);
  } catch (e) {
    console.error(" Error en PUT /api/games/[id]:", e);
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}
