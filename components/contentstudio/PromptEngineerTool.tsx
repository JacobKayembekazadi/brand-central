
import React, { useState } from 'react';
import { refineUserPrompt, generateTextFromPrompt } from '../../services/GeminiService';
import { PromptEngineeringData, WorldBible } from '../../types';
import Button from '../shared/Button';
import LoadingSpinner from '../shared/LoadingSpinner';
import Alert from '../shared/Alert';
import Card from '../shared/Card';

interface PromptEngineerToolProps {
  worldBible: Partial<WorldBible>;
  addPromptData: (data: PromptEngineeringData) => void;
  addActivity: (description: string) => void;
  disabled?: boolean;
}

const PromptEngineerTool: React.FC<PromptEngineerToolProps> = ({ worldBible, addPromptData, addActivity, disabled }) => {
  const [userPrompt, setUserPrompt] = useState<string>('');
  const [refinedPrompt, setRefinedPrompt] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [isLoadingRefine, setIsLoadingRefine] = useState<boolean>(false);
  const [isLoadingGenerate, setIsLoadingGenerate] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const worldBibleContextString = (): string => {
    let context = "";
    if (worldBible.lore) context += `Lore hint: ${worldBible.lore.substring(0,150)}... `;
    if (worldBible.vocabulary && worldBible.vocabulary.length > 0) context += `Keywords: ${worldBible.vocabulary.join(', ')}. `;
    if (worldBible.forbiddenList && worldBible.forbiddenList.length > 0) context += `Avoid: ${worldBible.forbiddenList.join(', ')}. `;
    return context.trim();
  };

  const handleRefinePrompt = async () => {
    if (!userPrompt.trim()) {
      setError("Please enter a prompt to refine.");
      return;
    }
    setIsLoadingRefine(true);
    setError(null);
    setRefinedPrompt(null);
    try {
      const context = worldBibleContextString();
      const result = await refineUserPrompt(userPrompt, context);
      if (result) {
        setRefinedPrompt(result);
        addActivity("AI refined user prompt.");
      } else {
        setError("AI could not refine the prompt. Try a different prompt or check API logs.");
        addActivity("AI prompt refinement failed.");
      }
    } catch (err) {
      console.error(err);
      setError("Error refining prompt.");
    } finally {
      setIsLoadingRefine(false);
    }
  };

  const handleGenerateContent = async () => {
    const promptToUse = refinedPrompt || userPrompt;
    if (!promptToUse.trim()) {
      setError("Please enter or refine a prompt before generating content.");
      return;
    }
    setIsLoadingGenerate(true);
    setError(null);
    setGeneratedContent(null);
    try {
      const result = await generateTextFromPrompt(promptToUse);
      if (result) {
        setGeneratedContent(result);
        const promptRecord: PromptEngineeringData = {
            id: Date.now().toString(),
            userPrompt: userPrompt,
            worldBibleContext: worldBibleContextString(),
            refinedPrompt: refinedPrompt || undefined,
            generatedContent: result,
            timestamp: new Date()
        };
        addPromptData(promptRecord);
        addActivity("AI generated content from prompt.");
      } else {
        setError("AI could not generate content from this prompt.");
        addActivity("AI content generation from prompt failed.");
      }
    } catch (err) {
      console.error(err);
      setError("Error generating content.");
    } finally {
      setIsLoadingGenerate(false);
    }
  };

  return (
    <Card title="AI Prompt Engineer Tool (Phases 3+)">
      <p className="text-sm text-neutral-600 mb-4">
        Craft your AI prompts. Use the "Refine" button to get AI suggestions based on your World Bible, then "Generate" to see the output.
      </p>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="userPrompt" className="block text-sm font-medium text-neutral-700 mb-1">Your Prompt</label>
          <textarea
            id="userPrompt"
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            rows={4}
            className="w-full p-2 border border-neutral-300 rounded-lg focus:ring-primary focus:border-primary"
            placeholder="e.g., Write a short story about a brave explorer in our brand's world..."
            disabled={isLoadingRefine || isLoadingGenerate || disabled}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={handleRefinePrompt} isLoading={isLoadingRefine} disabled={isLoadingRefine || isLoadingGenerate || !userPrompt.trim() || disabled}>
            Refine Prompt with AI
          </Button>
          <Button onClick={handleGenerateContent} isLoading={isLoadingGenerate} variant="secondary" disabled={isLoadingRefine || isLoadingGenerate || !(refinedPrompt || userPrompt).trim() || disabled}>
            Generate Content
          </Button>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

        {refinedPrompt && !isLoadingRefine && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h5 className="text-sm font-semibold text-blue-700">AI Refined Prompt:</h5>
            <p className="text-sm text-blue-600 whitespace-pre-wrap">{refinedPrompt}</p>
          </div>
        )}

        {(isLoadingRefine || isLoadingGenerate) && <div className="mt-4"><LoadingSpinner /></div>}

        {generatedContent && !isLoadingGenerate && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
            <h5 className="text-sm font-semibold text-emerald-700">AI Generated Content:</h5>
            <p className="text-sm text-emerald-600 whitespace-pre-wrap">{generatedContent}</p>
          </div>
        )}
      </div>
      {disabled && <Alert type="info" message="This tool is best used in later phases (3+)." />}
    </Card>
  );
};

export default PromptEngineerTool;
