// app/api/games/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/utils/jwt";

// Validación del token
const checkAuth = async (request) => {
  const { authorization } = Object.fromEntries(request.headers);
  const token = authorization?.split(" ")[1];
  if (!token) throw new Error("Token no enviado");

  const payload = verifyToken(token);
  if (!payload) throw new Error("Acceso no autorizado");
};

export async function GET(request) {
  try {
    await checkAuth(request);
    const games = await prisma.games.findMany();
    return NextResponse.json(games);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}

export async function POST(request) {
  try {
    await checkAuth(request);

    const body = await request.json();

    const game = await prisma.games.create({
      data: {
        title: body.title,
        platform_id: parseInt(body.platform_id),
        category_id: parseInt(body.category_id),
        year: new Date(parseInt(body.year), 0),
        cover: body.cover, // es una URL tipo "/uploads/archivo.png"
      },
    });

    return NextResponse.json(game);
  } catch (e) {
    console.error("Error en POST /api/games:", e);
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}
