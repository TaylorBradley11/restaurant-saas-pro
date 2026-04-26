import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  await prisma.menuItem.deleteMany();

  await prisma.menuItem.createMany({ data: [
    // Appetizers
    {name:"Spring Roll (3 Pcs)",price:6.00,category:"Appetizers",emoji:"🌯"},
    {name:"Samusa — Fried Stuffed Pastry (2 pcs)",price:6.78,category:"Appetizers",emoji:"🥟",description:"Potato, onion, Indian spices"},
    {name:"Palata — Burmese Style Pancake (2 pcs)",price:7.00,category:"Appetizers",emoji:"🫓"},
    {name:"Chicken Dumpling (5 pcs)",price:5.99,category:"Appetizers",emoji:"🥟",description:"Pan fried"},
    {name:"Tempura Shrimp (3 pcs)",price:5.99,category:"Appetizers",emoji:"🍤"},
    {name:"Vege Tempura",price:12.00,category:"Appetizers",emoji:"🥦"},
    {name:"Fried Tofu (6 pcs)",price:12.00,category:"Appetizers",emoji:"🍽️",description:"House-made chickpea tofu, fried golden and crisp, served with spicy dipping sauce"},
    {name:"Squid Salad",price:8.00,category:"Appetizers",emoji:"🦑"},
    {name:"Seaweed Salad",price:7.50,category:"Appetizers",emoji:"🥗"},
    {name:"Chicken Wings",price:12.50,category:"Appetizers",emoji:"🍗"},
    {name:"Ma Lar Chicken Feet",price:13.99,category:"Appetizers",emoji:"🍗",description:"Spicy chicken feet"},
    {name:"Pork Intestine",price:15.00,category:"Appetizers",emoji:"🍖",description:"Pork ear, tongue, heart, intestine"},
    {name:"Crispy Cream Cheese Wonton",price:6.99,category:"Appetizers",emoji:"🥟",description:"Cream cheese, imitation crab, green onions, wrapped and fried"},
    {name:"Crispy Pot Sticker",price:6.99,category:"Appetizers",emoji:"🥟"},
    // Special Rolls
    {name:"Forever Love",price:15.95,category:"Special Rolls",emoji:"🍣",description:"Imitation crab, avocado, cream cheese topped with torched salmon, house mayo and teriyaki sauce"},
    {name:"Dragon Roll",price:14.50,category:"Special Rolls",emoji:"🍣",description:"California roll topped with eel and avocado"},
    {name:"Rainbow Roll (Raw)",price:15.95,category:"Special Rolls",emoji:"🌈",description:"California roll topped with salmon, tuna, avocado — raw fish"},
    {name:"Crunchy Roll",price:14.99,category:"Special Rolls",emoji:"🍣",description:"Shrimp, crab, and avocado topped with spicy crab and crunch"},
    {name:"Caterpillar Roll",price:13.95,category:"Special Rolls",emoji:"🍣",description:"California roll topped with avocado"},
    {name:"Dynamite Roll (Raw)",price:15.97,category:"Special Rolls",emoji:"🍣",description:"Spicy tuna and cucumber topped with spicy crab and crunch"},
    {name:"Tiger Roll (Raw)",price:15.99,category:"Special Rolls",emoji:"🍣",description:"Tempura shrimp, avocado, cucumber topped with spicy tuna"},
    {name:"Salmon Favorite",price:15.95,category:"Special Rolls",emoji:"🍣",description:"Tempura salmon, avocado, cream cheese topped with crunch"},
    {name:"Super Hot 2 Roll",price:15.98,category:"Special Rolls",emoji:"🌶️",description:"Spicy salmon, cucumber topped with fresh salmon, spicy sauce and jalapeno"},
    {name:"Shrimp Lover Roll",price:15.95,category:"Special Rolls",emoji:"🍤",description:"Double steamed shrimp, crab, avocado and cucumber"},
    {name:"Volcano (Baked) Roll",price:15.99,category:"Special Rolls",emoji:"🌋",description:"California roll topped with spicy crab and scallop"},
    {name:"Eel Lover Roll",price:15.99,category:"Special Rolls",emoji:"🍣",description:"California roll topped with eel"},
    {name:"Party Platter",price:45.00,category:"Special Rolls",emoji:"🎉",description:"4 rolls combo sushi, raw and cooked — option for request"},
    // Deep Fried Sushi Rolls
    {name:"Shrimp Tempura Roll",price:15.98,category:"Deep Fried Sushi Rolls",emoji:"🍤",description:"Double shrimp tempura, avocado, crab, cream cheese & crunch"},
    {name:"Crazy Shrimp Roll",price:15.50,category:"Deep Fried Sushi Rolls",emoji:"🍤",description:"Double shrimp tempura, avocado, crab, cucumber, spicy crab & crunch"},
    {name:"Golden California Roll",price:13.50,category:"Deep Fried Sushi Rolls",emoji:"🍣",description:"Lightly battered and deep-fried California roll drizzled with house special sauce"},
    {name:"Golden Spicy Tuna Roll",price:16.50,category:"Deep Fried Sushi Rolls",emoji:"🍣",description:"Lightly battered and deep-fried spicy tuna roll drizzled with spicy mayo sauce"},
    // Fusion Bowls
    {name:"Tuna Bowl",price:16.95,category:"Fusion Bowls",emoji:"🥣",description:"Fresh tuna, crab meat, avocado, spicy tuna on rice with house special sauce"},
    {name:"Salmon Bowl",price:16.50,category:"Fusion Bowls",emoji:"🥣",description:"Fresh salmon, avocado, salad on rice with house special sauce"},
    {name:"Chicken Teriyaki Bowl",price:14.95,category:"Fusion Bowls",emoji:"🍗",description:"Chicken teriyaki, onion, broccoli, bell pepper on rice"},
    {name:"SHA MUU Bowl",price:16.95,category:"Fusion Bowls",emoji:"🥣",description:"Spicy crab, spicy tuna, salmon, cucumber, avocado on sushi rice"},
    {name:"Eel Bowl (Unagi)",price:17.00,category:"Fusion Bowls",emoji:"🍱",description:"Eel, avocado, seaweed salad, masago on rice"},
    {name:"Poke Bowl",price:16.97,category:"Fusion Bowls",emoji:"🥣",description:"Tuna, salmon, spicy crab, avocado, seaweed salad on sushi rice"},
    {name:"Bulgogi",price:16.98,category:"Fusion Bowls",emoji:"🥩",description:"Marinated beef with rice, 4pcs cali, 2pcs fried gyoza with miso soup"},
    // Nigiri
    {name:"Eel Nigiri",price:7.00,category:"Nigiri",emoji:"🍣",description:"Cucumber, avocado, eel"},
    {name:"Smoked Salmon Nigiri",price:6.70,category:"Nigiri",emoji:"🍣"},
    // Regular Rolls
    {name:"California Roll",price:8.80,category:"Regular Rolls",emoji:"🍣"},
    {name:"Spicy Cali Roll",price:8.80,category:"Regular Rolls",emoji:"🍣"},
    {name:"Avocado Roll",price:8.00,category:"Regular Rolls",emoji:"🥑"},
    {name:"Cucumber Roll",price:7.00,category:"Regular Rolls",emoji:"🥒"},
    {name:"Tuna Roll",price:12.50,category:"Regular Rolls",emoji:"🍣"},
    {name:"Salmon Roll",price:12.50,category:"Regular Rolls",emoji:"🍣",description:"Salmon, avocado and cucumber"},
    {name:"Spicy Salmon Roll",price:13.00,category:"Regular Rolls",emoji:"🍣",description:"Spicy salmon, avocado and cucumber"},
    {name:"Spicy Tuna Roll",price:13.00,category:"Regular Rolls",emoji:"🍣",description:"Spicy tuna, avocado cucumber topped with masago"},
    {name:"Philadelphia Roll",price:13.00,category:"Regular Rolls",emoji:"🍣",description:"Cream cheese, salmon, cucumber, avocado"},
    // Bento Box
    {name:"Bulgogi Bento",price:16.98,category:"Bento Box",emoji:"🍱",description:"Marinated beef with rice, 4pcs cali, 2pcs fried gyoza with miso soup"},
    {name:"Shrimp Tempura Bento",price:15.99,category:"Bento Box",emoji:"🍱",description:"5pcs tempura shrimp, 4pcs cali, 2pcs fried gyoza, cucumber salad and white rice"},
    // Fried Rice & Fried Noodle
    {name:"Sricha Fried Glass Noodle",price:14.98,category:"Fried Rice & Noodle",emoji:"🍜",description:"Bell pepper, onion, garlic, broccoli, cauliflower, shrimp, beef or chicken"},
    {name:"Garlic Fried Rice",price:11.95,category:"Fried Rice & Noodle",emoji:"🍚",description:"Garlic, egg, and rice"},
    {name:"Village Fried Rice",price:13.87,category:"Fried Rice & Noodle",emoji:"🍚",description:"Anchovies, garlic, chili, shrimp paste, egg"},
    {name:"Vege Fried Rice",price:12.95,category:"Fried Rice & Noodle",emoji:"🍚",description:"Long bean, carrot, pea, cabbage, onion, and coriander"},
    {name:"Beef Fried Rice",price:13.98,category:"Fried Rice & Noodle",emoji:"🍚",description:"Beef, garlic, egg, cabbage, green onion"},
    {name:"Shrimp Fried Rice",price:14.87,category:"Fried Rice & Noodle",emoji:"🍚",description:"Shrimp, garlic, onion, cabbage, egg"},
    {name:"Pork Belly Fried Rice",price:13.95,category:"Fried Rice & Noodle",emoji:"🍚",description:"Pork belly, cabbage, onion, garlic, egg"},
    {name:"Tea Leaf Rice Salad",price:17.00,category:"Fried Rice & Noodle",emoji:"🥗",description:"Steamed rice tossed with fermented tea leaves, crisp cabbage, tomatoes, and fresh herbs"},
    {name:"Tea Leaf Salad",price:19.98,category:"Fried Rice & Noodle",emoji:"🥗",description:"Fermented tea leaves tossed with fresh cabbage, tomatoes, and herbs"},
    // Noodle Soup & Noodle Salad
    {name:"Pork Belly Shan Noodle Soup",price:13.99,category:"Noodle Soup & Salad",emoji:"🍜",description:"Served with pork, beef, or chicken and rice noodles"},
    {name:"Shan Noodle Toke",price:13.98,category:"Noodle Soup & Salad",emoji:"🍜",description:"Beef, rice noodles, soybean paste, Chinese five spices, garlic"},
    {name:"Nan Gyi Toke",price:13.70,category:"Noodle Soup & Salad",emoji:"🍜",description:"Chicken, udon, marinated with roasted soy bean powder"},
    {name:"Mote Hin Hkar (Fish Noodle Soup)",price:13.99,category:"Noodle Soup & Salad",emoji:"🍲",description:"Fish, fish sauce, besan powder, garlic, onion, lemongrass"},
    {name:"Laksa",price:14.98,category:"Noodle Soup & Salad",emoji:"🍜",description:"Coconut cream, shrimp, chilli, bean sprout, fried tofu, chicken, onion, garlic and noodles"},
    {name:"Tofu Noodle (Vegan)",price:13.50,category:"Noodle Soup & Salad",emoji:"🍜",description:"Besan, rice noodle, Chinese five spices, choose spicy or mild"},
    {name:"Tofu Salad (Vegan)",price:14.00,category:"Noodle Soup & Salad",emoji:"🥗"},
    {name:"Beef Soup Noodle",price:14.98,category:"Noodle Soup & Salad",emoji:"🍜",description:"Mild spicy"},
    {name:"Chicken Soup Noodle",price:13.50,category:"Noodle Soup & Salad",emoji:"🍜",description:"Mild spicy"},
    // Salad & Sides
    {name:"Rice",price:4.98,category:"Salad & Sides",emoji:"🍚"},
    {name:"Miso Soup",price:5.98,category:"Salad & Sides",emoji:"🍵"},
    {name:"Cucumber Salad",price:6.98,category:"Salad & Sides",emoji:"🥗",description:"Sweet & sour taste"},
    // Rice Bowls (Curry)
    {name:"Beef & Potato Curry",price:13.98,category:"Rice Bowls",emoji:"🍛",description:"Gram masala, ginger, onion, garlic, vege oil, potato and beef"},
    {name:"Pork Belly Curry",price:13.98,category:"Rice Bowls",emoji:"🍛",description:"Chinese five spices, potato, soy sauce and pork, served with rice"},
    {name:"Chicken Curry",price:12.99,category:"Rice Bowls",emoji:"🍛",description:"Gram masala, garlic, onion, ginger and chicken, served with rice"},
    // Beverages
    {name:"Coke (Original)",price:3.00,category:"Beverages",emoji:"🥤"},
    {name:"Bubble Ice Coffee",price:5.00,category:"Beverages",emoji:"🧋",description:"20 oz"},
    {name:"Bubble Ice Milk Tea",price:5.00,category:"Beverages",emoji:"🧋",description:"20 oz"},
    {name:"Brown Sugar Milk Tea",price:5.00,category:"Beverages",emoji:"🧋",description:"Non dairy creamer"},
    {name:"Matcha Latte",price:5.00,category:"Beverages",emoji:"🍵",description:"Non dairy creamer"},
    {name:"Strawberry Matcha Latte",price:5.00,category:"Beverages",emoji:"🍵",description:"Non dairy creamer"},
    {name:"Passion Juice",price:5.00,category:"Beverages",emoji:"🧃"},
    {name:"Strawberry Juice",price:5.00,category:"Beverages",emoji:"🍓"},
    {name:"Passion Strawberry Fusion with Rainbow Jelly",price:6.00,category:"Beverages",emoji:"🧋"},
    // Dessert
    {name:"Fried Banana with Chocolate & Sweet Sauce (2 pcs)",price:6.99,category:"Dessert",emoji:"🍌"},
    {name:"Sticky Rice with Coconut Milk",price:6.90,category:"Dessert",emoji:"🍚"},
  ]});

  const count = await prisma.menuItem.count();
  return Response.json({ message: "Seeded successfully!", count });
}
