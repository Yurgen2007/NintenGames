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
    return NextResponse.json(await prisma.categories.findMany());
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}

export async function POST(request) {
  try {
    checkAuth(request);
    return NextResponse.json(
      await prisma.categories.create({ data: await request.json() })
    );
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}
