
import { GoogleGenAI, GenerateContentResponse, Part, GenerateContentParameters, Content, PartUnion } from "@google/genai";
import { LMAIScore, MacroFantasyInputs, WorldBible, VisualIdentityKit, AppStateData } from '../types';
import { GEMINI_TEXT_MODEL } from '../constants';

const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;
let isMockClient = false;

const getAiClient = (): GoogleGenAI => {
  if (!API_KEY) {
    isMockClient = true;
    console.warn("API_KEY is not configured for GeminiService. Using mock AI client. AI features will use mock data.");
    return {
        models: {
            // @ts-ignore
            generateContent: async (params: GenerateContentParameters): Promise<GenerateContentResponse> => {
                let mockText = "API Key not configured. Mock AI response.";
                
                let primaryTextContent = "";
                if (typeof params.contents === 'string') {
                    primaryTextContent = params.contents;
                } else if (Array.isArray(params.contents)) { // It's Array<Content | PartUnion>
                    primaryTextContent = params.contents.map(item => {
                        if (typeof item === 'string') return item; // PartUnion as string
                        if (item && 'text' in item && typeof item.text === 'string') return item.text; // Handles TextPart-like objects
                        if (item && 'parts' in item && Array.isArray(item.parts)) { // Handles Content
                            return item.parts.map(part => {
                                if (typeof part === 'string') return part;
                                if (part && 'text' in part && typeof part.text === 'string') return part.text;
                                return '';
                            }).join(' ');
                        }
                        return '';
                    }).join(' ');
                } else if (params.contents && typeof params.contents === 'object' && 'parts' in params.contents && Array.isArray((params.contents as Content).parts)) { // It's Content
                    primaryTextContent = (params.contents as Content).parts.map(part => {
                        if (typeof part === 'string') return part;
                        if (part && 'text' in part && typeof part.text === 'string') return part.text;
                        return '';
                    }).join(' ');
                }


                if (primaryTextContent.includes("Macro-Fantasy Statement")) {
                    mockText = "Mock Macro-Fantasy: Your brand will empower [Target Audience] to overcome [Core Problem] by offering [Unique Solution], making them feel truly [Desired Feeling]. (API Key Missing)";
                } else if (primaryTextContent.includes("L-M-A-I framework")) {
                     mockText = JSON.stringify({
                        overallScore: 50,
                        lifestyle: { score: 50, explanation: "Mock: Focus on daily relevance." },
                        moodboard: { score: 50, explanation: "Mock: Visuals evoke comfort." },
                        association: { score: 50, explanation: "Mock: Connects with aspiration." },
                        inspire: { score: 50, explanation: "Mock: Motivates positive change." },
                        summary: "This is a mock LMAI score due to missing API Key.",
                      });
                } else if (primaryTextContent.includes("brand alignment")) {
                     mockText = JSON.stringify({ violations: ["Mock: Color 'bright red' not in palette (API Key Missing)"], suggestions: ["Consider using primary brand color."] });
                } else if (primaryTextContent.includes("Generate content ideas for topic:")) {
                    mockText = JSON.stringify([
                        "Mock Idea 1: Explore the impact of X on Y.",
                        "Mock Idea 2: A 'how-to' guide for Z.",
                        "Mock Idea 3: Interview an expert about A."
                    ]);
                } else if (primaryTextContent.includes("Refine the following user prompt")) {
                    mockText = `Refined Mock Prompt: Based on the World Bible context, enhance the user's focus on [Key Theme] while ensuring a [Brand Tone] tone. User's original query: ${primaryTextContent}`;
                } else if (primaryTextContent.includes("Generate content for the template")) {
                    mockText = "Mock templated content: This is a short social media post about [Primary Input] highlighting [Secondary Input], all in a mock brand voice. (API Key Missing)";
                } else if (primaryTextContent.includes("Suggest a reply to the following user comment")) {
                    mockText = "Mock suggested reply: Thank you for your comment! We appreciate your feedback on [Comment Topic]. (API Key Missing)";
                } else if (primaryTextContent.includes("Generate a text based on this prompt:")) {
                    mockText = "This is mock text generated based on the provided prompt. (API Key Missing)";
                }
                // @ts-ignore
                return { text: mockText } as GenerateContentResponse;
            },
            generateContentStream: async function*() { 
                // @ts-ignore
                yield { text: "API Key not configured. Mock stream response." } as GenerateContentResponse; 
            },
        },
        chats: {
          create: () => ({
            // @ts-ignore
            sendMessage: async () => ({ text: "API Key not configured. Mock chat response." } as GenerateContentResponse),
            // @ts-ignore
            sendMessageStream: async function*() { yield { text: "API Key not configured. Mock chat stream response." } as GenerateContentResponse; },
          }) as any,
        }
    } as unknown as GoogleGenAI;
  }
  isMockClient = false;
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: API_KEY });
  }
  return ai;
};


const parseJsonFromMarkdown = <T,>(markdownString: string): T | null => {
  try {
    let jsonStr = markdownString.trim();
    const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[1]) {
      jsonStr = match[1].trim();
    }
    return JSON.parse(jsonStr) as T;
  } catch (error) {
    console.error("Failed to parse JSON from Markdown:", error, "Original string:", markdownString);
    try {
      // Attempt to parse as raw JSON if markdown parsing fails
      return JSON.parse(markdownString) as T;
    } catch (e) {
      console.error("Failed to parse as raw JSON either:", e, markdownString);
      return null;
    }
  }
};


export const getLMAIScore = async (text: string): Promise<LMAIScore | null> => {
  const client = getAiClient();
  if (isMockClient) {
      const mockResponse = await client.models.generateContent({ model: GEMINI_TEXT_MODEL, contents: "L-M-A-I framework" });
      return parseJsonFromMarkdown<LMAIScore>(mockResponse.text);
  }

  const prompt = `
    Analyze the following brand idea/text for alignment with the L-M-A-I framework (Lifestyle, Moodboard, Association, Inspire).
    Brand Idea: "${text}"
    Provide your analysis in JSON format. The JSON object should have the following structure:
    {
      "overallScore": <number between 0 and 100 representing the overall alignment>,
      "lifestyle": { "score": <number 0-100>, "explanation": "<string>" },
      "moodboard": { "score": <number 0-100>, "explanation": "<string>" },
      "association": { "score": <number 0-100>, "explanation": "<string>" },
      "inspire": { "score": <number 0-100>, "explanation": "<string>" },
      "summary": "<string summarizing the overall alignment and key suggestions>"
    }
    Focus on constructive feedback for each L, M, A, and I component.
    The explanation for each should be concise, 1-2 sentences.
  `;

  try {
    const response = await client.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
      config: { responseMimeType: "application/json", temperature: 0.5 },
    });
    const responseText = response.text;
    if (!responseText) return null;
    return parseJsonFromMarkdown<LMAIScore>(responseText);
  } catch (error) {
    console.error("Error getting LMAI score from Gemini:", error);
     if (error instanceof Error && (error.message.includes("API_KEY_INVALID") || error.message.includes("PERMISSION_DENIED"))) {
        return {
            overallScore: 0,
            lifestyle: { score: 0, explanation: "Error: API Key is invalid or permission denied." },
            moodboard: { score: 0, explanation: "Error: API Key is invalid or permission denied." },
            association: { score: 0, explanation: "Error: API Key is invalid or permission denied." },
            inspire: { score: 0, explanation: "Error: API Key is invalid or permission denied." },
            summary: "Failed to fetch LMAI score due to an API key or permission issue."
        };
    }
    return null;
  }
};


export const generateMacroFantasyStatement = async (inputs: MacroFantasyInputs): Promise<string | null> => {
  const client = getAiClient();
   if (isMockClient) {
    console.log("[GeminiService Debug] generateMacroFantasyStatement: Using MOCK client.");
    const mockResponse = await client.models.generateContent({ model: GEMINI_TEXT_MODEL, contents: "Macro-Fantasy Statement" });
    console.log("[GeminiService Debug] generateMacroFantasyStatement (Mock): mockResponse.text is:", mockResponse.text);
    const result = mockResponse.text?.trim() || null;
    console.log("[GeminiService Debug] generateMacroFantasyStatement (Mock): final result to be returned:", result);
    return result;
  }

  const prompt = `
    Craft a compelling and concise Macro-Fantasy Statement for a brand based on the following inputs.
    The statement should be a powerful one-line promise that encapsulates the brand's core value proposition and aspirational appeal.
    It should be inspiring and memorable.
    Inputs:
    - Target Audience: "${inputs.targetAudience}"
    - Core Problem they face: "${inputs.coreProblem}"
    - Unique Solution the brand offers: "${inputs.uniqueSolution}"
    - Desired Feeling the brand evokes: "${inputs.desiredFeeling}"
    Generate only the Macro-Fantasy Statement as a single string.
  `;

  try {
    console.log("[GeminiService Debug] generateMacroFantasyStatement: Using REAL client.");
    const response = await client.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
      config: { temperature: 0.7, maxOutputTokens: 150 },
    });
    const result = response.text?.trim() || null;
    console.log("[GeminiService Debug] generateMacroFantasyStatement (Real): final result to be returned:", result);
    return result;
  } catch (error) {
    console.error("Error generating Macro-Fantasy Statement from Gemini:", error);
    return null;
  }
};

export const checkBrandAlignment = async (
  assetDescription: string, 
  worldBible: Partial<WorldBible>, 
  vik: Partial<VisualIdentityKit>
): Promise<{ violations: string[], suggestions: string[] } | null> => {
  const client = getAiClient();
   if (isMockClient) {
    const mockResponse = await client.models.generateContent({ model: GEMINI_TEXT_MODEL, contents: { parts: [{text: "brand alignment"}]} }); 
    return parseJsonFromMarkdown(mockResponse.text);
  }

  const promptParts: Part[] = [ { text: `Analyze the following asset description for brand alignment.\nAsset Description: "${assetDescription}"\n\n` }];
  if (worldBible.forbiddenList && worldBible.forbiddenList.length > 0) promptParts.push({ text: `Forbidden Terms: ${worldBible.forbiddenList.join(', ')}\n` });
  if (worldBible.vocabulary && worldBible.vocabulary.length > 0) promptParts.push({ text: `Preferred Vocabulary: ${worldBible.vocabulary.join(', ')}\n` });
  if (vik.colorPalette && vik.colorPalette.length > 0) promptParts.push({ text: `Approved Colors: ${vik.colorPalette.map(c => `${c.name} (${c.hex})`).join(', ')}\n`});
  promptParts.push({ text: `
    Identify any violations of brand guidelines (e.g., use of forbidden terms, misalignment with approved colors/styles/fonts/logo principles).
    Provide constructive suggestions for improvement.
    Return your analysis in JSON format with the following structure:
    {
      "violations": ["<string violation 1>", ...],
      "suggestions": ["<string suggestion 1>", ...]
    }
    If no violations, return empty arrays. Be specific and actionable.
  `});
  
  try {
    const response = await client.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: { parts: promptParts },
      config: { responseMimeType: "application/json", temperature: 0.3 },
    });
    const responseText = response.text;
    if (!responseText) return null;
    return parseJsonFromMarkdown<{ violations: string[], suggestions: string[] }>(responseText);
  } catch (error) {
    console.error("Error checking brand alignment with Gemini:", error);
    return null;
  }
};

// New AI Functions for Content Studio

export const generateContentIdeas = async (topic: string, count: number = 3): Promise<string[] | null> => {
    const client = getAiClient();
    if (isMockClient) {
        const mockResponse = await client.models.generateContent({ model: GEMINI_TEXT_MODEL, contents: `Generate content ideas for topic: ${topic}`});
        return parseJsonFromMarkdown<string[]>(mockResponse.text);
    }

    const prompt = `
        Generate ${count} distinct content ideas for the topic: "${topic}".
        The ideas should be suitable for blog posts, social media, or short videos.
        Keep each idea concise and actionable.
        Return the ideas as a JSON array of strings. For example:
        ["Idea 1 about ${topic}", "Idea 2 exploring ${topic}", "Idea 3 how-to on ${topic}"]
    `;
    try {
        const response = await client.models.generateContent({
            model: GEMINI_TEXT_MODEL,
            contents: prompt,
            config: { responseMimeType: "application/json", temperature: 0.7 }
        });
        const responseText = response.text;
        if (!responseText) return null;
        return parseJsonFromMarkdown<string[]>(responseText);
    } catch (error) {
        console.error("Error generating content ideas from Gemini:", error);
        return null;
    }
};

export const refineUserPrompt = async (userPrompt: string, worldBibleContext?: string): Promise<string | null> => {
    const client = getAiClient();
    if (isMockClient) {
        const mockResponse = await client.models.generateContent({ model: GEMINI_TEXT_MODEL, contents: `Refine the following user prompt: ${userPrompt} Context: ${worldBibleContext}` });
        return mockResponse.text?.trim() || null;
    }
    
    let prompt = `Refine the following user prompt to be more effective for an AI content generation model. \nUser Prompt: "${userPrompt}"\n`;
    if (worldBibleContext) {
        prompt += `Consider this brand context from the World Bible: "${worldBibleContext}". Ensure the refined prompt subtly aligns with this context, perhaps by suggesting a tone, specific keywords to include/avoid, or a target audience perspective.\n`;
    }
    prompt += `Return only the refined prompt as a single string. Make it clearer, more specific, or more evocative if possible.`;

    try {
        const response = await client.models.generateContent({
            model: GEMINI_TEXT_MODEL,
            contents: prompt,
            config: { temperature: 0.5 }
        });
        return response.text?.trim() || null;
    } catch (error) {
        console.error("Error refining prompt with Gemini:", error);
        return null;
    }
};

export const generateTextFromPrompt = async (prompt: string): Promise<string | null> => {
    const client = getAiClient();
     if (isMockClient) {
        const mockResponse = await client.models.generateContent({ model: GEMINI_TEXT_MODEL, contents: `Generate a text based on this prompt: ${prompt}`});
        return mockResponse.text?.trim() || null;
    }
    try {
        const response = await client.models.generateContent({
            model: GEMINI_TEXT_MODEL,
            contents: prompt,
            config: { temperature: 0.7, maxOutputTokens: 500 }
        });
        return response.text?.trim() || null;
    } catch (error) {
        console.error("Error generating text from prompt with Gemini:", error);
        return null;
    }
};

export const generateContentFromTemplate = async (
    templateName: string, 
    inputs: Record<string, string>, 
    worldBible: Partial<WorldBible>
): Promise<string | null> => {
    const client = getAiClient();
    if (isMockClient) {
        const mockResponse = await client.models.generateContent({ model: GEMINI_TEXT_MODEL, contents: `Generate content for the template: ${templateName}` });
        return mockResponse.text?.trim() || null;
    }

    // Construct a detailed prompt based on the template and inputs
    let prompt = `Generate content for the template: "${templateName}".\n`;
    prompt += `User Inputs:\n`;
    for (const key in inputs) {
        prompt += `- ${key}: "${inputs[key]}"\n`;
    }
    
    prompt += `\nBrand Context (from World Bible):\n`;
    if (worldBible.vocabulary && worldBible.vocabulary.length > 0) {
        prompt += `- Preferred Vocabulary: ${worldBible.vocabulary.join(', ')}\n`;
    }
    if (worldBible.forbiddenList && worldBible.forbiddenList.length > 0) {
        prompt += `- Avoid these terms: ${worldBible.forbiddenList.join(', ')}\n`;
    }
    if (worldBible.lore) { // Add a snippet of lore for tone
        prompt += `- Brand Tone/Story Hint: ${worldBible.lore.substring(0,100)}...\n`
    }
    
    // Example specific template logic (can be expanded)
    if (templateName === "Short Social Media Post") {
        prompt += `\nTask: Create a concise and engaging social media post (approx 2-3 sentences) using the provided inputs and adhering to the brand context. The post should be suitable for platforms like Twitter or LinkedIn. Focus on the main message from the inputs.`;
    } else if (templateName === "Product Description Introduction") {
        prompt += `\nTask: Write an intriguing introductory paragraph (approx 3-4 sentences) for a product description page using the provided inputs and adhering to the brand context. It should capture attention and highlight the key benefit.`;
    } else {
        prompt += `\nTask: Generate a creative piece of text based on the inputs, template name, and brand context.`;
    }
    prompt += `\nReturn only the generated text.`;

    try {
        const response = await client.models.generateContent({
            model: GEMINI_TEXT_MODEL,
            contents: prompt,
            config: { temperature: 0.7, maxOutputTokens: 300 }
        });
        return response.text?.trim() || null;
    } catch (error) {
        console.error("Error generating content from template with Gemini:", error);
        return null;
    }
};

export const suggestCommentReply = async (commentText: string, userName: string, worldBible: Partial<WorldBible>): Promise<string | null> => {
    const client = getAiClient();
    if (isMockClient) {
         const mockResponse = await client.models.generateContent({ model: GEMINI_TEXT_MODEL, contents: `Suggest a reply to the following user comment from ${userName}: ${commentText}` });
        return mockResponse.text?.trim() || null;
    }

    let prompt = `Suggest a helpful and brand-aligned reply to the following user comment.
User Name: "${userName}"
Comment: "${commentText}"

Brand Context (from World Bible):
`;
    if (worldBible.vocabulary && worldBible.vocabulary.length > 0) {
        prompt += `- Preferred Tone/Vocabulary Hints: ${worldBible.vocabulary.slice(0,5).join(', ')}\n`; // Use a few keywords for tone
    }
     if (worldBible.lore) { 
        prompt += `- Brand Story Essence: ${worldBible.lore.substring(0,100)}...\n`
    }
    prompt += `
The reply should be polite, acknowledge the user's comment, and use a tone consistent with the brand context.
If the comment is negative, try to de-escalate or offer help. If positive, show appreciation.
Return only the suggested reply as a single string.
    `;
    try {
        const response = await client.models.generateContent({
            model: GEMINI_TEXT_MODEL,
            contents: prompt,
            config: { temperature: 0.6, maxOutputTokens: 150 }
        });
        return response.text?.trim() || null;
    } catch (error) {
        console.error("Error suggesting comment reply with Gemini:", error);
        return null;
    }
};
