

// @ts-ignore
import React, { useState } from '../react.js';
import AIFeedback from './AIFeedback.tsx';
import WeeklyGardenView from './WeeklyGardenView.tsx';
import { useStatsCalculations, formatDuration, formatBestDay, formatWeekRange, formatMonthName } from '../hooks/useStatsCalculations.ts';

const StatCard = ({ title, value, subtext }) => (
    React.createElement("div", { className: "bg-navy p-4 rounded-md" },
        React.createElement("p", { className: "text-sm text-slate" }, title),
        React.createElement("p", { className: "text-2xl font-bold text-lightest-slate mt-1" }, value),
        subtext && React.createElement("p", { className: "text-xs text-slate/80 mt-1" }, subtext)
    )
);

const TabButton = ({ label, isActive, onClick }) => (
    React.createElement("button", {
        onClick: onClick,
        className: `px-4 py-2 text-sm font-semibold transition-colors duration-200 focus:outline-none focus:text-brand ${
            isActive
                ? 'text-brand border-b-2 border-brand'
                : 'text-slate hover:text-lightest-slate'
        }`
    },
        label
    )
);

const PlaceholderTab = ({ title, message }) => (
    React.createElement("div", { className: "bg-light-navy p-10 mt-6 rounded-lg text-center border border-lightest-navy/20" },
        React.createElement("h3", { className: "text-xl font-bold text-lightest-slate mb-2" }, title),
        React.createElement("p", { className: "text-slate" }, message)
    )
);


const StatsPage = ({ stats }) => {
  const { sessionLogs } = stats;
  const { currentStats, averageResults, bestResults } = useStatsCalculations(sessionLogs);
  const [activeTab, setActiveTab] = useState('GENERAL');

  return (
    React.createElement("div", { className: "space-y-6" },
      React.createElement("div", { className: "text-center" },
        React.createElement("h2", { className: "text-3xl font-bold text-lightest-slate" }, "Your Focus Journey"),
        React.createElement("p", { className: "text-slate mt-2" }, "An overview of your productivity patterns and achievements.")
      ),
      
      React.createElement("div", { className: "border-b border-lightest-navy/20 flex justify-center space-x-2 md:space-x-4" },
        React.createElement(TabButton, { label: "General", isActive: activeTab === 'GENERAL', onClick: () => setActiveTab('GENERAL') }),
        React.createElement(TabButton, { label: "Garden", isActive: activeTab === 'GARDEN', onClick: () => setActiveTab('GARDEN') }),
        React.createElement(TabButton, { label: "Tasks", isActive: activeTab === 'TASKS', onClick: () => setActiveTab('TASKS') }),
        React.createElement(TabButton, { label: "Month", isActive: activeTab === 'MONTH', onClick: () => setActiveTab('MONTH') })
      ),

      React.createElement("div", null,
        activeTab === 'GENERAL' && (
            React.createElement("div", { className: "space-y-6" },
                React.createElement("div", { className: "bg-light-navy p-4 md:p-6 rounded-lg" },
                    React.createElement("h3", { className: "text-lg font-bold text-light-slate mb-4" }, "Current Stats"),
                    React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4" },
                        React.createElement(StatCard, { title: "Today", value: formatDuration(currentStats.today) }),
                        React.createElement(StatCard, { title: "This week", value: formatDuration(currentStats.thisWeek) }),
                        React.createElement(StatCard, { title: "This month", value: formatDuration(currentStats.thisMonth) })
                    )
                ),

                React.createElement("div", { className: "bg-light-navy p-4 md:p-6 rounded-lg" },
                    React.createElement("h3", { className: "text-lg font-bold text-light-slate mb-4" }, "Average Results"),
                    React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4" },
                        React.createElement(StatCard, { title: "Daily", value: formatDuration(averageResults.daily) }),
                        React.createElement(StatCard, { title: "Weekly", value: formatDuration(averageResults.weekly) }),
                        React.createElement(StatCard, { title: "Monthly", value: formatDuration(averageResults.monthly) })
                    )
                ),
                
                React.createElement("div", { className: "bg-light-navy p-4 md:p-6 rounded-lg" },
                    React.createElement("h3", { className: "text-lg font-bold text-light-slate mb-4" }, "Best Results"),
                    React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4" },
                        React.createElement(StatCard, { title: "Day", value: formatDuration(bestResults.day.total), subtext: formatBestDay(bestResults.day.date) }),
                        React.createElement(StatCard, { title: "Week", value: formatDuration(bestResults.week.total), subtext: formatWeekRange(bestResults.week.date) }),
                        React.createElement(StatCard, { title: "Month", value: formatDuration(bestResults.month.total), subtext: formatMonthName(bestResults.month.month) })
                    )
                ),

                React.createElement(AIFeedback, { stats: stats })
            )
        ),

        activeTab === 'GARDEN' && (
            React.createElement("div", { className: "mt-4" },
                React.createElement(WeeklyGardenView, { sessionLogs: sessionLogs })
            )
        ),

        activeTab === 'TASKS' && React.createElement(PlaceholderTab, { title: "Task Stats", message: "A detailed breakdown of focus time per task is coming soon!" }),
        activeTab === 'MONTH' && React.createElement(PlaceholderTab, { title: "Monthly Stats", message: "A monthly summary view is in the works." })
      )
    )
  );
};

export default StatsPage;