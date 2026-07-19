import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const usersTable = pgTable("users_table", {
  id: uuid("id").primaryKey().defaultRandom(),
  kindeId: text("kinde_id").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email"),
  avatar: text("avatar_url"),
  phone: text("phone"),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const productTypeEnum = pgEnum("product_type", [
  "tshirt",
  "hoodie",
  "sweatshirt",
  "cap",
]);

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(),
  typeId: uuid("type_id")
    .references(() => productTypes.id)
    .notNull(),
  featured: boolean("featured").notNull().default(false),
  studioMode: text("studio_mode")
    .$type<"none" | "free" | "template">()
    .notNull()
    .default("none"),
  salesCount: integer("sales_count").default(0).notNull(),
  isActive: boolean().default(true),
  templateConfig: jsonb("template_config")
    .$type<TemplateConfig | null>()
    .default(null),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type TemplateConfig = {
  baseDesign: {
    designId: string; // id من designs table
    threadHex: string;
    top: string; // e.g. "45%"
    left: string; // e.g. "50%"
    width: number;
  } | null;
  nameplate: {
    top: string;
    left: string;
    width: number;
    fontIndex: number;
    threadHex: string;
    placeholder: string;
  };
};

export const productTypes = pgTable("product_types", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  hasSizes: boolean("has_sizes").notNull().default(false),
  sizes: jsonb("sizes")
    .$type<string[]>()
    .notNull()
    .default([] as string[]),
  hasThreadColor: boolean("has_thread_color").notNull().default(false),
  imagePlacements: jsonb("image_placements")
    .$type<string[]>()
    .notNull()
    .default([] as string[]),
});

export const ImagePlaceEnum = pgEnum("place", [
  "front",
  "back",
  "left-sleeve",
  "right-sleeve",
]);
export const productImages = pgTable("product_images", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .references(() => products.id)
    .notNull(),
  url: text("url").notNull(),
  altText: text("alt_text"),
  color: text("color"),
  position: integer("position").default(0),
  place: ImagePlaceEnum("place"),
});

export const productVariants = pgTable("product_variants", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .references(() => products.id)
    .notNull(),
  color: text("color").notNull(),
  size: text("size"),
  stringColor: text("string_color"),
  stock: integer("stock").default(0), // stock means quantity available
  price: integer("price"),
});

// Define an enum for order status
export const orderStatusEnum = pgEnum("order_status", [
  "cart",
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
]);

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }), // Foreign key to users
  status: orderStatusEnum("status").notNull().default("cart"),
  totalPrice: integer("total_price").default(0).notNull(),
  currency: varchar("currency", { length: 3 }).notNull().default("EGP"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id),
    variantId: uuid("variant_id").references(() => productVariants.id),
    quantity: integer("quantity").notNull().default(1),
    unitPrice: integer("unit_price").notNull(),
    addOn: jsonb("add_on"),
    customization: jsonb("customization"),
  },
  (t) => ({
    uniqueCartItem: unique().on(
      t.orderId,
      t.productId,
      t.variantId,
      // t.itemType,
    ),
  }),
);
// db/schema/designs.ts

export const designs = pgTable("designs", {
  id: uuid("id").defaultRandom().primaryKey(),
  key: text("key").notNull().unique(),
  label: text("label").notNull(),
  svg: text("svg"),
  url: text("url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Design = typeof designs.$inferSelect;
export type NewDesign = typeof designs.$inferInsert;

export const userRelations = relations(usersTable, ({ many }) => ({
  orders: many(orders),
}));

export const productRelations = relations(products, ({ one, many }) => ({
  variants: many(productVariants),
  images: many(productImages),
  type: one(productTypes, {
    fields: [products.typeId],
    references: [productTypes.id],
  }),
}));

export const productTypeRelations = relations(productTypes, ({ many }) => ({
  products: many(products),
}));

export const productVariantRelations = relations(
  productVariants,
  ({ one }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
    }),
  }),
);

export const productImageRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

export const orderRelations = relations(orders, ({ many, one }) => ({
  user: one(usersTable, {
    fields: [orders.userId],
    references: [usersTable.id],
  }),
  items: many(orderItems),
}));

export const orderItemRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  variant: one(productVariants, {
    fields: [orderItems.variantId],
    references: [productVariants.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));
