
import { PhaseInfo, ModuleKey } from './types';

export const APP_NAME = "Brand Central AI";

export const PHASES: PhaseInfo[] = [
  { id: 0, title: "Phase 0: Positioning", description: "Define your brand's core positioning and audience.", module: ModuleKey.WorldFoundry },
  { id: 1, title: "Phase 1: World Bible", description: "Develop the foundational lore and narrative of your brand.", module: ModuleKey.WorldFoundry },
  { id: 2, title: "Phase 2: Visual Identity", description: "Establish your brand's visual language.", module: ModuleKey.WorldFoundry },
  { id: 3, title: "Phase 3: Content Pillars", description: "Define key themes for your content.", module: ModuleKey.ContentStudio },
  { id: 4, title: "Phase 4: Distribution Setup", description: "Set up your content distribution channels.", module: ModuleKey.DistributionHub },
  { id: 5, title: "Phase 5: MVP Content", description: "Create your minimum viable product content.", module: ModuleKey.ContentStudio },
  { id: 6, title: "Phase 6: Content Cadence", description: "Establish a regular content publishing schedule.", module: ModuleKey.ContentStudio },
  { id: 7, title: "Phase 7: Campaign Execution", description: "Launch and manage brand campaigns.", module: ModuleKey.ContentStudio },
  { id: 8, title: "Phase 8: Community Building", description: "Engage and grow your brand community.", module: ModuleKey.ContentStudio }, // Assuming Content Studio handles engagement aspects
  { id: 9, title: "Phase 9: Analytics & Iteration", description: "Analyze performance and refine strategies.", module: ModuleKey.DistributionHub },
];

export const ONBOARDING_WEEKS_CONFIG = {
  1: {
    unlocks: [ModuleKey.WorldFoundry],
    focus: "Guided research and positioning (Phase 0).",
  },
  2: {
    unlocks: [ModuleKey.WorldFoundry], // Already unlocked, but focus shifts
    focus: "Develop Visual Identity Kit and World Bible (Phases 1 & 2).",
  },
  3: {
    unlocks: [ModuleKey.ContentStudio],
    focus: "Create 4 MVP posts using the Content Studio (Phase 5).",
  },
  4: {
    unlocks: [ModuleKey.DistributionHub],
    focus: "Set up distribution and activate metrics dashboard (Phases 4 & 9). Full system activation.",
  },
};

export const GEMINI_TEXT_MODEL = 'gemini-2.5-flash-preview-04-17';
// export const GEMINI_IMAGE_MODEL = 'imagen-3.0-generate-002'; // If image generation was needed

    