import {
  pgTable,
  uuid,
  integer,
  decimal,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { cartItems } from "./cart-item";

export const cart = pgTable(
  "cart",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    userUnique: unique().on(table.userId),
  })
);

export const cartItemsRelations = relations(cart, ({ one, many }) => ({
  user: one(users, {
    fields: [cart.userId],
    references: [users.id],
  }),
  items: many(cartItems),
}));
