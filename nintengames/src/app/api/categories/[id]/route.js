import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma.js";
import { verifyToken } from "../../../../utils/jwt.js";

const checkAuth = (request) => {
  const token = request.headers.get("authorization")?.split(" ")[1];
  if (!token) throw new Error("Token no enviado");

  const payload = verifyToken(token);
  if (!payload) throw new Error("Acceso no autorizado");
};

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Obtener una categoría por su ID
 *     tags: [Categories]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la categoría
 *     responses:
 *       200:
 *         description: Categoría encontrada
 *       401:
 *         description: No autorizado
 */
export async function GET(request, { params }) {
  try {
    checkAuth(request);
    const id = parseInt(params.id);
    const categori = await prisma.categories.findUnique({
      where: { id },
    });
    return NextResponse.json(categori);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Eliminar una categoría por ID
 *     tags: [Categories]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoría eliminada
 *       401:
 *         description: No autorizado
 */
export async function DELETE(request, { params }) {
  try {
    checkAuth(request);
    const id = parseInt(params.id);
    const categori = await prisma.categories.delete({ where: { id } });
    return NextResponse.json(categori);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Actualizar una categoría por ID
 *     tags: [Categories]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
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
 *         description: Categoría actualizada
 *       401:
 *         description: No autorizado
 */
export async function PUT(request, { params }) {
  try {
    checkAuth(request);
    const id = parseInt(params.id);
    const body = await request.json();
    const categori = await prisma.categories.update({
      where: { id },
      data: { name: body.name },
    });
    return NextResponse.json(categori);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}
