import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcryptjs";
import { insertDoctorSchema, insertPatientSchema, insertPrescriptionSchema } from "@shared/schema";
import { z } from "zod";
import { transporter } from "./utils/mailer";
import { generatePrescriptionPDF } from "./utils/prescriptionPdf";
import { generatePrescriptionHTML } from "./utils/prescriptionTemplate";
import { htmlToPDF} from "./utils/pdf";
import { renderPrescriptionHTML } from "@shared/prescription/renderPrescriptionHTML";
import { sendPrescriptionEmail } from "./utils/resendEmail";



export async function registerRoutes(app: Express): Promise<Server> {
  // Doctor registration
  app.post("/api/auth/register", async (req, res) => {
    try {
      const doctorData = insertDoctorSchema.parse(req.body);
      
      // Check if username or medical license ID already exists
      const existingByUsername = await storage.getDoctorByUsername(doctorData.username);
      if (existingByUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const existingByLicense = await storage.getDoctorByMedicalLicense(doctorData.medicalLicenseId);
      if (existingByLicense) {
        return res.status(400).json({ message: "Medical license ID already registered" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(doctorData.password, 10);
      
      const doctor = await storage.createDoctor({
        ...doctorData,
        password: hashedPassword,
      });

      if (req.session) {
        req.session.doctorId = doctor.id;
      }
      
      res.json({ 
        message: "Registration successful", 
        doctor: { 
          id: doctor.id, 
          username: doctor.username,
          firstName: doctor.firstName,
          lastName: doctor.lastName,
          specialization: doctor.specialization 
        } 
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(400).json({ message: "Invalid registration data" });
    }
  });

  // Doctor login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { identifier, password } = req.body;
      
      if (!identifier || !password) {
        return res.status(400).json({ message: "Username/License ID and password are required" });
      }

      const doctor = await storage.getDoctorByUsernameOrLicense(identifier);
      if (!doctor) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, doctor.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      if (req.session) {
        req.session.doctorId = doctor.id;
        console.log("Doctor session created:", req.session);
      }
      
      res.json({ 
        message: "Login successful", 
        doctor: { 
          id: doctor.id, 
          username: doctor.username,
          firstName: doctor.firstName,
          lastName: doctor.lastName,
          specialization: doctor.specialization 
        } 
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Doctor logout
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ message: "Could not log out" });
      }
      res.json({ message: "Logout successful" });
    });
  });

  // Get current doctor
  app.get("/api/auth/me", async (req, res) => {
    if (!req.session?.doctorId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const doctor = await storage.getDoctor(req.session.doctorId);
      if (!doctor) {
        return res.status(404).json({ message: "Doctor not found" });
      }

      res.json({ 
        doctor: { 
          id: doctor.id, 
          username: doctor.username,
          firstName: doctor.firstName,
          lastName: doctor.lastName,
          specialization: doctor.specialization 
        } 
      });
    } catch (error) {
      console.error("Get current doctor error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Middleware to check authentication
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session?.doctorId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    next();
  };

  // Patient routes
  app.get("/api/patients", requireAuth, async (req, res) => {
    try {
      const { search } = req.query;
      let patients;
      
      if (search && typeof search === 'string') {
        patients = await storage.searchPatients(req.session.doctorId!, search);
      } else {
        patients = await storage.getPatientsByDoctor(req.session.doctorId!);
      }
      
      res.json(patients);
    } catch (error) {
      console.error("Get patients error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/patients/:id", requireAuth, async (req, res) => {
    try {
      const patient = await storage.getPatient(req.params.id);
      if (!patient || patient.doctorId !== req.session.doctorId) {
        return res.status(404).json({ message: "Patient not found" });
      }
      res.json(patient);
    } catch (error) {
      console.error("Get patient error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/patients", requireAuth, async (req, res) => {
    try {
      const patientData = insertPatientSchema.parse({
        ...req.body,
        doctorId: req.session.doctorId,
      });
      
      const patient = await storage.createPatient(patientData);
      res.json(patient);
    } catch (error) {
      console.error("Create patient error:", error);
      res.status(400).json({ message: "Invalid patient data" });
    }
  });

  app.put("/api/patients/:id", requireAuth, async (req, res) => {
    try {
      const patient = await storage.getPatient(req.params.id);
      if (!patient || patient.doctorId !== req.session.doctorId) {
        return res.status(404).json({ message: "Patient not found" });
      }

      const updateData = insertPatientSchema.partial().parse(req.body);
      const updatedPatient = await storage.updatePatient(req.params.id, updateData);
      res.json(updatedPatient);
    } catch (error) {
      console.error("Update patient error:", error);
      res.status(400).json({ message: "Invalid patient data" });
    }
  });

  // Prescription routes
  // app.get("/api/prescriptions", requireAuth, async (req, res) => {
  //   try {
  //     console.log("Fetching prescriptions for doctorId:", req.session.doctorId);
  //     const prescriptions = await storage.getPrescriptionsByDoctor(req.session.doctorId);
  //     res.json(prescriptions);
  //   } catch (error) {
  //     console.error("Get prescriptions error:", error);
  //     res.status(500).json({ message: "Internal server error" });
  //   }
  // });

  app.get("/api/patients/:patientId/prescriptions", requireAuth, async (req, res) => {
    try {
      const patient = await storage.getPatient(req.params.patientId);
      if (!patient || patient.doctorId !== req.session.doctorId) {
        return res.status(404).json({ message: "Patient not found" });
      }

      const prescriptions = await storage.getPrescriptionsByPatient(req.params.patientId);
      res.json(prescriptions);
    } catch (error) {
      console.error("Get patient prescriptions error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/prescriptions", requireAuth, async (req, res) => {
    try {
      const prescriptionData = insertPrescriptionSchema.parse({
        ...req.body,
        doctorId: req.session.doctorId,
      });
      
      const prescription = await storage.createPrescription(prescriptionData);
      res.json(prescription);
    } catch (error) {
      console.error("Create prescription error:", error);
      res.status(400).json({ message: "Invalid prescription data" });
    }
  });

  // Get prescriptions for current doctor (for history page)
  app.get("/api/prescriptions", requireAuth, async (req, res) => {
    try {
      const prescriptions = await storage.getPrescriptionsByDoctor(req.session.doctorId!);
      res.json(prescriptions);

    } catch (error) {
      console.error("Error fetching prescriptions:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Email sending route
  // app.post("/api/prescriptions/:id/email", requireAuth, async (req, res) => {
  //   try {
  //     const prescriptionId = req.params.id;
  //     const { email } = req.body;
  //     const doctorId = req.session.doctorId;

  //     const prescriptions = await storage.getPrescriptionsByDoctor(doctorId!);
  //     const prescription = prescriptions.find(p => p.id === prescriptionId);
      
  //     if (!prescription) {
  //       return res.status(404).json({ message: "Prescription not found" });
  //     }

  //     const patient = await storage.getPatient(prescription.patientId);
  //     if(!patient) {
  //       return res.status(404).json({ message: "Patient not found" });
  //     }

  //     const doctorRecord = await storage.getDoctor(doctorId!);
  //     if(!doctorRecord) {
  //       return res.status(404).json({ message: "Doctor not found" });
  //     }

  //     const targetEmail = email || patient.email;
  //     if (!targetEmail) {
  //       return res.status(400).json({ message: "No email address provided for patient" });
  //     }

  //     const doctorForTemplate = {
  //       firstName: doctorRecord.firstName,
  //       lastName: doctorRecord.lastName,
  //       medicalLicenseId: doctorRecord.medicalLicenseId,
  //       specialization: doctorRecord.specialization ?? undefined,
  //     };

  //     const html = renderPrescriptionHTML({
  //       doctor: doctorForTemplate,
  //       patient,
  //       medicines: prescription.medicines,
  //       additionalNotes: prescription.additionalNotes ?? "",
  //       date: new Date().toLocaleDateString(),
  //     });

  //     const pdfBuffer = await htmlToPDF(html);

  //     return res.json({
  //       message: "Prescription email sent successfully",
  //       sentTo: targetEmail,
  //     });

  //   } catch (err) {
  //     console.error("Email prescription error:",err);
  //     res.status(500).json({ message: "Internal server error" });
  //   }
  // });

  app.post("/api/prescriptions/:id/email", requireAuth, async (req, res) => {
    try {
      console.log("📨 Sending prescription email:", req.params.id);

      const prescriptionId = req.params.id;
      const doctorId = req.session.doctorId;
      const { email: manualEmail } = req.body as { email?: string };

      // 1️⃣ Fetch prescription
      const prescriptions = await storage.getPrescriptionsByDoctor(doctorId!);
      const prescription = prescriptions.find(p => p.id === prescriptionId);

      if (!prescription) {
        return res.status(404).json({ message: "Prescription not found" });
      }

      // 2️⃣ Fetch patient
      const patient = await storage.getPatient(prescription.patientId);
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }

      // 3️⃣ Fetch doctor
      const doctorRecord = await storage.getDoctor(doctorId!);
      if (!doctorRecord) {
        return res.status(404).json({ message: "Doctor not found" });
      }

      // 4️⃣ Decide target email (manual > patient.email)
      const targetEmail = manualEmail ?? patient.email;
      if (!targetEmail) {
        return res.status(400).json({
          message: "No email address provided for patient",
        });
      }

      // 5️⃣ Prepare doctor data
      const doctorForTemplate = {
        firstName: doctorRecord.firstName,
        lastName: doctorRecord.lastName,
        medicalLicenseId: doctorRecord.medicalLicenseId,
        specialization: doctorRecord.specialization ?? undefined,
      };

      // 6️⃣ Generate prescription HTML
      const html = renderPrescriptionHTML({
        doctor: doctorForTemplate,
        patient,
        medicines: prescription.medicines,
        additionalNotes: prescription.additionalNotes ?? "",
        date: new Date().toLocaleDateString(),
      });

      console.log("📄 Generating PDF...");
      const pdfBuffer = await htmlToPDF(html);
      console.log("📄 PDF generated:", pdfBuffer.length, "bytes");

      console.log("✉️ Sending email...");
      const emailResult = await sendPrescriptionEmail(
        targetEmail,
        doctorForTemplate.firstName,
        patient.firstName,
        pdfBuffer
      );

      console.log("✅ Email sent:", emailResult);

      // 7️⃣ Respond ONLY after success
      return res.json({
        message: "Prescription email sent successfully",
        sentTo: targetEmail,
      });

    } catch (err) {
      console.error("❌ Email prescription error:", err);
      return res.status(500).json({
        message: "Failed to send prescription email",
      });
    }
  });


  // Dashboard stats
  app.get("/api/dashboard/stats", requireAuth, async (req, res) => {
    try {
      const patients = await storage.getPatientsByDoctor(req.session.doctorId!);
      const prescriptions = await storage.getPrescriptionsByDoctor(req.session.doctorId!);
      
      const today = new Date().toISOString().split('T')[0];
      const todayPrescriptions = prescriptions.filter(p => 
        p.createdAt && p.createdAt.toISOString().split('T')[0] === today
      );

      res.json({
        todayPatients: patients.filter(p => 
          p.createdAt && p.createdAt.toISOString().split('T')[0] === today
        ).length,
        prescriptions: todayPrescriptions.length,
        pendingReviews: 0, // Placeholder for future functionality
        totalPatients: patients.length,
      });
    } catch (error) {
      console.error("Get dashboard stats error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
