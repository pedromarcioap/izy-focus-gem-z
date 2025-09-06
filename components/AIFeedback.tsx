

// @ts-ignore
import React, { useState, useCallback } from '../react.js';
import { getAIFeedback } from '../services/geminiService.ts';

const AIFeedback = ({ stats }) => {
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFeedback = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getAIFeedback(stats);
      setFeedback(result);
    } catch (err) {
      setError('Failed to get feedback. Please try again.');
      console.error(err);
    }
    setIsLoading(false);
  }, [stats]);

  // Automatically fetch feedback if there are enough sessions and no feedback yet.
  React.useEffect(() => {
    if (stats.sessionLogs.length > 2 && !feedback && !isLoading) {
      fetchFeedback();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stats.sessionLogs.length]);

  const formattedFeedback = feedback
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-brand">$1</strong>')
    .replace(/\* (.*?)(?=\n\* |$)/g, '<li class="mb-2 pl-4 relative before:content-[\'→\'] before:absolute before:left-0 before:text-brand">$1</li>')
    .replace(/(\r\n|\n|\r)/gm, '<br>')
    .replace(/<br><li/g, '<li')
    .replace(/<br>$/g, '');


  return (
    React.createElement("div", { className: "bg-light-navy p-6 rounded-lg border border-lightest-navy/20" },
      React.createElement("h3", { className: "text-xl font-bold text-lightest-slate mb-4" }, "AI Productivity Coach"),
      feedback && !isLoading && (
        React.createElement("div", { 
            className: "prose prose-slate text-light-slate max-w-none",
            dangerouslySetInnerHTML: { __html: `<ul>${formattedFeedback}</ul>` }
        })
      ),
      isLoading && React.createElement("p", { className: "text-slate animate-pulse" }, "Your AI coach is thinking..."),
      error && React.createElement("p", { className: "text-red-400" }, error),
      !feedback && !isLoading && !error && (
        React.createElement("p", { className: "text-slate" }, "Complete a few more sessions or click the button to get personalized tips from your AI coach.")
      ),
      React.createElement("div", { className: "mt-4" },
        React.createElement("button", {
          onClick: fetchFeedback,
          disabled: isLoading,
          className: "px-4 py-2 bg-brand text-navy font-bold rounded-md hover:bg-opacity-80 transition-all disabled:bg-slate disabled:cursor-not-allowed"
        },
          isLoading ? 'Analyzing...' : 'Get Fresh Insights'
        )
      )
    )
  );
};

export default AIFeedback;