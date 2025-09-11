

import React, { useState, useMemo, CSSProperties } from 'react';
import {
  IsometricGardenBase,
  IsometricTree1,
  IsometricTree2,
  IsometricFlowers,
  IsometricPond,
  IsometricRock,
} from './GardenAssets';
import { formatDuration } from '../hooks/useStatsCalculations';
import { SessionLog } from '../types';

// --- TYPES ---
interface DailyStats {
  [key: string]: {
    focusTime: number;
    sessions: number;
  };
}

interface GardenAsset {
    component: React.FC<{ style: CSSProperties }>;
    style: CSSProperties;
}

interface WeeklyGardenViewProps {
    sessionLogs: SessionLog[];
}

// --- HELPER FUNCTIONS ---
const getStartOfWeek = (date: Date): Date => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day of week
  return new Date(d.setDate(diff));
};

const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const formatDateKey = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// --- GARDEN ASSETS MAP ---
const gardenAssetMap: GardenAsset[] = [
  { component: IsometricTree1, style: { top: '35%', left: '15%', width: '15%' } },
  { component: IsometricPond, style: { top: '50%', left: '50%', width: '25%' } },
  { component: IsometricFlowers, style: { top: '65%', left: '75%', width: '12%' } },
  { component: IsometricTree2, style: { top: '20%', left: '70%', width: '18%' } },
  { component: IsometricRock, style: { top: '70%', left: '30%', width: '10%' } },
  { component: IsometricTree1, style: { top: '60%', left: '15%', width: '15%' } },
  { component: IsometricFlowers, style: { top: '25%', left: '35%', width: '12%' } },
  { component: IsometricTree2, style: { top: '45%', left: '80%', width: '18%' } },
];

// --- MAIN COMPONENT ---
const WeeklyGardenView: React.FC<WeeklyGardenViewProps> = ({ sessionLogs }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const dailyStats = useMemo((): DailyStats => {
    const stats: DailyStats = {};
    sessionLogs.forEach(log => {
      const dateKey = formatDateKey(new Date(log.startTime));
      if (!stats[dateKey]) {
        stats[dateKey] = { focusTime: 0, sessions: 0 };
      }
      stats[dateKey].focusTime += log.actualDuration;
      if (log.status === 'completed' || (log.duration > 0 && log.actualDuration / log.duration >= 0.8)) {
        stats[dateKey].sessions += 1;
      }
    });
    return stats;
  }, [sessionLogs]);

  const startOfWeek = getStartOfWeek(selectedDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfWeek, i));

  const handlePrevWeek = () => setSelectedDate(addDays(startOfWeek, -7));
  const handleNextWeek = () => setSelectedDate(addDays(startOfWeek, 7));

  const selectedDateKey = formatDateKey(selectedDate);
  const todaysProgress = dailyStats[selectedDateKey] || { focusTime: 0, sessions: 0 };
  const numAssets = Math.min(todaysProgress.sessions, gardenAssetMap.length);

  return (
    <div className="bg-light-navy p-4 sm:p-6 rounded-lg border border-lightest-navy/20">
      <div className="relative w-full aspect-[2/1] bg-navy rounded-lg p-4 overflow-hidden mb-4 flex items-center justify-center">
        <IsometricGardenBase />
        {Array.from({ length: numAssets }).map((_, index) => {
          const Asset = gardenAssetMap[index % gardenAssetMap.length];
          return <Asset.component key={index} style={Asset.style} />;
        })}
        <div className="absolute top-2 left-3 text-lightest-slate font-bold text-sm">
          {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </div>
        <div className="absolute top-2 right-3 text-brand font-bold text-sm">
          {formatDuration(todaysProgress.focusTime)}
        </div>
      </div>

      <div className="text-center">
        <div className="flex items-center justify-between mb-2">
            <button onClick={handlePrevWeek} className="p-2 text-slate hover:text-brand">{"<"}</button>
            <span className="text-sm font-semibold text-lightest-slate">
                {`${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${addDays(startOfWeek, 6).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
            </span>
            <button onClick={handleNextWeek} className="p-2 text-slate hover:text-brand">{">"}</button>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map(day => {
            const dayKey = formatDateKey(day);
            const isSelected = dayKey === selectedDateKey;
            const progressForDay = dailyStats[dayKey]?.sessions || 0;
            const intensity = Math.min(progressForDay / 5, 1);

            return (
              <button
                key={dayKey}
                onClick={() => setSelectedDate(day)}
                className={`p-2 rounded-md transition-all duration-200 ${
                  isSelected ? 'bg-brand text-navy' : 'bg-navy hover:bg-lightest-navy'
                }`}
              >
                <span className="block text-xs uppercase">{day.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                <div className="w-full h-1.5 rounded-full mt-1.5 bg-lightest-navy/20">
                    <div className="h-1.5 rounded-full bg-brand" style={{ width: `${intensity * 100}%` }} />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeeklyGardenView;