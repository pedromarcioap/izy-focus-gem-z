
import { GoogleGenAI } from "../google-genai.js";

// Safely access the API key to prevent crashes in browser environments
const apiKey = (typeof process !== 'undefined' && process.env && process.env.API_KEY)
  ? process.env.API_KEY
  : '';


if (!apiKey) {
    console.warn("API_KEY environment variable not set. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: apiKey });

export const getAIFeedback = async (stats) => {
    if (!apiKey) {
        return "AI features are disabled because the API key is not configured.";
    }

    const { completedSessions, interruptedSessions, totalFocusTime, sessionLogs } = stats;

    if (completedSessions === 0 && interruptedSessions === 0) {
        return "Start a focus session to get your first AI-powered insight!";
    }

    const prompt = `
        Você é 'Izy', um coach de produtividade amigável e encorajador especializado em ajudar usuários com desafios de função executiva, como TDAH. 
        Analise as seguintes estatísticas do usuário e forneça 3 dicas acionáveis, positivas e não críticas.
        Mantenha o tom leve, de apoio e motivador Use markdown para formatação.

        Estatísticas do Usuário:
        - Total Completed Sessions: ${completedSessions}
        - Total Interrupted Sessions: ${interruptedSessions}
        - Total Focus Time: ${totalFocusTime} minutes
        - Recent Activity (last 5 sessions): ${JSON.stringify(sessionLogs.slice(-5).map(s => ({ task: s.taskName, status: s.status, plannedMinutes: s.duration, focusedMinutes: s.actualDuration })))}

        Com base nisso, gere feedback personalizado.

        - Se as interrupções forem altas, especialmente em tarefas longas, sugira dividi-las ou usar o sistema de recompensa parcial como motivação.
        - Se um usuário frequentemente estende o tempo (focado > planejado), elogie sua capacidade de hiperfoco e sugira agendar blocos mais longos para essas tarefas.
        - Reconheça o esforço, por exemplo, "Ótimo trabalho por se concentrar por X minutos, mesmo que você tenha tido que parar!".
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                temperature: 0.7,
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error fetching AI feedback:", error);
        return "Sorry, I couldn't get any insights right now. Please try again later.";
    }
};
