
import React, { useState } from 'react';
import { WorldBible, VisualIdentityKit } from '../../types';
import { checkBrandAlignment } from '../../services/GeminiService';
import Button from '../shared/Button';
import LoadingSpinner from '../shared/LoadingSpinner';
import Alert from '../shared/Alert';
import Card from '../shared/Card';

interface BrandGuardianProps {
  worldBible: Partial<WorldBible>;
  visualIdentityKit: Partial<VisualIdentityKit>;
  addActivity: (description: string) => void;
}

interface AlignmentResult {
  violations: string[];
  suggestions: string[];
}

const BrandGuardian: React.FC<BrandGuardianProps> = ({ worldBible, visualIdentityKit, addActivity }) => {
  const [assetDescription, setAssetDescription] = useState<string>('');
  const [alignmentResult, setAlignmentResult] = useState<AlignmentResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!assetDescription.trim()) {
      setError("Please enter an asset description to check.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setAlignmentResult(null);
    try {
      const result = await checkBrandAlignment(assetDescription, worldBible, visualIdentityKit);
      setAlignmentResult(result);
      if (result) {
        const violationCount = result.violations.length;
        addActivity(`Brand Guardian check: ${violationCount} violation(s) found.`);
      } else {
        setError("Failed to get brand alignment feedback. The AI service might be unavailable or returned no content.");
      }
    } catch (err) {
      console.error("Error in BrandGuardian handleSubmit:", err);
      setError("An unexpected error occurred while checking brand alignment.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card title="The Brand Guardian (AI Quality Assurance)">
      <p className="text-sm text-neutral-600 mb-4">
        Upload or describe your draft visual or copy. The AI will scan it against your World Bible and Visual Identity Kit for consistency.
        (Note: Currently checks text descriptions. Visual upload/analysis TBD.)
      </p>
      <textarea
        value={assetDescription}
        onChange={(e) => setAssetDescription(e.target.value)}
        placeholder="Describe your asset (e.g., 'Social media post copy: ...', 'Ad visual: A woman in a red dress...') "
        rows={5}
        className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-primary focus:border-primary mb-4"
        disabled={isLoading}
        aria-label="Asset description for brand alignment check"
      />
      <Button onClick={handleSubmit} isLoading={isLoading} disabled={isLoading || !assetDescription.trim()} className="w-full sm:w-auto">
        Check Alignment
      </Button>

      {isLoading && <div className="mt-6"><LoadingSpinner /></div>}
      
      {error && !isLoading && <Alert type="error" message={error} onClose={() => setError(null)} />}

      {alignmentResult && !isLoading && (
        <div className="mt-6 p-4 border border-neutral-200 rounded-lg bg-white">
          <h4 className="text-xl font-semibold text-neutral-800 mb-3">Brand Alignment Report:</h4>
          {alignmentResult.violations.length === 0 && alignmentResult.suggestions.length === 0 && (
             <Alert type="success" message="No brand violations detected! Looks good." />
          )}

          {alignmentResult.violations.length > 0 && (
            <div className="mb-4">
              <h5 className="font-semibold text-red-600">Violations:</h5>
              <ul className="list-disc list-inside text-red-500 text-sm space-y-1">
                {alignmentResult.violations.map((v, i) => <li key={`v-${i}`}>{v}</li>)}
              </ul>
            </div>
          )}

          {alignmentResult.suggestions.length > 0 && (
            <div>
              <h5 className="font-semibold text-emerald-600">Suggestions:</h5>
              <ul className="list-disc list-inside text-emerald-500 text-sm space-y-1">
                {alignmentResult.suggestions.map((s, i) => <li key={`s-${i}`}>{s}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default BrandGuardian;
