import { pgTable, uuid, decimal, integer, varchar, text, timestamp, pgEnum, json } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./users";
import { products } from "./products";

// Order status enum
export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "confirmed", 
  "processing",
  "shipped",
  "delivered",
  "cancelled"
]);

// Payment status enum
export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "paid",
  "failed",
  "refunded"
]);

// Address schema for JSON fields
const addressSchema = z.object({
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  country: z.string().min(1, "Country is required"),
});

// Orders table
export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: orderStatusEnum("status").notNull().default("pending"),
  paymentStatus: paymentStatusEnum("payment_status").notNull().default("pending"),
  shippingAddress: json("shipping_address").$type<z.infer<typeof addressSchema>>().notNull(),
  billingAddress: json("billing_address").$type<z.infer<typeof addressSchema>>(),
  notes: text("notes"),
  trackingNumber: varchar("tracking_number", { length: 100 }),
  shippedAt: timestamp("shipped_at"),
  deliveredAt: timestamp("delivered_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Order items table
export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "restrict" }),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(), // Price at time of order
  productName: varchar("product_name", { length: 255 }).notNull(), // Snapshot of product name
  productImage: text("product_image"), // Snapshot of main product image
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Relations
export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

// Zod schemas for validation
export const insertOrderSchema = createInsertSchema(orders, {
  totalAmount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid amount format"),
  status: z.enum(["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"]).default("pending"),
  paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]).default("pending"),
  shippingAddress: addressSchema,
  billingAddress: addressSchema.optional(),
  notes: z.string().max(500, "Notes too long").optional(),
});

export const insertOrderItemSchema = createInsertSchema(orderItems, {
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
  productName: z.string().min(1, "Product name is required"),
});

export const selectOrderSchema = createSelectSchema(orders);
export const selectOrderItemSchema = createSelectSchema(orderItems);

export const updateOrderSchema = insertOrderSchema.partial().omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

// Type exports
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type UpdateOrder = z.infer<typeof updateOrderSchema>;

export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;

export type Address = z.infer<typeof addressSchema>;
