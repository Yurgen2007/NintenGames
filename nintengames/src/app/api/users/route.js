import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { verifyToken } from "@/utils/jwt";

const checkAuth = (request) => {
  const token = request.headers.get("authorization")?.split(" ")[1];
  if (!token) throw new Error("Token no enviado");

  const payload = verifyToken(token);
  if (!payload) throw new Error("Acceso no autorizado");
};

export async function GET(request) {
  try {
    checkAuth(request);
    const user = await prisma.users.findMany();

    return NextResponse.json(user);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}

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
