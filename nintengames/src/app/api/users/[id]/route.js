import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/utils/jwt"; // Asegúrate de que esta función esté definida

const checkAuth = (request) => {
  const token = request.headers.get("authorization")?.split(" ")[1];
  if (!verifyToken(token)) throw new Error("Acceso no autorizado");
};

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
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}
