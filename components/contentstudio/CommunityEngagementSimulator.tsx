
import React, { useState } from 'react';
import { suggestCommentReply } from '../../services/GeminiService';
import { CommunityComment, WorldBible } from '../../types';
import Button from '../shared/Button';
import LoadingSpinner from '../shared/LoadingSpinner';
import Alert from '../shared/Alert';
import Card from '../shared/Card';

interface CommunityEngagementSimulatorProps {
  worldBible: Partial<WorldBible>;
  comments: CommunityComment[];
  updateComment: (comment: CommunityComment) => void; // To update with suggested reply
  addActivity: (description: string) => void;
  disabled?: boolean;
}

const CommunityEngagementSimulator: React.FC<CommunityEngagementSimulatorProps> = ({ worldBible, comments, updateComment, addActivity, disabled }) => {
  const [isLoadingReplyFor, setIsLoadingReplyFor] = useState<string | null>(null); // comment.id
  const [error, setError] = useState<string | null>(null);

  const handleSuggestReply = async (comment: CommunityComment) => {
    setIsLoadingReplyFor(comment.id);
    setError(null);
    try {
      const reply = await suggestCommentReply(comment.commentText, comment.userName, worldBible);
      if (reply) {
        updateComment({ ...comment, suggestedReply: reply });
        addActivity(`AI suggested reply for ${comment.userName}'s comment.`);
      } else {
        setError(`AI could not suggest a reply for ${comment.userName}.`);
        addActivity(`AI reply suggestion failed for ${comment.userName}.`);
      }
    } catch (err) {
      console.error(err);
      setError("Error suggesting reply.");
    } finally {
      setIsLoadingReplyFor(null);
    }
  };

  return (
    <Card title="AI Community Engagement Simulator (Phases 8+)" className="lg:col-span-2">
      <p className="text-sm text-neutral-600 mb-4">
        Practice your brand's voice. AI will suggest replies to these mock user comments based on your World Bible.
        (Comments are mock data for now).
      </p>
      
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      {comments.length === 0 && <p className="text-neutral-500">No comments to display.</p>}

      <div className="space-y-6">
        {comments.map(comment => (
          <div key={comment.id} className="p-4 border border-neutral-200 rounded-lg bg-neutral-50 shadow-sm">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <p className="font-semibold text-primary">{comment.userName}</p>
                    <p className="text-xs text-neutral-500">{new Date(comment.timestamp).toLocaleString()}</p>
                </div>
                <Button
                    onClick={() => handleSuggestReply(comment)}
                    isLoading={isLoadingReplyFor === comment.id}
                    disabled={isLoadingReplyFor !== null || !!comment.suggestedReply || disabled}
                    size="sm"
                    variant="outline"
                >
                    {comment.suggestedReply ? 'Reply Suggested' : 'Suggest Reply'}
                </Button>
            </div>
            <p className="text-neutral-700 mb-3">{comment.commentText}</p>
            
            {isLoadingReplyFor === comment.id && <LoadingSpinner size="sm" />}

            {comment.suggestedReply && !isLoadingReplyFor && (
              <div className="mt-2 p-3 bg-emerald-50 border-l-4 border-emerald-400">
                <p className="text-xs font-semibold text-emerald-700">AI Suggested Reply:</p>
                <p className="text-sm text-emerald-600 italic">{comment.suggestedReply}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      {disabled && <Alert type="info" message="This tool is best used in later phases (8+)." />}
    </Card>
  );
};

export default CommunityEngagementSimulator;
