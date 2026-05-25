import { pgTable, text, timestamp, integer, boolean, json } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull().unique(),
  password: text("password"),
  role: text("role", { enum: ["admin", "editor", "viewer"] }).default("editor").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const screens = pgTable("screens", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status", { enum: ["draft", "published", "archived"] }).default("draft").notNull(),
  playlistId: text("playlist_id").references(() => playlists.id),
  pairingCode: text("pairing_code").unique(),
  lastSeen: timestamp("last_seen"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const media = pgTable("media", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  type: text("type", { enum: ["image", "video", "document", "audio"] }).notNull(),
  url: text("url").notNull(),
  key: text("key").notNull(),
  size: integer("size").notNull(),
  mimeType: text("mime_type").notNull(),
  metadata: json("metadata"),
  uploadedById: text("uploaded_by_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const playlists = pgTable("playlists", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  description: text("description"),
  items: json("items").$type<PlaylistItem[]>().default([]).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdById: text("created_by_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const aiJobs = pgTable("ai_jobs", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  type: text("type", { enum: ["translate", "transcribe", "summarize", "generate"] }).notNull(),
  status: text("status", { enum: ["pending", "running", "completed", "failed"] }).default("pending").notNull(),
  input: json("input").notNull(),
  output: json("output"),
  error: text("error"),
  mediaId: text("media_id").references(() => media.id),
  createdById: text("created_by_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type PlaylistItem = {
  mediaId: string;
  duration: number;
  order: number;
  transition?: string;
};

export type User = typeof users.$inferSelect;
export type Screen = typeof screens.$inferSelect;
export type Media = typeof media.$inferSelect;
export type Playlist = typeof playlists.$inferSelect;
export type AiJob = typeof aiJobs.$inferSelect;
