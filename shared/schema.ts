import { relations, sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const doctors = pgTable("doctors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  medicalLicenseId: text("medical_license_id").notNull().unique(),
  specialization: text("specialization"),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const patients = pgTable("patients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  doctorId: varchar("doctor_id").references(() => doctors.id).notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  dateOfBirth: text("date_of_birth").notNull(),
  gender: text("gender").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  address: text("address"),
  bloodType: text("blood_type"),
  emergencyContact: text("emergency_contact"),
  allergies: text("allergies"),
  medicalHistory: text("medical_history"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const prescriptions = pgTable("prescriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  doctorId: varchar("doctor_id").references(() => doctors.id).notNull(),
  patientId: varchar("patient_id").references(() => patients.id).notNull(),
  medicines: json("medicines").$type<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }[]>().notNull(),
  additionalNotes: text("additional_notes"),
  transcribedText: text("transcribed_text"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const doctorsRelations = relations(doctors, ({ many }) => ({
  patients: many(patients),
  prescriptions: many(prescriptions),
}));

export const patientsRelations = relations(patients, ({ one, many }) => ({
  doctor: one(doctors, {
    fields: [patients.doctorId],
    references: [doctors.id],
  }),
  prescriptions: many(prescriptions),
}));

export const prescriptionsRelations = relations(prescriptions, ({ one }) => ({
  doctor: one(doctors, {
    fields: [prescriptions.doctorId],
    references: [doctors.id],
  }),
  patient: one(patients, {
    fields: [prescriptions.patientId],
    references: [patients.id],
  }),
}));

export const insertDoctorSchema = createInsertSchema(doctors).omit({
  id: true,
  createdAt: true,
});

export const insertPatientSchema = createInsertSchema(patients).omit({
  id: true,
  createdAt: true,
});

export const insertPrescriptionSchema = createInsertSchema(prescriptions).omit({
  id: true,
  createdAt: true,
});

export type InsertDoctor = z.infer<typeof insertDoctorSchema>;
export type Doctor = typeof doctors.$inferSelect;
export type InsertPatient = z.infer<typeof insertPatientSchema>;
export type Patient = typeof patients.$inferSelect;
export type InsertPrescription = z.infer<typeof insertPrescriptionSchema>;
export type Prescription = typeof prescriptions.$inferSelect;

// For backwards compatibility
export const users = doctors;
export const insertUserSchema = insertDoctorSchema;
export type InsertUser = InsertDoctor;
export type User = Doctor;
