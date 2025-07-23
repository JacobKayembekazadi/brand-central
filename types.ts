
export enum ModuleKey {
  Dashboard = 'Dashboard',
  WorldFoundry = 'WorldFoundry',
  ContentStudio = 'ContentStudio',
  DistributionHub = 'DistributionHub',
}

export interface NorthStarMetricData {
  id: string;
  name: 'Awareness' | 'Engagement' | 'Conversion' | 'Loyalty';
  value: string;
  icon: React.ReactNode; 
}

export interface ActivityItem {
  id: string;
  timestamp: Date;
  type: 'Asset Created' | 'Post Scheduled' | 'Performance Alert' | 'Phase Advanced' | 'AI Task' | 'Brand Check' | 'Data Loaded' | 'Data Saved' | 'Error';
  description: string;
  link?: string;
}

export interface LMAIScore {
  overallScore: number; // 0-100
  lifestyle: { score: number; explanation: string };
  moodboard: { score: number; explanation: string };
  association: { score: number; explanation: string };
  inspire: { score: number; explanation: string };
  summary?: string;
}

export interface MacroFantasyInputs {
  targetAudience: string;
  coreProblem: string;
  uniqueSolution: string;
  desiredFeeling: string;
}

export interface WorldBible {
  lore: string;
  timeline: string;
  keyCharacters: string;
  vocabulary: string[];
  forbiddenList: string[];
}

export interface VisualIdentityKit {
  logoUrl: string | null;
  colorPalette: { name: string, hex: string }[];
  fontFiles: string[]; 
  iconSetUrl: string | null; 
}

export interface AudienceProfile {
  pains: string;
  dreams: string;
  behaviors: string;
}

export interface CompetitiveAnalysisData {
  notes: string;
}

export interface PhaseInfo {
  id: number;
  title: string;
  description: string;
  module: ModuleKey;
}

// Content Studio Types
export interface ContentIdea {
  id: string;
  topic: string; // User-provided topic
  generatedIdeas: string[]; // AI-generated ideas related to the topic
  timestamp: Date;
}

export interface PromptEngineeringData {
  id: string;
  userPrompt: string;
  worldBibleContext?: string; // Optional: context from world bible
  refinedPrompt?: string; // AI refined prompt
  generatedContent?: string; // Content generated from this prompt
  timestamp: Date;
}

export interface GeneratedContentItem {
  id: string;
  templateName: string; // e.g., "Short Social Post"
  inputs: Record<string, string>; // User inputs for the template
  outputText: string; // AI-generated text
  timestamp: Date;
}

export interface CommunityComment {
  id: string;
  userName: string;
  commentText: string;
  suggestedReply?: string; // AI-suggested reply
  timestamp: Date;
}


// For Brand Guardian (already exists, just for context)
export interface BrandGuardianAsset {
    description: string;
    // Potential future fields: assetType: 'image' | 'text' | 'video', assetUrl?: string
}

export interface BrandGuardianResult {
    violations: string[];
    suggestions: string[];
    overallAssessment?: string; // AI's general thoughts
}

// App-wide persistent state structure
export interface AppStateData {
  currentPhaseId: number;
  audienceProfile: AudienceProfile;
  worldBible: WorldBible;
  visualIdentityKit: VisualIdentityKit;
  competitiveAnalysis: CompetitiveAnalysisData;
  recentActivity: ActivityItem[];
  contentIdeas: ContentIdea[];
  promptData: PromptEngineeringData[];
  generatedContentItems: GeneratedContentItem[];
  communityComments: CommunityComment[];
}
