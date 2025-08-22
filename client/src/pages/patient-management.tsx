import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import PatientDetailsModal from "@/components/patient-details-modal";
import AddPatientModal from "@/components/add-patient-modal";
import { Link } from "wouter";

export default function PatientManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const { data: patients, isLoading } = useQuery({
    queryKey: ["/api/patients", searchQuery],
    queryFn: async () => {
      const url = searchQuery ? `/api/patients?search=${encodeURIComponent(searchQuery)}` : "/api/patients";
      const response = await fetch(url, { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch patients");
      return response.json();
    },
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-blue"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Patient Management</h2>
          <p className="text-gray-600">Search, view, and manage patient records</p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2"
          data-testid="button-add-patient"
        >
          <i className="fas fa-user-plus"></i>
          <span>Add New Patient</span>
        </Button>
      </div>

      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Patients</label>
              <div className="relative">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, ID, or phone..."
                  className="pl-10"
                  data-testid="input-search"
                />
                <i className="fas fa-search absolute left-3 top-3.5 text-gray-400"></i>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age Group</label>
              <Select>
                <SelectTrigger data-testid="select-age-group">
                  <SelectValue placeholder="All Ages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ages</SelectItem>
                  <SelectItem value="0-18">0-18</SelectItem>
                  <SelectItem value="19-35">19-35</SelectItem>
                  <SelectItem value="36-60">36-60</SelectItem>
                  <SelectItem value="60+">60+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <Select>
                <SelectTrigger data-testid="select-gender">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patient List */}
      <Card>
        <CardContent className="p-0">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">Patient Records</h3>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Age/Gender</TableHead>
                  <TableHead>Last Visit</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients && patients.length > 0 ? (
                  patients.map((patient: any) => (
                    <TableRow key={patient.id} className="hover:bg-gray-50" data-testid={`row-patient-${patient.id}`}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {patient.firstName[0]}{patient.lastName[0]}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{patient.firstName} {patient.lastName}</p>
                            <p className="text-sm text-gray-500">ID: {patient.id.slice(0, 8)}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm text-gray-900">{patient.phone}</p>
                          <p className="text-sm text-gray-500">{patient.email || 'N/A'}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-900">
                          {calculateAge(patient.dateOfBirth)} • {patient.gender}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-900">
                          {patient.createdAt ? new Date(patient.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedPatient(patient)}
                            className="p-2 text-medical-blue hover:bg-blue-50"
                            data-testid={`button-view-${patient.id}`}
                          >
                            <i className="fas fa-eye text-sm"></i>
                          </Button>
                          <Link href="/prescriptions/new">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-2 text-success-green hover:bg-green-50"
                              data-testid={`button-prescribe-${patient.id}`}
                            >
                              <i className="fas fa-prescription text-sm"></i>
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-2 text-gray-600 hover:bg-gray-50"
                            data-testid={`button-edit-${patient.id}`}
                          >
                            <i className="fas fa-edit text-sm"></i>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="text-gray-500">
                        {searchQuery ? "No patients found matching your search" : "No patients yet"}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      {selectedPatient && (
        <PatientDetailsModal
          patient={selectedPatient}
          open={!!selectedPatient}
          onOpenChange={() => setSelectedPatient(null)}
        />
      )}

      <AddPatientModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
      />
    </div>
  );
}
