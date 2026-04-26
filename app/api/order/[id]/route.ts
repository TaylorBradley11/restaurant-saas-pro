import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({ where: { id: params.id } });
  return Response.json(order);
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { status } = await req.json();
  const order = await prisma.order.update({
    where: { id: params.id },
    data: { status }
  });
  return Response.json(order);
}
