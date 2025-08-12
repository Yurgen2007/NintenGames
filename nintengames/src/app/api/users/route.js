import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import bcrypt from "bcryptjs";
import { verifyToken } from "../../../utils/jwt";

const checkAuth = (request) => {
  const token = request.headers.get("authorization")?.split(" ")[1];
  if (!token) throw new Error("Token no enviado");

  const payload = verifyToken(token);
  if (!payload) throw new Error("Acceso no autorizado");
};

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *       401:
 *         description: Acceso no autorizado
 */
export async function GET(request) {
  try {
    checkAuth(request);
    const user = await prisma.users.findMany();

    return NextResponse.json(user);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags:
 *       - Users
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
 *         description: Usuario creado correctamente
 *       400:
 *         description: Error al crear el usuario
 */
export async function POST(request) {
  const body = await request.json();

  const hashedPassword = await bcrypt.hash(body.password, 10);

  const usuario = await prisma.users.create({
    data: {
      fullname: body.fullname,
      email: body.email,
      password: hashedPassword,
    },
  });

  return NextResponse.json(usuario);
}
