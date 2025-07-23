
import React, { useState } from 'react';
import { generateContentIdeas } from '../../services/GeminiService';
import { ContentIdea } from '../../types';
import Button from '../shared/Button';
import LoadingSpinner from '../shared/LoadingSpinner';
import Alert from '../shared/Alert';
import Card from '../shared/Card';

interface IdeaGeneratorProps {
  addContentIdea: (idea: ContentIdea) => void;
  addActivity: (description: string) => void;
  disabled?: boolean;
}

const IdeaGenerator: React.FC<IdeaGeneratorProps> = ({ addContentIdea, addActivity, disabled }) => {
  const [topic, setTopic] = useState<string>('');
  const [generatedIdeas, setGeneratedIdeas] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic to generate ideas.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedIdeas(null); 
    try {
      const ideas = await generateContentIdeas(topic, 5); // Request 5 ideas
      if (ideas && ideas.length > 0) {
        setGeneratedIdeas(ideas);
        const newIdeaSet: ContentIdea = {
            id: Date.now().toString(),
            topic: topic,
            generatedIdeas: ideas,
            timestamp: new Date()
        };
        addContentIdea(newIdeaSet); // Save to app state
        addActivity(`AI generated ${ideas.length} ideas for topic: ${topic}`);
      } else {
        setError("AI did not return any ideas. Try a different topic or try again.");
        addActivity(`AI idea generation failed for topic: ${topic}`);
      }
    } catch (err) {
      console.error("Error in IdeaGenerator handleSubmit:", err);
      setError("An unexpected error occurred while generating ideas.");
      addActivity(`Error during AI idea generation for topic: ${topic}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card title="AI Content Idea Generator (Phases 3+)">
      <p className="text-sm text-neutral-600 mb-4">
        Enter a topic or keyword, and let AI brainstorm content ideas for you.
        Generated ideas will be added to a list for your review (not yet displayed here, but saved).
      </p>
      <div className="space-y-3">
        <div>
          <label htmlFor="ideaTopic" className="block text-sm font-medium text-neutral-700 mb-1">
            Topic / Keyword
          </label>
          <input
            type="text"
            id="ideaTopic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Sustainable Packaging, AI in Marketing"
            className="w-full p-2 border border-neutral-300 rounded-lg focus:ring-primary focus:border-primary"
            disabled={isLoading || disabled}
            aria-required="true"
          />
        </div>
        <Button 
          onClick={handleSubmit} 
          isLoading={isLoading} 
          disabled={isLoading || !topic.trim() || disabled}
          className="w-full sm:w-auto"
        >
          Generate Ideas
        </Button>
      </div>

      {isLoading && <div className="mt-4"><LoadingSpinner /></div>}
      {error && !isLoading && <Alert type="error" message={error} onClose={() => setError(null)} />}

      {generatedIdeas && !isLoading && (
        <div className="mt-6 p-4 border border-emerald-300 rounded-lg bg-emerald-50">
          <h4 className="text-md font-semibold text-emerald-700 mb-2">Suggested Ideas for "{topic}":</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-emerald-800">
            {generatedIdeas.map((idea, index) => (
              <li key={index}>{idea}</li>
            ))}
          </ul>
           <p className="text-xs text-emerald-600 mt-3">These ideas have been saved to your app data.</p>
        </div>
      )}
       {disabled && <Alert type="info" message="This tool is best used in later phases (3+)." />}
    </Card>
  );
};

export default IdeaGenerator;
