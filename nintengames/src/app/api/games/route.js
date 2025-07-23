import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
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
    const games = await prisma.games.findMany();
    return NextResponse.json(games);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}

export async function POST(request) {
  try {
    checkAuth(request);
    const json = await request.json();
    const game = await prisma.games.create({
      data: {
        title: json.title,
        platform_id: json.platform_id,
        category_id: json.category_id,
        cover: json.cover,
        year: new Date(),
      },
    });
    return NextResponse.json(game);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}
