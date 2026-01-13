import { doctors, patients, prescriptions, type Doctor, type InsertDoctor, type Patient, type InsertPatient, type Prescription, type InsertPrescription } from "@shared/schema";
import { db } from "./db";
import { eq, or, ilike, desc, and } from "drizzle-orm";

export interface IStorage {
  // Doctor methods
  getDoctor(id: string): Promise<Doctor | undefined>;
  getDoctorByUsername(username: string): Promise<Doctor | undefined>;
  getDoctorByMedicalLicense(licenseId: string): Promise<Doctor | undefined>;
  getDoctorByUsernameOrLicense(identifier: string): Promise<Doctor | undefined>;
  createDoctor(doctor: InsertDoctor): Promise<Doctor>;

  // Patient methods
  getPatient(id: string): Promise<Patient | undefined>;
  getPatientsByDoctor(doctorId: string): Promise<Patient[]>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  updatePatient(id: string, patient: Partial<InsertPatient>): Promise<Patient>;
  searchPatients(doctorId: string, query: string): Promise<Patient[]>;

  // Prescription methods
  getPrescription(id: string): Promise<Prescription | undefined>;
  getPrescriptionsByPatient(patientId: string): Promise<Prescription[]>;
  getPrescriptionsByDoctor(doctorId: string): Promise<Prescription[]>;
  createPrescription(prescription: InsertPrescription): Promise<Prescription>;

  // For backwards compatibility
  getUser(id: string): Promise<Doctor | undefined>;
  getUserByUsername(username: string): Promise<Doctor | undefined>;
  createUser(user: InsertDoctor): Promise<Doctor>;
}

export class DatabaseStorage implements IStorage {
  // Doctor methods
  async getDoctor(id: string): Promise<Doctor | undefined> {
    const [doctor] = await db.select().from(doctors).where(eq(doctors.id, id));
    return doctor || undefined;
  }

  async getDoctorByUsername(username: string): Promise<Doctor | undefined> {
    const [doctor] = await db.select().from(doctors).where(eq(doctors.username, username));
    return doctor || undefined;
  }

  async getDoctorByMedicalLicense(licenseId: string): Promise<Doctor | undefined> {
    const [doctor] = await db.select().from(doctors).where(eq(doctors.medicalLicenseId, licenseId));
    return doctor || undefined;
  }

  async getDoctorByUsernameOrLicense(identifier: string): Promise<Doctor | undefined> {
    const [doctor] = await db.select().from(doctors).where(
      or(
        eq(doctors.username, identifier),
        eq(doctors.medicalLicenseId, identifier)
      )
    );
    return doctor || undefined;
  }

  async createDoctor(insertDoctor: InsertDoctor): Promise<Doctor> {
    const [doctor] = await db
      .insert(doctors)
      .values(insertDoctor)
      .returning();
    return doctor;
  }

  // Patient methods
  async getPatient(id: string): Promise<Patient | undefined> {
    const [patient] = await db.select().from(patients).where(eq(patients.id, id));
    return patient || undefined;
  }

  async getPatientsByDoctor(doctorId: string): Promise<Patient[]> {
    return await db.select().from(patients).where(eq(patients.doctorId, doctorId)).orderBy(desc(patients.createdAt));
  }

  async createPatient(insertPatient: InsertPatient): Promise<Patient> {
    const [patient] = await db
      .insert(patients)
      .values(insertPatient)
      .returning();
    return patient;
  }

  async updatePatient(id: string, updateData: Partial<InsertPatient>): Promise<Patient> {
    const [patient] = await db
      .update(patients)
      .set(updateData)
      .where(eq(patients.id, id))
      .returning();
    return patient;
  }

  async searchPatients(doctorId: string, query: string): Promise<Patient[]> {
    return await db.select().from(patients).where(
      and(
        eq(patients.doctorId, doctorId),
        or(
          ilike(patients.firstName, `%${query}%`),
          ilike(patients.lastName, `%${query}%`),
          ilike(patients.phone, `%${query}%`),
          ilike(patients.email, `%${query}%`)
        )
      )
    ).orderBy(desc(patients.createdAt));
  }

  // Prescription methods
  async getPrescription(id: string): Promise<Prescription | undefined> {
    const [prescription] = await db.select().from(prescriptions).where(eq(prescriptions.id, id));
    return prescription || undefined;
  }

  // async getPrescriptionsByPatient(patientId: string): Promise<Prescription[]> {
  //   return await db.select().from(prescriptions).where(eq(prescriptions.patientId, patientId)).orderBy(desc(prescriptions.createdAt));
  // }

  async getPrescriptionsByPatient(patientId: string) {
    const rows = await db
      .select({
        prescription: prescriptions,
        doctor: {
          id: doctors.id,
          firstName: doctors.firstName,
          lastName: doctors.lastName,
          specialization: doctors.specialization,
          medicalLicenseId: doctors.medicalLicenseId,
        },
        patient: {
          id: patients.id,
          firstName: patients.firstName,
          lastName: patients.lastName,
          phone: patients.phone,
          dateOfBirth: patients.dateOfBirth,
        },
      })
      .from(prescriptions)
      .leftJoin(doctors, eq(prescriptions.doctorId, doctors.id))
      .leftJoin(patients, eq(prescriptions.patientId, patients.id))
      .where(eq(prescriptions.patientId, patientId))
      .orderBy(desc(prescriptions.createdAt));

    return rows.map((row) => ({
      ...row.prescription,
      doctor: row.doctor,
      patient: row.patient,
    }));
  }


  // async getPrescriptionsByDoctor(doctorId: string): Promise<Prescription[]> {
  //   return await db.select().from(prescriptions).where(eq(prescriptions.doctorId, doctorId)).orderBy(desc(prescriptions.createdAt));
  // }

  async getPrescriptionsByDoctor(doctorId: string) {
    const rows = await db
      .select({
        prescription: prescriptions,
        doctor: {
          id: doctors.id,
          firstName: doctors.firstName,
          lastName: doctors.lastName,
          specialization: doctors.specialization,
          medicalLicenseId: doctors.medicalLicenseId,
        },
        patient: {
          id: patients.id,
          firstName: patients.firstName,
          lastName: patients.lastName,
          phone: patients.phone,
          dateOfBirth: patients.dateOfBirth,
        },
      })
      .from(prescriptions)
      .leftJoin(doctors, eq(prescriptions.doctorId, doctors.id))
      .leftJoin(patients, eq(prescriptions.patientId, patients.id))
      .where(eq(prescriptions.doctorId, doctorId))
      .orderBy(desc(prescriptions.createdAt));

    // Normalize the shape: merge into single object
    return rows.map((row) => ({
      ...row.prescription,
      doctor: row.doctor,
      patient: row.patient,
    }));
  }

  async createPrescription(insertPrescription: InsertPrescription): Promise<Prescription> {
    const [prescription] = await db
      .insert(prescriptions)
      .values({
        ...insertPrescription,
        medicines: JSON.stringify(insertPrescription.medicines)
      } as any)
      .returning();
    return prescription;
  }

  // For backwards compatibility
  async getUser(id: string): Promise<Doctor | undefined> {
    return this.getDoctor(id);
  }

  async getUserByUsername(username: string): Promise<Doctor | undefined> {
    return this.getDoctorByUsername(username);
  }

  async createUser(user: InsertDoctor): Promise<Doctor> {
    return this.createDoctor(user);
  }
}

export const storage = new DatabaseStorage();
