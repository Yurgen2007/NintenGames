import prisma from "@/lib/prisma";
import { signToken } from "@/utils/jwt";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request) {
  const { email, password } = await request.json();

  const user = await prisma.users.findUnique({ where: { email } });
  if (!user)
    return NextResponse.json(
      { error: "Usuario no encontrado" },
      { status: 401 }
    );

  const valid = await bcrypt.compare(password, user.password);
  if (!valid)
    return NextResponse.json(
      { error: "Contraseña incorrecta" },
      { status: 401 }
    );

  const token = signToken({ id: user.id, email: user.email });
  return NextResponse.json({ token });
}
