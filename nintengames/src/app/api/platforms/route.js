import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma.js";
import { verifyToken } from "../../../utils/jwt.js";

const checkAuth = (request) => {
  const token = request.headers.get("authorization")?.split(" ")[1];
  if (!token) throw new Error("Token no enviado");

  const payload = verifyToken(token);
  if (!payload) throw new Error("Acceso no autorizado");
};

/**
 * @swagger
 * /api/platforms:
 *   get:
 *     summary: Obtener todas las plataformas
 *     tags:
 *       - Platforms
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de plataformas obtenida exitosamente
 *       401:
 *         description: Acceso no autorizado
 */
export async function GET(request) {
  try {
    checkAuth(request);
    const plarform = await prisma.platforms.findMany();

    return NextResponse.json(plarform);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}

/**
 * @swagger
 * /api/platforms:
 *   post:
 *     summary: Crear una nueva plataforma
 *     tags:
 *       - Platforms
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Plataforma creada exitosamente
 *       401:
 *         description: Acceso no autorizado
 */
export async function POST(request) {
  try {
    checkAuth(request);
    let json = await request.json();
    const plarform = await prisma.platforms.create({
      data: {
        name: json.name,
      },
    });
    return NextResponse.json(plarform);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}
