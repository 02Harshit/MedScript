let recognition: any | null = null;
let isListening = false;

export const startSpeechRecognition = (onResult: (transcript: string) => void): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      reject(new Error('Speech recognition not supported in this browser'));
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    let finalTranscript = '';

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }
      
      onResult(finalTranscript + interimTranscript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      reject(new Error(`Speech recognition error: ${event.error}`));
    };

    recognition.onstart = () => {
      isListening = true;
      resolve();
    };

    recognition.onend = () => {
      isListening = false;
    };

    try {
      recognition.start();
    } catch (error) {
      reject(error);
    }
  });
};

export const stopSpeechRecognition = () => {
  if (recognition && isListening) {
    recognition.stop();
    recognition = null;
    isListening = false;
  }
};

export const isSpeechRecognitionSupported = (): boolean => {
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
};

// Extend the Window interface to include speech recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
