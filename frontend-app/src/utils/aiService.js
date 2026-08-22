/**
 * aiService.js — shared utility for all AI calls in Campus OS.
 *
 * Reads VITE_AI_API_URL (set in .env).
 * When the env var is missing, callAI() returns null so every
 * feature can gracefully show its own fallback text.
 */

const AI_URL = import.meta.env.VITE_AI_API_URL;

/**
 * Call the Campus OS AI backend.
 *
 * @param {string} systemPrompt  — Role/context instruction for the AI.
 * @param {string} userPrompt    — The specific question or task.
 * @param {Array}  history       — Optional previous messages [{role, content}].
 * @returns {Promise<string|null>} AI text response, or null if unavailable.
 */
export async function callAI(systemPrompt, userPrompt, history = []) {
  if (!AI_URL) return null;

  const messages = [
    { role: "system", content: systemPrompt },
    ...history,
    { role: "user", content: userPrompt },
  ];

  const response = await fetch(AI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) throw new Error(`AI request failed: ${response.status}`);

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || data.message || data.response;
  if (!text) throw new Error("Empty AI response");
  return text;
}

