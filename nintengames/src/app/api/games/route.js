import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { verifyToken } from "../../../utils/jwt";

// Validación del token
const checkAuth = async (request) => {
  const { authorization } = Object.fromEntries(request.headers);
  const token = authorization?.split(" ")[1];
  if (!token) throw new Error("Token no enviado");

  const payload = verifyToken(token);
  if (!payload) throw new Error("Acceso no autorizado");
};

/**
 * @swagger
 * /api/games:
 *   get:
 *     summary: Obtener todos los videojuegos
 *     tags:
 *       - Games
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de videojuegos obtenida correctamente
 *       401:
 *         description: Error de autenticación
 */
export async function GET(request) {
  try {
    await checkAuth(request);
    const games = await prisma.games.findMany();
    return NextResponse.json(games);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}

/**
 * @swagger
 * /api/games:
 *   post:
 *     summary: Crear un nuevo videojuego
 *     tags:
 *       - Games
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - platform_id
 *               - category_id
 *               - year
 *               - cover
 *             properties:
 *               title:
 *                 type: string
 *               platform_id:
 *                 type: integer
 *               category_id:
 *                 type: integer
 *               year:
 *                 type: integer
 *               cover:
 *                 type: string
 *                 format: uri
 *     responses:
 *       200:
 *         description: Videojuego creado correctamente
 *       401:
 *         description: Error de autenticación
 */
export async function POST(request) {
  try {
    await checkAuth(request);

    const body = await request.json();

    const game = await prisma.games.create({
      data: {
        title: body.title,
        platform_id: parseInt(body.platform_id),
        category_id: parseInt(body.category_id),
        year: new Date(parseInt(body.year), 0),
        cover: body.cover, // es una URL tipo "/uploads/archivo.png"
      },
    });

    return NextResponse.json(game);
  } catch (e) {
    console.error("Error en POST /api/games:", e);
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}
