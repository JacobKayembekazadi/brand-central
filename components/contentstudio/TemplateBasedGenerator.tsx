
import React, { useState } from 'react';
import { generateContentFromTemplate } from '../../services/GeminiService';
import { GeneratedContentItem, WorldBible } from '../../types';
import Button from '../shared/Button';
import LoadingSpinner from '../shared/LoadingSpinner';
import Alert from '../shared/Alert';
import Card from '../shared/Card';

interface TemplateBasedGeneratorProps {
  worldBible: Partial<WorldBible>;
  addGeneratedContentItem: (item: GeneratedContentItem) => void;
  addActivity: (description: string) => void;
  disabled?: boolean;
}

const TEMPLATES = [
  { 
    name: "Short Social Media Post", 
    description: "A brief post for platforms like Twitter or LinkedIn.",
    inputs: [
      { name: "mainMessage", label: "Main Message/Topic", type: "text", placeholder: "e.g., Announcing new feature X" },
      { name: "callToAction", label: "Call to Action (optional)", type: "text", placeholder: "e.g., Learn more, Visit our site" }
    ]
  },
  {
    name: "Product Description Introduction",
    description: "An engaging opening for a product page.",
    inputs: [
      { name: "productName", label: "Product Name", type: "text", placeholder: "e.g., The Innovator's Toolkit" },
      { name: "keyBenefit", label: "Key Benefit", type: "text", placeholder: "e.g., Simplifies complex tasks" },
      { name: "targetUser", label: "Target User (optional)", type: "text", placeholder: "e.g., For busy professionals" }
    ]
  },
];

const TemplateBasedGenerator: React.FC<TemplateBasedGeneratorProps> = ({ worldBible, addGeneratedContentItem, addActivity, disabled }) => {
  const [selectedTemplateName, setSelectedTemplateName] = useState<string>(TEMPLATES[0].name);
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [generatedOutput, setGeneratedOutput] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const currentTemplate = TEMPLATES.find(t => t.name === selectedTemplateName) || TEMPLATES[0];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInputValues({ ...inputValues, [e.target.name]: e.target.value });
  };

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTemplateName(e.target.value);
    setInputValues({}); // Reset inputs when template changes
    setGeneratedOutput(null);
  };
  
  const handleSubmit = async () => {
    // Basic validation: ensure all required fields for the current template are filled
    const requiredInputs = currentTemplate.inputs.filter(input => !input.placeholder?.includes("(optional)"));
    const missingInput = requiredInputs.find(input => !inputValues[input.name]?.trim());
    if (missingInput) {
      setError(`Please fill in the "${missingInput.label}" field.`);
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedOutput(null);
    try {
      const result = await generateContentFromTemplate(currentTemplate.name, inputValues, worldBible);
      if (result) {
        setGeneratedOutput(result);
        const newItem: GeneratedContentItem = {
            id: Date.now().toString(),
            templateName: currentTemplate.name,
            inputs: inputValues,
            outputText: result,
            timestamp: new Date()
        };
        addGeneratedContentItem(newItem);
        addActivity(`AI generated content using template: ${currentTemplate.name}`);
      } else {
        setError("AI could not generate content for this template. Check inputs or API status.");
        addActivity(`AI template generation failed for: ${currentTemplate.name}`);
      }
    } catch (err) {
      console.error(err);
      setError("Error generating content from template.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card title="AI Template-Based Content Generator (Phases 5+)">
      <p className="text-sm text-neutral-600 mb-4">
        Select a template, fill in the key information, and let AI generate content aligned with your World Bible.
      </p>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="templateSelect" className="block text-sm font-medium text-neutral-700 mb-1">Select Template</label>
          <select
            id="templateSelect"
            value={selectedTemplateName}
            onChange={handleTemplateChange}
            className="w-full p-2 border border-neutral-300 rounded-lg focus:ring-primary focus:border-primary bg-white"
            disabled={isLoading || disabled}
          >
            {TEMPLATES.map(template => (
              <option key={template.name} value={template.name}>{template.name} - {template.description}</option>
            ))}
          </select>
        </div>

        {currentTemplate.inputs.map(input => (
          <div key={input.name}>
            <label htmlFor={input.name} className="block text-sm font-medium text-neutral-700 mb-1">{input.label}</label>
            <input
              type={input.type}
              id={input.name}
              name={input.name}
              value={inputValues[input.name] || ''}
              onChange={handleInputChange}
              placeholder={input.placeholder}
              className="w-full p-2 border border-neutral-300 rounded-lg focus:ring-primary focus:border-primary"
              disabled={isLoading || disabled}
              aria-required={!input.placeholder?.includes("(optional)")}
            />
          </div>
        ))}
        
        <Button onClick={handleSubmit} isLoading={isLoading} disabled={isLoading || disabled}>
          Generate with AI
        </Button>

        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
        {isLoading && <div className="mt-4"><LoadingSpinner /></div>}

        {generatedOutput && !isLoading && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
            <h5 className="text-sm font-semibold text-emerald-700">AI Generated Output:</h5>
            <p className="text-sm text-emerald-600 whitespace-pre-wrap">{generatedOutput}</p>
          </div>
        )}
      </div>
       {disabled && <Alert type="info" message="This tool is best used in later phases (5+)." />}
    </Card>
  );
};

export default TemplateBasedGenerator;
