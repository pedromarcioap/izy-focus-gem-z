import { Stats } from '../types';

// Removed OPENROUTER_API_KEY from process.env

const getStorageData = (keys: string[]): Promise<any> => {
  return new Promise((resolve) => {
    chrome.storage.local.get(keys, (result) => {
      resolve(result);
    });
  });
};

export const getAIFeedback = async (stats: Stats): Promise<string> => {
  const { openRouterApiKey, openRouterModel } = await getStorageData(['openRouterApiKey', 'openRouterModel']);

  if (!openRouterApiKey) {
    console.warn("OpenRouter API Key not set in settings. AI features will be disabled.");
    return "AI feedback is currently unavailable. Please set your OpenRouter API key in the AI Settings.";
  }

  const modelToUse = openRouterModel || "openai/gpt-3.5-turbo"; // Use configured model or default

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openRouterApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: modelToUse,
        messages: [
          { role: "system", content: "You are a helpful assistant that provides encouraging feedback on focus session statistics." },
          { role: "user", content: `Provide a short, encouraging feedback based on these focus stats: Total Focus Time: ${stats.totalFocusTime} minutes, Completed Sessions: ${stats.completedSessions}, Interrupted Sessions: ${stats.interruptedSessions}.` },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenRouter API error: ${response.status} - ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;

  } catch (error) {
    console.error("Error fetching AI feedback:", error);
    return "Failed to get AI feedback. Please try again later.";
  }
};