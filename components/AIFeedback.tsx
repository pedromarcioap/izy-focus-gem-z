import React, { useEffect, useState } from 'react';
import { Stats } from '../types';
import { getAIFeedback } from '../services/openrouterService';

interface AIFeedbackProps {
  stats: Stats;
}

const AIFeedback: React.FC<AIFeedbackProps> = ({ stats }) => {
  const [feedback, setFeedback] = useState<string>('Loading AI feedback...');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      setIsLoading(true);
      const aiFeedback = await getAIFeedback(stats);
      setFeedback(aiFeedback);
      setIsLoading(false);
    };

    fetchFeedback();
  }, [stats]);

  return (
    <div className="bg-light-navy p-4 md:p-6 rounded-lg border border-lightest-navy/20">
      <h3 className="text-lg font-bold text-light-slate mb-4">AI Feedback</h3>
      {isLoading ? (
        <p className="text-slate">Generating personalized insights...</p>
      ) : (
        <p className="text-slate italic">"{feedback}"</p>
      )}
    </div>
  );
};

export default AIFeedback;
