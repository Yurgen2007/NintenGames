import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/utils/jwt"; // Asegúrate de que esta función esté definida

const checkAuth = (request) => {
  const token = request.headers.get("authorization")?.split(" ")[1];
  if (!token) throw new Error("Token no enviado");

  const payload = verifyToken(token);
  if (!payload) throw new Error("Acceso no autorizado");
};
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
