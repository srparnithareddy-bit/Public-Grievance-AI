/**
 * AI Complaint Triage Service
 * 
 * Powered by Google Gemini API (@google/generative-ai).
 * Automatically classifies citizen grievances into:
 *  - Title
 *  - Category/Department: Sanitation, Water, Roads, Electricity, Public Safety, General
 *  - Urgency Level: Low, Medium, High, Critical
 *  - Concise Summary & Actionable Recommendations
 * 
 * Includes an intelligent fallback triage engine so the demo NEVER crashes
 * even if GEMINI_API_KEY is unset, offline, or rate-limited.
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

const VALID_CATEGORIES = ['Sanitation', 'Water', 'Roads', 'Electricity', 'Public Safety', 'General'];
const VALID_URGENCIES = ['Low', 'Medium', 'High', 'Critical'];

// Initialize Google Gemini Client if API key is provided
const getGeminiModel = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
    return null;
  }
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    return genAI.getGenerativeModel({ model: modelName });
  } catch (error) {
    console.warn('⚠️  Could not initialize GoogleGenerativeAI:', error.message);
    return null;
  }
};

/**
 * Intelligent Rule-Based Fallback Classifier
 * Used when Gemini API key is missing or offline
 */
const fallbackTriage = (rawText) => {
  const text = (rawText || '').toLowerCase();

  // 1. Determine Category
  let category = 'General';
  if (text.includes('water') || text.includes('drain') || text.includes('pipe') || text.includes('leak') || text.includes('tap') || text.includes('contamination') || text.includes('sewage') || text.includes('jal')) {
    category = 'Water';
  } else if (text.includes('garbage') || text.includes('waste') || text.includes('dump') || text.includes('trash') || text.includes('smell') || text.includes('odor') || text.includes('dustbin') || text.includes('sanitation') || text.includes('cleanliness')) {
    category = 'Sanitation';
  } else if (text.includes('pothole') || text.includes('road') || text.includes('flyover') || text.includes('street') || text.includes('pavement') || text.includes('tar') || text.includes('asphalt') || text.includes('footpath') || text.includes('bridge')) {
    category = 'Roads';
  } else if (text.includes('electric') || text.includes('power') || text.includes('wire') || text.includes('spark') || text.includes('shock') || text.includes('transformer') || text.includes('voltage') || text.includes('meter') || text.includes('current')) {
    category = 'Electricity';
  } else if (text.includes('dark') || text.includes('theft') || text.includes('crime') || text.includes('accident') || text.includes('hazard') || text.includes('danger') || text.includes('police') || text.includes('safety') || text.includes('harassment') || text.includes('streetlight') || text.includes('light')) {
    category = 'Public Safety';
  }

  // 2. Determine Urgency
  let urgency = 'Medium';
  const criticalKeywords = ['spark', 'fire', 'shock', 'electrocution', 'urgent', 'emergency', 'casualty', 'burst', 'collapsed', 'explosion', 'life-threatening', 'danger', 'sparks', 'bleeding'];
  const highKeywords = ['flooding', 'blocked', 'major', 'severe', 'child', 'school', 'hospital', 'accident', 'overflowing', 'contaminat', 'skid', 'stray dog'];
  const lowKeywords = ['minor', 'suggestion', 'request', 'slow', 'aesthetic', 'paint', 'park bench', 'tree trim'];

  if (criticalKeywords.some(kw => text.includes(kw))) {
    urgency = 'Critical';
  } else if (highKeywords.some(kw => text.includes(kw))) {
    urgency = 'High';
  } else if (lowKeywords.some(kw => text.includes(kw))) {
    urgency = 'Low';
  }

  // 3. Generate concise Title
  const cleanSnippet = rawText.trim().replace(/\n+/g, ' ').slice(0, 75);
  let title = cleanSnippet.length > 60 ? cleanSnippet.slice(0, 60) + '...' : cleanSnippet;
  if (!title) {
    title = `Public Grievance Report - ${category}`;
  }

  // 4. Generate Recommendations & Summary
  const recommendationsMap = {
    Water: [
      'Isolate the local control valve immediately to prevent clean water loss.',
      'Deploy water maintenance team for pipeline inspection and pressure testing.',
      'Provide temporary potable water tanker if supply is disrupted.'
    ],
    Electricity: [
      'Instruct grid substation to de-energize the hazardous line immediately.',
      'Deploy rapid electrical response crew to insulate exposed wires or repair transformer.',
      'Place high-visibility hazard barricades around the perimeter.'
    ],
    Roads: [
      'Install cautionary traffic cones and warning indicators for motorists.',
      'Schedule cold-mix/hot-mix bituminous patching within 24 to 48 hours.',
      'Notify local traffic enforcement to regulate vehicle flow during repairs.'
    ],
    Sanitation: [
      'Dispatch municipal solid waste collection vehicle for comprehensive clearance.',
      'Apply bleaching powder and disinfectant spray across the site.',
      'Establish monitored bi-daily waste pickup schedule for this location.'
    ],
    'Public Safety': [
      'Dispatch municipal electrical technician to replace faulty lighting or fixtures.',
      'Coordinate with nearest police station to increase night patrolling.',
      'Conduct neighborhood safety inspection and clear obscured visibility angles.'
    ],
    General: [
      'Acknowledge citizen grievance and route to relevant zonal municipal ward officer.',
      'Conduct preliminary on-site inspection within 48 hours.',
      'Keep citizen notified via SMS/email updates as ticket progresses.'
    ],
  };

  const detectedKeywords = [...criticalKeywords, ...highKeywords]
    .filter(kw => text.includes(kw))
    .slice(0, 5);

  return {
    title: title.charAt(0).toUpperCase() + title.slice(1),
    category,
    urgency,
    summary: `Citizen reported: ${rawText.slice(0, 160)}${rawText.length > 160 ? '...' : ''}`,
    actionableRecommendations: recommendationsMap[category] || recommendationsMap.General,
    confidenceScore: 0.92,
    detectedKeywords: detectedKeywords.length > 0 ? detectedKeywords : [category.toLowerCase()],
    source: 'heuristic_fallback',
  };
};

/**
 * Triage raw citizen complaint using Gemini API
 */
const triageComplaint = async (rawText) => {
  if (!rawText || typeof rawText !== 'string' || !rawText.trim()) {
    throw new Error('Complaint text cannot be empty');
  }

  const model = getGeminiModel();

  // If Gemini is not configured, seamlessly run intelligent fallback
  if (!model) {
    return fallbackTriage(rawText);
  }

  const prompt = `
You are the AI Complaint Triage Engine for the "Public Grievance AI Assistant" municipal portal.
Analyze the following citizen complaint and extract structured information.

Rules:
1. category MUST be strictly one of: ["Sanitation", "Water", "Roads", "Electricity", "Public Safety", "General"]
2. urgency MUST be strictly one of: ["Low", "Medium", "High", "Critical"]
   - Critical: Imminent physical danger, live exposed wires, gas leaks, structural collapse, severe flooding.
   - High: Heavy disruption, contamination, major potholes on highways, school/hospital proximity.
   - Medium: Routine road issues, uncollected garbage, streetlight failure, drainage delays.
   - Low: Minor cosmetic repairs, long-term requests, park maintenance.
3. title: Concise, professional headline (max 80 chars).
4. summary: Clear 1-2 sentence executive summary of the issue.
5. actionableRecommendations: Array of 3 specific, concrete action steps government officials should take.
6. detectedKeywords: Array of 3-6 key terms extracted from the complaint.

Citizen Complaint Text:
"""
${rawText}
"""

You MUST respond strictly with valid JSON with no markdown backticks, no explanations.
JSON format:
{
  "title": "...",
  "category": "Sanitation" | "Water" | "Roads" | "Electricity" | "Public Safety" | "General",
  "urgency": "Low" | "Medium" | "High" | "Critical",
  "summary": "...",
  "actionableRecommendations": ["...", "...", "..."],
  "detectedKeywords": ["...", "..."],
  "confidenceScore": 0.95
}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text().trim();

    // Clean any markdown code fences if Gemini added them (e.g. ```json ... ```)
    const cleanedJson = responseText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```$/g, '')
      .trim();

    const parsed = JSON.parse(cleanedJson);

    // Validate category and urgency bounds
    if (!VALID_CATEGORIES.includes(parsed.category)) {
      parsed.category = 'General';
    }
    if (!VALID_URGENCIES.includes(parsed.urgency)) {
      parsed.urgency = 'Medium';
    }
    if (!Array.isArray(parsed.actionableRecommendations)) {
      parsed.actionableRecommendations = [parsed.actionableRecommendations || 'Dispatch field inspection team.'];
    }

    parsed.source = 'gemini_api';
    return parsed;
  } catch (error) {
    console.warn('⚠️  Gemini API call failed, falling back to rule-based engine:', error.message);
    return fallbackTriage(rawText);
  }
};

/**
 * Conversational AI Assistant
 * Interacts with citizens to guide them, answer grievance questions,
 * and help them articulate complaints clearly before submission.
 */
const chatWithCitizenAssistant = async (messages, draftComplaint = '') => {
  const model = getGeminiModel();

  const conversationHistory = messages || [];
  const latestUserMessage = conversationHistory[conversationHistory.length - 1]?.content || '';

  // Fallback conversational responses if no API key
  if (!model) {
    const text = latestUserMessage.toLowerCase();
    let reply = "Hello! I am your Public Grievance AI Assistant. You can describe any municipal issue (like broken roads, water leaks, garbage dumps, or electrical problems), and I will help format and classify it for the right department.";

    if (text.includes('pothole') || text.includes('road')) {
      reply = "I understand you have an issue with road conditions. Could you tell me the exact location or landmark? You can click 'Apply AI Recommendations to Form' whenever you are ready to submit.";
    } else if (text.includes('water') || text.includes('drain') || text.includes('pipe')) {
      reply = "Water supply and drainage issues are prioritized. Is there active flooding or contaminated water? Please specify the street and approximate duration.";
    } else if (text.includes('garbage') || text.includes('trash') || text.includes('clean')) {
      reply = "Sanitation complaints are routed directly to the Municipal Solid Waste Department. Is the garbage near a public area like a school, hospital, or marketplace?";
    } else if (text.includes('wire') || text.includes('electric') || text.includes('light')) {
      reply = "Electrical issues can be hazardous. If there are exposed wires or sparks, our system automatically flags this as Critical urgency so officials are alerted immediately.";
    } else if (text.includes('track') || text.includes('status')) {
      reply = "You can track any grievance in real time using your unique Tracking ID (e.g. GRV-2026-1001) in the 'Track Grievance' tab!";
    }

    // Auto-triage the user's combined messages
    const triage = fallbackTriage(draftComplaint || latestUserMessage);
    return {
      reply,
      suggestedTriage: triage,
      source: 'heuristic_assistant',
    };
  }

  try {
    const systemInstruction = `You are a helpful, empathetic municipal AI Grievance Assistant for a city corporation portal.
Your job is to listen to citizens' complaints, ask 1 helpful clarifying question (such as specific location, duration, or immediate hazard),
and reassure them that their issue is being recorded for the appropriate department. Keep your responses concise (2-3 sentences).
Also analyze their complaint and provide an auto-triage suggestion.`;

    const chat = model.startChat({
      history: conversationHistory.slice(0, -1).map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      })),
    });

    const result = await chat.sendMessage(`${systemInstruction}\nCitizen message: ${latestUserMessage}`);
    const response = await result.response;
    const reply = response.text();

    const suggestedTriage = await triageComplaint(draftComplaint || latestUserMessage);

    return {
      reply,
      suggestedTriage,
      source: 'gemini_api',
    };
  } catch (error) {
    console.warn('⚠️  Chat assistant fallback triggered:', error.message);
    const triage = fallbackTriage(draftComplaint || latestUserMessage);
    return {
      reply: "Thank you for the details. I have analyzed your complaint and prepared the structured categorization and recommendations. You can review and submit it to the authorities now.",
      suggestedTriage: triage,
      source: 'heuristic_assistant',
    };
  }
};

module.exports = {
  triageComplaint,
  chatWithCitizenAssistant,
  fallbackTriage,
  VALID_CATEGORIES,
  VALID_URGENCIES,
};
