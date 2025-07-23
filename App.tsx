
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Link, NavLink, Navigate } from 'react-router-dom';
import {
  NorthStarMetricData, ActivityItem, ModuleKey, AudienceProfile, WorldBible, VisualIdentityKit, PhaseInfo,
  ContentIdea, PromptEngineeringData, GeneratedContentItem, CommunityComment, AppStateData, CompetitiveAnalysisData
} from './types';
import { APP_NAME, PHASES, ONBOARDING_WEEKS_CONFIG } from './constants';
import Dashboard from './components/dashboard/Dashboard';
import WorldFoundryModule from './components/worldfoundry/WorldFoundryModule';
import ContentStudioModule from './components/contentstudio/ContentStudioModule';
import DistributionHubModule from './components/distribution/DistributionHubModule';
// Removed Alert import as it's not directly used here, but in sub-components.

const LOCAL_STORAGE_KEY = 'brandCentralAIData';

const initialAudienceProfile: AudienceProfile = { pains: '', dreams: '', behaviors: '' };
const initialWorldBible: WorldBible = { lore: '', timeline: '', keyCharacters: '', vocabulary: [], forbiddenList: [] };
const initialVisualIdentityKit: VisualIdentityKit = { logoUrl: null, colorPalette: [], fontFiles: [], iconSetUrl: null };
const initialCompetitiveAnalysis: CompetitiveAnalysisData = { notes: '' };

const initialNorthStarMetrics: NorthStarMetricData[] = [
  { id: 'awareness', name: 'Awareness', value: '1.2M Imp.', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
  { id: 'engagement', name: 'Engagement', value: '15% CTR', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" /></svg> },
  { id: 'conversion', name: 'Conversion', value: '$50K', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.75A.75.75 0 012.25 4.5M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg> },
  { id: 'loyalty', name: 'Loyalty', value: '25% Rep.', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg> },
];

const getDefaultAppState = (): AppStateData => ({
  currentPhaseId: 0,
  audienceProfile: initialAudienceProfile,
  worldBible: initialWorldBible,
  visualIdentityKit: initialVisualIdentityKit,
  competitiveAnalysis: initialCompetitiveAnalysis,
  recentActivity: [],
  contentIdeas: [],
  promptData: [],
  generatedContentItems: [],
  communityComments: [ // Some mock comments to start with
    { id: 'c1', userName: 'UserAlice', commentText: 'This is an amazing product!', timestamp: new Date() },
    { id: 'c2', userName: 'UserBob', commentText: 'I have a question about feature X.', timestamp: new Date() },
  ],
});


const App: React.FC = () => {
  const [appData, setAppData] = useState<AppStateData>(getDefaultAppState());
  const [currentOnboardingWeek, setCurrentOnboardingWeek] = useState<number>(0); 
  const [northStarMetrics, setNorthStarMetrics] = useState<NorthStarMetricData[]>(initialNorthStarMetrics); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [apiKeyStatusMessage, setApiKeyStatusMessage] = useState<string | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Load state from localStorage on initial mount
  useEffect(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData) as AppStateData;
        // Ensure dates are correctly parsed for activity items
        if (parsedData.recentActivity) {
            parsedData.recentActivity = parsedData.recentActivity.map(act => ({...act, timestamp: new Date(act.timestamp) }));
        }
        // Ensure dates for other items if they exist
        if (parsedData.contentIdeas) parsedData.contentIdeas.forEach(i => i.timestamp = new Date(i.timestamp));
        if (parsedData.promptData) parsedData.promptData.forEach(i => i.timestamp = new Date(i.timestamp));
        if (parsedData.generatedContentItems) parsedData.generatedContentItems.forEach(i => i.timestamp = new Date(i.timestamp));
        if (parsedData.communityComments) parsedData.communityComments.forEach(i => i.timestamp = new Date(i.timestamp));


        setAppData(prev => ({...prev, ...parsedData})); // Merge to ensure new default fields are included
        
        // Add activity after state is set to ensure addActivity uses the loaded state
        queueMicrotask(() => {
             addActivity('Application data loaded from previous session.', 'Data Loaded');
        });

      } catch (error) {
        console.error("Failed to parse data from localStorage", error);
        localStorage.removeItem(LOCAL_STORAGE_KEY); // Clear corrupted data
        addActivity('Failed to load data, starting fresh.', 'Error');
      }
    }
    setIsDataLoaded(true); // Mark data as loaded (or tried to load)

    if (!process.env.API_KEY) {
      setApiKeyStatusMessage("Warning: Gemini API Key is not configured. AI features will use mock data.");
    } else {
      setApiKeyStatusMessage("Gemini API Key detected. AI features should be operational if the key is valid.");
    }
  }, []); // Empty dependency array means this runs once on mount


  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (isDataLoaded) { // Only save after initial load attempt
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(appData));
    }
  }, [appData, isDataLoaded]);


  const addActivity = useCallback((description: string, type: ActivityItem['type'] = 'AI Task') => {
    const newActivity: ActivityItem = {
      id: Date.now().toString(),
      timestamp: new Date(),
      type,
      description,
    };
    setAppData(prev => ({
        ...prev,
        recentActivity: [newActivity, ...prev.recentActivity.slice(0, 49)] // Keep last 50 activities
    }));
  }, []);

  const handleNextPhase = () => {
    setAppData(prev => {
      const nextPhase = Math.min(prev.currentPhaseId + 1, PHASES.length - 1);
      addActivity(`Advanced to Phase ${nextPhase}: ${PHASES.find(p=>p.id===nextPhase)?.title || ''}`, 'Phase Advanced');
      return {...prev, currentPhaseId: nextPhase };
    });
  };
  
  const isModuleLocked = useCallback((moduleKey: ModuleKey): boolean => {
    if (currentOnboardingWeek === 0) return false; 
    const config = ONBOARDING_WEEKS_CONFIG[currentOnboardingWeek as keyof typeof ONBOARDING_WEEKS_CONFIG];
    if (!config) return true; 
    
    let isAccessible = false;
    for (let i = 1; i <= currentOnboardingWeek; i++) {
      const weekConfig = ONBOARDING_WEEKS_CONFIG[i as keyof typeof ONBOARDING_WEEKS_CONFIG];
      if (weekConfig.unlocks.includes(moduleKey)) {
        isAccessible = true;
        break;
      }
    }
    return !isAccessible;
  }, [currentOnboardingWeek]);

  // Specific state updaters
  const updateAudienceProfile = (profile: AudienceProfile) => {
    setAppData(prev => ({ ...prev, audienceProfile: profile }));
    addActivity("Audience Profile updated.", "Asset Created");
  };
  const updateWorldBible = (wb: WorldBible) => {
    setAppData(prev => ({ ...prev, worldBible: wb }));
    addActivity("World Bible updated.", "Asset Created");
  };
  const updateVisualIdentityKit = (vik: VisualIdentityKit) => {
    setAppData(prev => ({ ...prev, visualIdentityKit: vik }));
    addActivity("Visual Identity Kit updated.", "Asset Created");
  };
  const updateCompetitiveAnalysis = (ca: CompetitiveAnalysisData) => {
    setAppData(prev => ({ ...prev, competitiveAnalysis: ca }));
    addActivity("Competitive Analysis Notes updated.", "Asset Created");
  };

  const addContentIdea = (idea: ContentIdea) => {
    setAppData(prev => ({ ...prev, contentIdeas: [idea, ...prev.contentIdeas] }));
    addActivity(`New content idea set added for topic: ${idea.topic}`, "AI Task");
  };
  
  const addPromptData = (data: PromptEngineeringData) => {
    setAppData(prev => ({...prev, promptData: [data, ...prev.promptData.slice(0,19)]})); // Keep last 20
    addActivity("Prompt Engineered and/or content generated.", "AI Task");
  };

  const addGeneratedContentItem = (item: GeneratedContentItem) => {
     setAppData(prev => ({...prev, generatedContentItems: [item, ...prev.generatedContentItems.slice(0,19)]})); // Keep last 20
     addActivity(`Content generated via template: ${item.templateName}`, "AI Task");
  };

  const updateCommunityComment = (updatedComment: CommunityComment) => {
    setAppData(prev => ({
        ...prev,
        communityComments: prev.communityComments.map(c => c.id === updatedComment.id ? updatedComment : c)
    }));
    addActivity(`AI reply suggested for comment by ${updatedComment.userName}`, "AI Task");
  };


  const navItems = [
    { name: 'Dashboard', path: '/', key: ModuleKey.Dashboard, icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 018.25 20.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25A2.25 2.25 0 0113.5 8.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg> },
    { name: 'World-Foundry', path: '/world-foundry', key: ModuleKey.WorldFoundry, icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A11.978 11.978 0 0112 16.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0021 12c0-.778.099 1.533-.284-2.253M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
    { name: 'Content Studio', path: '/content-studio', key: ModuleKey.ContentStudio, icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg> },
    { name: 'Distribution Hub', path: '/distribution-hub', key: ModuleKey.DistributionHub, icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" /></svg> },
  ];

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col lg:flex-row bg-neutral-100">
        <aside className={`bg-neutral-900 text-neutral-100 w-64 fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition-transform duration-200 ease-in-out z-30 flex flex-col`}>
          <div className="p-6 flex items-center space-x-3 border-b border-neutral-700">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-primary"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A11.978 11.978 0 0112 16.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0021 12c0-.778.099 1.533-.284-2.253M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <h1 className="text-2xl font-bold">{APP_NAME}</h1>
          </div>
          <nav className="flex-grow p-4 space-y-2">
            {navItems.map((item) => {
              const locked = isModuleLocked(item.key);
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors
                    ${locked ? 'text-neutral-500 cursor-not-allowed opacity-60' :
                      isActive ? 'bg-primary text-white shadow-md' : 'hover:bg-neutral-700 hover:text-white'
                    }`
                  }
                  aria-disabled={locked}
                  tabIndex={locked ? -1 : undefined}
                  style={locked ? { pointerEvents: 'none' } : {}}
                >
                  {item.icon}
                  <span>{item.name}</span>
                  {locked && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-auto text-amber-400"><path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" /></svg>}
                </NavLink>
              );
            })}
          </nav>
        </aside>

        <div className="flex-1 flex flex-col">
          <header className="bg-white shadow-sm p-4 flex justify-between items-center lg:hidden sticky top-0 z-20">
            <h1 className="text-xl font-semibold text-neutral-800">{APP_NAME}</h1>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-neutral-600" aria-label="Open sidebar">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </header>
          
          {apiKeyStatusMessage && (
            <div className={`p-2 text-center text-sm border-b ${apiKeyStatusMessage.startsWith("Warning") ? 'bg-yellow-100 text-yellow-700 border-yellow-300' : 'bg-emerald-50 text-emerald-700 border-emerald-200' }`}>
                {apiKeyStatusMessage}
            </div>
           )}

          <main className="flex-1 overflow-y-auto bg-neutral-100">
            <Routes>
              <Route path="/" element={
                <Dashboard
                  currentPhaseId={appData.currentPhaseId}
                  northStarMetrics={northStarMetrics}
                  recentActivity={appData.recentActivity}
                  onNextPhase={handleNextPhase}
                  addActivity={addActivity}
                  isModuleLocked={isModuleLocked}
                />
              } />
              <Route path="/world-foundry" element={
                <WorldFoundryModule
                  currentPhaseId={appData.currentPhaseId}
                  audienceProfile={appData.audienceProfile}
                  updateAudienceProfile={updateAudienceProfile}
                  worldBible={appData.worldBible}
                  updateWorldBible={updateWorldBible}
                  visualIdentityKit={appData.visualIdentityKit}
                  updateVisualIdentityKit={updateVisualIdentityKit}
                  competitiveAnalysis={appData.competitiveAnalysis}
                  updateCompetitiveAnalysis={updateCompetitiveAnalysis}
                  addActivity={addActivity}
                  isLocked={isModuleLocked(ModuleKey.WorldFoundry)}
                />
              } />
              <Route path="/content-studio" element={
                <ContentStudioModule
                    currentPhaseId={appData.currentPhaseId}
                    worldBible={appData.worldBible}
                    visualIdentityKit={appData.visualIdentityKit}
                    contentIdeas={appData.contentIdeas}
                    addContentIdea={addContentIdea}
                    promptData={appData.promptData}
                    addPromptData={addPromptData}
                    generatedContentItems={appData.generatedContentItems}
                    addGeneratedContentItem={addGeneratedContentItem}
                    communityComments={appData.communityComments}
                    updateCommunityComment={updateCommunityComment}
                    addActivity={addActivity}
                    isLocked={isModuleLocked(ModuleKey.ContentStudio)}
                />
              } />
              <Route path="/distribution-hub" element={
                 <DistributionHubModule
                    currentPhaseId={appData.currentPhaseId}
                    isLocked={isModuleLocked(ModuleKey.DistributionHub)}
                 />
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </HashRouter>
  );
};

export default App;
