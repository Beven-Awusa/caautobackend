import {
  pgTable,
  uuid,
  integer,
  text,
  timestamp,
  unique,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./users";
import { products } from "./products";

export const reviews = pgTable(
  "reviews",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    rating: integer("rating").notNull(),
    title: text("title"),
    comment: text("comment"),
    isVerified: boolean("is_verified").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    userProductUnique: unique().on(table.userId, table.productId),
  })
);

export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
}));

export const insertReviewSchema = createInsertSchema(reviews, {
  rating: z
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),
  title: z.string().max(200, "Title too long").optional(),
  comment: z.string().max(1000, "Comment too long").optional(),
});

export const selectReviewSchema = createSelectSchema(reviews);

export const updateReviewSchema = insertReviewSchema.partial().omit({
  id: true,
  productId: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

// Type exports
export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
export type UpdateReview = z.infer<typeof updateReviewSchema>;
