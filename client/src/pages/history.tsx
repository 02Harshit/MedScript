import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { generatePrescriptionPDF } from "@/utils/pdf-generator";

export default function History() {
  const { data: prescriptions, isLoading } = useQuery({
    queryKey: ["/api/prescriptions"],
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Prescription History</h1>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-blue mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading prescriptions...</p>
        </div>
      </div>
    );
  }

  const handleDownloadPDF = (prescription: any) => {
    generatePrescriptionPDF({
      doctor: prescription.doctor,
      patient: prescription.patient,
      medicines: typeof prescription.medicines === 'string' 
        ? JSON.parse(prescription.medicines) 
        : prescription.medicines,
      additionalNotes: prescription.additionalNotes || "",
      date: new Date(prescription.createdAt).toLocaleDateString(),
    });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900" data-testid="heading-history">
          Prescription History
        </h1>
      </div>

      {!prescriptions || (prescriptions as any[]).length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-prescription text-4xl text-gray-400"></i>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No prescriptions yet</h3>
          <p className="text-gray-600 mb-6">
            Once you create prescriptions, they will appear here for easy access and management.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {(prescriptions as any[]).map((prescription) => (
            <Card key={prescription.id} className="shadow-sm hover:shadow-md transition-shadow" data-testid={`prescription-card-${prescription.id}`}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Prescription #{prescription.id.slice(0, 8)}
                  </CardTitle>
                  <div className="text-sm text-gray-600">
                    {new Date(prescription.createdAt).toLocaleDateString()}
                  </div>
                </div>
                {prescription.patient && (
                  <div className="text-sm text-gray-600">
                    Patient: {prescription.patient.firstName} {prescription.patient.lastName}
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Medicines:</h4>
                    <div className="space-y-2">
                      {(typeof prescription.medicines === 'string' 
                        ? JSON.parse(prescription.medicines) 
                        : prescription.medicines
                      ).map((medicine: any, index: number) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                          <div className="font-medium text-gray-900">{medicine.name}</div>
                          <div className="text-sm text-gray-600">
                            {medicine.dosage} • {medicine.frequency} • {medicine.duration}
                          </div>
                          {medicine.instructions && (
                            <div className="text-sm text-gray-500 mt-1">
                              {medicine.instructions}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {prescription.additionalNotes && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Additional Notes:</h4>
                      <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">
                        {prescription.additionalNotes}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={() => handleDownloadPDF(prescription)}
                      className="bg-medical-blue hover:bg-blue-700"
                      data-testid={`button-download-${prescription.id}`}
                    >
                      <i className="fas fa-download mr-2"></i>
                      Download PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}