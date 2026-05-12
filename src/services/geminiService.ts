import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface FactCheckResult {
  top_bar: {
    credibility: number;
    verdict: "Likely True" | "Possibly Misleading" | "Likely False";
    risk: "Low" | "Medium" | "High";
  };
  one_line_summary: string;
  highlighted_flags: {
    text: string;
    risk: "Low" | "Medium" | "High";
  }[];
  key_issues: string[];
  timeline_check: {
    issue: "Yes" | "No";
    details: string;
  };
  why_it_tricks_people: string[];
  psychological_triggers: {
    type: string;
    example: string;
  }[];
  real_world_impact: {
    risk: "Low" | "Medium" | "High";
    impact: string;
  };
  explanation: string;
  corrected_version: string;
  truthful_rewrite: string;
  user_action: string[];
  confidence: "Low" | "Medium" | "High";
}

export async function analyzeContent(content: string): Promise<FactCheckResult> {
  const prompt = `
    You are TruthGuard AI — a real-time misinformation detection and digital forensics engine.

    Analyze the content below and generate a concise, structured, and user-friendly misinformation report designed for quick understanding and real-world action.

    Content:
    """
    ${content}
    """

    Return ONLY valid JSON in this format:

    {
    "top_bar": {
    "credibility": "0-100 score",
    "verdict": "Likely True / Possibly Misleading / Likely False",
    "risk": "Low / Medium / High"
    },

    "one_line_summary": "Very short explanation of the result (1 sentence)",

    "highlighted_flags": [
    {
    "text": "exact sentence or phrase",
    "risk": "Low / Medium / High"
    }
    ],

    "key_issues": [
    "Main misinformation problems (timeline errors, fake claims, manipulation, missing evidence)"
    ],

    "timeline_check": {
    "issue": "Yes/No",
    "details": "Explain if content uses future dates or impossible timeline"
    },

    "why_it_tricks_people": [
    "Explain simply how this content manipulates users (e.g., trusted branding, emotional triggers, mixing real + fake)"
    ],

    "psychological_triggers": [
    {
    "type": "fear / authority / shock / urgency / curiosity",
    "example": "text snippet"
    }
    ],

    "real_world_impact": {
    "risk": "Low / Medium / High",
    "impact": "How this misinformation can harm individuals or society"
    },

    "explanation": "Clear and simple reasoning why this content is reliable or not",

    "corrected_version": "Short accurate version of the content",

    "truthful_rewrite": "Rewrite full content in a neutral and factual way",

    "user_action": [
    "Do not share if misleading",
    "Verify with trusted sources",
    "Report if necessary"
    ],

    "confidence": "Low / Medium / High"
    }

    Rules:

    * Be clear, simple, and structured
    * Focus on quick readability (judge-friendly)
    * Do not assume unknown facts
    * Keep explanations concise but meaningful
    * Ensure valid JSON only
    * Do not output anything outside JSON
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as FactCheckResult;
  } catch (error) {
    console.error("Analysis failed:", error);
    throw new Error("Failed to analyze content. Please check your input or try again later.");
  }
}
