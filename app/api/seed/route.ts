import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const count = await prisma.menuItem.count();
  if (count > 0) return Response.json({ message: "Already seeded", count });

  await prisma.menuItem.createMany({ data: [
    {name:"Spring Roll (3 Pcs)",price:6.00,category:"Appetizers",emoji:"🌯"},
    {name:"Samusa — Fried Stuffed Pastry (2 pcs)",price:6.78,category:"Appetizers",emoji:"🥟",description:"Potato, onion, Indian spices"},
    {name:"Palata — Burmese Style Pancake (2 pcs)",price:7.00,category:"Appetizers",emoji:"🫓"},
    {name:"Chicken Dumpling (5 pcs)",price:5.99,category:"Appetizers",emoji:"🥟",description:"Pan fried"},
    {name:"Tempura Shrimp (3 pcs)",price:5.99,category:"Appetizers",emoji:"🍤"},
    {name:"Vege Tempura",price:12.00,category:"Appetizers",emoji:"🥦"},
    {name:"Fried Tofu (6 pcs)",price:12.00,category:"Appetizers",emoji:"🍽️",description:"House-made chickpea tofu, fried golden and crisp, served with spicy dipping sauce"},
    {name:"Squid Salad",price:8.00,category:"Appetizers",emoji:"🦑"},
    {name:"Seaweed Salad",price:7.50,category:"Appetizers",emoji:"🥗"},
    {name:"Cucumber Salad",price:6.98,category:"Appetizers",emoji:"🥗"},
    {name:"Ma Lar Chicken Feet",price:13.99,category:"Appetizers",emoji:"🍗",description:"Spicy chicken feet"},
    {name:"Pork Intestine",price:15.00,category:"Appetizers",emoji:"🍖",description:"Pork ear, tongue, heart, intestine"},
    {name:"Crispy Pot Sticker",price:6.99,category:"Appetizers",emoji:"🥟"},
    {name:"Forever Love",price:15.95,category:"Special Rolls",emoji:"🍣",description:"Imitation crab, avocado, cream cheese topped with torched salmon, house mayo and teriyaki sauce"},
    {name:"Dragon Roll",price:14.50,category:"Special Rolls",emoji:"🍣",description:"California roll topped with eel and avocado"},
    {name:"Rainbow Roll (Raw)",price:15.95,category:"Special Rolls",emoji:"🌈",description:"California roll topped with salmon, tuna, avocado — raw fish"},
    {name:"Crunchy Roll",price:14.99,category:"Special Rolls",emoji:"🍣",description:"Shrimp, crab, and avocado"},
    {name:"Crazy Shrimp Roll",price:15.50,category:"Special Rolls",emoji:"🍤"},
    {name:"Shrimp Tempura Roll",price:15.98,category:"Special Rolls",emoji:"🍤"},
    {name:"Vegas Roll",price:14.50,category:"Special Rolls",emoji:"🍣"},
    {name:"California Roll",price:8.80,category:"Sushi Rolls",emoji:"🍣",description:"Crab, avocado, cucumber"},
    {name:"Spicy Cali Roll",price:8.80,category:"Sushi Rolls",emoji:"🍣",description:"Spicy California roll"},
    {name:"Spicy Tuna Roll",price:13.50,category:"Sushi Rolls",emoji:"🍣"},
    {name:"Eel Bowl (Unagi)",price:15.00,category:"Sushi Rolls",emoji:"🍱"},
    {name:"Poke Bowl",price:16.97,category:"Bowls",emoji:"🥣",description:"Fresh poke over seasoned rice"},
    {name:"Bulgogi Bowl",price:16.98,category:"Bowls",emoji:"🥩",description:"Korean marinated beef over rice"},
    {name:"Mohinga",price:12.99,category:"Burmese & Asian",emoji:"🍲",description:"Traditional Burmese fish noodle soup"},
    {name:"Nan Gyi Toke",price:13.70,category:"Burmese & Asian",emoji:"🍜",description:"Burmese thick rice noodles"},
    {name:"Laksa",price:14.98,category:"Burmese & Asian",emoji:"🍜",description:"Spicy coconut curry noodle soup"},
    {name:"Beef Soup Noodle",price:14.98,category:"Burmese & Asian",emoji:"🍜"},
    {name:"Pad Thai Chicken",price:12.35,category:"Burmese & Asian",emoji:"🍝"},
    {name:"Chicken Curry",price:13.99,category:"Curry",emoji:"🍛",description:"Burmese style, served with rice"},
    {name:"Pork Curry",price:13.99,category:"Curry",emoji:"🍛",description:"Burmese style, served with rice"},
    {name:"Fish Curry",price:14.99,category:"Curry",emoji:"🍛",description:"Burmese style, served with rice"},
    {name:"Thai Iced Tea",price:4.50,category:"Drinks",emoji:"🧋"},
    {name:"Mango Lassi",price:4.99,category:"Drinks",emoji:"🥭"},
    {name:"Soda",price:2.50,category:"Drinks",emoji:"🥤"},
    {name:"Water",price:1.50,category:"Drinks",emoji:"💧"},
  ]});

  const final = await prisma.menuItem.count();
  return Response.json({ message: "Seeded successfully!", count: final });
}
