import React, { useState } from 'react';
import { useStatsCalculations, formatDuration, formatBestDay, formatWeekRange, formatMonthName } from '../hooks/useStatsCalculations';
import { Stats } from '../types';
import AIFeedback from './AIFeedback'; // Added import

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
        className={`button-primary tab-button-override${isActive ? ' tab-active' : ''}`}
    >
        {label}
    </button>
);

// Adicione no CSS global (style.css) se quiser manter o override visual:
// .tab-button-override { border-radius: 0; background: transparent; box-shadow: none; }
// .tab-active { color: var(--brand); background: var(--light-navy); border-bottom: 2px solid var(--brand); }

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
    <div className="dashboard-container">
        <div className="dashboard-header-card">
            <h2 className="dashboard-header-title">Your Focus Journey</h2>
            <p className="dashboard-header-subtitle">An overview of your productivity patterns and achievements.</p>
        </div>

        <div className="border-b border-lightest-navy/20 flex justify-center space-x-2 md:space-x-4">
            <TabButton label="General" isActive={activeTab === 'GENERAL'} onClick={() => setActiveTab('GENERAL')} />
            <TabButton label="Tasks" isActive={activeTab === 'TASKS'} onClick={() => setActiveTab('TASKS')} />
            <TabButton label="Month" isActive={activeTab === 'MONTH'} onClick={() => setActiveTab('MONTH')} />
        </div>

        <div>
            {activeTab === 'GENERAL' && (
                <div className="space-y-6">
                    <div className="bg-light-navy p-4 md:p-6 rounded-lg">
                        <h3 className="text-lg font-bold text-light-slate mb-4">Current Stats</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <StatCard title="Today" value={formatDuration(currentStats.today)} />
                            <StatCard title="This week" value={formatDuration(currentStats.thisWeek)} />
                            <StatCard title="This month" value={formatDuration(currentStats.thisMonth)} />
                        </div>
                    </div>

                    <div className="bg-light-navy p-4 md:p-6 rounded-lg">
                        <h3 className="text-lg font-bold text-light-slate mb-4">Average Results</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <StatCard title="Daily" value={formatDuration(averageResults.daily)} />
                            <StatCard title="Weekly" value={formatDuration(averageResults.weekly)} />
                            <StatCard title="Monthly" value={formatDuration(averageResults.monthly)} />
                        </div>
                    </div>
                    
                    <div className="bg-light-navy p-4 md:p-6 rounded-lg">
                        <h3 className="text-lg font-bold text-light-slate mb-4">Best Results</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <StatCard title="Day" value={formatDuration(bestResults.day.total)} subtext={formatBestDay(bestResults.day.date)} />
                            <StatCard title="Week" value={formatDuration(bestResults.week.total)} subtext={formatWeekRange(bestResults.week.date)} />
                            <StatCard title="Month" value={formatDuration(bestResults.month.total)} subtext={formatMonthName(bestResults.month.month)} />
                        </div>
                    </div>
                    <AIFeedback stats={stats} /> {/* Added AIFeedback component */}
                </div>
            )}

            {activeTab === 'TASKS' && <PlaceholderTab title="Task Stats" message="A detailed breakdown of focus time per task is coming soon!" />}
            {activeTab === 'MONTH' && <PlaceholderTab title="Monthly Stats" message="A monthly summary view is in the works." />}
        </div>
    </div>
  );
};

export default StatsPage;
