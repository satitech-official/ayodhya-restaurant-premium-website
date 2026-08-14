import {
  pgTable,
  serial,
  text,
  integer,
  numeric,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const menuCategories = pgTable("menu_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  icon: text("icon").default("🍽️"),
  description: text("description").default(""),
  sortOrder: integer("sort_order").default(0).notNull(),
});

export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").default(""),
  category: text("category").notNull(),
  cuisine: text("cuisine").default(""),
  price: numeric("price", { precision: 10, scale: 2 }).notNull().default("0"),
  image: text("image").default(""),
  vegetarian: boolean("vegetarian").default(true).notNull(),
  spicyLevel: integer("spicy_level").default(0).notNull(),
  recommended: boolean("recommended").default(false).notNull(),
  bestseller: boolean("bestseller").default(false).notNull(),
  signature: boolean("signature").default(false).notNull(),
  available: boolean("available").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const reservations = pgTable("reservations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  guests: integer("guests").notNull(),
  occasion: text("occasion").default("Regular Dining"),
  seating: text("seating").default("No preference"),
  specialRequest: text("special_request").default(""),
  status: text("status").default("new").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const offers = pgTable("offers", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").default(""),
  image: text("image").default(""),
  badge: text("badge").default(""),
  ctaLabel: text("cta_label").default(""),
  ctaLink: text("cta_link").default(""),
  validFrom: text("valid_from").default(""),
  validUntil: text("valid_until").default(""),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const gallery = pgTable("gallery", {
  id: serial("id").primaryKey(),
  image: text("image").notNull(),
  caption: text("caption").default(""),
  category: text("category").default("Food"),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  rating: integer("rating").default(5).notNull(),
  review: text("review").default(""),
  source: text("source").default("Google"),
  date: text("date").default(""),
  approved: boolean("approved").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const businessSettings = pgTable("business_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").default(""),
  email: text("email").default(""),
  subject: text("subject").default(""),
  message: text("message").notNull(),
  read: boolean("read").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
