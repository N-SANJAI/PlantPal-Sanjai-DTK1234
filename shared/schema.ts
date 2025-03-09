import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  level: integer("level").notNull().default(1),
  points: integer("points").notNull().default(0),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const plants = pgTable("plants", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  species: text("species"),
  imageUrl: text("image_url"),
  healthScore: integer("health_score").default(100),
  waterLevel: integer("water_level").default(100),
  lightLevel: integer("light_level").default(100),
  nutrientLevel: integer("nutrient_level").default(100),
  pestRisk: integer("pest_risk").default(0),
  lastWatered: timestamp("last_watered"),
  lastFertilized: timestamp("last_fertilized"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertPlantSchema = createInsertSchema(plants).pick({
  userId: true,
  name: true,
  species: true,
  imageUrl: true,
});

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  plantId: integer("plant_id").notNull(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(), // water, fertilize, move, prune, etc.
  priority: text("priority").notNull(), // urgent, high, medium, low
  completed: boolean("completed").default(false),
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertTaskSchema = createInsertSchema(tasks).pick({
  plantId: true,
  userId: true,
  title: true,
  description: true,
  type: true,
  priority: true,
  dueDate: true,
});

export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  requirements: json("requirements").notNull(),
});

export const insertBadgeSchema = createInsertSchema(badges).pick({
  name: true,
  description: true,
  icon: true,
  requirements: true,
});

export const userBadges = pgTable("user_badges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  badgeId: integer("badge_id").notNull(),
  earnedAt: timestamp("earned_at").notNull().defaultNow(),
});

export const insertUserBadgeSchema = createInsertSchema(userBadges).pick({
  userId: true,
  badgeId: true,
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // task, badge, tip
  read: boolean("read").default(false),
  relatedId: integer("related_id"), // related task/badge id
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertNotificationSchema = createInsertSchema(notifications).pick({
  userId: true,
  title: true,
  message: true,
  type: true,
  relatedId: true,
});

export const plantAnalysis = pgTable("plant_analysis", {
  id: serial("id").primaryKey(),
  plantId: integer("plant_id").notNull(),
  userId: integer("user_id").notNull(),
  healthScore: integer("health_score").notNull(),
  waterLevel: integer("water_level").notNull(),
  lightLevel: integer("light_level").notNull(),
  nutrientLevel: integer("nutrient_level").notNull(),
  pestRisk: integer("pest_risk").notNull(),
  issues: json("issues"),
  recommendations: json("recommendations"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertPlantAnalysisSchema = createInsertSchema(plantAnalysis).pick({
  plantId: true,
  userId: true,
  healthScore: true,
  waterLevel: true,
  lightLevel: true,
  nutrientLevel: true,
  pestRisk: true,
  issues: true,
  recommendations: true,
  imageUrl: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Plant = typeof plants.$inferSelect;
export type InsertPlant = z.infer<typeof insertPlantSchema>;

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

export type Badge = typeof badges.$inferSelect;
export type InsertBadge = z.infer<typeof insertBadgeSchema>;

export type UserBadge = typeof userBadges.$inferSelect;
export type InsertUserBadge = z.infer<typeof insertUserBadgeSchema>;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

export type PlantAnalysis = typeof plantAnalysis.$inferSelect;
export type InsertPlantAnalysis = z.infer<typeof insertPlantAnalysisSchema>;
