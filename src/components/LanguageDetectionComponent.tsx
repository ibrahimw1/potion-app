// LanguageDetectionComponent.tsx
"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface LanguageDetectionProps {
  editorState?: string | null; // Make it optional
}

const LanguageDetectionComponent: React.FC<LanguageDetectionProps> = ({ editorState }) => {
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>('');

  useEffect(() => {
    const detectLanguage = async () => {
      try {
        if (editorState !== null) { // Check for null before making the API call
          const response = await axios.post('/api/detect-language', { text: editorState });
          setDetectedLanguage(response.data.language);
        }
      } catch (error) {
        console.error('Error detecting language:', error);
      }
    };

    detectLanguage();
  }, [editorState]);

  return (
    <div className="text-sm mt-2">
      Detected Language: {detectedLanguage}
    </div>
  );
};

export default LanguageDetectionComponent;
