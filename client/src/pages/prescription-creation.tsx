import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import VoiceRecorder from "@/components/voice-recorder";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { generatePrescriptionPDF } from "@/utils/pdf-generator";

const medicineSchema = z.object({
  name: z.string().min(1, "Medicine name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  frequency: z.string().min(1, "Frequency is required"),
  duration: z.string().min(1, "Duration is required"),
  instructions: z.string().optional(),
});

const prescriptionSchema = z.object({
  patientId: z.string().min(1, "Patient selection is required"),
  medicines: z.array(medicineSchema).min(1, "At least one medicine is required"),
  additionalNotes: z.string().optional(),
  transcribedText: z.string().optional(),
});

type PrescriptionForm = z.infer<typeof prescriptionSchema>;

export default function PrescriptionCreation() {
  const [transcribedText, setTranscribedText] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: patients } = useQuery({
    queryKey: ["/api/patients"],
  });

  const { data: currentDoctor } = useQuery({
    queryKey: ["/api/auth/me"],
  });

  const form = useForm<PrescriptionForm>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      patientId: "",
      medicines: [{ name: "", dosage: "", frequency: "", duration: "", instructions: "" }],
      additionalNotes: "",
      transcribedText: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "medicines",
  });

  const selectedPatientId = form.watch("patientId");
  const selectedPatient = patients?.find((p: any) => p.id === selectedPatientId);

  const savePrescriptionMutation = useMutation({
    mutationFn: (data: PrescriptionForm) => apiRequest("POST", "/api/prescriptions", data),
    onSuccess: () => {
      toast({
        title: "Prescription saved",
        description: "Prescription has been saved successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/prescriptions"] });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to save prescription",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PrescriptionForm) => {
    savePrescriptionMutation.mutate({
      ...data,
      transcribedText: transcribedText || undefined,
    });
  };

  const handleGeneratePDF = () => {
    if (!selectedPatient || !currentDoctor) {
      toast({
        title: "Missing information",
        description: "Please select a patient and ensure you're logged in",
        variant: "destructive",
      });
      return;
    }

    const prescriptionData = form.getValues();
    generatePrescriptionPDF({
      doctor: currentDoctor.doctor,
      patient: selectedPatient,
      medicines: prescriptionData.medicines,
      additionalNotes: prescriptionData.additionalNotes || "",
      date: new Date().toLocaleDateString(),
    });
  };

  const handleTranscriptionProcessed = (text: string, medicines: any[]) => {
    setTranscribedText(text);
    if (medicines.length > 0) {
      form.setValue("medicines", medicines);
      toast({
        title: "Prescription processed",
        description: "Medicines have been extracted and added to the form",
      });
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Create New Prescription</h2>
        <p className="text-gray-600">Use voice input or manual entry to create prescriptions</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            {/* Patient Selection */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="patientId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Patient</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-patient">
                              <SelectValue placeholder="Choose a patient" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {patients?.map((patient: any) => (
                              <SelectItem key={patient.id} value={patient.id}>
                                {patient.firstName} {patient.lastName} ({patient.phone})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <Input
                      type="date"
                      defaultValue={new Date().toISOString().split('T')[0]}
                      data-testid="input-date"
                    />
                  </FormItem>
                </div>
              </CardContent>
            </Card>

            {/* Voice Recording */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Voice Recording</h3>
                <VoiceRecorder onTranscriptionProcessed={handleTranscriptionProcessed} />
              </CardContent>
            </Card>

            {/* Manual Entry */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Prescription Details</h3>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => append({ name: "", dosage: "", frequency: "", duration: "", instructions: "" })}
                    data-testid="button-add-medicine"
                  >
                    <i className="fas fa-plus mr-1"></i>
                    Add Medicine
                  </Button>
                </div>

                {fields.map((field, index) => (
                  <div key={field.id} className="border border-gray-200 rounded-xl p-4 mb-4 last:mb-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`medicines.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Medicine Name</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., Amoxicillin" data-testid={`input-medicine-name-${index}`} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`medicines.${index}.dosage`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dosage</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., 500mg" data-testid={`input-medicine-dosage-${index}`} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`medicines.${index}.frequency`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Frequency</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid={`select-medicine-frequency-${index}`}>
                                  <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Once daily">Once daily</SelectItem>
                                <SelectItem value="Twice daily">Twice daily</SelectItem>
                                <SelectItem value="Three times daily">Three times daily</SelectItem>
                                <SelectItem value="Four times daily">Four times daily</SelectItem>
                                <SelectItem value="As needed">As needed</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`medicines.${index}.duration`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Duration</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g., 7 days" data-testid={`input-medicine-duration-${index}`} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="mt-4">
                      <FormField
                        control={form.control}
                        name={`medicines.${index}.instructions`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Instructions</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="Take after meals..."
                                rows={2}
                                data-testid={`textarea-medicine-instructions-${index}`}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => remove(index)}
                        className="mt-2 text-red-600 hover:text-red-700"
                        data-testid={`button-remove-medicine-${index}`}
                      >
                        <i className="fas fa-trash mr-1"></i>
                        Remove
                      </Button>
                    )}
                  </div>
                ))}

                <FormField
                  control={form.control}
                  name="additionalNotes"
                  render={({ field }) => (
                    <FormItem className="mt-6">
                      <FormLabel>Additional Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Any additional instructions or notes..."
                          rows={3}
                          data-testid="textarea-additional-notes"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Preview */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Prescription Preview</h3>

                {/* Doctor Info */}
                <div className="bg-gradient-to-br from-medical-blue to-blue-600 text-white p-6 rounded-xl mb-4">
                  <div className="text-center mb-4">
                    <h4 className="font-bold text-lg">
                      Dr. {currentDoctor?.doctor?.firstName} {currentDoctor?.doctor?.lastName}
                    </h4>
                    <p className="text-blue-100">{currentDoctor?.doctor?.specialization || 'MD'}</p>
                    <p className="text-blue-100 text-sm">License: {currentDoctor?.doctor?.medicalLicenseId}</p>
                  </div>
                  <div className="border-t border-blue-400 pt-4">
                    <p className="text-sm font-medium mb-1">
                      Patient: <span>{selectedPatient ? `${selectedPatient.firstName} ${selectedPatient.lastName}` : 'Not selected'}</span>
                    </p>
                    <p className="text-sm font-medium mb-1">
                      Date: <span>{new Date().toLocaleDateString()}</span>
                    </p>
                  </div>
                </div>

                {/* Prescription Items */}
                <div className="space-y-3 mb-6">
                  {form.watch("medicines").map((medicine, index) => (
                    medicine.name && (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg" data-testid={`preview-medicine-${index}`}>
                        <p className="font-medium text-gray-900">{medicine.name} {medicine.dosage}</p>
                        <p className="text-sm text-gray-600">{medicine.frequency} • {medicine.duration}</p>
                        {medicine.instructions && (
                          <p className="text-sm text-gray-500">{medicine.instructions}</p>
                        )}
                      </div>
                    )
                  ))}
                  {form.watch("medicines").every(m => !m.name) && (
                    <div className="p-3 bg-gray-50 rounded-lg text-center text-gray-500">
                      No medicines added yet
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    type="submit"
                    className="w-full bg-success-green hover:bg-green-700"
                    disabled={savePrescriptionMutation.isPending}
                    data-testid="button-save-prescription"
                  >
                    <i className="fas fa-save mr-2"></i>
                    {savePrescriptionMutation.isPending ? "Saving..." : "Save Prescription"}
                  </Button>
                  <Button
                    type="button"
                    className="w-full"
                    onClick={handleGeneratePDF}
                    data-testid="button-generate-pdf"
                  >
                    <i className="fas fa-file-pdf mr-2"></i>
                    Generate PDF
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    data-testid="button-email-patient"
                  >
                    <i className="fas fa-envelope mr-2"></i>
                    Email to Patient
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </Form>
    </div>
  );
}
