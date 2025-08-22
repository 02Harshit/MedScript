import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { startSpeechRecognition, stopSpeechRecognition } from "@/utils/speech-recognition";
import { parsePrescriptionText } from "@/utils/prescription-parser";

interface VoiceRecorderProps {
  onTranscriptionProcessed: (text: string, medicines: any[]) => void;
}

export default function VoiceRecorder({ onTranscriptionProcessed }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");
  const { toast } = useToast();

  const handleStartRecording = async () => {
    try {
      setIsRecording(true);
      await startSpeechRecognition((transcript) => {
        setTranscribedText(transcript);
      });
    } catch (error) {
      toast({
        title: "Recording failed",
        description: "Could not start voice recording. Please check your microphone permissions.",
        variant: "destructive",
      });
      setIsRecording(false);
    }
  };

  const handleStopRecording = () => {
    stopSpeechRecognition();
    setIsRecording(false);
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      handleStopRecording();
    } else {
      handleStartRecording();
    }
  };

  const handleProcessPrescription = () => {
    if (!transcribedText) {
      toast({
        title: "No text to process",
        description: "Please record some audio first.",
        variant: "destructive",
      });
      return;
    }

    const medicines = parsePrescriptionText(transcribedText);
    
    if (medicines.length > 0 && medicines[0].name) {
      toast({
        title: "Processing complete",
        description: `Extracted ${medicines.length} medicine(s) from your speech.`,
      });
    } else {
      toast({
        title: "No medicines detected",
        description: "Please try speaking more clearly about specific medicines.",
        variant: "destructive",
      });
    }
    
    onTranscriptionProcessed(transcribedText, medicines);
  };

  return (
    <div>
      <div className="text-center p-8 border-2 border-dashed border-gray-200 rounded-xl">
        <div className="mb-4">
          <i className={`text-4xl mb-4 ${isRecording ? 'fas fa-microphone-alt text-red-500 animate-pulse' : 'fas fa-microphone text-medical-blue'}`}></i>
        </div>
        <h4 className="text-lg font-medium text-gray-900 mb-2">
          {isRecording ? 'Recording...' : 'Click to Start Recording'}
        </h4>
        <p className="text-gray-600 mb-4">
          {isRecording ? 'Speak clearly about the prescription' : 'Speak naturally about the prescription details'}
        </p>
        <Button
          onClick={handleToggleRecording}
          className={`px-6 py-3 rounded-xl font-semibold transition-colors ${
            isRecording 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-medical-blue hover:bg-blue-700 text-white'
          }`}
          data-testid="button-toggle-recording"
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </Button>
      </div>

      {transcribedText && (
        <div className="mt-6" data-testid="section-transcription">
          <label className="block text-sm font-medium text-gray-700 mb-2">Transcribed Text</label>
          <Textarea
            value={transcribedText}
            onChange={(e) => setTranscribedText(e.target.value)}
            className="resize-none"
            rows={4}
            placeholder="Transcribed text will appear here..."
            data-testid="textarea-transcription"
          />
          <Button
            onClick={handleProcessPrescription}
            className="mt-3 bg-success-green hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
            data-testid="button-process-prescription"
          >
            <i className="fas fa-magic mr-2"></i>
            Process Prescription
          </Button>
        </div>
      )}
    </div>
  );
}
