
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Stats } from '../types';

const apiKey = process.env.GEMINI_API_KEY || '';

if (!apiKey) {
    console.warn("GEMINI_API_KEY environment variable not set. AI features will be disabled.");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const getAIFeedback = async (stats: Stats): Promise<string> => {
    if (!apiKey) {
        return "AI features are disabled because the API key is not configured.";
    }

    const { completedSessions, interruptedSessions, totalFocusTime, sessionLogs } = stats;

    if (sessionLogs.length === 0) {
        return "Start a focus session to get your first AI-powered insight!";
    }

    const prompt = `
        You are 'Izy', a friendly and encouraging productivity coach specializing in helping users with executive function challenges like ADHD.
        Analyze the following user stats and provide 3 actionable, positive, and non-critical tips.
        Keep the tone light, supportive, and motivating. Use markdown for formatting.

        User Stats:
        - Total Completed Sessions: ${completedSessions}
        - Total Interrupted Sessions: ${interruptedSessions}
        - Total Focus Time: ${totalFocusTime} minutes
        - Recent Activity (last 5 sessions): ${JSON.stringify(sessionLogs.slice(-5).map(s => ({ task: s.taskName, status: s.status, plannedMinutes: s.duration, focusedMinutes: s.actualDuration })))}

        Based on this, generate personalized feedback.

        - If interruptions are high, especially on long tasks, suggest breaking them down or using the partial reward system as motivation.
        - If a user often goes over time (focused > planned), praise their ability to hyperfocus and suggest scheduling longer blocks for those tasks.
        - Acknowledge effort, e.g., "Great job for focusing for X minutes, even if you had to stop!".
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        return text;
    } catch (error) {
        console.error("Error fetching AI feedback:", error);
        return "Sorry, I couldn't get any insights right now. Please try again later.";
    }
};
