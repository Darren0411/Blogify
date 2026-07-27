import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

try {
  const r = await ai.models.generateContent({
    model: 'gemini-3.5-flash-lite',
    contents: 'Say hello in one word',
  });

  // Log the full response shape so we can see exactly how to extract text
  console.log('Full response keys:', Object.keys(r));
  console.log('candidates:', JSON.stringify(r.candidates?.[0]?.content, null, 2));
  console.log('text type:', typeof r.text);
  
  // Try all possible ways to get the text
  if (typeof r.text === 'function') console.log('✅ r.text():', r.text());
  if (typeof r.text === 'string') console.log('✅ r.text:', r.text);
  
  const fromCandidates = r.candidates?.[0]?.content?.parts?.[0]?.text;
  if (fromCandidates) console.log('✅ from candidates:', fromCandidates);

} catch (e) {
  console.log('Error:', e.message);
}
