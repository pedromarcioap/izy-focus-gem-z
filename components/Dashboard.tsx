

import React from 'react';
import TaskList from './TaskList';
import { Task, Stats } from '../types';

interface DashboardProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  stats: Stats;
  onTaskStart: (task: Task) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ tasks, setTasks, stats, onTaskStart }) => {
  return (
    <div className="space-y-6">
        <div className="text-center p-4 bg-light-navy rounded-lg border border-lightest-navy/20">
            <h2 className="text-xl font-bold text-lightest-slate">Focus Dashboard</h2>
            <p className="text-slate text-sm mt-1 max-w-2xl mx-auto">Select a task to begin a focus session.</p>
        </div>
        <div className="space-y-6">
            <TaskList tasks={tasks} setTasks={setTasks} onTaskStart={onTaskStart} />
            <div className="p-4 bg-light-navy rounded-lg border border-lightest-navy/20">
                <h3 className="font-bold text-lightest-slate mb-2">Quick Stats</h3>
                <div className="space-y-1 text-sm">
                    <p>Completed: <span className="font-bold text-brand">{stats.completedSessions}</span></p>
                    <p>Interrupted: <span className="font-bold text-slate">{stats.interruptedSessions}</span></p>
                    <p>Total Focus: <span className="font-bold text-brand">{stats.totalFocusTime}</span> min</p>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Dashboard;