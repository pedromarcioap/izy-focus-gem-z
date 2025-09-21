import React, { useState } from 'react';

interface AISettingsProps {
  openRouterApiKey: string;
  setOpenRouterApiKey: (key: string) => void;
  openRouterModel: string;
  setOpenRouterModel: (model: string) => void;
}

const AISettings: React.FC<AISettingsProps> = ({
  openRouterApiKey,
  setOpenRouterApiKey,
  openRouterModel,
  setOpenRouterModel,
}) => {
  const [apiKeyInput, setApiKeyInput] = useState(openRouterApiKey);
  const [modelInput, setModelInput] = useState(openRouterModel);

  const handleSave = () => {
    setOpenRouterApiKey(apiKeyInput);
    setOpenRouterModel(modelInput);
    // Optionally, provide user feedback that settings are saved
  };

  return (
    <div className="dashboard-container">
        <div className="dashboard-header-card">
            <h2 className="dashboard-header-title">AI Settings (OpenRouter)</h2>
            <p className="dashboard-header-subtitle">Configure your OpenRouter API key and preferred AI model for personalized feedback.</p>
        </div>
        <div className="mt-6 bg-light-navy p-6 rounded-lg border border-lightest-navy/20">
            <div className="space-y-6">
                <div>
                    <label htmlFor="openrouter-api-key" className="block text-sm font-medium text-light-slate mb-1">
                    OpenRouter API Key:
                    </label>
                    <input
                    type="password" // Use type="password" for API keys
                    id="openrouter-api-key"
                    className="input-base w-full"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder="sk-or-..."
                    />
                    <p className="text-xs text-slate mt-1">Get your API key from <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">OpenRouter.ai</a></p>
                </div>

                <div>
                    <label htmlFor="openrouter-model" className="block text-sm font-medium text-light-slate mb-1">
                    AI Model:
                    </label>
                    <input
                    type="text"
                    id="openrouter-model"
                    className="input-base w-full"
                    value={modelInput}
                    onChange={(e) => setModelInput(e.target.value)}
                    placeholder="openai/gpt-3.5-turbo"
                    />
                    <p className="text-xs text-slate mt-1">e.g., openai/gpt-3.5-turbo, google/gemini-pro</p>
                </div>

                <button
                    onClick={handleSave}
                    className="button-primary"
                >
                    Save Settings
                </button>
            </div>
        </div>
    </div>
  );
};

export default AISettings;