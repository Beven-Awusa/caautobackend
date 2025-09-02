import { relations } from "drizzle-orm";
import { users } from "./users";
import { categories } from "./categories";
import { products } from "./products";
import { cartItems } from "./cart";
import { orders, orderItems } from "./orders";
import { reviews } from "./reviews";
import { authTokens } from "./auth-tokens";

// User relations
export const usersRelations = relations(users, ({ many }) => ({
  products: many(products),
  cartItems: many(cartItems),
  orders: many(orders),
  reviews: many(reviews),
  authTokens: many(authTokens),
}));

// Category relations
export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

// Product relations
export const productsRelations = relations(products, ({ one, many }) => ({
  seller: one(users, {
    fields: [products.sellerId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  reviews: many(reviews),
  cartItems: many(cartItems),
  orderItems: many(orderItems),
}));

// Cart item relations
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

// Order relations
export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}));

// Order item relations
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

// Review relations
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

// Auth token relations
export const authTokensRelations = relations(authTokens, ({ one }) => ({
  user: one(users, {
    fields: [authTokens.userId],
    references: [users.id],
  }),
}));
