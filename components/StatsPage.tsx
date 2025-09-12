

import React, { useState } from 'react';
import AIFeedback from './AIFeedback';
import WeeklyGardenView from './WeeklyGardenView';
import { useStatsCalculations, formatDuration, formatBestDay, formatWeekRange, formatMonthName } from '../hooks/useStatsCalculations';
import { Stats } from '../types';

interface StatCardProps {
  title: string;
  value: string;
  subtext?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtext }) => (
    <div className="bg-navy p-4 rounded-md">
        <p className="text-sm text-slate">{title}</p>
        <p className="text-2xl font-bold text-lightest-slate mt-1">{value}</p>
        {subtext && <p className="text-xs text-slate/80 mt-1">{subtext}</p>}
    </div>
);

interface TabButtonProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-semibold transition-colors duration-200 focus:outline-none focus:text-brand ${
            isActive
                ? 'text-brand border-b-2 border-brand'
                : 'text-slate hover:text-lightest-slate'
        }`}
    >
        {label}
    </button>
);

interface PlaceholderTabProps {
    title: string;
    message: string;
}

const PlaceholderTab: React.FC<PlaceholderTabProps> = ({ title, message }) => (
    <div className="bg-light-navy p-10 mt-6 rounded-lg text-center border border-lightest-navy/20">
        <h3 className="text-xl font-bold text-lightest-slate mb-2">{title}</h3>
        <p className="text-slate">{message}</p>
    </div>
);

interface StatsPageProps {
  stats: Stats;
}

type ActiveTab = 'GENERAL' | 'GARDEN' | 'TASKS' | 'MONTH';

const StatsPage: React.FC<StatsPageProps> = ({ stats }) => {
  const { sessionLogs } = stats;
  const { currentStats, averageResults, bestResults } = useStatsCalculations(sessionLogs);
  const [activeTab, setActiveTab] = useState<ActiveTab>('GENERAL');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-lightest-slate">Your Focus Journey</h2>
        <p className="text-slate mt-2">An overview of your productivity patterns and achievements.</p>
      </div>
      
      <div className="border-b border-lightest-navy/20 flex justify-center space-x-2 md:space-x-4">
        <TabButton label="General" isActive={activeTab === 'GENERAL'} onClick={() => setActiveTab('GENERAL')} />
        <TabButton label="Garden" isActive={activeTab === 'GARDEN'} onClick={() => setActiveTab('GARDEN')} />
        <TabButton label="Tasks" isActive={activeTab === 'TASKS'} onClick={() => setActiveTab('TASKS')} />
        <TabButton label="Month" isActive={activeTab === 'MONTH'} onClick={() => setActiveTab('MONTH')} />
      </div>

      <div>
        {activeTab === 'GENERAL' && (
            <div className="space-y-6">
                <div className="bg-light-navy p-4 md:p-6 rounded-lg">
                    <h3 className="text-lg font-bold text-light-slate mb-4">Current Stats</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <StatCard title="Today" value={formatDuration(currentStats.today)} />
                        <StatCard title="This week" value={formatDuration(currentStats.thisWeek)} />
                        <StatCard title="This month" value={formatDuration(currentStats.thisMonth)} />
                    </div>
                </div>

                <div className="bg-light-navy p-4 md:p-6 rounded-lg">
                    <h3 className="text-lg font-bold text-light-slate mb-4">Average Results</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <StatCard title="Daily" value={formatDuration(averageResults.daily)} />
                        <StatCard title="Weekly" value={formatDuration(averageResults.weekly)} />
                        <StatCard title="Monthly" value={formatDuration(averageResults.monthly)} />
                    </div>
                </div>
                
                <div className="bg-light-navy p-4 md:p-6 rounded-lg">
                    <h3 className="text-lg font-bold text-light-slate mb-4">Best Results</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <StatCard title="Day" value={formatDuration(bestResults.day.total)} subtext={formatBestDay(bestResults.day.date)} />
                        <StatCard title="Week" value={formatDuration(bestResults.week.total)} subtext={formatWeekRange(bestResults.week.date)} />
                        <StatCard title="Month" value={formatDuration(bestResults.month.total)} subtext={formatMonthName(bestResults.month.month)} />
                    </div>
                </div>

                <AIFeedback stats={stats} />
            </div>
        )}

        {activeTab === 'GARDEN' && (
            <div className="mt-4">
                <WeeklyGardenView sessionLogs={sessionLogs} />
            </div>
        )}

        {activeTab === 'TASKS' && <PlaceholderTab title="Task Stats" message="A detailed breakdown of focus time per task is coming soon!" />}
        {activeTab === 'MONTH' && <PlaceholderTab title="Monthly Stats" message="A monthly summary view is in the works." />}
      </div>
    </div>
  );
};

export default StatsPage;