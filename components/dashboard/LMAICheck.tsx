
import React, { useState } from 'react';
import { getLMAIScore } from '../../services/GeminiService';
import { LMAIScore } from '../../types';
import Button from '../shared/Button';
import LoadingSpinner from '../shared/LoadingSpinner';
import Alert from '../shared/Alert';
import Card from '../shared/Card';

interface LMAICheckProps {
  addActivity: (description: string) => void;
}

const LMAICheck: React.FC<LMAICheckProps> = ({ addActivity }) => {
  const [inputText, setInputText] = useState<string>('');
  const [lmaiScore, setLmaiScore] = useState<LMAIScore | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!inputText.trim()) {
      setError("Please enter some text to analyze.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setLmaiScore(null);
    try {
      const score = await getLMAIScore(inputText);
      setLmaiScore(score);
      if (score) {
         addActivity(`L-M-A-I check performed. Overall Score: ${score.overallScore}`);
      } else {
        setError("Failed to get L-M-A-I score. The AI service might be unavailable or encountered an issue.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching the L-M-A-I score.");
    } finally {
      setIsLoading(false);
    }
  };

  const ScoreBar: React.FC<{ score: number, label: string }> = ({ score, label }) => (
    <div className="mb-2">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-neutral-700">{label}</span>
        <span className="text-sm font-medium text-primary">{score}/100</span>
      </div>
      <div className="w-full bg-neutral-200 rounded-full h-2.5">
        <div className="bg-primary h-2.5 rounded-full" style={{ width: `${score}%` }}></div>
      </div>
    </div>
  );

  return (
    <Card title="L-M-A-I Quick Check" className="bg-neutral-50">
      <p className="text-sm text-neutral-600 mb-4">
        Paste an idea (product, content, campaign) and get an AI-generated alignment score against the Lifestyle, Moodboard, Association, Inspire framework.
      </p>
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Enter your brand idea, content snippet, or concept here..."
        rows={4}
        className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-primary focus:border-primary mb-4"
        disabled={isLoading}
      />
      <Button onClick={handleSubmit} isLoading={isLoading} disabled={isLoading || !inputText.trim()} className="w-full sm:w-auto">
        Analyze Alignment
      </Button>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      
      {isLoading && <div className="mt-6"><LoadingSpinner /></div>}

      {lmaiScore && !isLoading && (
        <div className="mt-6 p-4 border border-neutral-200 rounded-lg bg-white">
          <h4 className="text-xl font-semibold text-neutral-800 mb-3">L-M-A-I Alignment Score:</h4>
          <div className="mb-4 p-3 bg-primary/10 rounded-lg text-center">
            <p className="text-sm text-primary font-medium">Overall Score</p>
            <p className="text-4xl font-bold text-primary">{lmaiScore.overallScore}/100</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <ScoreBar score={lmaiScore.lifestyle.score} label="Lifestyle" />
              <p className="text-xs text-neutral-500 mt-1">{lmaiScore.lifestyle.explanation}</p>
            </div>
            <div>
              <ScoreBar score={lmaiScore.moodboard.score} label="Moodboard" />
              <p className="text-xs text-neutral-500 mt-1">{lmaiScore.moodboard.explanation}</p>
            </div>
            <div>
              <ScoreBar score={lmaiScore.association.score} label="Association" />
              <p className="text-xs text-neutral-500 mt-1">{lmaiScore.association.explanation}</p>
            </div>
            <div>
              <ScoreBar score={lmaiScore.inspire.score} label="Inspire" />
              <p className="text-xs text-neutral-500 mt-1">{lmaiScore.inspire.explanation}</p>
            </div>
          </div>
           {lmaiScore.summary && (
            <div className="mt-4 p-3 bg-neutral-100 rounded-lg">
              <h5 className="font-semibold text-neutral-700">AI Summary & Suggestions:</h5>
              <p className="text-sm text-neutral-600 whitespace-pre-wrap">{lmaiScore.summary}</p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default LMAICheck;
    