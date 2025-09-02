import { pgTable, uuid, varchar, text, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// User role enum
export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);

// User provider enum
export const userProviderEnum = pgEnum("user_provider", ["local", "google"]);

// Users table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phone: varchar("phone", { length: 20 }),
  password: varchar("password", { length: 255 }), // Nullable for OAuth users
  role: userRoleEnum("role").notNull().default("user"),
  provider: userProviderEnum("provider").notNull().default("local"),
  googleId: varchar("google_id", { length: 255 }),
  isVerified: boolean("is_verified").notNull().default(false),
  avatar: text("avatar"), // URL to avatar image
  emailVerificationToken: varchar("email_verification_token", { length: 255 }),
  emailVerificationExpires: timestamp("email_verification_expires"),
  passwordResetToken: varchar("password_reset_token", { length: 255 }),
  passwordResetExpires: timestamp("password_reset_expires"),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users, {
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  phone: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  role: z.enum(["user", "admin"]).default("user"),
  provider: z.enum(["local", "google"]).default("local"),
  avatar: z.string().url().optional(),
});

export const selectUserSchema = createSelectSchema(users);

export const updateUserSchema = insertUserSchema.partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  emailVerificationToken: true,
  emailVerificationExpires: true,
  passwordResetToken: true,
  passwordResetExpires: true,
});

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UpdateUser = z.infer<typeof updateUserSchema>;
