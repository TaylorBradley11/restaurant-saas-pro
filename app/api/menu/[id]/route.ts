import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const data = await req.json();

  if (data.price !== undefined) data.price = parseFloat(data.price);

  const item = await prisma.menuItem.update({
    where: { id: params.id },
    data
  });

  return Response.json(item);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await prisma.menuItem.delete({ where: { id: params.id } });
  return Response.json({ success: true });
}
