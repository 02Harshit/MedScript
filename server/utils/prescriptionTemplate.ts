export function generatePrescriptionHTML(data: {
  doctor: {
    firstName: string;
    lastName: string;
    specialization?: string;
    medicalLicenseId?: string;
  };
  patient: {
    firstName: string;
    lastName: string;
    phone: string;
    dateOfBirth: string;
  };
  medicines: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
  }>;
  date: string;
}) {
  const calculateAge = (dob: string) => {
    const d = new Date(dob);
    const diff = Date.now() - d.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
  };

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 40px;
      color: #1f2937;
    }
    h1 {
      color: #2563eb;
      text-align: center;
    }
    .section {
      margin-top: 30px;
    }
    .box {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 16px;
    }
    .medicine {
      margin-bottom: 12px;
    }
  </style>
</head>
<body>

<h1>Dr. ${data.doctor.firstName} ${data.doctor.lastName}</h1>
<p style="text-align:center">
  ${data.doctor.specialization || "MD"} <br/>
  License: ${data.doctor.medicalLicenseId || "N/A"}
</p>

<div class="section box">
  <strong>Patient:</strong> ${data.patient.firstName} ${data.patient.lastName}<br/>
  <strong>Age:</strong> ${calculateAge(data.patient.dateOfBirth)} years<br/>
  <strong>Phone:</strong> ${data.patient.phone}<br/>
  <strong>Date:</strong> ${data.date}
</div>

<div class="section box">
  <h3>℞ Prescription</h3>
  ${data.medicines
    .map(
      (m, i) => `
      <div class="medicine">
        <strong>${i + 1}. ${m.name} ${m.dosage}</strong><br/>
        ${m.frequency} • ${m.duration}<br/>
        ${m.instructions ? `<em>${m.instructions}</em>` : ""}
      </div>
    `
    )
    .join("")}
</div>

<div class="section" style="text-align:right; margin-top:50px">
  <div style="border-top:1px solid #999; width:200px; margin-left:auto"></div>
  Dr. ${data.doctor.firstName} ${data.doctor.lastName}
</div>

</body>
</html>
`;
}
