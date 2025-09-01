interface PrescriptionData {
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
  medicines: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
  }>;
  additionalNotes: string;
  date: string;
}

export const generatePrescriptionPDF = (data: PrescriptionData) => {
  // Create a new window for the prescription
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  
  if (!printWindow) {
    alert('Please allow popups to generate the prescription PDF');
    return;
  }

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const prescriptionHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Medical Prescription - Dr. ${data.doctor?.firstName || "unknown"} ${data.doctor?.lastName || "unknown"}</title>
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
        </style>
    </head>
    <body>
        <div class="header">
            <div class="doctor-info">
                <h1 class="doctor-name">Dr. ${data.doctor?.firstName || "unknown"} ${data.doctor?.lastName || "unknown"}</h1>
                <p class="doctor-specialty">${data.doctor?.specialization || 'MD'}</p>
                <p class="license-info">Medical License: ${data.doctor?.medicalLicenseId || "unknown"}</p>
            </div>
        </div>

        <div class="patient-section">
            <h2 class="section-title">Patient Information</h2>
            <div class="patient-info">
                <div class="info-group">
                    <div class="info-label">Patient Name:</div>
                    <div class="info-value">${data.patient?.firstName || "unknown"} ${data.patient?.lastName || "unknown"}</div>
                </div>
                <div class="info-group">
                    <div class="info-label">Age:</div>
                    <div class="info-value">${calculateAge(data.patient?.dateOfBirth)|| "unknown"} years</div>
                </div>
                <div class="info-group">
                    <div class="info-label">Phone:</div>
                    <div class="info-value">${data.patient?.phone || "unknown"}</div>
                </div>
                <div class="info-group">
                    <div class="info-label">Date:</div>
                    <div class="info-value">${data?.date || "unknown"}</div>
                </div>
            </div>
        </div>

        <div class="prescription-section">
            <h2 class="section-title">℞ Prescription</h2>
            ${data.medicines.map((medicine, index) => `
                <div class="medicine-item">
                    <div class="medicine-name">${index + 1}. ${medicine.name || "unknown"} ${medicine.dosage || "unknown"}</div>
                    <div class="medicine-details">
                        <div class="medicine-detail">
                            <span class="detail-label">Frequency:</span>
                            <span class="detail-value">${medicine.frequency || "unknown"}</span>
                        </div>
                        <div class="medicine-detail">
                            <span class="detail-label">Duration:</span>
                            <span class="detail-value">${medicine.duration || "unknown"}</span>
                        </div>
                    </div>
                    ${medicine.instructions ? `<div class="medicine-instructions">Instructions: ${medicine.instructions || "unknown"}</div>` : ''}
                </div>
            `).join('')}
        </div>

        ${data.additionalNotes ? `
            <div class="notes-section">
                <h3 class="section-title" style="margin-bottom: 10px; font-size: 16px;">Additional Notes:</h3>
                <p style="margin: 0;">${data.additionalNotes || "unknown"}</p>
            </div>
        ` : ''}

        <div class="footer">
            <div class="date-issued">
                Date Issued: ${data.date || "unknown"}
            </div>
            <div class="signature-section">
                <div class="signature-line"></div>
                <div style="font-size: 14px; color: #6b7280;">
                    Dr. ${data.doctor?.firstName || "unknown"} ${data.doctor?.lastName || "unknown"}
                </div>
            </div>
        </div>

        <div class="no-print" style="text-align: center; margin-top: 30px;">
            <button onclick="window.print()" style="
                background: #2563EB;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 6px;
                font-size: 16px;
                cursor: pointer;
                margin-right: 10px;
            ">Print Prescription</button>
            <button onclick="window.close()" style="
                background: #6b7280;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 6px;
                font-size: 16px;
                cursor: pointer;
            ">Close</button>
        </div>
    </body>
    </html>
  `;

  printWindow.document.write(prescriptionHTML);
  printWindow.document.close();
};
