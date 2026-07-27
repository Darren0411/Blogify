// routes/chatbot.js
import { GoogleGenAI } from '@google/genai';
import express from 'express';
import ChatHistory from '../models/chatHistory.js';

const router = express.Router();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractJSON(text, fallback) {
  try {
    const match = text.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : fallback;
  } catch {
    return fallback;
  }
}

// Calls Gemini with a 15s timeout so the bot never hangs indefinitely
async function callGemini(prompt) {
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Gemini request timed out')), 15000)
  );

  const geminiPromise = ai.models.generateContent({
    model: 'gemini-3.5-flash-lite',
    contents: prompt,
  });

  const response = await Promise.race([geminiPromise, timeoutPromise]);
  return response.text;
}

async function saveHistory({ userId, blogId, type, userMessage, assistantResponse }) {
  try {
    await ChatHistory.create({
      userId: userId || undefined,
      blogId,
      type,
      userMessage,
      assistantResponse,
    });
  } catch (err) {
    console.error('Failed to save chat history:', err.message);
  }
}

// ─── Routes ───────────────────────────────────────────────────────────────────

// Grammar check (writers)
router.post('/grammar', async (req, res) => {
  try {
    const { text, blogId } = req.body;
    if (!text?.trim()) return res.status(400).json({ success: false, message: 'Text is required' });

    const prompt = `You are a professional writing assistant helping a blogger.
Analyze this text and respond ONLY with valid JSON, no markdown, no extra text:
{
  "corrected": "corrected version with better grammar and clarity",
  "issues": [{ "issue": "short description of the problem", "suggestion": "how to fix it" }]
}

Text: "${text}"`;

    const raw = await callGemini(prompt);
    const data = extractJSON(raw, { corrected: text, issues: [] });

    await saveHistory({ userId: req.user?._id, blogId, type: 'grammar', userMessage: text, assistantResponse: data });
    res.json({ success: true, ...data });
  } catch (error) {
    console.error('Grammar API error:', error.message);
    res.status(500).json({ success: false, message: error.message.includes('timed out') ? 'Request timed out, please try again' : 'Failed to process grammar check' });
  }
});

// Improve writing (writers)
router.post('/improve', async (req, res) => {
  try {
    const { text, blogId } = req.body;
    if (!text?.trim()) return res.status(400).json({ success: false, message: 'Text is required' });

    const prompt = `You are a professional editor. Improve the flow, word choice, and clarity of this paragraph while keeping the author's original meaning and voice.
Respond ONLY with valid JSON, no markdown, no extra text:
{
  "improved": "the improved version of the text",
  "changes": ["brief note on what was improved", "another improvement note"]
}

Text: "${text}"`;

    const raw = await callGemini(prompt);
    const data = extractJSON(raw, { improved: text, changes: [] });

    await saveHistory({ userId: req.user?._id, blogId, type: 'grammar', userMessage: text, assistantResponse: data });
    res.json({ success: true, ...data });
  } catch (error) {
    console.error('Improve API error:', error.message);
    res.status(500).json({ success: false, message: error.message.includes('timed out') ? 'Request timed out, please try again' : 'Failed to improve text' });
  }
});

// Summarize blog (readers)
router.post('/summarize', async (req, res) => {
  try {
    const { text, blogId, length = 'medium' } = req.body;
    if (!text?.trim()) return res.status(400).json({ success: false, message: 'Text is required' });

    const lengthMap = {
      short: 'in 1-2 sentences',
      medium: 'in 3-4 sentences',
      long: 'in a detailed paragraph of 5-7 sentences',
    };

    const prompt = `Summarize the following blog content ${lengthMap[length] || lengthMap.medium}. Write only the summary, no preamble, no labels.

Content: "${text}"`;

    const summary = await callGemini(prompt);

    await saveHistory({
      userId: req.user?._id,
      blogId,
      type: 'summarize',
      userMessage: text.slice(0, 500),
      assistantResponse: { summary: summary.trim() },
    });
    res.json({ success: true, summary: summary.trim() });
  } catch (error) {
    console.error('Summarization error:', error.message);
    res.status(500).json({ success: false, message: error.message.includes('timed out') ? 'Request timed out, please try again' : 'Failed to summarize text' });
  }
});

// Define a word (readers)
router.post('/define', async (req, res) => {
  try {
    const { word, context = '', blogId } = req.body;
    if (!word?.trim()) return res.status(400).json({ success: false, message: 'Word is required' });

    const prompt = `Define the word or phrase "${word}" simply for a general reader.
${context ? `It appeared in this context: "${context}"` : ''}
Respond ONLY with valid JSON, no markdown, no extra text:
{
  "word": "${word}",
  "definition": "simple, plain-English definition",
  "partOfSpeech": "noun/verb/adjective/etc",
  "exampleSentence": "a clear example sentence",
  "synonyms": ["synonym1", "synonym2"]
}`;

    const raw = await callGemini(prompt);
    const data = extractJSON(raw, { word, definition: 'Definition not found' });

    await saveHistory({ userId: req.user?._id, blogId, type: 'define', userMessage: word, assistantResponse: data });
    res.json({ success: true, ...data });
  } catch (error) {
    console.error('Definition API error:', error.message);
    res.status(500).json({ success: false, message: error.message.includes('timed out') ? 'Request timed out, please try again' : 'Failed to get word definition' });
  }
});

// General chat
router.post('/chat', async (req, res) => {
  try {
    const { message, blogId, chatMode = 'general' } = req.body;
    if (!message?.trim()) return res.status(400).json({ success: false, message: 'Message is required' });

    const systemPrompts = {
      writer: 'You are a helpful writing assistant for a blog author. Help them write better.',
      reader: 'You are a helpful reading assistant. Explain complex ideas and help readers understand blog content.',
      general: 'You are a helpful assistant for bloggers and readers on a blogging platform.',
    };

    const prompt = `${systemPrompts[chatMode] || systemPrompts.general}\n\nUser: ${message}`;
    const response = await callGemini(prompt);

    await saveHistory({ userId: req.user?._id, blogId, type: 'chat', userMessage: message, assistantResponse: response });
    res.json({ success: true, response });
  } catch (error) {
    console.error('Chat error:', error.message);
    res.status(500).json({ success: false, message: error.message.includes('timed out') ? 'Request timed out, please try again' : 'Failed to process message' });
  }
});

// Chat history (logged-in users only)
router.get('/history/:blogId', async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Login required to view history' });
    const history = await ChatHistory.find({ userId: req.user._id, blogId: req.params.blogId })
      .sort({ timestamp: -1 })
      .limit(50);
    res.json({ success: true, history });
  } catch (error) {
    console.error('History fetch error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch chat history' });
  }
});

// Clear history
router.delete('/history/:blogId', async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Login required' });
    await ChatHistory.deleteMany({ userId: req.user._id, blogId: req.params.blogId });
    res.json({ success: true, message: 'Chat history cleared' });
  } catch (error) {
    console.error('History deletion error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to clear history' });
  }
});

export default router;