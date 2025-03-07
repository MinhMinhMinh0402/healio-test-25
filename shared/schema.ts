import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  gender: text("gender"),
  dateOfBirth: timestamp("date_of_birth"),
  phoneNumber: text("phone_number"),
  address: text("address"),
});

export const healthRecords = pgTable("health_records", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  recordType: text("record_type").notNull(),
  description: text("description").notNull(),
  date: timestamp("date").notNull(),
});

export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: timestamp("date").notNull(),
  type: text("type").notNull(),
  status: text("status").notNull(),
  notes: text("notes"),
});

export const insertUserSchema = createInsertSchema(users, {
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  dateOfBirth: z.string().transform((str) => new Date(str)),
}).pick({
  username: true,
  password: true,
  fullName: true,
  email: true,
  gender: true,
  dateOfBirth: true,
  phoneNumber: true,
  address: true,
});

export const insertHealthRecordSchema = createInsertSchema(healthRecords, {
  date: z.string().transform((str) => new Date(str)),
}).pick({
  recordType: true,
  description: true,
  date: true,
});

export const insertAppointmentSchema = createInsertSchema(appointments, {
  date: z.string().transform((str) => new Date(str)),
}).pick({
  date: true,
  type: true,
  status: true,
  notes: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type HealthRecord = typeof healthRecords.$inferSelect;
export type Appointment = typeof appointments.$inferSelect;