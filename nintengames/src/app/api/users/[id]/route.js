import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/utils/jwt"; // Asegúrate de que esta función esté definida

const checkAuth = (request) => {
  const token = request.headers.get("authorization")?.split(" ")[1];
  if (!verifyToken(token)) throw new Error("Acceso no autorizado");
};

/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags:
 *       - Usuarios
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Datos del usuario
 *       401:
 *         description: Acceso no autorizado
 */
export async function GET(request, context) {
  try {
    checkAuth(request);
    const { params } = context;
    const user = await prisma.users.findUnique({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json(user);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}

/**
 * @swagger
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Eliminar un usuario por ID
 *     tags:
 *       - Usuarios
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 *       401:
 *         description: Acceso no autorizado
 */
export async function DELETE(request, context) {
  try {
    checkAuth(request);
    const { params } = context;
    const id = parseInt(params.id);

    const user = await prisma.users.delete({
      where: { id },
    });

    return NextResponse.json(user);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}

/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     summary: Actualizar un usuario por ID
 *     tags:
 *       - Usuarios
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a actualizar
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *       401:
 *         description: Acceso no autorizado
 */
export async function PUT(request, context) {
  try {
    checkAuth(request);
    const { params } = context;
    const id = parseInt(params.id);
    const body = await request.json();

    const user = await prisma.users.update({
      where: { id },
      data: {
        fullname: body.fullname,
        email: body.email,
        password: body.password,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
