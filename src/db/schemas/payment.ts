import {
  pgTable,
  integer,
  varchar,
  decimal,
  text,
  timestamp,
  index,
  jsonb,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { orders } from "./orders";

export const payments = pgTable(
  "payments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: integer("order_id").notNull(),
    paymentMethod: varchar("payment_method", { length: 50 }).notNull(),
    paymentMethodId: varchar("payment_method_id", { length: 255 }),
    transactionId: varchar("transaction_id", { length: 255 }),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).default("USD"),
    status: varchar("status", { length: 20 }).default("pending"),
    gatewayResponse: jsonb("gateway_response"),
    failureReason: text("failure_reason"),
    refundAmount: decimal("refund_amount", { precision: 10, scale: 2 }).default(
      "0"
    ),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    orderIdx: index("payments_order_idx").on(table.orderId),
    statusIdx: index("payments_status_idx").on(table.status),
    transactionIdx: index("payments_transaction_idx").on(table.transactionId),
  })
);

export const paymentsRelations = relations(payments, ({ one }) => ({
  order: one(orders, { fields: [payments.orderId], references: [orders.id] }),
}));
