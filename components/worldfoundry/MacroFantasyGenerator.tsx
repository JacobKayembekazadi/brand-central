
import React, { useState } from 'react';
import { MacroFantasyInputs } from '../../types';
import { generateMacroFantasyStatement } from '../../services/GeminiService';
import Button from '../shared/Button';
import LoadingSpinner from '../shared/LoadingSpinner';
import Alert from '../shared/Alert';
import Card from '../shared/Card';

interface MacroFantasyGeneratorProps {
   addActivity: (description: string) => void;
}

const MacroFantasyGenerator: React.FC<MacroFantasyGeneratorProps> = ({ addActivity }) => {
  const [inputs, setInputs] = useState<MacroFantasyInputs>({
    targetAudience: '',
    coreProblem: '',
    uniqueSolution: '',
    desiredFeeling: '',
  });
  const [generatedStatement, setGeneratedStatement] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (Object.values(inputs).some(val => !val.trim())) {
      setError("Please fill in all fields to generate the statement.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedStatement(null);
    try {
      const statement = await generateMacroFantasyStatement(inputs);
      console.log("Generated statement from service:", statement); // For debugging
      setGeneratedStatement(statement);

      if (statement) {
        addActivity("Macro-Fantasy Statement generated.");
      } else {
        setError("Failed to generate statement. The AI service might be unavailable or returned no content. If using a real API key, ensure it's valid and has permissions. Check the browser console for more specific error details from the AI service if an API key is configured.");
      }
    } catch (err) {
      console.error("Error in MacroFantasyGenerator handleSubmit:", err);
      setError("An unexpected error occurred while generating the statement. Check the browser console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputFields = [
    { name: 'targetAudience', label: 'Target Audience', placeholder: 'e.g., Ambitious entrepreneurs' },
    { name: 'coreProblem', label: 'Core Problem They Face', placeholder: 'e.g., Overwhelmed by complexity' },
    { name: 'uniqueSolution', label: 'Unique Solution You Offer', placeholder: 'e.g., AI-powered brand simplification' },
    { name: 'desiredFeeling', label: 'Desired Feeling You Evoke', placeholder: 'e.g., Confident and in control' },
  ];

  return (
    <Card title="Macro-Fantasy Statement Generator">
      <p className="text-sm text-neutral-600 mb-4">
        Craft your powerful one-line brand promise. Fill in the details below and let AI help you generate a compelling statement.
      </p>
      <div className="space-y-4">
        {inputFields.map(field => (
          <div key={field.name}>
            <label htmlFor={field.name} className="block text-sm font-medium text-neutral-700 mb-1">{field.label}</label>
            <input
              type="text"
              id={field.name}
              name={field.name}
              value={inputs[field.name as keyof MacroFantasyInputs]}
              onChange={handleChange}
              placeholder={field.placeholder}
              className="w-full p-2 border border-neutral-300 rounded-lg focus:ring-primary focus:border-primary"
              disabled={isLoading}
              aria-required="true"
            />
          </div>
        ))}
      </div>
      <Button 
        onClick={handleSubmit} 
        isLoading={isLoading} 
        disabled={isLoading || Object.values(inputs).some(val => !val.trim())} 
        className="w-full sm:w-auto mt-6"
      >
        Generate Statement
      </Button>

      {isLoading && <div className="mt-6"><LoadingSpinner /></div>}
      
      {error && !isLoading && <Alert type="error" message={error} onClose={() => setError(null)} />}

      {generatedStatement && !isLoading && (
        <div className="mt-6 p-4 border border-accent rounded-lg bg-emerald-50">
          <h4 className="text-xl font-semibold text-emerald-700 mb-2">Generated Macro-Fantasy Statement:</h4>
          <p className="text-lg text-emerald-800 italic">"{generatedStatement}"</p>
        </div>
      )}
    </Card>
  );
};

export default MacroFantasyGenerator;
