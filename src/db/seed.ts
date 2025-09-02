// import { db } from "./index";
// import { users, categories, products } from "./schemas";
// import bcrypt from "bcrypt";

// async function seed() {
//   console.log("🌱 Starting database seeding...");

//   try {
//     // Create admin user
//     const hashedPassword = await bcrypt.hash("admin123", 10);

//     const [adminUser] = await db
//       .insert(users)
//       .values({
//         name: "Admin User",
//         email: "admin@caautobackend.com",
//         password: hashedPassword,
//         role: "admin",
//         provider: "local",
//         isVerified: true,
//       })
//       .returning();

//     console.log("✅ Admin user created:", adminUser.email);

//     // Create sample categories
//     const categoryData = [
//       {
//         name: "Sedans",
//         description: "Four-door passenger cars with separate trunk",
//         isActive: true,
//       },
//       {
//         name: "SUVs",
//         description: "Sport Utility Vehicles with higher ground clearance",
//         isActive: true,
//       },
//       {
//         name: "Hatchbacks",
//         description: "Compact cars with rear door that opens upwards",
//         isActive: true,
//       },
//       {
//         name: "Trucks",
//         description: "Pickup trucks and commercial vehicles",
//         isActive: true,
//       },
//       {
//         name: "Motorcycles",
//         description: "Two-wheeled motor vehicles",
//         isActive: true,
//       },
//     ];

//     const createdCategories = await db
//       .insert(categories)
//       .values(categoryData)
//       .returning();
//     console.log(`✅ Created ${createdCategories.length} categories`);

//     // Create sample products
//     const sampleProducts = [
//       {
//         name: "2020 Toyota Camry LE",
//         description:
//           "Well-maintained sedan with low mileage. Perfect for daily commuting.",
//         price: "22500.00",
//         originalPrice: "25000.00",
//         brand: "Toyota",
//         model: "Camry",
//         year: 2020,
//         mileage: 35000,
//         condition: "used" as const,
//         fuelType: "Gasoline",
//         transmission: "Automatic",
//         engineSize: "2.5L",
//         bodyType: "Sedan",
//         color: "Silver",
//         images: [
//           "https://example.com/images/camry1.jpg",
//           "https://example.com/images/camry2.jpg",
//         ],
//         features: [
//           "Backup Camera",
//           "Bluetooth",
//           "Cruise Control",
//           "Power Windows",
//         ],
//         location: "Los Angeles, CA",
//         isNegotiable: true,
//         sellerId: adminUser.id,
//         categoryId: createdCategories[0].id, // Sedans
//       },
//       {
//         name: "2019 Honda CR-V EX",
//         description:
//           "Reliable SUV with excellent fuel economy and spacious interior.",
//         price: "26800.00",
//         brand: "Honda",
//         model: "CR-V",
//         year: 2019,
//         mileage: 42000,
//         condition: "used" as const,
//         fuelType: "Gasoline",
//         transmission: "CVT",
//         engineSize: "1.5L Turbo",
//         bodyType: "SUV",
//         color: "White",
//         images: [
//           "https://example.com/images/crv1.jpg",
//           "https://example.com/images/crv2.jpg",
//         ],
//         features: [
//           "All-Wheel Drive",
//           "Sunroof",
//           "Apple CarPlay",
//           "Lane Keeping Assist",
//         ],
//         location: "San Francisco, CA",
//         isNegotiable: true,
//         sellerId: adminUser.id,
//         categoryId: createdCategories[1].id, // SUVs
//       },
//     ];

//     const createdProducts = await db
//       .insert(products)
//       .values(sampleProducts)
//       .returning();
//     console.log(`✅ Created ${createdProducts.length} sample products`);

//     console.log("🎉 Database seeding completed successfully!");
//   } catch (error) {
//     console.error("❌ Database seeding failed:", error);
//     throw error;
//   }
// }

// // Run seeder if called directly
// if (import.meta.main) {
//   seed()
//     .then(() => {
//       console.log("✅ Seeding completed");
//       process.exit(0);
//     })
//     .catch((error) => {
//       console.error("❌ Seeding failed:", error);
//       process.exit(1);
//     });
// }

// export { seed };
