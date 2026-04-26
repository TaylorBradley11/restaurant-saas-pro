import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const items = await prisma.menuItem.findMany({
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }]
  });
  return Response.json(items);
}

export async function POST(req: NextRequest) {
  const { name, description, price, category, emoji, available } = await req.json();

  if (!name || !price || !category) {
    return Response.json({ error: "name, price, and category are required" }, { status: 400 });
  }

  const item = await prisma.menuItem.create({
    data: {
      name,
      description: description || null,
      price: parseFloat(price),
      category,
      emoji: emoji || "🍽️",
      available: available ?? true,
    }
  });

  return Response.json(item);
}
