import {
  pgTable,
  uuid,
  varchar,
  text,
  decimal,
  integer,
  boolean,
  timestamp,
  pgEnum,
  json,
} from "drizzle-orm/pg-core";

import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./users";
import { categories } from "./categories";

// Product status enum
export const productStatusEnum = pgEnum("product_status", [
  "active",
  "sold",
  "inactive",
]);

// Product condition enum
export const productConditionEnum = pgEnum("product_condition", [
  "new",
  "used",
  "refurbished",
]);

// Products table
export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  brand: varchar("brand", { length: 100 }).notNull(),
  model: varchar("model", { length: 100 }).notNull(),
  year: integer("year"),
  mileage: integer("mileage"),
  condition: productConditionEnum("condition").notNull().default("used"),
  fuelType: varchar("fuel_type", { length: 50 }),
  transmission: varchar("transmission", { length: 50 }),
  engineSize: varchar("engine_size", { length: 50 }),
  bodyType: varchar("body_type", { length: 50 }),
  color: varchar("color", { length: 50 }),
  images: json("images").$type<string[]>().notNull().default([]),
  features: json("features").$type<string[]>().default([]),
  location: varchar("location", { length: 255 }),
  isNegotiable: boolean("is_negotiable").notNull().default(true),
  isAvailable: boolean("is_available").notNull().default(true),
  status: productStatusEnum("status").notNull().default("active"),
  views: integer("views").notNull().default(0),
  sellerId: uuid("seller_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "restrict" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Relations will be defined after all schemas are created to avoid circular imports

// Zod schemas for validation
export const insertProductSchema = createInsertSchema(products, {
  name: z
    .string()
    .min(1, "Product name is required")
    .max(255, "Product name too long"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
  originalPrice: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Invalid price format")
    .optional(),
  brand: z.string().min(1, "Brand is required").max(100, "Brand name too long"),
  model: z.string().min(1, "Model is required").max(100, "Model name too long"),
  year: z
    .number()
    .int()
    .min(1900, "Invalid year")
    .max(new Date().getFullYear() + 1, "Invalid year")
    .optional(),
  mileage: z.number().int().min(0, "Mileage cannot be negative").optional(),
  condition: z.enum(["new", "used", "refurbished"]).default("used"),
  images: z
    .array(z.string().url("Invalid image URL"))
    .min(1, "At least one image is required"),
  features: z.array(z.string()).default([]),
  location: z.string().max(255, "Location too long").optional(),
});

export const selectProductSchema = createSelectSchema(products);

export const updateProductSchema = insertProductSchema.partial().omit({
  id: true,
  sellerId: true,
  createdAt: true,
  updatedAt: true,
  views: true,
});

// Type exports
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type UpdateProduct = z.infer<typeof updateProductSchema>;
