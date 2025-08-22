import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface PatientDetailsModalProps {
  patient: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PatientDetailsModal({ patient, open, onOpenChange }: PatientDetailsModalProps) {
  const { data: prescriptions } = useQuery({
    queryKey: [`/api/patients/${patient?.id}/prescriptions`],
    enabled: open && !!patient?.id,
  });

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

  if (!patient) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-screen overflow-y-auto" data-testid="modal-patient-details">
        <DialogHeader>
          <DialogTitle>Patient Details</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          {/* Patient Info */}
          <div className="lg:col-span-1">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">
                  {patient.firstName[0]}{patient.lastName[0]}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900" data-testid="text-patient-name">
                {patient.firstName} {patient.lastName}
              </h3>
              <p className="text-gray-600" data-testid="text-patient-id">
                {patient.id.slice(0, 8)}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Age</label>
                <p className="text-gray-900" data-testid="text-patient-age">
                  {calculateAge(patient.dateOfBirth)} years
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Gender</label>
                <p className="text-gray-900" data-testid="text-patient-gender">
                  {patient.gender}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                <p className="text-gray-900" data-testid="text-patient-phone">
                  {patient.phone}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                <p className="text-gray-900" data-testid="text-patient-email">
                  {patient.email || 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Address</label>
                <p className="text-gray-900" data-testid="text-patient-address">
                  {patient.address || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Medical History & Prescriptions */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Medical History</h4>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Blood Type:</span>
                    <span className="font-medium text-gray-900" data-testid="text-patient-blood-type">
                      {patient.bloodType || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Emergency Contact:</span>
                    <span className="font-medium text-gray-900" data-testid="text-patient-emergency-contact">
                      {patient.emergencyContact || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Allergies:</span>
                    <span className="font-medium text-gray-900" data-testid="text-patient-allergies">
                      {patient.allergies || 'None'}
                    </span>
                  </div>
                </div>
                {patient.medicalHistory && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <label className="block text-sm font-medium text-gray-500 mb-2">Medical History</label>
                    <p className="text-gray-900 text-sm" data-testid="text-patient-medical-history">
                      {patient.medicalHistory}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Prescriptions</h4>
              <div className="space-y-4">
                {(prescriptions as any[]) && (prescriptions as any[]).length > 0 ? (
                  (prescriptions as any[]).map((prescription: any) => (
                    <div key={prescription.id} className="border border-gray-200 rounded-xl p-4" data-testid={`prescription-${prescription.id}`}>
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">
                          {new Date(prescription.createdAt).toLocaleDateString()}
                        </h5>
                      </div>
                      <div className="space-y-2">
                        {prescription.medicines.map((medicine: any, index: number) => (
                          <div key={index} className="flex justify-between">
                            <span className="text-gray-600">{medicine.name} {medicine.dosage}</span>
                            <span className="text-sm text-gray-500">{medicine.frequency}, {medicine.duration}</span>
                          </div>
                        ))}
                      </div>
                      {prescription.additionalNotes && (
                        <div className="mt-2 pt-2 border-t border-gray-100">
                          <p className="text-sm text-gray-600">{prescription.additionalNotes}</p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="border border-gray-200 rounded-xl p-4 text-center text-gray-500">
                    No prescriptions yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
