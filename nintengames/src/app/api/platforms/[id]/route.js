import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma.js";
import { verifyToken } from "../../../../utils/jwt.js"; // Asegúrate de que esta función esté definida

const checkAuth = (request) => {
  const token = request.headers.get("authorization")?.split(" ")[1];
  if (!token) throw new Error("Token no enviado");

  const payload = verifyToken(token);
  if (!payload) throw new Error("Acceso no autorizado");
};

/**
 * @swagger
 * /api/platforms/{id}:
 *   get:
 *     summary: Obtener una plataforma por ID
 *     tags:
 *       - Platforms
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la plataforma
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Plataforma encontrada
 *       401:
 *         description: No autorizado o error
 */
export async function GET(request, context) {
  try {
    checkAuth(request);
    const { params } = context;
    const platform = await prisma.platforms.findUnique({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json(platform);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}

/**
 * @swagger
 * /api/platforms/{id}:
 *   delete:
 *     summary: Eliminar una plataforma por ID
 *     tags:
 *       - Platforms
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la plataforma a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Plataforma eliminada
 *       401:
 *         description: No autorizado o error
 */
export async function DELETE(request, context) {
  try {
    checkAuth(request);
    const { params } = context;
    const id = parseInt(params.id);

    const platform = await prisma.platforms.delete({
      where: { id },
    });

    return NextResponse.json(platform);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}

/**
 * @swagger
 * /api/platforms/{id}:
 *   put:
 *     summary: Actualizar una plataforma por ID
 *     tags:
 *       - Platforms
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la plataforma a actualizar
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
 *                 example: PlayStation 5
 *     responses:
 *       200:
 *         description: Plataforma actualizada
 *       401:
 *         description: No autorizado o error
 */
export async function PUT(request, context) {
  try {
    checkAuth(request);
    const { params } = context;
    const id = parseInt(params.id);
    const body = await request.json();

    const platform = await prisma.platforms.update({
      where: { id },
      data: {
        name: body.name,
      },
    });

    return NextResponse.json(platform);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}
