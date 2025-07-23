
import React from 'react';
import Card from '../shared/Card';
import BrandGuardian from './BrandGuardian';
import { WorldBible, VisualIdentityKit, ContentIdea, PromptEngineeringData, GeneratedContentItem, CommunityComment } from '../../types';
import IdeaGenerator from './IdeaGenerator';
import PromptEngineerTool from './PromptEngineerTool';
import TemplateBasedGenerator from './TemplateBasedGenerator';
import CommunityEngagementSimulator from './CommunityEngagementSimulator';
import Alert from '../shared/Alert';


interface ContentStudioModuleProps {
  currentPhaseId: number;
  worldBible: WorldBible;
  visualIdentityKit: VisualIdentityKit;
  contentIdeas: ContentIdea[];
  addContentIdea: (idea: ContentIdea) => void;
  promptData: PromptEngineeringData[];
  addPromptData: (data: PromptEngineeringData) => void;
  generatedContentItems: GeneratedContentItem[];
  addGeneratedContentItem: (item: GeneratedContentItem) => void;
  communityComments: CommunityComment[];
  updateCommunityComment: (comment: CommunityComment) => void;
  addActivity: (description: string) => void;
  isLocked: boolean;
}

const ContentStudioModule: React.FC<ContentStudioModuleProps> = ({
  currentPhaseId,
  worldBible,
  visualIdentityKit,
  contentIdeas,
  addContentIdea,
  promptData,
  addPromptData,
  generatedContentItems,
  addGeneratedContentItem,
  communityComments,
  updateCommunityComment,
  addActivity,
  isLocked,
}) => {
  if (isLocked) {
    return (
      <div className="p-8 text-center">
        <Card>
          <div className="p-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-amber-500 mx-auto mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            <h2 className="text-2xl font-semibold text-neutral-700 mb-2">Module Locked</h2>
            <p className="text-neutral-500">
              The Content Studio module is currently locked. Please complete earlier onboarding steps or advance your brand phase.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  const relevantPhases = [3, 5, 6, 7, 8]; // Phases where CS is primary focus
  const isFocusPhase = relevantPhases.includes(currentPhaseId);
   const accessiblePhases = [3,4,5,6,7,8,9]; // Phases where CS can be accessed/used
   const isAccessible = accessiblePhases.includes(currentPhaseId);


  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
         <h1 className="text-3xl font-bold text-neutral-800">Module 2: The Content Studio</h1>
        <p className="text-sm text-neutral-500 bg-neutral-200 px-3 py-1 rounded-full">
            Current Phase: {currentPhaseId}
        </p>
      </div>
      <p className="text-neutral-600">
        This is the creative engine where your brand world is made visible. Generate ideas, craft prompts, create content with templates, ensure brand alignment, and simulate community engagement.
      </p>

       {!isAccessible && currentPhaseId < Math.min(...accessiblePhases) && (
        <Alert type="info" message={`The Content Studio tools are typically used starting from Phase ${Math.min(...accessiblePhases)}. You are currently in Phase ${currentPhaseId}.`} />
      )}
      
      {/* Group tools by function or phase relevance if desired */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <IdeaGenerator
            addContentIdea={addContentIdea}
            addActivity={addActivity}
            disabled={!isAccessible && currentPhaseId < 3}
        />
        <PromptEngineerTool
            worldBible={worldBible}
            addPromptData={addPromptData}
            addActivity={addActivity}
            disabled={!isAccessible && currentPhaseId < 3}
        />
        <TemplateBasedGenerator
            worldBible={worldBible}
            addGeneratedContentItem={addGeneratedContentItem}
            addActivity={addActivity}
            disabled={!isAccessible && currentPhaseId < 5}
        />
         <BrandGuardian
            worldBible={worldBible}
            visualIdentityKit={visualIdentityKit}
            addActivity={addActivity}
        />
        <CommunityEngagementSimulator
            worldBible={worldBible}
            comments={communityComments}
            updateComment={updateCommunityComment}
            addActivity={addActivity}
            disabled={!isAccessible && currentPhaseId < 8}
        />
        <Card title="AI-Powered Idea Pipeline (Concept)" className="lg:col-span-1">
             <p className="text-neutral-500 text-sm">
                Future: Kanban workflow (Idea Backlog → Prompt Engineering → Draft → Review → Publish) integrating the tools above.
             </p>
        </Card>
      </div>
      
      {/* Placeholder for past generated items, could be a new component */}
       <Card title="Recent AI Generations" className="mt-8">
            <h3 className="text-md font-semibold text-neutral-700 mb-2">Prompt Engineering History (Last 3)</h3>
            {promptData.length === 0 && <p className="text-sm text-neutral-500">No prompt engineering history yet.</p>}
            <ul className="space-y-2 text-xs text-neutral-600">
                {promptData.slice(0,3).map(p => (
                    <li key={p.id} className="p-2 border rounded bg-neutral-50">
                        <p><strong>User Prompt:</strong> {p.userPrompt.substring(0,100)}...</p>
                        {p.refinedPrompt && <p><strong>Refined:</strong> {p.refinedPrompt.substring(0,100)}...</p>}
                        {p.generatedContent && <p><strong>Generated:</strong> {p.generatedContent.substring(0,100)}...</p>}
                         <p className="text-neutral-400 text-xxs">{new Date(p.timestamp).toLocaleString()}</p>
                    </li>
                ))}
            </ul>

            <h3 className="text-md font-semibold text-neutral-700 mt-4 mb-2">Templated Content History (Last 3)</h3>
            {generatedContentItems.length === 0 && <p className="text-sm text-neutral-500">No templated content generated yet.</p>}
            <ul className="space-y-2 text-xs text-neutral-600">
                {generatedContentItems.slice(0,3).map(item => (
                    <li key={item.id} className="p-2 border rounded bg-neutral-50">
                        <p><strong>Template:</strong> {item.templateName}</p>
                        <p><strong>Output:</strong> {item.outputText.substring(0,150)}...</p>
                        <p className="text-neutral-400 text-xxs">{new Date(item.timestamp).toLocaleString()}</p>
                    </li>
                ))}
            </ul>
        </Card>
    </div>
  );
};

export default ContentStudioModule;
