import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/utils/jwt";

const checkAuth = (request) => {
  const token = request.headers.get("authorization")?.split(" ")[1];
  if (!token) throw new Error("Token no enviado");

  const payload = verifyToken(token);
  if (!payload) throw new Error("Acceso no autorizado");
};

export async function GET(request, { params }) {
  try {
    checkAuth(request);
    const id = parseInt(params.id);
    const categori = await prisma.categories.findUnique({
      where: { id },
    });
    return NextResponse.json(categori);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}

export async function DELETE(request, { params }) {
  try {
    checkAuth(request);
    const id = parseInt(params.id);
    const categori = await prisma.categories.delete({ where: { id } });
    return NextResponse.json(categori);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}

export async function PUT(request, { params }) {
  try {
    checkAuth(request);
    const id = parseInt(params.id);
    const body = await request.json();
    const categori = await prisma.categories.update({
      where: { id },
      data: { name: body.name },
    });
    return NextResponse.json(categori);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}
