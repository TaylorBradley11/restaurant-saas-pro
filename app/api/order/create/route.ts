import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: NextRequest) {
  const { items } = await req.json();
  const total = items.reduce((s: number, i: any) => s + i.price, 0);

  const order = await prisma.order.create({
    data: { items, total }
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: items.map((i: any) => ({
      price_data: {
        currency: "usd",
        product_data: { name: i.name },
        unit_amount: Math.round(i.price * 100)
      },
      quantity: 1
    })),
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_URL}/track/${order.id}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/menu`
  });

  return Response.json({ url: session.url });
}
