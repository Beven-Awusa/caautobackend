import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  pgEnum,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./users";

export const tokenTypeEnum = pgEnum("token_type", [
  "refresh",
  "email_verification",
  "password_reset",
]);

// Auth tokens table
export const authTokens = pgTable("auth_tokens", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: varchar("token", { length: 500 }).notNull().unique(),
  type: tokenTypeEnum("type").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  isRevoked: boolean("is_revoked").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Relations
export const authTokensRelations = relations(authTokens, ({ one }) => ({
  user: one(users, {
    fields: [authTokens.userId],
    references: [users.id],
  }),
}));

// Zod schemas for validation
export const insertAuthTokenSchema = createInsertSchema(authTokens, {
  token: z.string().min(1, "Token is required"),
  type: z.enum(["refresh", "email_verification", "password_reset"]),
  expiresAt: z.date(),
});

export const selectAuthTokenSchema = createSelectSchema(authTokens);

export const updateAuthTokenSchema = insertAuthTokenSchema.partial().omit({
  id: true,
  userId: true,
  token: true,
  type: true,
  createdAt: true,
  updatedAt: true,
});

export type AuthToken = typeof authTokens.$inferSelect;
export type NewAuthToken = typeof authTokens.$inferInsert;
export type UpdateAuthToken = z.infer<typeof updateAuthTokenSchema>;
