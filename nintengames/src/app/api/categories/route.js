import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma.js";
import { verifyToken } from "../../../utils/jwt.js";

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Obtener todas las categorías
 *     tags:
 *       - Categorías
 *     responses:
 *       200:
 *         description: Lista de categorías obtenida exitosamente
 *       401:
 *         description: Acceso no autorizado
 */
export async function GET(request) {
  try {
    checkAuth(request);
    return NextResponse.json(await prisma.categories.findMany());
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Crear una nueva categoría
 *     tags:
 *       - Categorías
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *     responses:
 *       200:
 *         description: Categoría creada exitosamente
 *       401:
 *         description: Acceso no autorizado
 */
export async function POST(request) {
  try {
    checkAuth(request);
    return NextResponse.json(
      await prisma.categories.create({ data: await request.json() })
    );
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}

// Función de autenticación
const checkAuth = (request) => {
  const token = request.headers.get("authorization")?.split(" ")[1];
  if (!token) throw new Error("Token no enviado");

  const payload = verifyToken(token);
  if (!payload) throw new Error("Acceso no autorizado");
};
