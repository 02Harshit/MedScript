interface ParsedMedicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export const parsePrescriptionText = (text: string): ParsedMedicine[] => {
  const medicines: ParsedMedicine[] = [];
  const cleanText = text.toLowerCase().trim();

  // Common medicine name patterns
  const medicinePatterns = [
    /(\w*cillin|ibuprofen|acetaminophen|aspirin|metformin|lisinopril|amlodipine|atorvastatin|omeprazole|levothyroxine|paracetamol|diclofenac|naproxen|warfarin|insulin|furosemide|doxycycline|tramadol|codeine|morphine|gabapentin|sertraline|fluoxetine|lorazepam|diazepam)\s*(\d+\s*(?:mg|mcg|g|ml|units?))?/gi,
    /(tablet|capsule|syrup|injection|cream|ointment|drops)\s+of\s+(\w+)/gi,
    /(\w+)\s+(\d+\s*(?:mg|mcg|g|ml|units?))/gi,
  ];

  // Dosage patterns
  const dosagePatterns = [
    /(\d+\s*(?:mg|mcg|g|ml|units?))/gi,
    /(\d+\s*milligrams?|\d+\s*micrograms?|\d+\s*grams?)/gi,
  ];

  // Frequency patterns
  const frequencyPatterns = [
    /(once|twice|three times?|four times?|1|2|3|4)\s*(?:times?\s*)?(?:daily|per day|a day)/gi,
    /(every\s+\d+\s+hours?)/gi,
    /(morning|evening|night|bedtime)/gi,
    /(as needed|when needed|prn)/gi,
  ];

  // Duration patterns
  const durationPatterns = [
    /(?:for\s+)?(\d+\s*(?:days?|weeks?|months?))/gi,
    /(until\s+\w+|until\s+symptoms\s+improve)/gi,
  ];

  // Instructions patterns
  const instructionPatterns = [
    /((?:take|apply|use)\s+(?:after|before|with|without)\s+(?:meals?|food|eating))/gi,
    /(on empty stomach|with plenty of water)/gi,
  ];

  // Split text into sentences for better parsing
  const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0);

  sentences.forEach(sentence => {
    const trimmedSentence = sentence.trim();
    
    // Try to find medicine names
    let medicineName = '';
    let dosage = '';
    let frequency = '';
    let duration = '';
    let instructions = '';

    // Updated extraction logic to capture more medicine names with different dosage and freq for each
    for (const pattern of medicinePatterns) {
      let match;
      while ((match = pattern.exec(trimmedSentence)) !== null) {
        const medicineName = match[1] || match[3] || match[0];
        const dosage = match[2] || "As prescribed";

        // Get the substring after this medicine mention
        const afterMedicineText = trimmedSentence.slice(match.index + match[0].length);

        const frequencyMatch = /once daily|twice daily|three times daily|every \d+ hours/i.exec(afterMedicineText);
        const durationMatch = /for\s+\d+\s+(day|days|week|weeks)/i.exec(afterMedicineText);
        const instructionsMatch = /(after meals|before meals|with water|with milk|before bedtime)/i.exec(afterMedicineText);

        medicines.push({
          name: capitalizeFirst(medicineName),
          dosage,
          frequency: frequencyMatch ? frequencyMatch[0] : "As directed",
          duration: durationMatch ? durationMatch[0] : "As needed",
          instructions: instructionsMatch ? instructionsMatch[0] : "",
        });
      }
      pattern.lastIndex = 0;
      if (medicines.length > 0) break; // ✅ prevents duplicate pushes
  }


    // If no medicine found with patterns, try to identify common words
    if (!medicineName) {
      const words = trimmedSentence.split(/\s+/);
      for (const word of words) {
        if (word.length > 3 && /^[a-z]+$/.test(word) && 
            (word.includes('cillin') || word.includes('phen') || word.includes('stat') || 
             word.includes('zole') || word.includes('pine') || word.includes('pril'))) {
          medicineName = word;
          break;
        }
      }
    }

    if (medicineName) {
      // Extract dosage if not already found
      if (!dosage) {
        const dosageMatch = dosagePatterns[0].exec(trimmedSentence);
        if (dosageMatch) dosage = dosageMatch[1];
        dosagePatterns[0].lastIndex = 0;
      }

      // Extract frequency
      const frequencyMatch = frequencyPatterns[0].exec(trimmedSentence);
      if (frequencyMatch) {
        frequency = frequencyMatch[0];
      } else {
        // Check for numbers that might indicate frequency
        const numberMatch = /(\d+)\s*times?/gi.exec(trimmedSentence);
        if (numberMatch) {
          const num = parseInt(numberMatch[1]);
          if (num === 1) frequency = 'Once daily';
          else if (num === 2) frequency = 'Twice daily';
          else if (num === 3) frequency = 'Three times daily';
          else if (num === 4) frequency = 'Four times daily';
          else frequency = `${num} times daily`;
        }
      }
      frequencyPatterns[0].lastIndex = 0;

      // Extract duration
      const durationMatch = durationPatterns[0].exec(trimmedSentence);
      if (durationMatch) duration = durationMatch[1];
      durationPatterns[0].lastIndex = 0;

      // Extract instructions
      const instructionMatch = instructionPatterns[0].exec(trimmedSentence);
      if (instructionMatch) instructions = instructionMatch[1];
      instructionPatterns[0].lastIndex = 0;

      // Set defaults if not found
      if (!frequency) frequency = 'As directed';
      if (!duration) duration = 'As needed';
      if (!dosage) dosage = 'As prescribed';

      medicines.push({
        name: capitalizeFirst(medicineName),
        dosage: dosage,
        frequency: capitalizeFirst(frequency),
        duration: duration,
        instructions: capitalizeFirst(instructions),
      });
    }
  });

  // If no medicines found, return empty array to not interfere with form
  return medicines.length > 0 ? medicines : [];
};

const capitalizeFirst = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
