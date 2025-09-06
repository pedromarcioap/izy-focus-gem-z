// @ts-ignore
import React, { useMemo } from '../react.js';

export const formatDuration = (minutes) => {
    if (minutes < 1) {
        const seconds = Math.round(minutes * 60);
        return `${seconds} sec`;
    }
    if (minutes < 60) {
        return `${Math.round(minutes)} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);
    if (remainingMinutes === 0) {
        return `${hours} hr`;
    }
    return `${hours} hr, ${remainingMinutes} min`;
};

export const formatBestDay = (dateStr) => {
    if (!dateStr) return '';
    return `(${new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })})`;
};

export const formatWeekRange = (startDateStr) => {
    if (!startDateStr) return '';
    const start = new Date(startDateStr);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return `(${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}, ${start.getFullYear()})`;
};

export const formatMonthName = (monthKey) => {
    if (!monthKey) return '';
    const [year, monthIndex] = monthKey.split('-').map(Number);
    const date = new Date(year, monthIndex);
    return `(${date.toLocaleString('en-US', { month: 'long' })}, ${year})`;
};


export const useStatsCalculations = (sessionLogs) => {
  return useMemo(() => {
    const totalFocusTime = sessionLogs.reduce((sum, log) => sum + log.actualDuration, 0);

    // --- Group data ---
    const dailyData: { [key: string]: number } = {};
    const weeklyData: { [key: string]: number } = {};
    const monthlyData: { [key: string]: number } = {};

    sessionLogs.forEach(log => {
        const date = new Date(log.startTime);
        
        // Daily
        const dayKey = date.toISOString().split('T')[0];
        dailyData[dayKey] = (dailyData[dayKey] || 0) + log.actualDuration;

        // Weekly (Sun-Sat) - Create a new date object to avoid mutation
        const weeklyDate = new Date(log.startTime);
        const dayOfWeek = weeklyDate.getDay();
        const diff = weeklyDate.getDate() - dayOfWeek;
        const startOfWeek = new Date(weeklyDate.setDate(diff));
        startOfWeek.setHours(0,0,0,0);
        const weekKey = startOfWeek.toISOString().split('T')[0];
        weeklyData[weekKey] = (weeklyData[weekKey] || 0) + log.actualDuration;

        // Monthly - uses the original 'date' which is not mutated
        const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
        monthlyData[monthKey] = (monthlyData[monthKey] || 0) + log.actualDuration;
    });

    // --- Current Stats ---
    const now = new Date();
    const todayKey = now.toISOString().split('T')[0];
    const today = dailyData[todayKey] || 0;
    
    // Create a new date to avoid mutating 'now'
    const currentWeekDate = new Date();
    const currentDayOfWeek = currentWeekDate.getDay();
    const currentDiff = currentWeekDate.getDate() - currentDayOfWeek;
    const currentStartOfWeek = new Date(currentWeekDate.setDate(currentDiff));
    currentStartOfWeek.setHours(0,0,0,0);
    const currentWeekKey = currentStartOfWeek.toISOString().split('T')[0];
    const thisWeek = weeklyData[currentWeekKey] || 0;

    const currentMonthKey = `${now.getFullYear()}-${now.getMonth()}`;
    const thisMonth = monthlyData[currentMonthKey] || 0;

    // --- Average Results ---
    const numDays = Object.keys(dailyData).length;
    const daily = numDays > 0 ? totalFocusTime / numDays : 0;
    const numWeeks = Object.keys(weeklyData).length;
    const weekly = numWeeks > 0 ? totalFocusTime / numWeeks : 0;
    const numMonths = Object.keys(monthlyData).length;
    const monthly = numMonths > 0 ? totalFocusTime / numMonths : 0;

    // --- Best Results ---
    const bestDay = Object.entries(dailyData).reduce((best, [date, total]) => total > best.total ? { date, total } : best, { date: '', total: 0 });
    const bestWeek = Object.entries(weeklyData).reduce((best, [date, total]) => total > best.total ? { date, total } : best, { date: '', total: 0 });
    const bestMonth = Object.entries(monthlyData).reduce((best, [month, total]) => total > best.total ? { month, total } : best, { month: '', total: 0 });


    return {
      currentStats: { today, thisWeek, thisMonth },
      averageResults: { daily, weekly, monthly },
      bestResults: { day: bestDay, week: bestWeek, month: bestMonth },
    };
  }, [sessionLogs]);
};