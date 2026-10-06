import { sqliteTable, text, real, integer } from "drizzle-orm/sqlite-core";
export const plans = sqliteTable("plans", { id: text("id").primaryKey(), reseller: text("reseller").notNull(), network: text("network").notNull(), gb: real("gb").notNull(), price: real("price").notNull(), days: integer("days").notNull(), type: text("type").notNull(), url: text("url").notNull(), updated: text("updated").notNull(), sourceUrl: text("source_url").notNull().default(""), checkedAt: text("checked_at").notNull().default(""), tier: text("tier").notNull().default(""), label: text("label").notNull().default(""), notes: text("notes").notNull().default("") });

export const catalogueImports = sqliteTable("catalogue_imports", { id: text("id").primaryKey(), appliedAt: text("applied_at").notNull() });
export const adminSessions = sqliteTable("admin_sessions", { tokenHash: text("token_hash").primaryKey(), expiresAt: integer("expires_at").notNull(), authVersion: text("auth_version").notNull() });
export const adminLoginAttempts = sqliteTable("admin_login_attempts", { key: text("key").primaryKey(), attempts: integer("attempts").notNull(), windowStart: integer("window_start").notNull() });

export const advertisements = sqliteTable("advertisements", { slot: text("slot").primaryKey(), title: text("title").notNull(), url: text("url").notNull(), imageKey: text("image_key").notNull(), active: integer("active").notNull().default(0) });
