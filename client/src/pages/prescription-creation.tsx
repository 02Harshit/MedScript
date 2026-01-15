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
import { set } from "date-fns";



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
  type PrescriptionStage = | "idle" | "recording" | "transcribed" | "processed" | "saved";
  const [stage, setStage] = useState<PrescriptionStage>("idle");
  const [transcribedText, setTranscribedText] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [prescriptionId, setPrescriptionId] = useState<string | null>(null); //store id in state on save to send with email
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [manualEmail, setManualEmail] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const { data: patients } = useQuery({
    queryKey: ["/api/patients"],
  });

  const { data: currentDoctor } = useQuery({
    queryKey: ["/api/auth/me"],
  });

  const form = useForm<PrescriptionForm>({
    resolver: stage === "processed" ? zodResolver(prescriptionSchema) : undefined,
    defaultValues: {
      patientId: "",
      medicines: [
        { name: "", dosage: "", frequency: "", duration: "", instructions: "" },
      ],
      additionalNotes: "",
      transcribedText: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "medicines",
  });

  const selectedPatientId = form.watch("patientId");
  const selectedPatient = (patients as any[])?.find((p: any) => p.id === selectedPatientId);

  const savePrescriptionMutation = useMutation({
    mutationFn: (data: PrescriptionForm) => apiRequest("POST", "/api/prescriptions", data),
    onSuccess: (savedPrescription : any) => {
      console.log("Saved prescription:", savedPrescription);
      toast({
        title: "Prescription saved",
        description: "Prescription has been saved successfully",
      });

      setPrescriptionId(savedPrescription.id);
      setStage("saved");
      queryClient.invalidateQueries({ queryKey: ["/api/prescriptions"] });
      // form.reset();
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
      doctor: (currentDoctor as any).doctor,
      patient: selectedPatient,
      medicines: prescriptionData.medicines,
      additionalNotes: prescriptionData.additionalNotes || "",
      date: new Date().toLocaleDateString(),
    });
  };

  const handleTranscriptionProcessed = (text: string, medicines: any[]) => {
    setTranscribedText(text);
    setStage("processed");

    if (medicines.length > 0) {
      form.setValue("medicines", medicines, {
        shouldValidate: false,
      });

      toast({
        title: "Prescription processed",
        description: "Medicines extracted. Please review before saving.",
      });
    }
  };

  const handleEmailPrescription = async (email?: string) => {
    if (!prescriptionId) {
      toast({
        title: "Prescription not saved",
        description: "Please save the prescription before emailing.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSendingEmail(true);

      await apiRequest("POST", `/api/prescriptions/${prescriptionId}/email`, email ? { email } : {});

      toast({
        title: "Email sent",
        description: `Prescription emailed to ${email || selectedPatient?.email}`,
      })

      setShowEmailModal(false);
      setManualEmail("");
    } catch (error: any) {
      toast({
        title: "Failed to send email",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSendingEmail(false);
    }      
  }
  

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
                            {(patients as any[])?.map((patient: any) => (
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
                              <Input {...field} placeholder="e.g., Paracetamol" data-testid={`input-medicine-name-${index}`} />
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
                <Button
                  type="button"
                  className="mt-4 bg-success-green hover:bg-green-700 text-white"
                  onClick={() => {
                    const medicines = form.getValues("medicines");

                    if (medicines.every(m => !m.name)) {
                      toast({
                        title: "No medicines added",
                        description: "Please add at least one medicine before processing.",
                        variant: "destructive",
                      });
                      return;
                    }

                    setStage("processed");
                    toast({
                      title: "Prescription ready",
                      description: "Please review the prescription and save.",
                    });
                  }}
                >
                  <i className="fas fa-check-circle mr-2"></i>
                  Process Prescription
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-6 shadow-md">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Prescription Preview
                </h3>

                {/* Doctor Info */}
                <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-5 mb-5">
                  <div className="text-center mb-3">
                    <h4 className="font-bold text-xl text-gray-900">
                      Dr. {(currentDoctor as any)?.doctor?.firstName}{" "}
                      {(currentDoctor as any)?.doctor?.lastName}
                    </h4>
                    <p className="text-medical-blue font-medium">
                      {(currentDoctor as any)?.doctor?.specialization || "MD"}
                    </p>
                  </div>
                  <div className="border-t border-gray-200 pt-3 text-sm text-gray-700">
                    <p className="mb-1">
                      <span className="font-medium">Patient:</span>{" "}
                      {selectedPatient
                        ? `${selectedPatient.firstName} ${selectedPatient.lastName}`
                        : "Not selected"}
                    </p>
                    <p>
                      <span className="font-medium">Date:</span>{" "}
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Prescription Items */}
                <div className="space-y-3 mb-6">
                  {form.watch("medicines").map(
                    (medicine, index) =>
                      medicine.name && (
                        <div
                          key={index}
                          className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                          data-testid={`preview-medicine-${index}`}
                        >
                          <p className="font-semibold text-gray-900">
                            {medicine.name} {medicine.dosage}
                          </p>
                          <p className="text-sm text-gray-700">
                            {medicine.frequency} • {medicine.duration}
                          </p>
                          {medicine.instructions && (
                            <p className="text-sm text-gray-500 italic">
                              {medicine.instructions}
                            </p>
                          )}
                        </div>
                      )
                  )}
                  {form.watch("medicines").every((m) => !m.name) && (
                    <div className="p-3 bg-gray-50 rounded-lg text-center text-gray-500 border border-dashed border-gray-300">
                      No medicines added yet
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">

                  {/* Save only after processing */}
                  {stage === "processed" && (
                    <Button
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-medium"
                      disabled={savePrescriptionMutation.isPending}
                      data-testid="button-save-prescription"
                    >
                      <i className="fas fa-save mr-2"></i>
                      {savePrescriptionMutation.isPending ? "Saving..." : "Save Prescription"}
                    </Button>
                  )}

                  {/* Post-save actions */}
                  {stage === "saved" && (
                    <>
                      <Button
                        type="button"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
                        onClick={handleGeneratePDF}
                      >
                        <i className="fas fa-file-pdf mr-2"></i>
                        Generate PDF
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        className="w-full border-gray-300 text-gray-700 font-medium hover:bg-gray-100"
                        onClick = {() => {
                          if(selectedPatient?.email) {
                            handleEmailPrescription(); // direct send
                          } else {
                            setShowEmailModal(true); // ask doctor to input email
                          }
                        }}
                        disabled={isSendingEmail}
                      >
                        { isSendingEmail ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5 text-gray-600" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                            </svg>
                            Sending...
                          </span>
                        ) : (
                          <>
                            <i className="fas fa-envelope mr-2"></i>
                            Email to Patient
                          </>
                        )}
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full text-gray-500"
                        onClick={() => {
                          form.reset();
                          setStage("idle");
                        }}
                      >
                        New Prescription
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </Form>
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-2">
              Enter Patient Email
            </h3>

            <Input
              type="email"
              placeholder="example@email.com"
              value={manualEmail}
              onChange={(e) => setManualEmail(e.target.value)}
            />

            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="ghost"
                onClick={() => setShowEmailModal(false)}
              >
                Cancel
              </Button>

              <Button
                disabled={!manualEmail || isSendingEmail}
                onClick={() => handleEmailPrescription(manualEmail)}
              >
                {isSendingEmail ? "Sending..." : "Send Email"}
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
