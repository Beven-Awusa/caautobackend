import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { products } from "./products";

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description"),
  image: text("image"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertCategorySchema = createInsertSchema(categories, {
  name: z
    .string()
    .min(1, "Category name is required")
    .max(100, "Category name too long"),
  description: z.string().max(500, "Description too long").optional(),
  image: z.string().url("Invalid image URL").optional(),
});

export const selectCategorySchema = createSelectSchema(categories);

export const updateCategorySchema = insertCategorySchema.partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type UpdateCategory = z.infer<typeof updateCategorySchema>;

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));
