import type { PrescriptionData } from "./types";

export function renderPrescriptionHTML(data: PrescriptionData): string {
  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Medical Prescription</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            line-height: 1.6;
            color: #333;
            background: white;
        }
        
        .header {
            border-bottom: 3px solid #2563EB;
            padding-bottom: 20px;
            margin-bottom: 30px;
            text-align: center;
        }
        
        .doctor-info {
            margin-bottom: 15px;
        }
        
        .doctor-name {
            font-size: 24px;
            font-weight: bold;
            color: #2563EB;
            margin: 0;
        }
        
        .doctor-specialty {
            font-size: 16px;
            color: #666;
            margin: 5px 0;
        }
        
        .license-info {
            font-size: 14px;
            color: #666;
        }
        
        .patient-section {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 30px;
        }
        
        .patient-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }
        
        .info-group {
            margin-bottom: 10px;
        }
        
        .info-label {
            font-weight: 600;
            color: #374151;
            margin-bottom: 2px;
        }
        
        .info-value {
            color: #6b7280;
        }
        
        .prescription-section {
            margin-bottom: 30px;
        }
        
        .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #2563EB;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 5px;
            margin-bottom: 20px;
        }
        
        .medicine-item {
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            margin-bottom: 15px;
            padding: 15px;
            background: white;
        }
        
        .medicine-name {
            font-size: 16px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 8px;
        }
        
        .medicine-details {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 10px;
            margin-bottom: 8px;
        }
        
        .medicine-detail {
            font-size: 14px;
        }
        
        .detail-label {
            font-weight: 600;
            color: #4b5563;
        }
        
        .detail-value {
            color: #6b7280;
        }
        
        .medicine-instructions {
            font-size: 14px;
            color: #059669;
            font-style: italic;
            margin-top: 5px;
        }
        
        .notes-section {
            background: #fef3c7;
            border: 1px solid #fbbf24;
            border-radius: 6px;
            padding: 15px;
            margin-bottom: 30px;
        }
        
        .footer {
            border-top: 2px solid #e5e7eb;
            padding-top: 20px;
            margin-top: 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .signature-section {
            text-align: right;
        }
        
        .signature-line {
            border-bottom: 1px solid #6b7280;
            width: 200px;
            height: 40px;
            margin-bottom: 5px;
            margin-left: auto;
        }
        
        .date-issued {
            font-size: 14px;
            color: #6b7280;
        }
        
        @media print {
            body {
                padding: 20px;
            }
            
            .no-print {
                display: none;
            }
        }
    /* ... rest unchanged ... */
    </style>
</head>

<body>
  <div class="header">
    <h1 class="doctor-name">
      Dr. ${data.doctor.firstName} ${data.doctor.lastName}
    </h1>
    <p class="doctor-specialty">${data.doctor.specialization ?? "MD"}</p>
    <p class="license-info">
      Medical License: ${data.doctor.medicalLicenseId}
    </p>
  </div>

  <div class="patient-section">
    <h2 class="section-title">Patient Information</h2>
    <div class="patient-info">
      <div>
        <strong>Patient:</strong>
        ${data.patient.firstName} ${data.patient.lastName}
      </div>
      <div>
        <strong>Age:</strong>
        ${calculateAge(data.patient.dateOfBirth)} years
      </div>
      <div>
        <strong>Phone:</strong>
        ${data.patient.phone}
      </div>
      <div>
        <strong>Date:</strong>
        ${data.date}
      </div>
    </div>
  </div>

  <div class="prescription-section">
    <h2 class="section-title">℞ Prescription</h2>

    ${data.medicines
      .map(
        (m, i) => `
        <div class="medicine-item">
          <div class="medicine-name">
            ${i + 1}. ${m.name} ${m.dosage}
          </div>
          <div>
            Frequency: ${m.frequency} • Duration: ${m.duration}
          </div>
          ${m.instructions ? `<em>${m.instructions}</em>` : ""}
        </div>
      `
      )
      .join("")}
  </div>

  ${
    data.additionalNotes
      ? `<div class="notes-section">${data.additionalNotes}</div>`
      : ""
  }

  <div class="footer">
    <div>Date Issued: ${data.date}</div>
    <div>Dr. ${data.doctor.firstName} ${data.doctor.lastName}</div>
  </div>
</body>
</html>
`;
}
