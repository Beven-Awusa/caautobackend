import { pgTable, uuid, integer, decimal, timestamp, unique } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./users";
import { products } from "./products";

// Cart items table
export const cartItems = pgTable("cart_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull().default(1),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(), // Price at time of adding to cart
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  // Ensure user can only have one cart item per product
  userProductUnique: unique().on(table.userId, table.productId),
}));

// Relations
export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  user: one(users, {
    fields: [cartItems.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}));

// Zod schemas for validation
export const insertCartItemSchema = createInsertSchema(cartItems, {
  quantity: z.number().int().min(1, "Quantity must be at least 1").max(100, "Quantity too high"),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
});

export const selectCartItemSchema = createSelectSchema(cartItems);

export const updateCartItemSchema = insertCartItemSchema.partial().omit({
  id: true,
  userId: true,
  productId: true,
  createdAt: true,
  updatedAt: true,
});

// Type exports
export type CartItem = typeof cartItems.$inferSelect;
export type NewCartItem = typeof cartItems.$inferInsert;
export type UpdateCartItem = z.infer<typeof updateCartItemSchema>;
