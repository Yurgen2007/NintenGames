import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

import { verifyToken } from "@/utils/jwt";

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
    const game = await prisma.games.findUnique({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json(game);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}

export async function DELETE(request, { params }) {
  try {
    checkAuth(request);
    const id = parseInt(params.id);
    const game = await prisma.games.delete({ where: { id } });
    return NextResponse.json(game);
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

    const game = await prisma.games.update({
      where: { id },
      data: {
        title: body.title,
        platform_id: body.platform_id,
        category_id: body.category_id,
        cover: body.cover,
        year: body.year,
      },
    });

    return NextResponse.json(game);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}
