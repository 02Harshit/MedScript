export interface PrescriptionData {
  doctor: {
    firstName: string;
    lastName: string;
    specialization?: string;
    medicalLicenseId: string;
  };
  patient: {
    firstName: string;
    lastName: string;
    phone: string;
    dateOfBirth: string;
  };
  medicines: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
  }[];
  additionalNotes: string;
  date: string;
}
