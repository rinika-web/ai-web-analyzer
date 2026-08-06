import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});


export async function generateAISummary(data) {

    const prompt = `
You are an expert Website Performance Engineer.

Analyze this website audit report.

Return ONLY valid JSON.
Do not use markdown.
Do not add explanations outside JSON.

The JSON structure must be:

{
  "summary": "short overall analysis",
  "strengths": [
    "strength 1",
    "strength 2",
    "strength 3"
  ],
  "priorities": [
    "priority improvement 1",
    "priority improvement 2",
    "priority improvement 3"
  ],
  "recommendation": "final engineering recommendation"
}


Website Report:

${JSON.stringify(data, null, 2)}
`;


    const response = await ai.models.generateContent({

        model: "gemini-3.6-flash",

        contents: prompt,

    });


    const text = response.text;


    return JSON.parse(text);

}